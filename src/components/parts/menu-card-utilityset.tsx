import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ShowExperimentalPopup from "./show-experimental-popup";
import SubtitleBar from "./subtitlebar";

const itemContainerClasses =
  "grid grid-cols-1 sm:grid-cols-2 gap-2 px-2 pb-2 w-72 sm:w-[35.5rem] text-center";
const experimentalButtonClasses =
  "flex flex-col bg-slate-200 dark:bg-slate-600 p-2 rounded-lg shadow-md space-y-4";
const experimentalTextClasses =
  "text-sm font-medium lg:text-base text-slate-950 dark:text-slate-50";
const UtilitySetCard = () => {
  const { t } = useTranslation();
  const [showExperimental, setShowExperimental] = useState<boolean>(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="text-xs opacity-60 text-center mt-4 md:mt-1 cursor-pointer">
          {t("ui.index.buttonGroup.experimental")}
        </div>
      </DialogTrigger>
      <DialogContent
        className="font-onemobile max-w-max rounded-lg max-h-[600px] overflow-y-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t("ui.utilities.title")}</DialogTitle>
          <DialogDescription>{t("ui.utilities.description")}</DialogDescription>
        </DialogHeader>
        <ShowExperimentalPopup
          show={showExperimental}
          setShow={setShowExperimental}
        />
        {showExperimental && (
          <>
            <SubtitleBar>{t("ui.utilities.experimental")}</SubtitleBar>
            <div className={itemContainerClasses}>
              <Link to={"/dispatchcalc"}>
                <div className={experimentalButtonClasses}>
                  <h4 className={experimentalTextClasses}>
                    {t("ui.index.testMark")}
                    {t("ui.dispatchcalc.title")}
                  </h4>
                </div>
              </Link>
              <Link to={"/check"}>
                <div className={experimentalButtonClasses}>
                  <h4 className={experimentalTextClasses}>
                    {t("ui.index.testMark")}
                    {t("ui.check.title")}
                  </h4>
                </div>
              </Link>
              <Link to={"/dealdesc"}>
                <div className={experimentalButtonClasses}>
                  <h4 className={experimentalTextClasses}>
                    {t("ui.index.testMark")}
                    {t("ui.dealdesc.title")}
                  </h4>
                </div>
              </Link>
              <Link to={"/pickups"}>
                <div className={experimentalButtonClasses}>
                  <h4 className={experimentalTextClasses}>
                    {t("ui.index.testMark")}
                    {t("ui.pickuplog.title")}
                  </h4>
                </div>
              </Link>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UtilitySetCard;
