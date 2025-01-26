import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BoardType, PurpleBoardType } from "@/types/enums";
import { Square, SquareCheckBig } from "lucide-react";

interface NthBoardViewerProps {
  charaName: string;
  boardIndex: number;
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
  hasBottom?: boolean;
  leftShift?: boolean;
}

interface BoardViewerProps {
  charaName: string;
  boardActualPosition: {
    s: number;
    b: string[];
  }[];
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
  boardActualPosition,
  boardCollection,
  routeCollection,
  pboardCollection,
  pbPositionIndexCollection,
  pbActualPositionCollection,
  hasBottom = false,
  leftShift = false,
}: NthBoardViewerProps) => {
  const { s: startPoint, b: boardRoute } = boardActualPosition;
  const boardStats = boardCollection
    .map((statCollection) => statCollection.toString())
    .join("");
  const allRoutes = routeCollection
    .join(".")
    .split(".")
    .map((routeIndex) => boardRoute[Number(routeIndex)]);
  const baseRoute: { boardType: number; stat: number }[] = allRoutes[0]
    .split("")
    .map((c) =>
      c === "0" ? { boardType: -1, stat: -1 } : { boardType: 0, stat: -1 }
    );
  allRoutes.forEach((r, j) => {
    baseRoute[r.indexOf("X")] = {
      boardType: 2,
      stat: Number(boardStats.charAt(j)),
    };
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
                          }On.png`}
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
                          src={`/boards/Tile_${BoardType[cell.stat]}On.png`}
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
      {hasBottom && (
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
                        src="/boards/Tile_Start.png"
                        className="w-full h-full aspect-square"
                      />
                    </div>
                  );
                }
                return (
                  <div key={colNum} className="w-6 h-6 bg-board-gate bg-cover">
                    <img
                      src="/boards/Tile_Gate.png"
                      className="w-full h-full aspect-square"
                    />
                  </div>
                );
              }
              return <div key={colNum} className="w-6 h-6" />;
            })}
        </div>
      )}
    </div>
  );
};

const BoardViewer = ({
  charaName,
  boardActualPosition,
  boardCollection,
  routeCollection,
  pboardCollection,
  pbPositionIndexCollection,
  pbActualPositionCollection,
  leftShift1 = false,
}: BoardViewerProps) => {
  const { t } = useTranslation();
  const [boardOn, setBoardOn] = useState(["0", "1", "2"]);

  return (
    <div>
      <ToggleGroup
        type="multiple"
        className="flex flex-row gap-2"
        value={boardOn}
        onValueChange={(v) => {
          v.sort();
          console.log(v);
          console.log(v[0] === "0" && v[1] === "2");
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
        {boardOn.includes("2") && (
          <NthBoardViewer
            boardIndex={2}
            charaName={charaName}
            boardActualPosition={boardActualPosition[2]}
            boardCollection={boardCollection[2]}
            routeCollection={routeCollection[2]}
            pboardCollection={pboardCollection[2]}
            pbPositionIndexCollection={pbPositionIndexCollection[2]}
            pbActualPositionCollection={pbActualPositionCollection[2]}
            hasBottom={boardOn.includes("2") && boardOn.includes("1")}
          />
        )}
        {boardOn.includes("1") && (
          <NthBoardViewer
            boardIndex={1}
            charaName={charaName}
            boardActualPosition={boardActualPosition[1]}
            boardCollection={boardCollection[1]}
            routeCollection={routeCollection[1]}
            pboardCollection={pboardCollection[1]}
            pbPositionIndexCollection={pbPositionIndexCollection[1]}
            pbActualPositionCollection={pbActualPositionCollection[1]}
            hasBottom={boardOn.includes("1") && boardOn.includes("0")}
          />
        )}
        {boardOn.includes("0") && (
          <NthBoardViewer
            boardIndex={0}
            charaName={charaName}
            boardActualPosition={boardActualPosition[0]}
            boardCollection={boardCollection[0]}
            routeCollection={routeCollection[0]}
            pboardCollection={pboardCollection[0]}
            pbPositionIndexCollection={pbPositionIndexCollection[0]}
            pbActualPositionCollection={pbActualPositionCollection[0]}
            hasBottom
            leftShift={leftShift1}
          />
        )}
        {boardOn.length === 0 && (
          <div className="flex justify-center items-center h-32">
            {t("ui.personal.selectBoard")}
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardViewer;
