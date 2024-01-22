import { useState, useEffect, useMemo } from "react";
import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";

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
        className="bg-center bg-cover bg-no-repeat h-screen w-screen absolute top-0 left-0 opacity-25 dark:brightness-80 dark:contrast-125"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute top-0 left-0 p-2 flex gap-2 w-full">
          <div className="flex-1 flex justify-end">
            <ModeToggle />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
