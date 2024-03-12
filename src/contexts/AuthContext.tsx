import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { dataFileExport, dataFileImport } from "@/utils/dataRW";

const TOKEN_URL = "https://api.triple-lab.com/api/v1/tr/token";

type ISyncabilityCheck = [boolean, boolean, string];

const defaultHeader = {
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
  Expires: "0",
};

interface IAuthContext {
  googleLinked: boolean;
  isReady: boolean;
  autoSave?: () => void;
  autoLoad?: () => Promise<void>;
  getFileDry?: () => Promise<ISyncabilityCheck>;
  retryReady?: () => void;
  requestToken?: (
    callback?: (accessToken: string) => void,
    onError?: () => void
  ) => Promise<void>;
}

const AuthContext = createContext<IAuthContext>({
  googleLinked: false,
  isReady: false,
});

type Children = ReactNode | ReactNode[];

const AuthProvider = ({ children }: { children: Children }) => {
  const [googleLinked, setGoogleLinked] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [token, setToken] = useState<string>();
  const [fileId, setFileId] = useState<string>();
  const [lastModified, setLastModified] = useState<number>(0);
  const [noFile, setNoFile] = useState<boolean>(false);

  const getNewToken = async (
    callback?: (accessToken: string) => void,
    onError?: () => void
  ) => {
    try {
      const f = await fetch(TOKEN_URL, {
        headers: defaultHeader,
        credentials: "include",
      });
      if (!f.ok) {
        setGoogleLinked(false);
        if (onError) onError();
        return;
      }
      const token = await f.text();
      if (token) {
        setToken(token);
        setGoogleLinked(true);
        setLastModified(Date.now());
        if (callback) callback(token);
      }
    } catch (e) {
      setGoogleLinked(false);
      if (onError) onError();
    }
  };

  const getFileId = useCallback(
    async (accessToken: string): Promise<string | undefined> => {
      const fileListUrl = "https://api.triple-lab.com/api/v1/tr/list";
      const getFileList = (t: string) =>
        fetch(fileListUrl, {
          method: "GET",
          credentials: "include",
          headers: {
            ...defaultHeader,
            Authorization: `Bearer ${t}`,
          },
        });
      try {
        const response = await getFileList(accessToken);
        const data = await response.json();
        if (data.files.length > 0) {
          setFileId(data.files[0].id);
          return data.files[0].id;
        } else setNoFile(true);
      } catch (error) {
        try {
          let id;
          await getNewToken(async (newToken) => {
            const response = await getFileList(newToken);
            const data = await response.json();
            if (data.files.length > 0) {
              id = data.files[0].id;
              setFileId(id);
            } else setNoFile(true);
          });
          return id;
        } catch (e) {
          console.error(e);
          return undefined;
        }
      }
    },
    []
  );

  useEffect(() => {
    getNewToken(
      (t) => {
        getFileId(t).then(() => setIsReady(true));
      },
      () => setIsReady(true)
    );
  }, [getFileId]);

  const getFileContent = async (accessToken: string, id: string) => {
    if (noFile) return "";
    const fileUrl = "https://api.triple-lab.com/api/v1/tr/read";
    const getFile = (t: string, i: string) =>
      fetch(`${fileUrl}?id=${i}`, {
        method: "GET",
        credentials: "include",
        headers: {
          ...defaultHeader,
          Authorization: `Bearer ${t}`,
        },
      });
    try {
      const response = await getFile(accessToken, id);
      return await response.text();
    } catch (error) {
      try {
        let content;
        await getNewToken(async (newToken) => {
          const fid = await getFileId(newToken);
          if (!fid) return undefined;
          await getFile(accessToken, fid).then(async (res) => {
            content = await res.text();
          });
        });
        return content;
      } catch (e) {
        console.error(e);
        return undefined;
      }
    }
  };

  const storeFile = async (accessToken: string, id?: string) => {
    const fileUploadUrl = "https://www.googleapis.com/upload/drive/v3/files";
    const storeFileContent = async (t: string, i?: string) => {
      const fileData = dataFileExport();
      // raw multipart data upload
      const body = `--foo_bar_baz
Content-Type: application/json; charset=UTF-8

{
  "name": "trickcal-note-sync.txt"${
    i
      ? ""
      : `,
  "parents": ["appDataFolder"]`
  }
}

--foo_bar_baz
Content-Type: text/plain

${fileData}
--foo_bar_baz--`;
      return fetch(`${fileUploadUrl}${i ? `/${i}` : ""}?uploadType=multipart`, {
        method: noFile ? "POST" : "PATCH",
        headers: {
          ...defaultHeader,
          Authorization: `Bearer ${t}`,
          "Content-Type": "multipart/related; boundary=foo_bar_baz",
        },
        body,
      });
    };
    try {
      const response = await storeFileContent(accessToken, id);
      const data = await response.json();
      if (data.id) {
        setFileId(data.id);
        return data.id;
      }
    } catch (error) {
      try {
        let content;
        await getNewToken(async (newToken) => {
          const fid = await getFileId(newToken);
          if (!fid) return undefined;
          await storeFileContent(newToken, fid).then(async (res) => {
            content = await res.json();
          });
        });
        return content;
      } catch (e) {
        console.error(e);
        return undefined;
      }
    }
  };

  const autoSave = () => {
    if (token) {
      if (fileId) {
        if (Date.now() - lastModified > 3600000) {
          getNewToken((newToken) => {
            storeFile(newToken, fileId);
            if (noFile) setNoFile(false);
          });
        } else {
          storeFile(token, fileId);
        }
      } else {
        getNewToken((newToken) => {
          storeFile(newToken);
        });
      }
    }
  };

  const autoLoad = async () => {
    if (noFile) return;
    if (token) {
      if (fileId) {
        if (Date.now() - lastModified > 3600000) {
          getNewToken(async (newToken) => {
            const content = await getFileContent(newToken, fileId);
            if (content) {
              dataFileImport(content);
              autoSave();
            }
          });
        } else {
          const content = await getFileContent(token, fileId);
          if (content) {
            dataFileImport(content);
            autoSave();
          }
        }
      } else {
        const id = await getFileId(token);
        if (id) {
          const content = await getFileContent(token, id);
          if (content) {
            dataFileImport(content);
            autoSave();
          }
        } else {
          setNoFile(true);
        }
      }
    }
  };

  const getFileDryCore = async (
    accessToken: string,
    id: string
  ): Promise<ISyncabilityCheck> => {
    if (noFile) return [true, false, "getFileDryCore:1"];
    const fileUrl = "https://api.triple-lab.com/api/v1/tr/read";
    const getFile = (t: string, i: string) =>
      fetch(`${fileUrl}?id=${i}`, {
        method: "GET",
        credentials: "include",
        headers: {
          ...defaultHeader,
          Authorization: `Bearer ${t}`,
        },
      });
    try {
      const response = await getFile(accessToken, id);
      return [true, true, await response.text()];
    } catch (error) {
      try {
        let content: ISyncabilityCheck = [false, false, "getFileDryCore:21"];
        await getNewToken(async (newToken) => {
          const fid = await getFileId(newToken);
          if (!fid) {
            content = [true, false, "getFileDryCore:25"];
            return;
          }
          await getFile(accessToken, fid).then(async (res) => {
            content = [true, true, await res.text()];
          });
        });
        return content;
      } catch (e) {
        if (e instanceof Error) return [false, false, e.message];
        return [false, false, String(e)];
      }
    }
  };

  const getFileDry = () =>
    new Promise<ISyncabilityCheck>((res) => {
      if (token) {
        if (fileId) {
          if (Date.now() - lastModified > 3600000) {
            getNewToken(async (newToken) => {
              getFileDryCore(newToken, fileId).then((content) => res(content));
            });
          } else {
            getFileDryCore(token, fileId).then((content) => res(content));
          }
        } else {
          getFileId(token).then((id) => {
            if (id) {
              getFileDryCore(token, id).then((content) => res(content));
            } else {
              res([true, false, "getFileDry:16"]);
            }
          });
        }
      }
    });

  const retryReady = () => {
    setIsReady(false);
    getNewToken(
      (t) => {
        getFileId(t).then(() => setIsReady(true));
      },
      () => setIsReady(true)
    );
  };

  return (
    <AuthContext.Provider
      value={{
        googleLinked,
        isReady,
        autoSave,
        autoLoad,
        getFileDry,
        retryReady,
        requestToken: getNewToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export { AuthContext };
