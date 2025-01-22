import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  dataFileExport,
  dataFileImport,
  firstReadIntoMemory,
  readIntoMemory,
  writeFromMemory,
} from "@/utils/dataRW";
import { SyncStatus } from "@/types/enums";
import { UserDataMemory } from "@/types/types";
import { useUserData } from "@/hooks/useUserData";

const API_URL = "https://api.triple-lab.com/api/v2/tr";
const TOKEN_URL = "https://api.triple-lab.com/api/v2/tr/token";

const defaultHeader = {
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
  Expires: "0",
};

interface IAuthContext {
  googleLinked: boolean;
  isReady: boolean;
  status: SyncStatus;
  userData: UserDataMemory | undefined;
  userDataDispatch: ReturnType<typeof useUserData>[1] | undefined;
  readIntoUserData?: () => void;
  forceUpload?: () => Promise<void>;
  forceDownload?: () => Promise<void>;
  forceApplyBackup?: (index: number) => Promise<void>;
  retryReady?: () => void;
  requestToken?: (
    callback?: (accessToken: string) => void,
    onError?: () => void
  ) => Promise<string | undefined>;
}

const AuthContext = createContext<IAuthContext>({
  googleLinked: false,
  isReady: false,
  status: SyncStatus.NotLinked,
  userData: undefined,
  userDataDispatch: undefined,
});

const b64t = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_";
const b64IntoNumber = (b64: string) => {
  return b64
    .split("")
    .map((v) => b64t.indexOf(v))
    .reduce((acc, v) => acc * 64 + v, 0);
};

type Children = ReactNode | ReactNode[];

