import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
// import { cn } from "@/lib/utils";
import ItemSlot from "./item-slot";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface GoldSlotProps {
  amount?: number | ReactNode;
  size?: number;
  innerSize?: number;
  slotOnly?: boolean;
  ring?: boolean | string;
}

const GoldSlot = ({
  amount,
  size,
  innerSize,
  slotOnly = false,
  ring,
}: GoldSlotProps) => {
  const { t } = useTranslation();
  if (slotOnly)
    return (
      <ItemSlot
        rarityInfo={{ s: "Gold" }}
        item="/icons/CurrencyIcon_0008"
        amount={amount}
        size={size}
        innerSize={innerSize}
        fullItemPath
        ring={ring === true ? "ring-amber-500" : ring}
      />
    );
  return (
    <Popover>
      <PopoverTrigger>
        <ItemSlot
          rarityInfo={{ s: "Gold" }}
          item="/icons/CurrencyIcon_0008"
          amount={amount}
          size={size}
          innerSize={innerSize}
          fullItemPath
          ring={ring === true ? "ring-amber-500" : ring}
        />
      </PopoverTrigger>
      <PopoverContent className="w-max font-onemobile">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between items-end gap-2">
            <div className="bg-accent/75 rounded px-2">
              <div className="-mt-2.5">{t("currency.gold")}</div>
            </div>
            <div>
              <img src="/icons/CurrencyIcon_0008.webp" alt="" className="w-4 h-4" />
            </div>
            {amount && (
              <div className="text-sm">
                {typeof amount === "number" ? amount.toLocaleString() : amount}
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GoldSlot;
