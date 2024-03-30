import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Cloud, CloudCog, Download, Upload } from "lucide-react";
import { AuthContext } from "@/contexts/AuthContext";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function QuickSync() {
  const { isReady, googleLinked, autoSave, autoLoad } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
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
          <DropdownMenuItem onClick={() => navigate("/setting")}>
            {t("ui.index.sync.config")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Cloud className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          <span className="sr-only">Sync using Google account</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => autoSave?.()}>
          <Upload className="mr-2 h-4 w-4" />
          {t("ui.index.sync.upload")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => autoLoad?.()}>
          <Download className="mr-2 h-4 w-4" />
          {t("ui.index.sync.download")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
