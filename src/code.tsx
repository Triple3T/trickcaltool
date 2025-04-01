import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSyncQuery } from "@/hooks/useSyncQuery";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import googleAccessUrl from "@/utils/googleAccessUrl";
import { exportTextFile } from "./utils/dataRW";

const Code = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getNewToken, sync } = useSyncQuery();
  const [notRegistered, setNotRegistered] = useState(false);
  const [failed, setFailed] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState("");
  const [failedMessage, setFailedMessage] = useState("ui.common.tokenFailed");
  const [status429, setStatus429] = useState(false);
  const [codeTriggered, setCodeTriggered] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (codeTriggered) return;
    if (
      sync &&
      getNewToken &&
      navigate &&
      searchParams &&
      !(alreadyRegistered || notRegistered || success || failed)
    ) {
      setCodeTriggered(true);
      if (searchParams.get("code")) {
        const code = searchParams.get("code");
        fetch(`https://api.triple-lab.com/api/v2/tr/code?code=${code}`, {
          credentials: "include",
        }).then((response) => {
          if (response.status === 429) {
            setFailedMessage("ui.common.tokenFailedRateLimit");
            setFailed(true);
            setStatus429(true);
            setTimeout(() => {
              setStatus429(false);
              setFailedMessage("ui.common.tokenFailed");
            }, 10000);
            return;
          }
          if (response.status === 200) {
            response.text().then((text) => {
              if (text === "OK") {
                setAlreadyRegistered(true);
                const resultPromise = getNewToken.refetch();
                resultPromise.then((result) => {
                  if (result.isSuccess) {
                    setSuccess(true);
                    sync.refetch();
                    setTimeout(() => navigate("/"), 3000);
                  } else {
                    setTimeout(() => setFailed(true), 2000);
                  }
                });
              } else if (text === "Not registered") {
                setNotRegistered(true);
              }
            });
          }
        });
      }
      if (searchParams.get("error")) {
        setFailed(true);
      }
    }
  }, [
    sync,
    getNewToken,
    navigate,
    searchParams,
    alreadyRegistered,
    notRegistered,
    success,
    failed,
    codeTriggered,
  ]);

  const register = useCallback(() => {
    if (!sync || !getNewToken || !navigate) return;
    getNewToken
      .refetch()
      .then(({ data }) =>
        fetch(`https://api.triple-lab.com/api/v2/tr/register`, {
          method: "POST",
          headers: { authorization: `Bearer ${data}` },
          credentials: "include",
        }).then(async (response) => {
          if (response.status === 200) {
            const registerResult = await response.json();
            setNotRegistered(false);
            getNewToken
              .refetch()
              .then(
                //callback
                () => {
                  setSuccess(true);
                  if (registerResult.status === "conflict") {
                    setAlreadyRegistered(true);
                    sync.refetch();
                    setTimeout(() => navigate("/"), 3000);
                  } else {
                    sync.refetch();
                    setRecoveryCode(registerResult.uuid);
                  }
                }
              )
              .catch(
                //onerror
                () => setTimeout(() => setFailed(true), 3000)
              );
          } else {
            setNotRegistered(false);
            setFailed(true);
          }
        })
      )
      .catch(() => {
        setNotRegistered(false);
        setFailed(true);
      });
  }, [sync, getNewToken, navigate]);

  const registerCancel = useCallback(() => {
    navigate("/clear");
  }, [navigate]);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="mt-[35vh] mx-auto text-center font-onemobile">
        {success ? (
          alreadyRegistered ? (
            <div>
              <div>{t("ui.common.tokenSuccess")}</div>
              <div>{t("ui.common.tokenSuccessDescription")}</div>
            </div>
          ) : (
            <div>
              <div>{t("ui.common.tokenRegistered")}</div>
              {downloaded ? (
                <div>{t("ui.common.syncDescription")}</div>
              ) : (
                <div>{t("ui.common.tokenRecoveryCodeDescription")}</div>
              )}
              <div className="text-xs text-center bg-slate-500/20 my-2 py-2">
                {recoveryCode}
              </div>
              <div className="flex justify-center gap-2">
                {downloaded ? (
                  <Button onClick={() => navigate("/")}>
                    {t("ui.common.goMain")}
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      exportTextFile({
                        fileName: "trickcal-note-recovery-code",
                        data: recoveryCode,
                      });
                      setDownloaded(true);
                    }}
                  >
                    {t("ui.common.fileSave")}
                  </Button>
                )}
              </div>
            </div>
          )
        ) : failed ? (
          <div>
            <div>{t(failedMessage)}</div>
            {!status429 && (
              <div>
                <a href={googleAccessUrl} target="_self" rel="noreferrer">
                  {t("ui.common.tokenFailedDescription")}
                </a>
              </div>
            )}
          </div>
        ) : notRegistered ? (
          <div>
            <div>{t("ui.common.tokenNotRegistered")}</div>
            <div>{t("ui.common.tokenNotRegisteredDescription")}</div>
            <div className="flex gap-2 justify-center">
              <Button onClick={registerCancel}>{t("ui.common.no")}</Button>
              <Button onClick={register}>{t("ui.common.yes")}</Button>
            </div>
          </div>
        ) : (
          <div>
            <div>
              <img
                src="/networkicon/NetworkIcon_Elena.png"
                className="w-24 h-24 mx-auto"
              />
            </div>
            <div>{t("ui.common.tokenProcessing")}</div>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
};

export default Code;
