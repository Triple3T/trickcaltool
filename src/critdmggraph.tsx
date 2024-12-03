import { HTMLAttributes, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const numberStartX = -4000;
const numberEndX = 12000;
const numberIntervalX = 2000;
const numberStartY = 0;
const numberEndY = 5;
const numberIntervalY = 0.5;
const padXStart = (numberEndX - numberStartX) * 0.1;
const padXEnd = padXStart * 0.35;
const padYStart = padXEnd / 2;
const padYEnd = padXStart / 2;
const startX = -1480.3;
const startY = 1.15;
const midX = 0;
const midY = 1.3;
const endX = 10125;
const endY = 4;
const lengthX = endX - startX;
const lengthY = (numberEndX - numberStartX) / 2;
const areaWidth = numberEndX - numberStartX + padXStart + padXEnd;
const areaHeight = lengthY + padYStart + padYEnd;
const leftX = startX - numberStartX;
const rightX = numberEndX - endX;
const yMult = -lengthY / (numberEndY - numberStartY);
const a1 = -878.293;
const b1 = 1.20795;
const c1 = -379.61;
const d1 = 1.25951;
const a2 = 820.031;
const b2 = 3.38812;
const c2 = 2294.54;
const d2 = 3.78133;
const boxWidth = padXStart * 2.5;
const boxHeight = boxWidth * 0.35;
const boxMargin = boxWidth * 0.05;
const graphStartX = padXStart / areaWidth;
const graphEndX = (padXStart + numberEndX - numberStartX) / areaWidth;
const graphStartActualY = padYStart + numberStartY * yMult + lengthY;
const graphEndActualY = padYStart + numberEndY * yMult + lengthY;
const markFontSize = boxWidth * 0.1;
const guideFontSize = markFontSize * 0.9;
const strokeWidth = padXStart *0.02;
const circleRadius = strokeWidth * 2;
const boxRadius = circleRadius * 1.25;

interface FocusProps {
  xPos: number;
  actualXPos: number;
  exactX: number;
  exactY: number;
}

const CritDmgGraph = ({
  className,
  ...props
}: Omit<HTMLAttributes<HTMLDivElement>, "children">) => {
  const [focusedValue, setFocusedValue] = useState<FocusProps>({
    xPos: -1,
    actualXPos: -999999,
    exactX: -1,
    exactY: -1,
  });
  const elRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (elRef.current) {
      const mouseMoveFocusHandler = (event: MouseEvent) => {
        const bounds = elRef.current!.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        const actualXPos = areaWidth * x;
        const exactX = actualXPos - padXStart + numberStartX;
        const exactY =
          exactX < 0
            ? Math.max(startY, 84375 / (28125 - Math.min(28124, exactX)) - 1.7)
            : Math.min(endY, 4.3 - 3375 / (exactX + 1125));
        if (x >= graphStartX && x <= graphEndX && y >= 0 && y <= 1)
          setFocusedValue({
            xPos: x,
            actualXPos,
            exactX,
            exactY,
          });
      };
      window.addEventListener("mousemove", mouseMoveFocusHandler);
      return () => {
        window.removeEventListener("mousemove", mouseMoveFocusHandler);
      };
    }
  }, []);

  return (
    <div
      className={cn("w-full", className, "aspect-[2] bg-[#121212]")}
      {...props}
    >
      <svg
        ref={elRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`${0} ${0} ${areaWidth} ${areaHeight}`}
        style={{ width: "100%", height: "100%" }}
      >
        {/* x축 눈금 */}
        {Array(Math.round((numberEndX - numberStartX) / numberIntervalX) + 1)
          .fill(0)
          .map((_, i) => {
            const x = padXStart + i * numberIntervalX;
            return (
              <>
                <line
                  x1={`${x}`}
                  y1={`${graphStartActualY}`}
                  x2={`${x}`}
                  y2={`${graphEndActualY}`}
                  stroke="#262626"
                  stroke-width={strokeWidth}
                />
                <text
                  x={`${x}`}
                  y={`${padYStart + lengthY + markFontSize * 1.5}`}
                  fill="#575757"
                  font-size={markFontSize}
                  text-anchor="middle"
                >
                  {Math.abs(numberStartX + i * numberIntervalX) >= 1000
                    ? `${(numberStartX + i * numberIntervalX) / 1000}k`
                    : `${numberStartX + i * numberIntervalX}`}
                </text>
              </>
            );
          })}
        {/* y축 눈금 */}
        {Array(Math.round((numberEndY - numberStartY) / numberIntervalY) + 1)
          .fill(0)
          .map((_, i) => {
            const y =
              padYStart +
              Math.round(numberIntervalY * 100 * i * yMult) / 100 +
              lengthY;
            return (
              <>
                <line
                  x1={`${padXStart}`}
                  y1={`${y}`}
                  x2={`${areaWidth - padXEnd}`}
                  y2={`${y}`}
                  stroke="#262626"
                  stroke-width={strokeWidth}
                />
                <text
                  x={`${padXStart - markFontSize * 0.6}`}
                  y={`${y + markFontSize * 0.5}`}
                  fill="#575757"
                  font-size={markFontSize}
                  text-anchor="end"
                >
                  {Math.round((numberStartY + i * numberIntervalY) * 100)}%
                </text>
              </>
            );
          })}
        {/* 그래프 경계 */}
        {/* <line
          x1={`${padXStart}`}
          y1={`${graphStartY}`}
          x2={`${padXStart + leftX + lengthX + rightX}`}
          y2={`${graphStartY}`}
          stroke="#262626"
          stroke-width="100"
        />
        <line
          x1={`${padXStart}`}
          y1={`${graphStartY}`}
          x2={`${padXStart}`}
          y2={`${graphEndY}`}
          stroke="#262626"
          stroke-width="100"
        /> */}
        {/* 그래프 영역 */}
        <line
          x1={`${padXStart}`}
          y1={`${padYStart + startY * yMult + lengthY}`}
          x2={`${padXStart + leftX}`}
          y2={`${padYStart + startY * yMult + lengthY}`}
          stroke="orange"
          stroke-width={strokeWidth}
        />
        <path
          d={`M${padXStart + leftX} ${padYStart + startY * yMult + lengthY} C ${
            padXStart + leftX + a1 - startX
          } ${padYStart + b1 * yMult + lengthY}, ${
            padXStart + leftX + c1 - startX
          } ${padYStart + d1 * yMult + lengthY}, ${
            padXStart + leftX + midX - startX
          } ${padYStart + midY * yMult + lengthY}`}
          stroke="lime"
          fill="none"
          stroke-width={strokeWidth}
        />
        <path
          d={`M${padXStart + leftX + midX - startX} ${
            padYStart + midY * yMult + lengthY
          } C ${padXStart + leftX + a2 - startX} ${
            padYStart + b2 * yMult + lengthY
          }, ${padXStart + leftX + c2 - startX} ${
            padYStart + d2 * yMult + lengthY
          }, ${padXStart + leftX + lengthX} ${
            padYStart + endY * yMult + lengthY
          }`}
          stroke="cyan"
          fill="none"
          stroke-width={strokeWidth}
        />
        <line
          x1={`${padXStart + leftX + lengthX}`}
          y1={`${padYStart + endY * yMult + lengthY}`}
          x2={`${padXStart + leftX + lengthX + rightX}`}
          y2={`${padYStart + endY * yMult + lengthY}`}
          stroke="magenta"
          stroke-width={strokeWidth}
        />
        {/* 인터랙티브 */}
        <line
          x1={`${focusedValue.actualXPos}`}
          y1={`${graphStartActualY}`}
          x2={`${focusedValue.actualXPos}`}
          y2={`${graphEndActualY}`}
          stroke="red"
          stroke-width={strokeWidth}
        />
        <circle
          cx={`${focusedValue.actualXPos}`}
          cy={`${padYStart + yMult * focusedValue.exactY + lengthY}`}
          r={circleRadius}
          fill="yellow"
        />
        <rect
          x={`${
            focusedValue.actualXPos +
            (focusedValue.xPos > 0.5 ? -boxWidth - boxMargin : boxMargin)
          }`}
          y={`${Math.max(
            graphEndActualY + boxMargin,
            Math.min(
              graphStartActualY - boxHeight - boxMargin,
              padYStart +
                yMult * focusedValue.exactY +
                lengthY +
                boxMargin
            )
          )}`}
          rx={boxRadius}
          ry={boxRadius}
          width={`${boxWidth}`}
          height={`${boxHeight}`}
          fill="#393939"
        />
        <text
          x={`${
            focusedValue.actualXPos +
            (focusedValue.xPos > 0.5
              ? -boxWidth / 2 - boxMargin
              : boxWidth / 2 + boxMargin)
          }`}
          y={`${
            Math.max(
              graphEndActualY + boxMargin,
              Math.min(
                graphStartActualY - boxHeight - boxMargin,
                padYStart +
                  yMult * focusedValue.exactY +
                  lengthY +
                  boxMargin
              )
            ) +
            boxHeight * 0.4
          }`}
          fill="#adadad"
          font-size={guideFontSize}
          text-anchor="middle"
        >
          {focusedValue.exactX > 0
            ? `치명 피해 초과 +${Math.round(
                focusedValue.exactX
              ).toLocaleString()}`
            : `치명 피해 부족 ${Math.round(
                focusedValue.exactX
              ).toLocaleString()}`}
        </text>

        <text
          x={`${
            focusedValue.actualXPos +
            (focusedValue.xPos > 0.5
              ? -boxWidth / 2 - boxMargin
              : boxWidth / 2 + boxMargin)
          }`}
          y={`${
            Math.max(
              graphEndActualY + boxMargin,
              Math.min(
                graphStartActualY - boxHeight - boxMargin,
                padYStart +
                  yMult * focusedValue.exactY +
                  lengthY +
                  boxMargin
              )
            ) +
            boxHeight * 0.8
          }`}
          fill="#adadad"
          font-size={guideFontSize}
          text-anchor="middle"
        >
          치피 계수 {(focusedValue.exactY * 100).toFixed(2)}%
        </text>
      </svg>
    </div>
  );
};

export default CritDmgGraph;
