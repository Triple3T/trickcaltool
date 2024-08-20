import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";

const Clear = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const { requestToken } = useContext(AuthContext);
  const { t } = useTranslation();

  const tryLogout = useCallback(() => {
    setSuccess(false);
    setFailed(false);
    if (requestToken) {
      fetch("https://api.triple-lab.com/api/v1/tr/clear", {
        credentials: "include",
      })
        .then(() => {
          requestToken(
            //callback
            () => setTimeout(() => setFailed(true), 3000),
            //onerror
            () => {
              setSuccess(true);
              navigate("/");
            }
          );
        })
        .catch(() => {
          setFailed(true);
        });
    }
  }, [navigate, requestToken]);
  useEffect(() => {
    tryLogout();
  }, [tryLogout]);
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="mt-[35vh] mx-auto text-center font-onemobile">
        {success ? (
          <div>
            <div>{t("ui.common.tokenSuccess")}</div>
            <div>{t("ui.common.tokenSuccessDescription")}</div>
          </div>
        ) : failed ? (
          <div>
            <div>{t("ui.common.tokenFailed")}</div>
            <div onClick={tryLogout}>
              {t("ui.common.tokenFailedDescription")}
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
            <div>{t("ui.common.logoutProcessing")}</div>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
};

export default Clear;