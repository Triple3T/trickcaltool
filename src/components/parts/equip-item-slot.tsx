import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
// import { cn } from "@/lib/utils";
import ItemSlot from "./item-slot";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowLeft, ArrowRight } from "lucide-react";
import equip from "@/data/equip";

interface EquipItemSlotProps {
  equipCode: string;
  amount?: number | ReactNode;
  size?: number;
  innerSize?: number;
  slotOnly?: boolean;
}

//equipCode = `${type}.${part}.${num}`
//type: e stands for equip, p stands for piece, r stands for recipe.
//part: weapon, armor, accessory.
//num: number code of the item.
const equipCodeToRarity = (equipCode: string) => {
  const [iType, , iNum] = equipCode.split(".");
  const iRank = Math.floor(Number(iNum) / 100);
  if (iType === "e") {
    if ([9, 10].includes(iRank)) return { s: "Yellow" };
    if ([7, 8].includes(iRank)) return { s: "Purple", b: "#B371F5" };
    if ([5, 6].includes(iRank)) return { s: "Blue", b: "#65A7E9" };
    if ([3, 4].includes(iRank)) return { s: "Green", b: "#65DD82" };
    return { s: "Gray", b: "#B0B0B0" };
  }
  if ([7, 8, 9, 10].includes(iRank))
    return {
      s: "Purple",
      b: "#B371F5",
    };
  if ([5, 6].includes(iRank))
    return {
      s: "Blue",
      b: "#65A7E9",
    };
  if ([3, 4].includes(iRank))
    return {
      s: "Green",
      b: "#65DD82",
    };
  return { s: "Gray", b: "#B0B0B0" };
};

const equipCodeToNameKey = (equipCode: string) => {
  const [iType, iPart, iNum] = equipCode.split(".");
  if (iType === "p") return `equip.piece.${iPart}.${iNum}`;
  if (iType === "r") return `equip.recipe.${iPart}.${iNum}`;
  return `equip.equip.${iPart}.${iNum}`;
};

type EquipPartType = "weapon" | "armor" | "accessory";

const EquipItemSlot = ({
  equipCode,
  amount,
  size,
  innerSize,
  slotOnly = false,
}: EquipItemSlotProps) => {
  const { t } = useTranslation();
  const [iType, iPart, iNum] = equipCode.split(".");
  const fileName = `/equips/Equip_${
    { e: "", p: "Piece_", r: "Recipe_" }[iType]
  }Icon_${iPart.charAt(0).toUpperCase()}${iPart.slice(1)}${iNum}`;
  const equipInfo = iType === "e" && equip.e[iPart as EquipPartType][iNum];
  if (slotOnly)
    return (
      <ItemSlot
        rarityInfo={equipCodeToRarity(equipCode)}
        item={fileName}
        fullItemPath
        amount={amount}
        size={size}
        innerSize={innerSize}
      />
    );
  return (
    <Popover>
      <PopoverTrigger>
        <ItemSlot
          rarityInfo={equipCodeToRarity(equipCode)}
          item={fileName}
          fullItemPath
          amount={amount}
          size={size}
          innerSize={innerSize}
        />
      </PopoverTrigger>
      <PopoverContent className="w-max font-onemobile">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between items-end gap-2">
            <div className="bg-accent/75 rounded px-2">
              <div className="-mt-2.5">{t(equipCodeToNameKey(equipCode))}</div>
            </div>
            {(amount || typeof amount === "number") && (
              <div className="text-sm">
                {t("ui.common.count", { 0: amount })}
              </div>
            )}
          </div>
          <div className="flex flex-row gap-1 justify-between items-center">
            <ItemSlot
              rarityInfo={equipCodeToRarity(equipCode)}
              item={fileName}
              fullItemPath
              amount={1}
              size={3}
            />
            {equipInfo && "i" in equipInfo ? (
              <div>
                <ArrowLeft className="w-4 h-4" />
              </div>
            ) : (
              <div>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
            <div className="flex flex-row p-2 gap-2 bg-accent rounded-lg">
              {equipInfo && "i" in equipInfo ? (
                Object.entries(equipInfo.i).map(([v, i]) => {
                  return (
                    <EquipItemSlot
                      key={v}
                      equipCode={v}
                      amount={i}
                      size={2.5}
                    />
                  );
                })
              ) : (
                <div className="flex flex-wrap gap-1 max-w-60 justify-evenly">
                  {Object.entries(equip.d)
                    .map(([world, stageList]) => {
                      return stageList
                        .map((v, i) => ({ v, i }))
                        .filter(({ v }) => v.includes(equipCode))
                        .map(({ i }) => `${world}-${i + 1}`);
                    })
                    .flat()
                    .map((stageCode) => {
                      return (
                        <div
                          key={stageCode}
                          className="px-1.5 py-0.5 rounded ring-1 ring-foreground text-sm bg-background/75"
                        >
                          {stageCode}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EquipItemSlot;
