import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BoardType, PurpleBoardType } from "@/types/enums";
import { Square, SquareCheckBig } from "lucide-react";

interface NthBoardViewerProps {
  charaName: string;
  boardIndex: number;
  boardShape: string;
  boardActualPosition: {
    s: number;
    b: string[];
  };
  boardCollection: number[];
  routeCollection: string[];
  pboardCollection: number;
  pbPositionIndexCollection: string;
  pbActualPositionCollection: {
    s: number;
    p: string[];
  };
  leftShift?: boolean;
}

interface BoardViewerProps {
  charaName: string;
  boardActualPosition: {
    s: number;
    b: string[];
  }[];
  boardShape: {
    s: number;
    b: string[];
  }[];
  boardShapeIndex: number;
  boardCollection: number[][];
  routeCollection: string[][];
  pboardCollection: number[];
  pbPositionIndexCollection: string[];
  pbActualPositionCollection: {
    s: number;
    p: string[];
  }[];
  leftShift1?: boolean;
}
const NthBoardViewer = ({
  boardIndex,
  boardShape,
  boardActualPosition,
  boardCollection,
  routeCollection,
  pboardCollection,
  pbPositionIndexCollection,
  pbActualPositionCollection,
  leftShift = false,
}: NthBoardViewerProps) => {
  const { s: startPoint, b: boardRoute } = boardActualPosition;
  const boardStats = boardCollection
    .map((statCollection) => statCollection.toString())
    .join("");
  const baseRoute: { boardType: number; stat: number }[] = boardShape
    .split("")
    .map((c) => {
      switch (c) {
        case "3":
          return { boardType: 2, stat: -1 };
        case "2":
          return { boardType: 1, stat: -1 };
        case "1":
          return { boardType: 0, stat: -1 };
        case "0":
        default:
          return { boardType: -1, stat: -1 };
      }
    });
  routeCollection
    .join(".")
    .split(".")
    .forEach((r, j) => {
      baseRoute[boardRoute[Number(r)].indexOf("X")].stat = Number(
        boardStats.charAt(j)
      );
    });
  pbPositionIndexCollection.split(".").forEach((p, j) => {
    const stat = Number(pboardCollection.toString().charAt(j));
    const position = pbActualPositionCollection.p[Number(p)];
    position.split(".").forEach((pos) => {
      const [posRow, posCol] = pos.split("").map((rc) => parseInt(rc, 36));
      const cellIndex = posRow * 7 + posCol;
      baseRoute[cellIndex] = {
        boardType: 1,
        stat,
      };
    });
  });
  if (leftShift) baseRoute.push(baseRoute.shift()!);
  const routeRows = baseRoute.length / 7;
  return (
    <div>
      {Array(routeRows)
        .fill(0)
        .map((_, rowNum) => {
          return (
            <div
              key={rowNum}
              className="flex flex-row justify-center items-center"
            >
              {Array(7)
                .fill(0)
                .map((_, colNum) => {
                  const cellIndex = rowNum * 7 + colNum;
                  const cell = baseRoute[cellIndex];
                  if (cell.boardType === 0) {
                    return (
                      <div
                        key={colNum}
                        className="w-6 h-6 bg-board-normal bg-cover"
                      />
                    );
                  }
                  if (cell.boardType === 1) {
                    return (
                      <div
                        key={colNum}
                        className="w-6 h-6 bg-board-high bg-cover"
                      >
                        <img
                          src={`/boards/Tile_${
                            PurpleBoardType[cell.stat]
                          }On.webp`}
                          className="w-full h-full aspect-square"
                        />
                      </div>
                    );
                  }
                  if (cell.boardType === 2) {
                    return (
                      <div
                        key={colNum}
                        className="w-6 h-6 bg-board-special bg-cover"
                      >
                        <img
                          src={`/boards/Tile_${BoardType[cell.stat]}On.webp`}
                          className="w-full h-full aspect-square"
                        />
                      </div>
                    );
                  }
                  return <div key={colNum} className="w-6 h-6" />;
                })}
            </div>
          );
        })}

      <div className="flex flex-row justify-center items-center">
        {Array(7)
          .fill(0)
          .map((_, colNum) => {
            if (colNum === startPoint - (leftShift ? 1 : 0)) {
              if (boardIndex === 0) {
                return (
                  <div
                    key={colNum}
                    className="w-6 h-6 bg-board-normal bg-cover"
                  >
                    <img
                      src="/boards/Tile_Start.webp"
                      className="w-full h-full aspect-square"
                    />
                  </div>
                );
              }
              return (
                <div key={colNum} className="w-6 h-6 bg-board-gate bg-cover">
                  <img
                    src="/boards/Tile_Gate.webp"
                    className="w-full h-full aspect-square"
                  />
                </div>
              );
            }
            return <div key={colNum} className="w-6 h-6" />;
          })}
      </div>
    </div>
  );
};

