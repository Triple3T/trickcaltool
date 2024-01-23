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
        u: state.u.filter((chara) => chara !== action.chara),
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
      [...Object.keys(board).filter((chara) => !u.u.includes(chara))].map(
        (chara) => {
          if (u.b[chara]) return [chara, u.b[chara]];
          return [chara, board[chara].b.map((a) => a.map(() => 0))];
        }
      )
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
            <ScrollArea className="mt-2 p-1 w-full h-80 sm:h-96 bg-gray-400/50 rounded">
              <div className="grid grid-cols-[repeat(auto-fill,_minmax(3rem,_1fr))] sm:grid-cols-[repeat(auto-fill,_minmax(3.5rem,_1fr))] md:grid-cols-[repeat(auto-fill,_minmax(4rem,_1fr))] gap-0.5">
                {Object.keys(board)
                  .filter(
                    (chara) =>
                      !userData?.u.includes(chara) &&
                      (search ? board[chara].n.includes(search) : true)
                  )
                  .map((chara) => {
                    return (
                      <div className="min-w-12 min-h-12 sm:min-w-14 sm:min-h-14 md:min-w-16 md:min-h-16 relative aspect-square">
                        <img
                          key={chara}
                          src={`/charas/${chara}.png`}
                          className="w-full aspect-square"
                          onClick={() => {
                            dispatchUserData({ type: "unown", chara: chara });
                          }}
                        />
                        <div className="absolute w-full left-0 bottom-0 bg-gray-800/75 text-center text-xs py-0.5">
                          {board[chara].n}
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
            <ScrollArea className="mt-2 p-1 w-full h-80 sm:h-96 bg-gray-400/50 rounded">
              <div className="grid grid-cols-[repeat(auto-fill,_minmax(3rem,_1fr))] sm:grid-cols-[repeat(auto-fill,_minmax(3.5rem,_1fr))] md:grid-cols-[repeat(auto-fill,_minmax(4rem,_1fr))] gap-0.5">
                {userData?.u
                  .filter((chara) =>
                    search ? board[chara].n.includes(search) : true
                  )
                  .map((chara) => {
                    return (
                      <div className="min-w-12 min-h-12 sm:min-w-14 sm:min-h-14 md:min-w-16 md:min-h-16 relative aspect-square">
                        <img
                          key={chara}
                          src={`/charas/${chara}.png`}
                          className="w-full aspect-square"
                          onClick={() => {
                            dispatchUserData({ type: "own", chara: chara });
                          }}
                        />
                        <div className="absolute w-full left-0 bottom-0 bg-gray-800/75 text-center text-xs py-0.5">
                          {board[chara].n}
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
