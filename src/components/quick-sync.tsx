import { use, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Archive,
  CheckCircle,
  Cloud,
  CloudCog,
  Download,
  RefreshCw,
  Upload,
  XCircle,
} from "lucide-react";
import { AuthContext } from "@/contexts/AuthContext";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { dataFileWrite } from "@/utils/dataRW";

import { SyncStatus } from "@/types/enums";

export function QuickSync() {
  const { isReady, googleLinked, status, forceUpload, forceDownload } =
    use(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const bgClass = useCallback((s: SyncStatus) => {
    switch (s) {
      case SyncStatus.Uploading:
      case SyncStatus.Downloading:
        return "bg-orange-400 dark:bg-orange-600";
      case SyncStatus.Success:
        return "bg-green-400 dark:bg-green-500";
      case SyncStatus.Errored:
        return "bg-red-500 dark:bg-red-600";
      default:
        return "";
    }
  }, []);
  if (!isReady || !googleLinked)
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <CloudCog className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
            <span className="sr-only">Config sync using Google account</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => dataFileWrite()}>
            <Archive className="mr-2 h-4 w-4" />
            {t("ui.common.backUp")}
          </DropdownMenuItem>
          <Separator className="my-1" />
          <DropdownMenuItem onClick={() => navigate("/setting")}>
            <CloudCog className="mr-2 h-4 w-4" />
            {t("ui.index.sync.config")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn("transition-all relative", bgClass(status))}
        >
          <RefreshCw
            className={cn(
              "h-[1.2rem] w-[1.2rem] transition-all animate-spin",
              status === SyncStatus.Uploading ||
                status === SyncStatus.Downloading
                ? "opacity-100"
                : "opacity-0"
            )}
          />
          <Cloud
            className={cn(
              "h-[1.2rem] w-[1.2rem] transition-all absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2",
              status === SyncStatus.Idle ? "opacity-100" : "opacity-0"
            )}
          />
          <CheckCircle
            className={cn(
              "h-[1.2rem] w-[1.2rem] transition-all absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2",
              status === SyncStatus.Success ? "opacity-100" : "opacity-0"
            )}
          />
          <XCircle
            className={cn(
              "h-[1.2rem] w-[1.2rem] transition-all absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2",
              status === SyncStatus.Errored ? "opacity-100" : "opacity-0"
            )}
          />
          <span className="sr-only">Sync using Google account</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {status === SyncStatus.Uploading && (
          <>
            <DropdownMenuItem disabled>
              {t("ui.index.sync.uploading")}
            </DropdownMenuItem>
            <Separator className="my-1" />
          </>
        )}
        {status === SyncStatus.Downloading && (
          <>
            <DropdownMenuItem disabled>
              {t("ui.index.sync.downloading")}
            </DropdownMenuItem>
            <Separator className="my-1" />
          </>
        )}
        {status === SyncStatus.Errored && (
          <>
            <DropdownMenuItem disabled>
              {t("ui.index.sync.errored")}
              <br />
              {t("ui.index.sync.tryRefresh")}
            </DropdownMenuItem>
            <Separator className="my-1" />
          </>
        )}
        <DropdownMenuItem onClick={() => dataFileWrite()}>
          <Archive className="mr-2 h-4 w-4" />
          {t("ui.common.backUp")}
        </DropdownMenuItem>
        <Separator className="my-1" />
        <DropdownMenuItem
          onClick={() => forceUpload?.()}
          disabled={[
            SyncStatus.Uploading,
            SyncStatus.Downloading,
            SyncStatus.Errored,
          ].includes(status)}
        >
          <Upload className="mr-2 h-4 w-4" />
          {t("ui.index.sync.upload")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => forceDownload?.()}
          disabled={[
            SyncStatus.Uploading,
            SyncStatus.Downloading,
            SyncStatus.Errored,
          ].includes(status)}
        >
          <Download className="mr-2 h-4 w-4" />
          {t("ui.index.sync.download")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
