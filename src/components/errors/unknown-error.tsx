import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import cuts from "./cuts";

const UnknownError = ({
  message,
  stack,
}: {
  message: string;
  stack: string;
}) => {
  const { t } = useTranslation();
  const [bgFileName, setBgFileName] = useState<string>("");
  useEffect(() => {
    const componentTitle = t("ui.error.title");
    const appTitle = t("ui.index.title");
    document.title = `${componentTitle} - ${appTitle}`;
    setBgFileName(cuts[Math.floor(Math.random() * cuts.length)]);
  }, [t]);
  const [viewStack, setViewStack] = useState<boolean>(false);
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div
        className="absolute left-0 top-0 bg-center bg-cover w-full h-full font-onemobile bg-no-repeat bg-blend-overlay bg-slate-100/90 dark:bg-slate-900/90"
        style={{ backgroundImage: `url(/dialogcut/${bgFileName}.webp)` }}
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full p-8 opacity-70 max-h-full overflow-y-auto">
          <div className="text-6xl">{t("ui.error.title")}</div>
          <div className="h-4" />
          <div className="text-lg">{t("ui.error.subtitle")}</div>
          <div className="break-keep">{t("ui.error.description")}</div>
          <div className="text-xs mt-1 rounded-sm bg-slate-100 dark:bg-slate-900 p-1">
            <div>{message}</div>
            <div
              className={cn(
                "transition-all ease-out duration-200 grid",
                viewStack ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                {stack.split("\n").map((t, i) => (
                  <div key={i} className="mt-0.5">
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="text-xs text-right">
            <span
              onClick={() => setViewStack((v) => !v)}
              className="cursor-pointer"
            >
              {viewStack ? t("ui.error.hidestack") : t("ui.error.viewstack")}
            </span>
          </div>
          <div className="text-sm mt-1 flex justify-center items-center p-1 my-1 text-blue-800/90 dark:text-blue-200/90 text-shadow-glow">
            <a href="mailto:trickcal-note@triple-lab.com">
              <Mail className="w-4 h-4 mr-1 inline-block" />
              {t("ui.error.contact")}
            </a>
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

export default UnknownError;
