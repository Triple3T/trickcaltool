import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import MocaroonCalc from "./components/goodscalc/mocaroon-calc";
import AsideCalc from "./components/goodscalc/aside-calc";
import SkillCalc from "./components/goodscalc/skill-calc";
// import { dataFileRead, dataFileWrite } from "@/utils/dataRW";

const GoodsCalc = () => {
  const { t } = useTranslation();
  return (
    <Tabs className="font-onemobile w-full mt-4" defaultValue="mocaroon">
      <TabsList className="grid grid-cols-2 sm:grid-cols-4 mb-4 h-max items-stretch">
        <TabsTrigger className="flex-1" value="mocaroon">
          {t("ui.goodscalc.mocaroon.title")}
        </TabsTrigger>
        <TabsTrigger className="flex-1" value="aside">
          {t("ui.goodscalc.aside.title")}
        </TabsTrigger>
        <TabsTrigger className="flex-1" value="skill">
          {t("ui.goodscalc.skill.title")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="mocaroon">
        <MocaroonCalc />
      </TabsContent>
      <TabsContent value="aside">
        <AsideCalc />
      </TabsContent>
      <TabsContent value="skill">
        <SkillCalc />
      </TabsContent>
    </Tabs>
  );
};

export default GoodsCalc;
