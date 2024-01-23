import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";

function App() {
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
    ];
    return imageNames[Math.floor(Math.random() * imageNames.length)];
  }, []);
  useEffect(() => {
    function handleResize() {
      if (window.innerHeight > window.innerWidth) {
        setBackgroundImage(`/backgrounds/${randomImageName}_galaxy.png`);
      } else {
        setBackgroundImage(`/backgrounds/${randomImageName}_pc.png`);
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
      <div className="flex flex-col min-h-screen relative">
        <main className="flex flex-col flex-1 p-4 md:p-6 items-center justify-center">
          <section className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-2xl font-semibold tracking-tighter sm:text-4xl text-gray-800 dark:text-gray-200">
              이름못정함
            </h2>
            <p className="max-w-[600px] text-gray-700 md:text-lg dark:text-gray-400">
              이름좀정해주실분ㅎㅎ;;
            </p>
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link to="/board">
                <div className="flex flex-col bg-gray-200/50 p-4 rounded-lg shadow-md space-y-4">
                  {/* <PackageIcon className="h-6 w-6 lg:h-8 lg:w-8 text-blue-500" /> */}
                  <img
                    src="/icons/Item_Crayon4.png"
                    className="h-6 w-6 lg:h-8 lg:w-8"
                  />
                  <h3 className="text-lg font-medium lg:text-xl text-gray-800 dark:text-gray-200">
                    황크 칠하기
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    전체 8% 보드 현황을 체크합니다.<br />나만 황크 안 나와
                  </p>
                </div>
              </Link>
              <div className="flex flex-col bg-gray-200/50 p-4 rounded-lg shadow-md space-y-4">
                {/* <GaugeIcon className="h-6 w-6 lg:h-8 lg:w-8 text-blue-500" /> */}
                <img
                  src="/icons/Item_Crayon3.png"
                  className="h-6 w-6 lg:h-8 lg:w-8"
                />
                <h3 className="text-lg font-medium lg:text-xl text-gray-800 dark:text-gray-200">
                  보크 칠하기
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  전체 스탯 고정치 보드 현황을 체크합니다.<br />은근 필요해
                </p>
              </div>
              <div className="flex flex-col bg-gray-200/50 p-4 rounded-lg shadow-md space-y-4">
                {/* <BarChartIcon className="h-6 w-6 lg:h-8 lg:w-8 text-blue-500" /> */}
                <img
                  src="/itemslot/Tab_Equip_Default.png"
                  className="h-6 w-6 lg:h-8 lg:w-8 bg-greenicon rounded-full"
                />
                <h3 className="text-lg font-medium lg:text-xl text-gray-800 dark:text-gray-200">
                  랭크 메모장
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  사도들의 장비 랭크를 메모해 둡니다.<br />메모 안 하면 헷갈려
                </p>
              </div>
              <div className="flex flex-col bg-gray-200/50 p-4 rounded-lg shadow-md space-y-4">
                {/* <HelpCircleIcon className="h-6 w-6 lg:h-8 lg:w-8 text-blue-500" /> */}
                <img
                  src="/mainlobby/HousingButton.png"
                  className="h-6 w-6 lg:h-8 lg:w-8"
                />
                <h3 className="text-lg font-medium lg:text-xl text-gray-800 dark:text-gray-200">
                  교단 레벨업
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  교단의 각종 레벨업 현황을 체크합니다.<br />루포야 일하자
                </p>
              </div>
            </div>
          </section>
        </main>
        <footer className="flex items-center justify-center py-4 bg-gray-500 shadow-md dark:bg-gray-800 fixed bottom-0 left-0 right-0">
          <p className="text-xs text-white dark:text-gray-400">
            Trickcal copyrighted by EPIDGames, Trickcal Tool powered by Triple
          </p>
          {/* <nav className="ml-4 flex space-x-2">
            <Link
              className="text-xs text-white dark:text-gray-400 hover:underline"
              to="#"
            >
              Privacy Policy
            </Link>
            <Link
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
            </Link>
          </nav> */}
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
