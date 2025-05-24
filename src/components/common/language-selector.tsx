import { useState } from "react";
import { supportedLngs, getCurrentLanguage } from "@/locale/localize";
import { Languages } from "lucide-react";
import { useLanguageChange } from "@/hooks/useLanguageChange";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const LanguageSelector = () => {
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage());
  const { languageChange } = useLanguageChange();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Languages className="w-4 h-4 inline-block mr-1" />
          {{ "ko-KR": "언어 변경", "zh-CN": "语言更改" }[currentLanguage] ||
            "Change Language"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="font-medium font-onemobile">
              {{ "ko-KR": "언어 변경", "zh-CN": "语言更改" }[currentLanguage] ||
                "Change Language"}
            </div>
          </DialogTitle>
        </DialogHeader>
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
              {{ "ko-KR": "한국어", "zh-CN": "简体中文" }[lng] || "Language"}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LanguageSelector;
