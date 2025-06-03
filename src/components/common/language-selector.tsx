import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import { getCurrentLanguage } from "@/locale/localize";
import { supportedLngNames, supportedLngs } from "@/locale/langs";
import { useLanguageChange } from "@/hooks/useLanguageChange";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ENGAGE_URL = "https://localizer.triple-lab.com/engage/trickcal-note/-/";
const WIDGET_URL =
  "https://localizer.triple-lab.com/widget/trickcal-note/localize/";

const LanguageSelector = () => {
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage());
  const { languageChange } = useLanguageChange();
  const { t } = useTranslation();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Languages className="w-4 h-4 inline-block mr-1" />
          {t("ui.common.languageChange")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="font-medium font-onemobile">
              {t("ui.common.languageChange")}
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="text-center">
          <a href={`${ENGAGE_URL}${currentLanguage.replaceAll("-", "_")}/`}>
            <span className="font-onemobile">
              {supportedLngNames[currentLanguage] || "Language"}
            </span>
            <img
              src={`${WIDGET_URL}${currentLanguage.replaceAll(
                "-",
                "_"
              )}/svg-badge.svg`}
              alt={t("ui.index.translationNoticeDescription")}
              className="inline ml-2"
            />
          </a>
        </div>
        <div className="grid gap-2 grid-cols-2">
          {supportedLngs.map((lng) => (
            <Button
              key={lng}
              variant={lng === currentLanguage ? "default" : "outline"}
              onClick={async () => {
                await languageChange(lng);
                setCurrentLanguage(getCurrentLanguage());
              }}
            >
              {supportedLngNames[lng] || "Language"}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LanguageSelector;
