import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getCharaImageUrl } from "@/utils/getImageUrl";
import chara from "@/data/chara";

const allMinimis = Object.entries(chara)
  .map(([key, value]) => {
    const returnArray = [key];
    Array(value.s || 0)
      .fill(0)
      .forEach((_, i) => returnArray.push(`${key}Skin${i + 1}`));
    return returnArray;
  })
  .flat();

// minimi initial baseline is 90% of its height
const RandomMinimi = ({ className }: { className?: string }) => {
  const [minimi, setMinimi] = useState<string>("");
  useEffect(() => {
    if (Math.random() < 0.833) setMinimi("");
    else setMinimi(allMinimis[Math.floor(Math.random() * allMinimis.length)]);
  }, []);
  if (!minimi) return <div className="w-0 h-0 pointer-events-none" />;
  return (
    <div className="relative w-0 h-0 pointer-events-none">
      <img
        src={getCharaImageUrl(minimi, "af")}
        className={cn(
          "absolute pointer-events-none opacity-90",
          "w-24 h-24 max-w-24",
          "sm:w-28 sm:h-28 sm:max-w-28",
          "md:w-32 md:h-32 md:max-w-32",
          "lg:w-36 lg:h-36 lg:max-w-36",
          className
        )}
      />
    </div>
  );
};

const AFOverlay = () => {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);
  const [wGap, setWGap] = useState<number>(64);
  const [hGap, setHGap] = useState<number>(64);
  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setWindowWidth(w);
      setWindowHeight(h);
      if (w < 640) {
        // xs
        setWGap(64);
      } else if (w < 768) {
        // sm
        setWGap(80);
      } else if (w < 1024) {
        // md
        setWGap(80);
      } else if (w < 1280) {
        // lg
        setWGap(96);
      } else if (w < 1536) {
        // xl
        setWGap(96);
      } else {
        // 2xl
        setWGap(96);
      }
      if (h < 640) {
        // xs
        setHGap(64);
      } else if (h < 768) {
        // sm
        setHGap(80);
      } else if (h < 1024) {
        // md
        setHGap(80);
      } else if (h < 1280) {
        // lg
        setHGap(96);
      } else if (h < 1536) {
        // xl
        setHGap(96);
      } else {
        // 2xl
        setHGap(96);
      }
    };
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-0 flex flex-row justify-around z-20 px-16">
        {Array(Math.floor((windowWidth - 128) / wGap))
          .fill(0)
          .map((_, i) => {
            return (
              <RandomMinimi
                key={i}
                className="top-0 -translate-y-[10%] left-0 -translate-x-1/2 rotate-180"
              />
            );
          })}
      </div>
      <div className="fixed bottom-0 left-0 w-full h-0 flex flex-row justify-around z-20 px-8">
        {Array(Math.floor((windowWidth - 64) / wGap))
          .fill(0)
          .map((_, i) => {
            return (
              <RandomMinimi
                key={i}
                className="bottom-0 translate-y-[10%] left-0 -translate-x-1/2"
              />
            );
          })}
      </div>
      <div className="fixed top-0 left-0 h-full w-0 flex flex-col justify-around z-20 py-8">
        {Array(Math.floor((windowHeight - 64) / hGap))
          .fill(0)
          .map((_, i) => {
            return (
              <RandomMinimi
                key={i}
                className="left-0 -translate-x-[10%] bottom-0 -translate-y-1/2 rotate-90"
              />
            );
          })}
      </div>
      <div className="fixed top-0 right-0 h-full w-0 flex flex-col justify-around z-20 py-8">
        {Array(Math.floor((windowHeight - 64) / hGap))
          .fill(0)
          .map((_, i) => {
            return (
              <RandomMinimi
                key={i}
                className="right-0 translate-x-[10%] bottom-0 -translate-y-1/2 -rotate-90"
              />
            );
          })}
      </div>
    </>
  );
};

export default AFOverlay;
