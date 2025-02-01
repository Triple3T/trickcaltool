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
          onClick={() => navigate("/pboard")}
          disabled={matchPath(location.pathname, "/pboard") ? true : false}
        >
          <img
            src="/icons/Item_Crayon3.png"
            className="w-4 h-4 inline-block mr-1"
          />
          {t("ui.board.pboardTitle")}
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
          <img
            src="/myhomeicons/MyHome_Button_004.png"
            className="w-4 h-4 inline-block mr-1"
          />
          {t("ui.tasksearch.title")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate("/boardsearch")}
          disabled={matchPath(location.pathname, "/boardsearch") ? true : false}
        >
          <img
            src="/icons/Common_Node_Special.png"
            className="w-4 h-4 inline-block mr-1"
          />
          {t("ui.boardsearch.title")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate("/restaurant")}
          disabled={matchPath(location.pathname, "/restaurant") ? true : false}
        >
          <img
            src="/foods/MyHomeRestaurant_EatingInviteIcon.png"
            className="w-4 h-4 inline-block mr-1"
          />
          {t("ui.restaurant.title")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate("/goodscalc")}
          disabled={matchPath(location.pathname, "/goodscalc") ? true : false}
        >
          <img
            src="/icons/CurrencyIcon_0041.png"
            className="w-4 h-4 inline-block mr-1"
          />
          {t("ui.goodscalc.title")}
        </DropdownMenuItem>
        {/* <Separator className="my-1" /> */}
        {/* <DropdownMenuItem
          onClick={() => navigate("/eventcalc")}
          disabled={matchPath(location.pathname, "/eventcalc") ? true : false}
        >
          <img
            src="/mainlobby/HousingButton.png"
            className="w-4 h-4 inline-block mr-1"
          />
          {t("ui.index.testMark")}
          {t("ui.eventcalc.title")}
        </DropdownMenuItem> */}
        {/* <DropdownMenuItem
          onClick={() => navigate("/check")}
          disabled={matchPath(location.pathname, "/check") ? true : false}
        >
          <img
            src="/mainlobby/HousingButton.png"
            className="w-4 h-4 inline-block mr-1"
          />
          {t("ui.index.testMark")}
          {t("ui.check.title")}
        </DropdownMenuItem> */}
        <Separator className="my-1" />
        <a
          href="https://triple3t.notion.site/155c52e157ae80d49106d63711dfd84c"
          target="_blank"
          rel="noreferrer"
        >
          <DropdownMenuItem>{t("ui.index.textHelp")}</DropdownMenuItem>
        </a>
        <DropdownMenuItem
          onClick={() => navigate("/setting")}
          disabled={matchPath(location.pathname, "/setting") ? true : false}
        >
          {t("ui.index.textSetting")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MenuButton;
