import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BonusChecker from "@/components/checker/bonus-checker";
// import { dataFileRead, dataFileWrite } from "@/utils/dataRW";
import {
  getTotalBoardStat,
  getTotalPboardStat,
  getTotalRankStat,
  getTotalLabStat,
} from "@/utils/getTotalStatBonus";
import { UserDataOwnedCharaInfo } from "@/types/types";
import {
  useUserDataStatus,
  useUserDataCharaInfo,
  useUserDataLab,
} from "@/stores/useUserDataStore";

const Checker = () => {
  const { t } = useTranslation();
  const dataStatus = useUserDataStatus();
  const userDataCharaInfo = useUserDataCharaInfo();
  const userDataLab = useUserDataLab();
  const ownedCharaInfo = useMemo<
    Record<string, UserDataOwnedCharaInfo> | undefined
  >(
    () =>
      userDataCharaInfo &&
      Object.fromEntries(
        Object.entries(userDataCharaInfo).filter(
          ([, v]) => !v.unowned
        ) as Array<[string, UserDataOwnedCharaInfo]>
      ),
    [userDataCharaInfo]
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
    () => userDataLab && getTotalLabStat(userDataLab),
    [userDataLab]
  );
  if (
    dataStatus !== "initialized" ||
    !ownedCharaInfo ||
    !boardStat ||
    !pboardStat ||
    !rankStat ||
    !labStat
  )
    return null;
  return (
    <>
      <Tabs className="font-onemobile w-full mt-4" defaultValue="bonus">
        <TabsList className="flex mb-4">
          <TabsTrigger className="flex-1" value="bonus">
            {t("ui.check.bonus.index")}
          </TabsTrigger>
        </TabsList>
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
