import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import MocaroonCalc from "./components/goodscalc/mocaroon-calc";
// import { dataFileRead, dataFileWrite } from "@/utils/dataRW";

const GoodsCalc = () => {
  const { t } = useTranslation();
  return (
    <>
      <Tabs className="font-onemobile w-full mt-4" defaultValue="mocaroon">
        <TabsList className="flex mb-4">
          <TabsTrigger className="flex-1" value="mocaroon">
            {t("ui.goodscalc.mocaroon.title")}
          </TabsTrigger>
          {/* <TabsTrigger className="flex-1" value="bonus">
            {t("ui.check.bonus.index")}
          </TabsTrigger> */}
        </TabsList>
        <TabsContent value="mocaroon">
          <MocaroonCalc />
        </TabsContent>
        {/* <TabsContent value="bonus">
          <BonusChecker
            boardStat={boardStat}
            pboardStat={pboardStat}
            rankStat={rankStat}
            labStat={labStat}
          />
        </TabsContent> */}
      </Tabs>
    </>
  );
};

export default GoodsCalc;
