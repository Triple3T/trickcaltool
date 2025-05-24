import { useNavigate, matchPath } from "react-router-dom";
import { t } from "i18next";
import { ExternalLink, Menu } from "lucide-react";
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
      <DropdownMenuContent align="start" className="font-onemobile">
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
            src="/itemslot/Tab_Tree.png"
            className="w-4 h-4 inline-block mr-1 rounded-full bg-greenicon"
          />
          {t("ui.board.pboardTitle")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate("/eqrank")}
          disabled={matchPath(location.pathname, "/eqrank") ? true : false}
        >
          <img
            src="/growth/CommonLevelUpPopupIcon.png"
            className="w-4 h-4 inline-block mr-1"
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
          onClick={() => navigate("/personal")}
          disabled={matchPath(location.pathname, "/personal") ? true : false}
        >
          <img
            src="/itemslot/Tab_Detail.png"
            className="w-4 h-4 inline-block mr-1 rounded-full bg-greenicon"
          />
          {t("ui.personal.title")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate("/equipviewer")}
          disabled={matchPath(location.pathname, "/equipviewer") ? true : false}
        >
          <img
            src="/itemslot/Tab_Equip_Default.png"
            className="w-4 h-4 inline-block mr-1 rounded-full bg-greenicon"
          />
          {t("ui.equipviewer.title")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate("/normaldrop")}
          disabled={matchPath(location.pathname, "/normaldrop") ? true : false}
        >
          <img
            src="/icons/CurrencyIcon_0011.png"
            className="w-4 h-4 inline-block mr-1"
          />
          {t("ui.normaldrop.title")}
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
        <Separator className="my-1" />
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
        <DropdownMenuItem
          onClick={() => navigate("/dispatchcalc")}
          disabled={
            matchPath(location.pathname, "/dispatchcalc") ? true : false
          }
        >
          <img
            src="/icons/CurrencyIcon_0048.png"
            className="w-4 h-4 inline-block mr-1"
          />
          {t("ui.dispatchcalc.title")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate("/teambuilder")}
          disabled={matchPath(location.pathname, "/teambuilder") ? true : false}
        >
          <img
            src="/scenes/DeckButton.png"
            className="w-4 h-4 inline-block mr-1"
          />
          {t("ui.teambuilder.title")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate("/guidecheck")}
          disabled={matchPath(location.pathname, "/guidecheck") ? true : false}
        >
          <img
            src="/common/BoardRecord_Tab_Stat.png"
            className="w-4 h-4 inline-block mr-1 rounded-full bg-greenicon"
          />
          {t("ui.check.guide.index")}
        </DropdownMenuItem>
        <Separator className="my-1" />
        <a
          href="https://triple3t.notion.site/155c52e157ae80d49106d63711dfd84c"
          target="_blank"
          rel="noreferrer"
        >
          <DropdownMenuItem>
            {t("ui.index.textHelp")}
            <ExternalLink className="w-4 h-4 inline-block ml-1" />
          </DropdownMenuItem>
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
