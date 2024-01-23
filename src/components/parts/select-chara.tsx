import { useCallback, useEffect, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import board from "@/data/board";
import chara from "@/data/chara";

const BOARD_KEY = "board";

interface SelectCharaProp {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  saveAndClose: (charaList: string[]) => void;
}

interface UserDataProps {
  b: { [key: string]: number[][] };
  u: string[];
  c: number;
}

interface UserDataImport {
  type: "import";
  data: UserDataProps;
}

interface UserDataAddOwn {
  type: "own";
  chara: string;
}

interface UserDataRemoveOwn {
  type: "unown";
  chara: string;
}

interface UserDataAllOwn {
  type: "allOwn";
}

interface UserDataAllUnown {
  type: "allUnown";
}

type UserDataReduceActionMini =
  | UserDataImport
  | UserDataAddOwn
  | UserDataRemoveOwn
  | UserDataAllOwn
  | UserDataAllUnown;

const userDataReducerMini = (
  state: UserDataProps | undefined,
  action: UserDataReduceActionMini
): UserDataProps | undefined => {
  switch (action.type) {
    case "import":
      return action.data;
    case "own":
      if (!state) return state;
      return {
        ...state,
        u: state.u.filter((c) => c !== action.chara),
        c: state.c,
      };
    case "unown":
      if (!state) return state;
      return {
        ...state,
        u: [...state.u, action.chara],
        c: state.c,
      };
    case "allOwn":
      if (!state) return state;
      return {
        ...state,
        u: [],
        c: state.c,
      };
    case "allUnown":
      if (!state) return state;
      return {
        ...state,
        u: Object.keys(board),
        c: state.c,
      };
  }
};

const SelectChara = ({
  isOpen,
  onOpenChange,
  saveAndClose,
}: SelectCharaProp) => {
  const { t } = useTranslation();
  const [userData, dispatchUserData] = useReducer(
    userDataReducerMini,
    undefined
  );
  const [search, setSearch] = useState("");

  const getFromUserData = useCallback(() => {
    const charaList = Object.keys(board);
    const userDataProto = localStorage.getItem(BOARD_KEY);
    if (!userDataProto) {
      localStorage.setItem(
        BOARD_KEY,
        JSON.stringify({ b: {}, u: charaList, c: 0 })
      );
    }
    const userData = userDataProto
      ? JSON.parse(userDataProto)
      : { b: {}, u: charaList, c: 0 };
    dispatchUserData({ type: "import", data: userData });
  }, []);

  const setToUserData = useCallback((u: UserDataProps | undefined) => {
    if (!u) return;
    u.b = Object.fromEntries(
      [...Object.keys(board).filter((c) => !u.u.includes(c))].map((c) => {
        if (u.b[c]) return [c, u.b[c]];
        return [c, board[c].b.map((a) => a.map(() => 0))];
      })
    );
    localStorage.setItem(BOARD_KEY, JSON.stringify(u));
  }, []);

  useEffect(() => {
    getFromUserData();
  }, [getFromUserData]);

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerTrigger>
        <Button variant="outline">{t("ui.board.selectCharacter")}...</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="px-4 mt-4 font-onemobile relative">
          <Input
            type="text"
            placeholder={t("ui.charaSelect.searchByName")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            inputMode="search"
            style={{ paddingLeft: "2rem" }}
            // icon={<Search />}
          />
          <div className="absolute left-6 top-1/2 -translate-y-1/2">
            <Search className=" text-gray-500 w-5" />
          </div>
        </div>
        <div className="flex gap-4 p-4 w-full font-onemobile">
          <div className="w-full">
            <div className="text-lg">{t("ui.charaSelect.owned")}</div>
            <ScrollArea className="mt-2 p-1 w-full h-80 sm:h-96 bg-gray-400/50 rounded-lg">
              <div className="grid grid-cols-[repeat(auto-fill,_minmax(3rem,_1fr))] sm:grid-cols-[repeat(auto-fill,_minmax(3.5rem,_1fr))] md:grid-cols-[repeat(auto-fill,_minmax(4rem,_1fr))] gap-0.5">
                {Object.keys(board)
                  .filter(
                    (c) =>
                      !userData?.u.includes(c) &&
                      (search ? chara[c].n.includes(search) : true)
                  )
                  .sort((a, b) => chara[a].n.localeCompare(chara[b].n))
                  .map((c) => {
                    const imgClassNames = ["w-full", "aspect-square"];
                    switch (chara[c].t[0]) {
                      case "0":
                        imgClassNames.push("bg-personality-Cool");
                        break;
                      case "1":
                        imgClassNames.push("bg-personality-Gloomy");
                        break;
                      case "2":
                        imgClassNames.push("bg-personality-Jolly");
                        break;
                      case "3":
                        imgClassNames.push("bg-personality-Mad");
                        break;
                      case "4":
                        imgClassNames.push("bg-personality-Naive");
                        break;
                    }
                    return (
                      <div
                        key={c}
                        className="min-w-12 min-h-12 sm:min-w-14 sm:min-h-14 md:min-w-16 md:min-h-16 relative aspect-square rounded overflow-hidden"
                      >
                        <img
                          src={`/charas/${c}.png`}
                          className={imgClassNames.join(" ")}
                          onClick={() => {
                            dispatchUserData({ type: "unown", chara: c });
                          }}
                        />
                        <div className="absolute w-full left-0 bottom-0 bg-slate-100/75 dark:bg-gray-800/75 text-center text-xs py-0.5">
                          {chara[c].n}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </ScrollArea>
            <Button
              variant="secondary"
              className="w-full mt-2"
              onClick={() => dispatchUserData({ type: "allUnown" })}
            >
              {t("ui.charaSelect.allUnowned")}
            </Button>
          </div>
          <div className="w-full">
            <div className="text-lg">{t("ui.charaSelect.unowned")}</div>
            <ScrollArea className="mt-2 p-1 w-full h-80 sm:h-96 bg-gray-400/50 rounded-lg">
              <div className="grid grid-cols-[repeat(auto-fill,_minmax(3rem,_1fr))] sm:grid-cols-[repeat(auto-fill,_minmax(3.5rem,_1fr))] md:grid-cols-[repeat(auto-fill,_minmax(4rem,_1fr))] gap-0.5">
                {userData?.u
                  .filter((c) => (search ? chara[c].n.includes(search) : true))
                  .sort((a, b) => chara[a].n.localeCompare(chara[b].n))
                  .map((c) => {
                    const imgClassNames = ["w-full", "aspect-square"];
                    switch (chara[c].t[0]) {
                      case "0":
                        imgClassNames.push("bg-personality-Cool");
                        break;
                      case "1":
                        imgClassNames.push("bg-personality-Gloomy");
                        break;
                      case "2":
                        imgClassNames.push("bg-personality-Jolly");
                        break;
                      case "3":
                        imgClassNames.push("bg-personality-Mad");
                        break;
                      case "4":
                        imgClassNames.push("bg-personality-Naive");
                        break;
                    }
                    return (
                      <div
                        key={c}
                        className="min-w-12 min-h-12 sm:min-w-14 sm:min-h-14 md:min-w-16 md:min-h-16 relative aspect-square rounded overflow-hidden"
                      >
                        <img
                          src={`/charas/${c}.png`}
                          className={imgClassNames.join(" ")}
                          onClick={() => {
                            dispatchUserData({ type: "own", chara: c });
                          }}
                        />
                        <div className="absolute w-full left-0 bottom-0 bg-slate-100/75 dark:bg-gray-800/75 text-center text-xs py-0.5">
                          {chara[c].n}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </ScrollArea>
            <Button
              variant="secondary"
              className="w-full mt-2"
              onClick={() => dispatchUserData({ type: "allOwn" })}
            >
              {t("ui.charaSelect.allOwned")}
            </Button>
          </div>
        </div>
        <DrawerFooter>
          <Button
            className="font-onemobile"
            onClick={() => {
              if (userData) {
                setToUserData(userData);
                saveAndClose(userData.u);
              }
            }}
          >
            {t("ui.charaSelect.apply")}
          </Button>
          <DrawerClose className="font-onemobile inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
            {t("ui.charaSelect.cancel")}
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default SelectChara;
