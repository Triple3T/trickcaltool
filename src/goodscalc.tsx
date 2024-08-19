import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import MocaroonCalc from "./components/goodscalc/mocaroon-calc";
import AsideCalc from "./components/goodscalc/aside-calc";
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
          <TabsTrigger className="flex-1" value="aside">
            {t("ui.goodscalc.aside.title")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="mocaroon">
          <MocaroonCalc />
        </TabsContent>
        <TabsContent value="aside">
          <AsideCalc />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default GoodsCalc;