const AuthProvider = ({ children }: { children: Children }) => {
  const [googleLinked, setGoogleLinked] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [token, setToken] = useState<string>();
  const [lastModified, setLastModified] = useState<number>(0);
  const [status, setStatus] = useState<SyncStatus>(SyncStatus.NotLinked);
  const [userData, userDataDispatch] = useUserData();
  const [usingIDB, setUsingIDB] = useState<boolean | undefined>(undefined);
  const [tokenTried, setTokenTried] = useState<boolean>(false);
  // const [userUsingVersion, setUserUsingVersion] = useState<string>("");
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // first read into memory
  const readIntoUserData = useCallback(() => {
    firstReadIntoMemory().then(([idbAvailable, memoryData]) => {
      setUsingIDB(idbAvailable);
      if (memoryData) {
        userDataDispatch.restore(memoryData);
        setIsReady(true);
      }
    });
  }, [userDataDispatch]);
  useEffect(() => {
    if (!userData && readIntoUserData) readIntoUserData();
  }, [readIntoUserData, userData]);

  // get token for login
  const getNewToken = useCallback(
    async (
      callback?: (accessToken: string) => void | Promise<void>,
      onError?: () => void
    ) => {
      try {
        const f = await fetch(TOKEN_URL, {
          headers: defaultHeader,
          credentials: "include",
        });
        if (!f.ok) {
          setGoogleLinked(false);
          setStatus(SyncStatus.NotLinked);
          if (onError) onError();
          return;
        }
        const tok = await f.text();
        if (tok) {
          setToken(tok);
          setGoogleLinked(true);
          setStatus((v) => (v === SyncStatus.NotLinked ? SyncStatus.Idle : v));
          setLastModified(Date.now());
          if (callback) await callback(tok);
          return tok;
        }
      } catch (e) {
        setGoogleLinked(false);
        setStatus(SyncStatus.Errored);
        if (onError) onError();
      }
    },
    []
  );

  // sync download / unless force is true, it will not apply downloaded data if the server file is older than the current one
  const getFileContent = useCallback(
    async (accessToken: string, noRetry: boolean, force: boolean = false) => {
      if (typeof usingIDB === "undefined") return;
      const fileUrl = `${API_URL}/read`;
      try {
        setStatus(SyncStatus.Downloading);
        const response = await fetch(fileUrl, {
          method: "GET",
          credentials: "include",
          headers: {
            ...defaultHeader,
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.ok) {
          const fileContent = await response.text();
          const serverFileTimestamp = b64IntoNumber(fileContent.slice(2, 10));
          const currentTimestamp = userData?.timestamp ?? 0;
          if (serverFileTimestamp > currentTimestamp || force) {
            const result = await dataFileImport(fileContent);
            if (result.success) {
              const newData = await readIntoMemory(usingIDB);
              if (newData) {
                userDataDispatch.restore(newData);
                setStatus(SyncStatus.Success);
                setTimeout(
                  () =>
                    setStatus((v) =>
                      v === SyncStatus.Success ? SyncStatus.Idle : v
                    ),
                  3600
                );
                return true;
              } else {
                if (noRetry) {
                  setStatus(SyncStatus.Errored);
                  throw new Error("store failed");
                }
              }
            } else {
              if (noRetry) {
                setStatus(SyncStatus.Errored);
                throw new Error(result.reason);
              }
            }
          }
          // local file is newer
          return false;
        } else {
          switch (response.status) {
            case 400:
              // invalid data
              setStatus(SyncStatus.Errored);
              break;
            case 401:
              // invalid credentials(token)
              setStatus(SyncStatus.Errored);
              break;
            case 403:
              // not registered
              setGoogleLinked(false);
              setStatus(SyncStatus.NotLinked);
              break;
            case 500:
              // transaction failed
              setStatus(SyncStatus.Errored);
              break;
            case 503:
            default:
              // service unavailable(unknown error occured)
              setStatus(SyncStatus.Errored);
              break;
          }
          throw new Error(response.statusText);
        }
      } catch (error) {
        try {
          if (noRetry) throw error;
          await getNewToken(async (token) => {
            await getFileContent(token, true, force);
          });
        } catch (e) {
          console.error(e);
          setStatus(SyncStatus.Errored);
          return undefined;
        }
      }
    },
    [getNewToken, userData?.timestamp, userDataDispatch, usingIDB]
  );

  // sync upload / unless force is true, it will not apply uploaded data if the server file is older than the current one
  const storeFile = useCallback(
    async (accessToken: string, noRetry: boolean, force: boolean = false) => {
      if (typeof usingIDB === "undefined") return;
      const fileUrl = `${API_URL}/write`;
      try {
        setStatus(SyncStatus.Uploading);
        const { data } = await dataFileExport(usingIDB);
        if (data.length < 1) {
          setStatus(SyncStatus.Errored);
          return;
        }
        const body = JSON.stringify({
          file: data,
          force,
        });
        const response = await fetch(fileUrl, {
          method: "POST",
          credentials: "include",
          headers: {
            ...defaultHeader,
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body,
        });
        if (response.ok) {
          const fileContent = await response.text();
          if (
            !force &&
            (fileContent.length > 15 || Number.isNaN(Number(fileContent)))
          ) {
            // newer file returned
            const result = await dataFileImport(fileContent);
            if (result.success) {
              const newData = await readIntoMemory(usingIDB);
              if (newData) {
                userDataDispatch.restore(newData);
                setStatus(SyncStatus.Success);
                setTimeout(
                  () =>
                    setStatus((v) =>
                      v === SyncStatus.Success ? SyncStatus.Idle : v
                    ),
                  3600
                );
                return true;
              } else {
                if (noRetry) {
                  setStatus(SyncStatus.Errored);
                  throw new Error("store failed");
                }
              }
            } else {
              if (noRetry) {
                setStatus(SyncStatus.Errored);
                throw new Error(result.reason);
              }
            }
          } else {
            // file stored into remote db
            setStatus(SyncStatus.Success);
            setTimeout(
              () =>
                setStatus((v) =>
                  v === SyncStatus.Success ? SyncStatus.Idle : v
                ),
              3600
            );
            return true;
          }
        } else {
          switch (response.status) {
            case 400:
              // invalid data
              setStatus(SyncStatus.Errored);
              break;
            case 401:
              // invalid credentials(token)
              setStatus(SyncStatus.Errored);
              break;
            case 403:
              // not registered
              setGoogleLinked(false);
              setStatus(SyncStatus.NotLinked);
              break;
            case 500:
              // transaction failed
              setStatus(SyncStatus.Errored);
              break;
            case 503:
            default:
              // service unavailable(unknown error occured)
              setStatus(SyncStatus.Errored);
              break;
          }
          throw new Error(response.statusText);
        }
      } catch (error) {
        try {
          if (noRetry) throw error;
          await getNewToken(async (token) => {
            await storeFile(token, true);
          });
        } catch (e) {
          console.error(e);
          setStatus(SyncStatus.Errored);
          return undefined;
        }
      }
    },
    [getNewToken, userDataDispatch, usingIDB]
  );

  const applyBackup = useCallback(
    async (backupindex: number, accessToken: string, noRetry: boolean) => {
      if (typeof usingIDB === "undefined") return;
      const fileUrl = `${API_URL}/backupapply`;
      try {
        setStatus(SyncStatus.Downloading);
        const response = await fetch(fileUrl, {
          method: "POST",
          credentials: "include",
          headers: {
            ...defaultHeader,
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ backupindex }),
        });
        if (response.ok) {
          const fileContent = await response.text();
          const result = await dataFileImport(fileContent);
          if (result.success) {
            const newData = await readIntoMemory(usingIDB);
            if (newData) {
              userDataDispatch.restore(newData);
              setStatus(SyncStatus.Success);
              setTimeout(
                () =>
                  setStatus((v) =>
                    v === SyncStatus.Success ? SyncStatus.Idle : v
                  ),
                3600
              );
              return true;
            } else {
              if (noRetry) {
                setStatus(SyncStatus.Errored);
                throw new Error("store failed");
              }
            }
          } else {
            if (noRetry) {
              setStatus(SyncStatus.Errored);
              throw new Error(result.reason);
            }
          }
        } else {
          switch (response.status) {
            case 400:
              // invalid data
              setStatus(SyncStatus.Errored);
              break;
            case 401:
              // invalid credentials(token)
              setStatus(SyncStatus.Errored);
              break;
            case 403:
              // not registered
              setGoogleLinked(false);
              setStatus(SyncStatus.NotLinked);
              break;
            case 500:
              // transaction failed
              setStatus(SyncStatus.Errored);
              break;
            case 503:
            default:
              // service unavailable(unknown error occured)
              setStatus(SyncStatus.Errored);
              break;
          }
          throw new Error(response.statusText);
        }
      } catch (error) {
        try {
          if (noRetry) throw error;
          await getNewToken(async (token) => {
            await applyBackup(backupindex, token, true);
          });
        } catch (e) {
          console.error(e);
          setStatus(SyncStatus.Errored);
          return undefined;
        }
      }
    },
    [getNewToken, userDataDispatch, usingIDB]
  );

  // upload scheduler
  const isUploading = useRef(false); // 업로드 중 여부
  const uploadScheduled = useRef(false); // 업로드 예약 여부
  const handleUpload = useCallback(
    async (token: string) => {
      if (isUploading.current) {
        if (!uploadScheduled.current) {
          // upload scheduled
          uploadScheduled.current = true;
          return true;
        } else {
          // if upload currently scheduled, ignore
          return true;
        }
      }

      isUploading.current = true;

      let uploadResult = false;
      try {
        await storeFile(token, false);
        uploadResult = true;
      } catch (error) {
        console.error(error);
        uploadResult = false;
      } finally {
        isUploading.current = false;
        if (uploadScheduled.current) {
          uploadScheduled.current = false;
          handleUpload(token); // 예약된 업로드 실행
        }
      }
      return uploadResult;
    },
    [storeFile]
  );

  // sync with storage periodically but only when data is dirty
  useEffect(() => {
    if (typeof usingIDB === "undefined") return;
    if (userData?.dirty) {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
      saveTimeout.current = setTimeout(() => {
        writeFromMemory(userData, usingIDB, true);
        if (googleLinked && token) {
          handleUpload(token).then((res) => {
            if (!res) {
              getNewToken((tok) => {
                handleUpload(tok).then((res) => {
                  if (!res) setStatus(SyncStatus.Errored);
                });
              });
            }
          });
        }
        userDataDispatch.clean();
      }, 3000);
      return () => {
        if (saveTimeout.current) {
          clearTimeout(saveTimeout.current);
        }
      };
    }
  }, [
    getNewToken,
    googleLinked,
    handleUpload,
    token,
    userData,
    userDataDispatch,
    usingIDB,
  ]);

  // first connect sync
  const firstConnectSync = useCallback(async () => {
    if (!getNewToken || !storeFile) return;
    if (!tokenTried) {
      const tok = await getNewToken();
      setTokenTried(true);
      if (!tok) return;
      const result = await getFileContent(tok, false);
      if (result === false) await storeFile(tok, false);
    }
  }, [getFileContent, getNewToken, storeFile, tokenTried]);
  useEffect(() => {
    firstConnectSync();
  }, [firstConnectSync]);

  const forceUpload = useCallback(async () => {
    if (token) {
      if (Date.now() - lastModified > 3600000) {
        const nt = await getNewToken();
        if (!nt) throw Error("Token not found");
        await storeFile(nt, false, true);
      } else {
        await storeFile(token, false, true);
        return;
      }
    } else {
      return Promise.resolve();
    }
  }, [getNewToken, lastModified, storeFile, token]);

  const forceDownload = useCallback(async () => {
    if (token) {
      if (Date.now() - lastModified > 3600000) {
        const nt = await getNewToken();
        if (!nt) throw Error("Token not found");
        await getFileContent(nt, false, true);
      } else {
        await getFileContent(token, false, true);
      }
    } else {
      return Promise.resolve();
    }
  }, [getFileContent, getNewToken, lastModified, token]);

  const forceApplyBackup = useCallback(async (backupindex: number) => {
    if (token) {
      if (Date.now() - lastModified > 3600000) {
        const nt = await getNewToken();
        if (!nt) throw Error("Token not found");
        await applyBackup(backupindex, nt, false);
      } else {
        await applyBackup(backupindex, token, false);
      }
    } else {
      return Promise.resolve();
    }
  }, [applyBackup, getNewToken, lastModified, token]);

  const value = useMemo(
    () => ({
      googleLinked,
      isReady,
      status,
      userData,
      userDataDispatch,
      readIntoUserData,
      forceUpload,
      forceDownload,
      forceApplyBackup,
      requestToken: getNewToken,
    }),
    [
      googleLinked,
      isReady,
      status,
      userData,
      userDataDispatch,
      readIntoUserData,
      forceUpload,
      forceDownload,
      forceApplyBackup,
      getNewToken,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export { AuthContext };
