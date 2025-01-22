import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import googleAccessUrl from "@/utils/googleAccessUrl";
import { exportTextFile } from "./utils/dataRW";

const Code = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { requestToken } = useContext(AuthContext);
  const [notRegistered, setNotRegistered] = useState(false);
  const [failed, setFailed] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState("");
  const [failedMessage, setFailedMessage] = useState("ui.common.tokenFailed");
  const [status429, setStatus429] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (requestToken && searchParams) {
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
                requestToken(
                  //callback
                  () => {
                    setSuccess(true);
                    setTimeout(() => navigate("/"), 3000);
                  },
                  //onerror
                  () => setTimeout(() => setFailed(true), 3000)
                );
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
  }, [navigate, requestToken, searchParams]);

  const register = useCallback(() => {
    if (!requestToken) return;
    requestToken(
      (token) =>
        fetch(`https://api.triple-lab.com/api/v2/tr/register`, {
          method: "POST",
          headers: { authorization: `Bearer ${token}` },
          credentials: "include",
        }).then(async (response) => {
          if (response.status === 200) {
            const registerResult = await response.json();
            setNotRegistered(false);
            requestToken(
              //callback
              () => {
                setSuccess(true);
                if (registerResult.status === "conflict") {
                  setAlreadyRegistered(true);
                  setTimeout(() => navigate("/"), 3000);
                } else {
                  setRecoveryCode(registerResult.uuid);
                }
              },
              //onerror
              () => setTimeout(() => setFailed(true), 3000)
            );
          } else {
            setNotRegistered(false);
            setFailed(true);
          }
        }),
      () => {
        setNotRegistered(false);
        setFailed(true);
      }
    );
  }, [navigate, requestToken]);

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
