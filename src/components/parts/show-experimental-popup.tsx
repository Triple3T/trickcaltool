import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Square, SquareCheckBig } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const ShowExperimentalPopup = ({
  show,
  setShow,
}: {
  show: boolean;
  setShow: (show: boolean) => void;
}) => {
  const { t } = useTranslation();
  const [checked, setChecked] = useState<boolean>(false);
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="font-onemobile pl-1 pr-1.5 py-0.5 w-max text-sm h-auto"
          variant="ghost"
        >
          {show ? (
            <SquareCheckBig className="w-4 h-4 inline-block mr-2" />
          ) : (
            <Square className="w-4 h-4 inline-block mr-2" />
          )}
          {t("ui.utilities.showExperimentalText")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="font-onemobile">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("ui.utilities.showExperimentalText")}
          </AlertDialogTitle>
          <AlertDialogDescription className="break-keep">
            {t("ui.utilities.showExperimentalDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-2">
          <Checkbox
            id="show-experimental"
            checked={checked}
            onCheckedChange={(v) => setChecked(Boolean(v))}
          />
          <label
            htmlFor="show-experimental"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t("ui.utilities.showExperimentalCheckbox")}
          </label>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setChecked(false);
              setShow(false);
            }}
          >
            {t("ui.utilities.showExperimentalCancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              setChecked(true);
              setShow(true);
            }}
            disabled={!checked}
          >
            {t("ui.utilities.showExperimentalConfirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ShowExperimentalPopup;
