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
const utilityButtonClasses =
  "flex flex-col bg-slate-200 dark:bg-slate-600 p-4 rounded-lg shadow-md space-y-4";
const utilityTextClasses =
  "text-lg font-medium lg:text-xl text-slate-950 dark:text-slate-50";
const experimentalButtonClasses =
  "flex flex-col bg-slate-200 dark:bg-slate-600 p-4 rounded-lg shadow-md space-y-4";
const experimentalTextClasses =
  "font-medium lg:text-lg text-slate-950 dark:text-slate-50";
const UtilitySetCard = () => {
  const { t } = useTranslation();
  const [showExperimental, setShowExperimental] = useState<boolean>(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex flex-col bg-gray-200/60 dark:bg-gray-500/60 p-4 rounded-lg shadow-md space-y-4">
          <img
            src={"/scenes/Dron.png"}
            className="h-6 w-6 lg:h-8 lg:w-8"
          />
          <h3 className="text-lg font-medium lg:text-xl text-gray-800 dark:text-gray-200">
            {t("ui.utilities.title")}
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {t("ui.utilities.description")}
            <br />
            {t("ui.utilities.subDescription")}
          </p>
        </div>
      </DialogTrigger>
      <DialogContent
        className="font-onemobile max-w-max rounded-lg"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t("ui.utilities.title")}</DialogTitle>
          <DialogDescription>{t("ui.utilities.description")}</DialogDescription>
        </DialogHeader>
        <SubtitleBar>{t("ui.utilities.title")}</SubtitleBar>
        <div className={itemContainerClasses}>
          <Link to={"/tasksearch"}>
            <div className={utilityButtonClasses}>
              <h4 className={utilityTextClasses}>
                <img
                  src="/myhomeicons/MyHome_Button_004.png"
                  className="h-6 w-6 inline-block align-middle mr-2"
                />
                {t("ui.tasksearch.title")}
              </h4>
            </div>
          </Link>
          <Link to={"/boardsearch"}>
            <div className={utilityButtonClasses}>
              <h4 className={utilityTextClasses}>
                <img
                  src="/icons/Common_Node_Special.png"
                  className="h-6 w-6 inline-block align-middle mr-2"
                />
                {t("ui.boardsearch.title")}
              </h4>
            </div>
          </Link>
          <Link to={"/restaurant"}>
            <div className={utilityButtonClasses}>
              <h4 className={utilityTextClasses}>
                <img
                  src="/foods/MyHomeRestaurant_EatingInviteIcon.png"
                  className="h-6 w-6 inline-block align-middle mr-2"
                />
                {t("ui.restaurant.title")}
              </h4>
            </div>
          </Link>
        </div>
        <ShowExperimentalPopup
          show={showExperimental}
          setShow={setShowExperimental}
        />
        {showExperimental && (
          <>
            <SubtitleBar>{t("ui.utilities.experimental")}</SubtitleBar>
            <div className={itemContainerClasses}>
              <Link to={"/equipviewer"}>
                <div className={experimentalButtonClasses}>
                  <h4 className={experimentalTextClasses}>
                    {t("ui.index.testMark")}
                    {t("ui.equipviewer.title")}
                  </h4>
                </div>
              </Link>
              <Link to={"/eventcalc"}>
                <div className={experimentalButtonClasses}>
                  <h4 className={experimentalTextClasses}>
                    {t("ui.index.testMark")}
                    {t("ui.eventcalc.title")}
                  </h4>
                </div>
              </Link>
              <Link to={"/goodscalc"}>
                <div className={experimentalButtonClasses}>
                  <h4 className={experimentalTextClasses}>
                    {t("ui.index.testMark")}
                    {t("ui.goodscalc.title")}
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
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UtilitySetCard;
