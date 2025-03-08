import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useUserDataActions,
  useUserDataTimestamp,
  useUserDataUsingIDB,
  useUserGoogleLinked,
  useUserSyncStatus,
  useUserToken,
} from "@/stores/useUserDataStore";
import { dataFileExport, dataFileImport, readIntoMemory } from "@/utils/dataRW";
import { SyncStatus } from "@/types/enums";

const API_URL = "https://api.triple-lab.com/api/v2/tr";
const TOKEN_URL = "https://api.triple-lab.com/api/v2/tr/token";

const defaultHeader = {
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
  Expires: "0",
};

const b64t = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_";
const b64IntoNumber = (b64: string) => {
  return b64
    .split("")
    .map((v) => b64t.indexOf(v))
    .reduce((acc, v) => acc * 64 + v, 0);
};

export const useSyncQuery = () => {
  const timestamp = useUserDataTimestamp();
  const token = useUserToken();
  const isGoogleLinked = useUserGoogleLinked();
  const usingIDB = useUserDataUsingIDB();
  const syncStatus = useUserSyncStatus();
  const {
    restore,
    setToken,
    clearToken,
    setSyncStatus,
    setStatusToIdleIfSuccess,
  } = useUserDataActions();
  const queryClient = useQueryClient();

  // get token for login
  const getNewTokenFn = async () => {
    try {
      const f = await fetch(TOKEN_URL, {
        headers: defaultHeader,
        credentials: "include",
      });
      if (!f.ok) {
        clearToken();
        setSyncStatus(SyncStatus.NotLinked);
        return;
      }
      const tok = await f.text();
      if (tok) {
        setToken(tok);
        if (syncStatus === SyncStatus.NotLinked) setSyncStatus(SyncStatus.Idle);
        return tok;
      }
    } catch (e) {
      clearToken();
      setSyncStatus(SyncStatus.Errored);
    }
  };
  const getNewToken = useQuery({
    queryKey: ["authToken"],
    queryFn: getNewTokenFn,
    staleTime: 1000 * 60 * 57,
    refetchInterval: 1000 * 60 * 57,
    refetchOnWindowFocus: false,
    enabled: isGoogleLinked !== false,
  });

  // sync download / unless force is true, it will not apply downloaded data if the server file is older than the current one
  // return -1 if local file is newer, 0 if same, 1 if server file is newer
  // return undefined if error occured
  const getFileContentFn = async (force?: boolean) => {
    if (typeof usingIDB === "undefined") return undefined;
    if (!token) return undefined;
    const fileUrl = `${API_URL}/read`;
    try {
      setSyncStatus(SyncStatus.Downloading);
      const response = await fetch(fileUrl, {
        method: "GET",
        credentials: "include",
        headers: {
          ...defaultHeader,
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const fileContent = await response.text();
        if (fileContent.length < 1) return -1;
        const serverFileTimestamp = b64IntoNumber(fileContent.slice(2, 10));
        const currentTimestamp = timestamp ?? 0;
        if (serverFileTimestamp === currentTimestamp) {
          setSyncStatus(SyncStatus.Success);
          setTimeout(setStatusToIdleIfSuccess, 3600);
          return 0; // same, no need to apply
        }
        if (serverFileTimestamp > currentTimestamp || force) {
          const result = await dataFileImport(fileContent);
          if (result.success) {
            const newData = await readIntoMemory(usingIDB);
            if (newData) {
              restore(newData);
              setSyncStatus(SyncStatus.Success);
              setTimeout(setStatusToIdleIfSuccess, 3600);
              // server file is newer, applied
              return 1;
            } else {
              setSyncStatus(SyncStatus.Errored);
              throw new Error("store failed");
            }
          } else {
            setSyncStatus(SyncStatus.Errored);
            throw new Error(result.reason);
          }
        }
        // local file is newer
        return -1;
      } else {
        switch (response.status) {
          case 400:
            // invalid data
            setSyncStatus(SyncStatus.Errored);
            break;
          case 401:
            // invalid credentials(token)
            setSyncStatus(SyncStatus.Errored);
            break;
          case 403:
            // not registered
            clearToken();
            break;
          case 500:
            // transaction failed
            setSyncStatus(SyncStatus.Errored);
            break;
          case 503:
          default:
            // service unavailable(unknown error occured)
            setSyncStatus(SyncStatus.Errored);
            break;
        }
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error(error);
      setSyncStatus(SyncStatus.Errored);
      throw error;
    }
  };

  // sync upload / unless force is true, it will not apply uploaded data if the server file is older than the current one
  const storeFileFn = async (force?: boolean) => {
    if (typeof usingIDB === "undefined") return;
    if (!token) return;
    const fileUrl = `${API_URL}/write`;
    try {
      setSyncStatus(SyncStatus.Uploading);
      const { data } = await dataFileExport(usingIDB);
      if (data.length < 1) {
        setSyncStatus(SyncStatus.Errored);
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
          Authorization: `Bearer ${token}`,
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
              restore(newData);
              setSyncStatus(SyncStatus.Success);
              setTimeout(setStatusToIdleIfSuccess, 3600);
              return true;
            } else {
              setSyncStatus(SyncStatus.Errored);
              throw new Error("store failed");
            }
          } else {
            setSyncStatus(SyncStatus.Errored);
            throw new Error(result.reason);
          }
        } else {
          // file stored into remote db
          setSyncStatus(SyncStatus.Success);
          setTimeout(setStatusToIdleIfSuccess, 3600);
          return true;
        }
      } else {
        switch (response.status) {
          case 400:
            // invalid data
            setSyncStatus(SyncStatus.Errored);
            break;
          case 401:
            // invalid credentials(token)
            setSyncStatus(SyncStatus.Errored);
            break;
          case 403:
            // not registered
            clearToken();
            break;
          case 500:
            // transaction failed
            setSyncStatus(SyncStatus.Errored);
            break;
          case 503:
          default:
            // service unavailable(unknown error occured)
            setSyncStatus(SyncStatus.Errored);
            break;
        }
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error(error);
      setSyncStatus(SyncStatus.Errored);
      return undefined;
    }
  };

  const getFileContent = useQuery({
    queryKey: ["fileContent", "nonforce"],
    queryFn: () =>
      getFileContentFn().catch(() => {
        queryClient.invalidateQueries({ queryKey: ["fileContent"] });
        queryClient.invalidateQueries({ queryKey: ["authToken"] });
      }),
    enabled: false,
    retry: false,
  });
  const storeFile = useMutation({
    mutationFn: storeFileFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fileContent"] });
    },
  });

  const applyBackupFn = async (backupindex: number) => {
    if (typeof usingIDB === "undefined") return;
    const fileUrl = `${API_URL}/backupapply`;
    try {
      setSyncStatus(SyncStatus.Downloading);
      const response = await fetch(fileUrl, {
        method: "POST",
        credentials: "include",
        headers: {
          ...defaultHeader,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ backupindex }),
      });
      if (response.ok) {
        const fileContent = await response.text();
        const result = await dataFileImport(fileContent);
        if (result.success) {
          const newData = await readIntoMemory(usingIDB);
          if (newData) {
            restore(newData);
            setSyncStatus(SyncStatus.Success);
            setTimeout(setStatusToIdleIfSuccess, 3600);
            return true;
          } else {
            setSyncStatus(SyncStatus.Errored);
            throw new Error("store failed");
          }
        } else {
          setSyncStatus(SyncStatus.Errored);
          throw new Error(result.reason);
        }
      } else {
        switch (response.status) {
          case 400:
            // invalid data
            setSyncStatus(SyncStatus.Errored);
            break;
          case 401:
            // invalid credentials(token)
            setSyncStatus(SyncStatus.Errored);
            break;
          case 403:
            // not registered
            clearToken();
            break;
          case 500:
            // transaction failed
            setSyncStatus(SyncStatus.Errored);
            break;
          case 503:
          default:
            // service unavailable(unknown error occured)
            setSyncStatus(SyncStatus.Errored);
            break;
        }
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error(error);
      setSyncStatus(SyncStatus.Errored);
      throw error;
    }
  };
  const applyBackup = useMutation({
    mutationFn: applyBackupFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fileContent"] });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["authToken"] });
    },
  });

  // first connect sync
  const syncFn = async () => {
    const result = await getFileContentFn(false);
    if (result === -1) await storeFileFn(false);
    return {
      success: true,
      localRewrite: result === 1,
      serverRewrite: result === -1,
    };
  };
  const sync = useQuery({
    queryKey: ["sync"],
    queryFn: syncFn,
    enabled: !!isGoogleLinked,
    staleTime: 1000 * 60 * 30,
    refetchInterval: 1000 * 60 * 30,
  });

  const forceUpload = useMutation({
    mutationFn: () => storeFileFn(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fileContent"] });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["authToken"] });
    },
  });

  const forceDownload = useQuery({
    queryKey: ["fileContent", "force"],
    queryFn: () =>
      getFileContentFn(true).catch(() => {
        queryClient.invalidateQueries({ queryKey: ["fileContent"] });
        queryClient.invalidateQueries({ queryKey: ["authToken"] });
      }),
    enabled: false,
    retry: false,
  });

  return {
    getNewToken,
    getFileContent,
    storeFile,
    applyBackup,
    sync,
    forceUpload,
    forceDownload,
  };
};
