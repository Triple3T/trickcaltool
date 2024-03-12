import { useNavigate, matchPath } from "react-router-dom";
import { t } from "i18next";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

const MenuButton = () => {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          <span className="sr-only">Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem
          onClick={() => navigate("/board")}
          disabled={matchPath(location.pathname, "/board") ? true : false}
        >
          <img
            src="/icons/Item_Crayon4.png"
            className="w-4 h-4 inline-block mr-1"
          />
          {t("ui.board.title")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate("/eqrank")}
          disabled={matchPath(location.pathname, "/eqrank") ? true : false}
        >
          <img
            src="/itemslot/Tab_Equip_Default.png"
            className="w-4 h-4 inline-block mr-1 rounded-full bg-greenicon"
          />
          {t("ui.equiprank.title")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate("/lab")}
          disabled={matchPath(location.pathname, "/lab") ? true : false}
        >
          <img
            src="/mainlobby/HousingButton.png"
            className="w-4 h-4 inline-block mr-1"
          />
          {t("ui.lab.title")}
        </DropdownMenuItem>
        <Separator className="my-1" />
        <DropdownMenuItem
          onClick={() => navigate("/tasksearch")}
          disabled={matchPath(location.pathname, "/tasksearch") ? true : false}
        >
          {/* <img
            src="/mainlobby/HousingButton.png"
            className="w-4 h-4 inline-block mr-1"
          /> */}
          {t("ui.index.testMark")}
          {t("ui.tasksearch.title")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate("/pboard")}
          disabled={matchPath(location.pathname, "/pboard") ? true : false}
        >
          {/* <img
            src="/mainlobby/HousingButton.png"
            className="w-4 h-4 inline-block mr-1"
          /> */}
          {t("ui.index.testMark")}
          {t("ui.board.pboardTitle")}
        </DropdownMenuItem>
        <Separator className="my-1" />
        <DropdownMenuItem
          onClick={() => navigate("/setting")}
          disabled={matchPath(location.pathname, "/setting") ? true : false}
        >
          {t("ui.index.setting")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MenuButton;
