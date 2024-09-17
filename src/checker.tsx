import { useMemo } from "react";
import { useTranslation } from "react-i18next";
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

const Checker = () => {
  const { t } = useTranslation();
  const boardStat = useMemo(() => getTotalBoardStat(), []);
  const pboardStat = useMemo(() => getTotalPboardStat(), []);
  const rankStat = useMemo(() => getTotalRankStat(), []);
  const labStat = useMemo(() => getTotalLabStat(), []);
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
