import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import googleAccessUrl from "@/utils/googleAccessUrl";

const Code = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { requestToken } = useContext(AuthContext);
  const [failed, setFailed] = useState(false);
  const [success, setSuccess] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (requestToken && searchParams && searchParams.get("code")) {
      fetch(
        `https://api.triple-lab.com/api/v1/tr/code?code=${searchParams.get(
          "code"
        )}`,
        { credentials: "include" }
      ).then(() => {
        requestToken(
          //callback
          () => {
            setSuccess(true);
            navigate("/");
          },
          //onerror
          () => setTimeout(() => setFailed(true), 3000)
        );
      });
    }
  }, [navigate, requestToken, searchParams]);
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
            <div>
              <a href={googleAccessUrl} target="_self" rel="noreferrer">
                {t("ui.common.tokenFailedDescription")}
              </a>
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
