import { use, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "./contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PercentChecker from "@/components/checker/percent-checker";
import BonusChecker from "@/components/checker/bonus-checker";
// import { dataFileRead, dataFileWrite } from "@/utils/dataRW";
import {
  getTotalBoardStat,
  getTotalPboardStat,
  getTotalRankStat,
  getTotalLabStat,
} from "@/utils/getTotalStatBonus";
import { UserDataOwnedCharaInfo } from "@/types/types";

const Checker = () => {
  const { t } = useTranslation();
  const { userData } = use(AuthContext);
  const ownedCharaInfo = useMemo<
    Record<string, UserDataOwnedCharaInfo> | undefined
  >(
    () =>
      userData &&
      Object.fromEntries(
        Object.entries(userData.charaInfo).filter(
          ([, v]) => !v.unowned
        ) as Array<[string, UserDataOwnedCharaInfo]>
      ),
    [userData]
  );
  const boardStat = useMemo(
    () =>
      ownedCharaInfo &&
      getTotalBoardStat(
        Object.fromEntries(
          Object.entries(ownedCharaInfo).map(([k, v]) => [k, v.board])
        )
      ),
    [ownedCharaInfo]
  );
  const pboardStat = useMemo(
    () =>
      ownedCharaInfo &&
      getTotalPboardStat(
        Object.fromEntries(
          Object.entries(ownedCharaInfo).map(([k, v]) => [k, v.pboard])
        )
      ),
    [ownedCharaInfo]
  );
  const rankStat = useMemo(
    () =>
      ownedCharaInfo &&
      getTotalRankStat(
        Object.fromEntries(
          Object.entries(ownedCharaInfo).map(([k, v]) => [k, v.eqrank])
        )
      ),
    [ownedCharaInfo]
  );
  const labStat = useMemo(
    () => userData && getTotalLabStat(userData.lab),
    [userData]
  );
  if (
    !userData ||
    !ownedCharaInfo ||
    !boardStat ||
    !pboardStat ||
    !rankStat ||
    !labStat
  )
    return null;
  return (
    <>
      <Tabs className="font-onemobile w-full mt-4" defaultValue="percent">
        <TabsList className="flex mb-4">
          <TabsTrigger className="flex-1" value="percent">
            {t("ui.check.percent.index")}
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="bonus">
            {t("ui.check.bonus.index")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="percent">
          <PercentChecker boardStat={boardStat} />
        </TabsContent>
        <TabsContent value="bonus">
          <BonusChecker
            boardStat={boardStat}
            pboardStat={pboardStat}
            rankStat={rankStat}
            labStat={labStat}
          />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Checker;
