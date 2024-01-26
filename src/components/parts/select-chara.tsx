import { useCallback, useEffect, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import chara from "@/data/chara";
import userdata from "@/utils/userdata";
import { UserDataUnowned } from "@/types/types";
import SearchBox from "../common/search-with-icon";

interface SelectCharaProp {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  saveAndClose: (charaList: string[]) => void;
}

interface UserDataImport {
  type: "import";
  data: UserDataUnowned;
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
  state: UserDataUnowned | undefined,
  action: UserDataReduceActionMini
): UserDataUnowned | undefined => {
  switch (action.type) {
    case "import":
      return action.data;
    case "own":
      if (!state) return state;
      return {
        u: state.u.filter((c) => c !== action.chara),
        o: [...state.o, action.chara],
      };
    case "unown":
      if (!state) return state;
      return {
        u: [...state.u, action.chara],
        o: state.o.filter((c) => c !== action.chara),
      };
    case "allOwn":
      if (!state) return state;
      return {
        u: [],
        o: Object.keys(chara),
      };
    case "allUnown":
      if (!state) return state;
      return {
        u: Object.keys(chara),
        o: [],
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
    const ud = userdata.unowned.load();
    dispatchUserData({ type: "import", data: ud });
  }, []);

  const setToUserData = useCallback((u: UserDataUnowned | undefined) => {
    if (!u) return;
    userdata.unowned.save(u);
  }, []);

  useEffect(() => {
    getFromUserData();
  }, [getFromUserData]);

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerTrigger>
        <Button variant="outline">{t("ui.charaSelect.title")}...</Button>
      </DrawerTrigger>
      <DrawerContent>
        <SearchBox
          className="px-4 mt-4 font-onemobile"
          value={search}
          onValueChange={setSearch}
          placeholder={t("ui.charaSelect.searchByName")}
        />
        <div className="flex gap-4 p-4 w-full font-onemobile">
          <div className="w-full">
            <div className="text-lg">{t("ui.charaSelect.owned")}</div>
            <ScrollArea className="mt-2 p-1 w-full h-80 sm:h-96 bg-gray-400/50 rounded-lg">
              <div className="grid grid-cols-[repeat(auto-fill,_minmax(3rem,_1fr))] sm:grid-cols-[repeat(auto-fill,_minmax(3.5rem,_1fr))] md:grid-cols-[repeat(auto-fill,_minmax(4rem,_1fr))] gap-0.5">
                {userData?.o
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
          <DrawerClose
            className="font-onemobile inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            onClick={getFromUserData}
          >
            {t("ui.charaSelect.cancel")}
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default SelectChara;
