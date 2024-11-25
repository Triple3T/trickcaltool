import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
// import { cn } from "@/lib/utils";
import ItemSlot from "./item-slot";
import { ItemSlotProps } from "./item-slot";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowLeft } from "lucide-react";

interface MiniItemSlotProps {
  rarityInfo: {
    s: string;
    b?: string;
  };
  item: string | ReactNode;
  fullItemPath?: boolean;
  amount: number;
}

interface ItemSlotWithRecipeProps extends ItemSlotProps {
  nameKey: string;
  recipe?: MiniItemSlotProps[];
}

const ItemSlotWithRecipe = ({
  rarityInfo,
  item,
  fullItemPath,
  amount,
  size,
  innerSize,
  nameKey,
  recipe,
}: ItemSlotWithRecipeProps) => {
  const { t } = useTranslation();
  return (
    <Popover>
      <PopoverTrigger>
        <ItemSlot
          rarityInfo={rarityInfo}
          item={item}
          fullItemPath={fullItemPath}
          amount={amount}
          size={size}
          innerSize={innerSize}
        />
      </PopoverTrigger>
      <PopoverContent className="w-max font-onemobile">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between items-end gap-2">
            <div className="bg-accent/75 rounded px-2"
            >
              <div className="-mt-2.5">{t(nameKey)}</div>
            </div>
            <div className="text-sm">{t("ui.common.count", { 0: amount })}</div>
          </div>
          <div className="flex flex-row gap-1 justify-between items-center">
            <ItemSlot
              rarityInfo={rarityInfo}
              item={item}
              fullItemPath={fullItemPath}
              amount={1}
              size={3}
            />
            <div>
              <ArrowLeft className="w-4 h-4" />
            </div>
            <div className="flex flex-row p-2 gap-2 bg-accent rounded-lg">
              {!recipe || recipe.length === 0 ? (
                <div className="flex justify-center items-center h-10 opacity-75">
                  {t("ui.common.noRecipe")}
                </div>
              ) : (
                recipe.map((v, i) => {
                  return <ItemSlot key={i} {...v} size={2.5} />;
                })
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ItemSlotWithRecipe;
