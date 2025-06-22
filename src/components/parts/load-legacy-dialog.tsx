import { useTranslation } from "react-i18next";
import { ExternalLink, FileClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import googleAccessUrlLegacy from "@/utils/googleAccessUrlLegacy";

const LoadLegacyDialog = () => {
  const { t } = useTranslation();
  return (
    <Dialog>
      <DialogTrigger>
        <Button
          variant="link"
          size="sm"
          className="text-sm bg-background/60 hover:bg-accent/60 underline"
        >
          <FileClock className="w-4 h-4 mr-1 inline-block" />
          {t("ui.common.loadLegacyDesc")}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="font-onemobile max-h-[600px] overflow-y-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            <div className="flex flex-col gap-1 font-normal">
              {t("ui.common.loadLegacyDesc")}
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="break-keep">
          {t("ui.common.loadLegacyDescDetail")
            .split("\n")
            .map((s) => {
              return (
                <p key={s} className="mb-1">
                  {s.trim()}
                </p>
              );
            })}
        </div>
        <Button className="pb-2">
          <a href={googleAccessUrlLegacy} target="_blank" rel="noreferrer">
            {t("ui.common.loadLegacy")}
          </a>
          <ExternalLink className="w-3 h-3 ml-0.5 inline" />
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default LoadLegacyDialog;
