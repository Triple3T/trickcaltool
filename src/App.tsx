import { useState, useEffect, useMemo } from "react";
import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import { Card } from "./components/ui/card";

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
        className="bg-center bg-cover bg-no-repeat h-screen w-screen absolute top-0 left-0 bottom-0 right-0 opacity-25 dark:brightness-80 dark:contrast-125"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="p-24 flex justify-between flex-col items-center overflow-y-auto">
        <div className="absolute top-0 left-0 p-2 flex gap-2 w-full">
          <div className="flex-1 flex justify-end">
            <ModeToggle />
          </div>
        </div>
        <h1 className="text-6xl">이름못정함</h1>
        <h3>누가좀정해주세요감사합니다</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full">
          <div className="xs:px-10 px-5 py-4">
            <a href="/board">
              <Card className="p-4 text-left">
                <div className="text-2xl">황크 칠하기</div>
                <div>나만 황크 안 나와</div>
              </Card>
            </a>
          </div>
          <div className="xs:px-10 px-5 py-4">
            <Card className="p-4 text-left">
              <div className="text-2xl">보크 칠하기</div>
              <div>생각보다 많이 필요하더라</div>
            </Card>
          </div>
          <div className="xs:px-10 px-5 py-4">
            <Card className="p-4 text-left">
              <div className="text-2xl">랭크 올리기</div>
              <div>랭크작 적어두기 귀찮아</div>
            </Card>
          </div>
          <div className="xs:px-10 px-5 py-4">
            <Card className="p-4 text-left">
              <div className="text-2xl">교단 업그레이드</div>
              <div>루포야 일할 시간이야</div>
            </Card>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
