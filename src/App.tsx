import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, ExternalLink } from "lucide-react";
import "./App.css";
// import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { QuickSync } from "@/components/quick-sync";
import LocalizeEngageNotice from "@/components/parts/localize-engage-notice";
import MainMenuCard from "@/components/parts/main-menu-card";
// import GoogleSyncChangedNotice from "@/components/parts/google-sync-changed-notice";
import UtilitySetCard from "@/components/parts/menu-card-utilityset";
import getServerHash from "@/utils/getServerHash";

// af
import { useIsAFOverlayActive } from "./stores/useAFDataStore";
import AFOverlay from "./components/afoverlay";

const imageNames = [
  "butter",
  "Epica",
  "group",
  "naia",
  "Selline",
  "Tig",
  "vivi",
  "alice",
  "blanchet",
  "ed",
  "half",
  "leets",
  "picora",
];

function App() {
  const { t } = useTranslation();
  const isAFActive = useIsAFOverlayActive();
  const randomImageName = useRef<string>(
    imageNames[Math.floor(Math.random() * imageNames.length)]
  );
  const [backgroundImage, setBackgroundImage] = useState<string>();
  const [isHashUpdated, setIsHashUpdated] = useState<boolean>(false);
  useEffect(() => {
    function handleResize() {
      if (window.innerHeight > window.innerWidth) {
        setBackgroundImage(
          `url(/backgrounds/${randomImageName.current}_galaxy.webp)`
        );
      } else {
        setBackgroundImage(
          `url(/backgrounds/${randomImageName.current}_pc.webp)`
        );
      }
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    getServerHash()
      .then((v) => {
        if (v !== process.env.VERSION_HASH) setIsHashUpdated(true);
      })
      .catch(() => {});
  }, []);
  useEffect(() => {
    document.title = t("ui.index.title");
  }, [t]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {isAFActive && <AFOverlay />}
      <div
        className="bg-center bg-cover bg-no-repeat h-screen w-screen fixed top-0 left-0 bottom-0 right-0 opacity-25 dark:brightness-80 dark:contrast-125"
        style={{ backgroundImage }}
      />
      <div className="fixed top-0 left-0 flex p-2 gap-2 w-full z-10">
        <div className="flex-1 flex gap-2 justify-end">
          <QuickSync />
          <ModeToggle />
        </div>
      </div>
      <div className="flex flex-col min-h-screen relative font-onemobile -mt-16 pt-16">
        <main className="flex flex-col flex-1 pt-8 items-center justify-center mb-16">
          <section className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-2xl font-semibold tracking-tighter sm:text-4xl text-gray-800 dark:text-gray-200">
              {t("ui.index.title")}
            </h2>
            {isHashUpdated ? (
              <p className="max-w-[600px] text-red-600/80 md:text-lg dark:text-red-500/80">
                <Link to="/setting">
                  {t("ui.index.newVersionDetected")}
                  <ArrowRight
                    className="w-4 h-4 inline-block align-middle ml-2"
                    strokeWidth={3.5}
                  />
                </Link>
              </p>
            ) : (
              <p className="max-w-[600px] text-gray-700 md:text-lg dark:text-gray-400">
                {t("ui.index.description")}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-2 items-center sm:items-baseline justify-center">
              {isAFActive && <Link to="/setting" className="text-sm">{t("ui.common.afOffDesc")}</Link>}
              {/* <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://triple3t.notion.site/1-14cc52e157ae80618170e928ba76de74"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-background/30 text-sm"
                >
                  {t("ui.index.afterSurvey")}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <GoogleSyncChangedNotice /> */}
              <LocalizeEngageNotice />
            </div>
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-8 sm:pt-10 md:pt-12 lg:pt-16 pb-16">
              <MainMenuCard
                title={t("ui.index.buttonGroup.note.title")}
                description={t("ui.index.buttonGroup.note.description")}
                subMenus={[
                  {
                    icon: "/icons/Item_Crayon4.png",
                    title: t("ui.board.title"),
                    to: "/board",
                  },
                  {
                    icon: "/itemslot/Tab_Tree.png",
                    title: t("ui.board.pboardTitle"),
                    to: "/pboard",
                    greenIcon: true,
                  },
                  {
                    icon: "/growth/CommonLevelUpPopupIcon.png",
                    title: t("ui.equiprank.title"),
                    to: "/eqrank",
                  },
                  {
                    icon: "/mainlobby/HousingButton.png",
                    title: t("ui.lab.title"),
                    to: "/lab",
                  },
                ]}
              />
              <MainMenuCard
                title={t("ui.index.buttonGroup.trickcalpedia.title")}
                description={t(
                  "ui.index.buttonGroup.trickcalpedia.description"
                )}
                subMenus={[
                  {
                    icon: "/itemslot/Tab_Detail.png",
                    title: t("ui.personal.title"),
                    to: "/personal",
                    greenIcon: true,
                  },
                  {
                    icon: "/itemslot/Tab_Equip_Default.png",
                    title: t("ui.equipviewer.title"),
                    to: "/equipviewer",
                    greenIcon: true,
                  },
                  {
                    icon: "/icons/CurrencyIcon_0011.png",
                    title: t("ui.normaldrop.title"),
                    to: "/normaldrop",
                  },
                ]}
              />
              <MainMenuCard
                title={t("ui.index.buttonGroup.search.title")}
                description={t("ui.index.buttonGroup.search.description")}
                subMenus={[
                  {
                    icon: "/myhomeicons/MyHome_Button_004.png",
                    title: t("ui.tasksearch.title"),
                    to: "/tasksearch",
                  },
                  {
                    icon: "/icons/Common_Node_Special.png",
                    title: t("ui.boardsearch.title"),
                    to: "/boardsearch",
                  },
                  {
                    icon: "/foods/MyHomeRestaurant_EatingInviteIcon.png",
                    title: t("ui.restaurant.title"),
                    to: "/restaurant",
                  },
                ]}
              />
              <MainMenuCard
                title={t("ui.index.buttonGroup.calculator.title")}
                description={t("ui.index.buttonGroup.calculator.description")}
                subMenus={[
                  {
                    icon: "/icons/CurrencyIcon_0041.png",
                    title: t("ui.goodscalc.title"),
                    to: "/goodscalc",
                  },
                  {
                    icon: "/icons/CurrencyIcon_0048.png",
                    title: t("ui.dispatchcalc.title"),
                    to: "/dispatchcalc",
                  },
                  {
                    icon: "/scenes/DeckButton.png",
                    title: t("ui.teambuilder.title"),
                    to: "/teambuilder",
                  },
                  {
                    icon: "/common/BoardRecord_Tab_Stat.png",
                    title: t("ui.check.guide.index"),
                    to: "/guidecheck",
                    greenIcon: true,
                  },
                ]}
              />
            </div>
          </section>
          <UtilitySetCard />
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
            <a
              className="text-xs text-white dark:text-gray-400 hover:underline"
              href="https://triple3t.notion.site/155c52e157ae80d49106d63711dfd84c"
            >
              {t("ui.index.textHelp")}
              <ExternalLink className="w-3 h-3 ml-0.5 inline" />
            </a>
            <a
              className="text-xs text-white dark:text-gray-400 hover:underline"
              href="https://triple3t.notion.site/102c52e157ae80f5a581dda26232a96b"
            >
              {t("ui.index.textUpdateLog")}
              <ExternalLink className="w-3 h-3 ml-0.5 inline" />
            </a>
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
