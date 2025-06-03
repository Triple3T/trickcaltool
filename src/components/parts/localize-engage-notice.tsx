import { useTranslation } from "react-i18next";
import { Earth } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const LocalizeEngageNotice = () => {
  const { t } = useTranslation();
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline" className="text-sm bg-background/60 hover:bg-accent/60">
          <Earth className="w-4 h-4 mr-1 inline-block" />
          번역에 참여해 주세요!
        </Button>
      </DialogTrigger>
      <DialogContent
        className="font-onemobile max-h-[600px] overflow-y-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            <div className="flex flex-col gap-1 font-normal">
              번역에 참여해 주세요!
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="break-keep">
          <p>안녕하세요, 트릭컬 노트 운영자 Triple입니다.</p>
          <p>
            트릭컬 노트는 다양한 언어로 사용할 수 있도록 다국어 지원을 하고
            있으며, 여러분의 참여로 번역이 이루어지고 있습니다.
          </p>
          <p>
            아래 이미지 링크를 눌러 Google 계정을 연결하면 자유롭게 시작하실 수
            있으니 많은 참여 부탁드립니다.
          </p>
          <p>감사합니다.</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 mt-1">
          <div />
          <a href="https://localizer.triple-lab.com/engage/trickcal-note/">
            <img
              src="https://localizer.triple-lab.com/widget/trickcal-note/localize/svg-badge.svg"
              className="inline-block mr-2"
              alt={t("ui.index.translationNoticeDescription")}
            />
            {t("ui.index.translationNoticeTitleShort")}&nbsp;&rarr;
          </a>
          <a href="https://localizer.triple-lab.com/engage/trickcal-note/">
            <img
              src="https://localizer.triple-lab.com/widget/trickcal-note/localize/multi-auto.svg"
              alt={t("ui.index.translationNoticeDescription")}
            />
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocalizeEngageNotice;
