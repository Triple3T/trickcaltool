import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ExternalLink } from "lucide-react";
import "./App.css";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import MainMenuCard from "@/components/parts/main-menu-card";

function App() {
  const { t } = useTranslation();
  const [backgroundImage, setBackgroundImage] = useState(
    "/backgrounds/butter_pc.png"
  );
  const randomImageName = useMemo(() => {
    const imageNames = [
      "butter",
      "Epica",
      "group",
      "naia",
      "Selline",
      "Tig",
      "vivi",
      'alice',
      'blanchet',
      'ed',
      'half',
      'leets',
      'picora',
    ];
    return imageNames[Math.floor(Math.random() * imageNames.length)];
  }, []);
  useEffect(() => {
    function handleResize() {
      if (window.innerHeight > window.innerWidth) {
        setBackgroundImage(`/backgrounds/${randomImageName}_galaxy.webp`);
      } else {
        setBackgroundImage(`/backgrounds/${randomImageName}_pc.webp`);
      }
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [randomImageName]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div
        className="bg-center bg-cover bg-no-repeat h-screen w-screen fixed top-0 left-0 bottom-0 right-0 opacity-25 dark:brightness-80 dark:contrast-125"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="fixed top-0 left-0 flex p-2 gap-2 w-full z-10">
        <div className="flex-1 flex justify-end">
          <ModeToggle />
        </div>
      </div>
      <div className="flex flex-col min-h-screen relative font-onemobile">
        <main className="flex flex-col flex-1 p-4 md:p-6 items-center justify-center">
          <section className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-2xl font-semibold tracking-tighter sm:text-4xl text-gray-800 dark:text-gray-200">
              {t("ui.index.title")}
            </h2>
            <p className="max-w-[600px] text-gray-700 md:text-lg dark:text-gray-400">
              {t("ui.index.description")}
            </p>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://forms.gle/KRZbrmJ9FG2D19gG7"
            >
              <Button variant="outline" size="sm" className="bg-background/30 text-sm">
                {t("ui.index.reportBoard")}
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-8 sm:pt-10 md:pt-12 lg:pt-16">
              <MainMenuCard
                title={t("ui.board.title")}
                description={t("ui.board.description")}
                subDescription={t("ui.board.subDescription")}
                icon="/icons/Item_Crayon4.png"
                to="/board"
              />
              {/* <MainMenuCard
                title="상급 보드 노트"
                description={<>전체 스탯 고정치 보드 현황을 체크합니다.<br />꽤 많이 필요해</>}
                icon="/icons/Item_Crayon3.png"
                // to="/board"
              /> */}
              <MainMenuCard
                title={t("ui.equiprank.title")}
                description={t("ui.equiprank.description")}
                subDescription={t("ui.equiprank.subDescription")}
                icon="/itemslot/Tab_Equip_Default.png"
                to="/eqrank"
                greenIcon
              />
              <MainMenuCard
                title={t("ui.lab.title")}
                description={t("ui.lab.description")}
                subDescription={t("ui.lab.subDescription")}
                icon="/mainlobby/HousingButton.png"
                to="/lab"
              />
            </div>
          </section>
        </main>
        <footer className="flex flex-col sm:flex-row items-center justify-center py-4 bg-gray-500 shadow-md dark:bg-gray-800 fixed bottom-0 left-0 right-0 gap-1">
          <p className="text-[0.625rem] text-white dark:text-gray-400">
            {t("ui.index.gameCopyright")}, {t("ui.index.sitePoweredBy")}
          </p>
          <nav className="ml-4 flex space-x-2">
            <Link
              className="text-xs text-white dark:text-gray-400 hover:underline"
              to="/privacy"
            >
              {t("ui.index.textPrivacy")}
            </Link>
            <Link
              className="text-xs text-white dark:text-gray-400 hover:underline"
              to="/setting"
            >
              {t("ui.index.textSetting")}
            </Link>
            {/* <Link
              className="text-xs text-white dark:text-gray-400 hover:underline"
              to="#"
            >
              Service Agreement
            </Link>
            <Link
              className="text-xs text-white dark:text-gray-400 hover:underline"
              to="#"
            >
              About Us
            </Link> */}
          </nav>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
