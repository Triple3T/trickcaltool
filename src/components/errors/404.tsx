import { useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

const cuts = [
  "CG_Event01_01",
  "CG_Event03_16",
  "CG_Event09_03",
  "CG_Event10_07",
  "CG_Event13_01",
  "CG_SoloEnd_04",
];

const Error404 = ({ message }: { message: string }) => {
  const ref = useRef<string>(cuts[Math.floor(Math.random() * cuts.length)]);
  const { t } = useTranslation();
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div
        className="absolute left-0 top-0 bg-center bg-cover w-full h-full font-onemobile bg-no-repeat bg-blend-overlay bg-slate-100/90 dark:bg-slate-900/90"
        style={{ backgroundImage: `url(/dialogcut/${ref.current}.png)` }}
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full p-8 opacity-70">
          <div className="text-6xl">{t("ui.error.title404")}</div>
          <div className="h-4" />
          <div className="text-lg">{t("ui.error.subtitle404")}</div>
          <div className="break-keep">{t("ui.error.description404")}</div>
          <div className="text-xs mt-1 rounded-sm bg-slate-100 dark:bg-slate-900 p-1">
            <div>{message}</div>
          </div>
          <div className="mt-4 text-lg flex gap-2 justify-center">
            <Link to="/">
              <Button>{t("ui.error.goto.main")}</Button>
            </Link>
            <Link to="/setting">
              <Button>{t("ui.error.goto.update")}</Button>
            </Link>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Error404;
