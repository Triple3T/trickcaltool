import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "./theme-provider";
import { ModeToggle } from "./mode-toggle";
import { QuickSync } from "./quick-sync";
import BackButton from "./common/back-button";
import MenuButton from "./common/menu-button";

const Layout = ({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) => {
  const { t } = useTranslation();
  const [displayScrollToTop, setDisplayScrollToTop] = useState<boolean>(false);
  useEffect(() => {
    const componentTitle = title ? t(title) ?? "" : "";
    const appTitle = t("ui.index.title");
    document.title = componentTitle
      ? `${componentTitle} - ${appTitle}`
      : appTitle;
  }, [t, title]);
  useEffect(() => {
    const scrollToTopDisplayHandler = () => {
      if (window.scrollY > 200) {
        setDisplayScrollToTop(true);
      } else {
        setDisplayScrollToTop(false);
      }
    };
    window.addEventListener("scroll", scrollToTopDisplayHandler);
    return () => {
      window.removeEventListener("scroll", scrollToTopDisplayHandler);
    };
  }, []);
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="fixed top-0 left-0 p-2 w-auto flex gap-2 z-20">
        <div className="flex-1 flex gap-2 justify-start">
          <BackButton />
          <MenuButton />
        </div>
      </div>
      <div className="fixed top-0 right-0 p-2 w-auto flex gap-2 z-20">
        <div className="flex-1 flex gap-2 justify-end">
          <QuickSync />
          <ModeToggle />
        </div>
      </div>
      <div
        className={cn(
          "fixed right-2 transition-all duration-300 ease-in-out w-7 h-7 p-1 bg-foreground/70 rounded-full shadow-md",
          displayScrollToTop ? "bottom-3" : "-bottom-10"
        )}
      >
        <ArrowUp
          className="text-background/80 w-5 h-5"
          onClick={() =>
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
          }
        />
      </div>
      {/* <div className="w-full h-10" /> */}
      {children}
    </ThemeProvider>
  );
};

export default Layout;