const BoardViewer = ({
  charaName,
  boardActualPosition,
  boardShape,
  boardShapeIndex,
  boardCollection,
  routeCollection,
  pboardCollection,
  pbPositionIndexCollection,
  pbActualPositionCollection,
  leftShift1 = false,
}: BoardViewerProps) => {
  const { t } = useTranslation();
  const [boardOn, setBoardOn] = useState<string[]>([]);

  return (
    <div>
      <ToggleGroup
        type="multiple"
        className="flex flex-row gap-2"
        value={boardOn}
        onValueChange={(v) => {
          v.sort();
          if (v[0] === "0" && v[1] === "2") setBoardOn(["0", "1", "2"]);
          else setBoardOn(v);
        }}
      >
        <ToggleGroupItem
          className={cn("flex-1 bg-background/50")}
          value="0"
          size="sm"
          variant="outline"
        >
          {boardOn.includes("0") ? (
            <SquareCheckBig className="w-5 h-5 mr-1" />
          ) : (
            <Square className="w-5 h-5 mr-1" />
          )}
          {t("ui.board.board1")}
        </ToggleGroupItem>
        <ToggleGroupItem
          className={cn("flex-1 bg-background/50")}
          value="1"
          size="sm"
          variant="outline"
        >
          {boardOn.includes("1") ? (
            <SquareCheckBig className="w-5 h-5 mr-1" />
          ) : (
            <Square className="w-5 h-5 mr-1" />
          )}
          {t("ui.board.board2")}
        </ToggleGroupItem>
        <ToggleGroupItem
          className={cn("flex-1 bg-background/50")}
          value="2"
          size="sm"
          variant="outline"
        >
          {boardOn.includes("2") ? (
            <SquareCheckBig className="w-5 h-5 mr-1" />
          ) : (
            <Square className="w-5 h-5 mr-1" />
          )}
          {t("ui.board.board3")}
        </ToggleGroupItem>
      </ToggleGroup>
      <div className="mt-4">
        {(boardOn.includes("2") || boardOn.length < 1) && (
          <NthBoardViewer
            boardIndex={2}
            charaName={charaName}
            boardShape={boardShape[2].b[boardShapeIndex]}
            boardActualPosition={boardActualPosition[2]}
            boardCollection={boardCollection[2]}
            routeCollection={routeCollection[2]}
            pboardCollection={pboardCollection[2]}
            pbPositionIndexCollection={pbPositionIndexCollection[2]}
            pbActualPositionCollection={pbActualPositionCollection[2]}
          />
        )}
        {(boardOn.includes("1") || boardOn.length < 1) && (
          <NthBoardViewer
            boardIndex={1}
            charaName={charaName}
            boardShape={boardShape[1].b[boardShapeIndex]}
            boardActualPosition={boardActualPosition[1]}
            boardCollection={boardCollection[1]}
            routeCollection={routeCollection[1]}
            pboardCollection={pboardCollection[1]}
            pbPositionIndexCollection={pbPositionIndexCollection[1]}
            pbActualPositionCollection={pbActualPositionCollection[1]}
          />
        )}
        {(boardOn.includes("0") || boardOn.length < 1) && (
          <NthBoardViewer
            boardIndex={0}
            charaName={charaName}
            boardShape={boardShape[0].b[boardShapeIndex]}
            boardActualPosition={boardActualPosition[0]}
            boardCollection={boardCollection[0]}
            routeCollection={routeCollection[0]}
            pboardCollection={pboardCollection[0]}
            pbPositionIndexCollection={pbPositionIndexCollection[0]}
            pbActualPositionCollection={pbActualPositionCollection[0]}
            leftShift={leftShift1}
          />
        )}
      </div>
    </div>
  );
};

export default BoardViewer;
