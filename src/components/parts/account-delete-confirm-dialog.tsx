import { use, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "@/contexts/AuthContext";
import { toast } from "sonner";
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
import { Input } from "@/components/ui/input";

export function AccountDeleteConfirmDialog() {
  const { t } = useTranslation();
  const { requestToken } = use(AuthContext);
  const [started, setStarted] = useState(false);
  const [value, setValue] = useState("");
  const accountDelete = useCallback(() => {
    if (!requestToken) return;
    setStarted(true);
    requestToken(
      async (tok) => {
        fetch("https://api.triple-lab.com/api/v2/tr/accountdelete", {
          method: "POST",
          headers: { Authorization: `Bearer ${tok}` },
        }).then((response) => {
          if (response.ok) {
            toast.success(t("ui.common.accountDeleteSuccess"));
            setTimeout(window.location.reload, 3000);
          } else
            toast.error(
              t("ui.common.accountDeleteFailed", response.statusText)
            );
        });
      },
      () => toast.error(t("ui.common.accountDeleteTokenTryFailed"))
    );
  }, [requestToken, t]);
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full font-onemobile text-red-600 dark:text-red-400"
          disabled={started}
        >
          {t("ui.common.accountDelete")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="font-onemobile">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("ui.common.accountDeleteTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription className="break-keep">
            {t("ui.common.accountDeleteDescription")}
            <br />
            {t("ui.common.accountDeleteAdditionalDesc")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <div>{t("ui.common.accountDeleteRequireInput")}</div>
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setValue("")} disabled={started}>
            {t("ui.common.no")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={accountDelete}
            disabled={started || value !== "Delete Permanently"}
          >
            {t("ui.common.yes")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AccountDeleteConfirmDialog;
