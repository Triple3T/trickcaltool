import { useEffect } from "react";
import { useTranslation } from "react-i18next";
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
  useEffect(() => {
    const componentTitle = title ? t(title) ?? "" : "";
    const appTitle = t("ui.index.title");
    document.title = componentTitle
      ? `${componentTitle} - ${appTitle}`
      : appTitle;
  }, [t, title]);
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
      {/* <div className="w-full h-10" /> */}
      {children}
    </ThemeProvider>
  );
};

export default Layout;
