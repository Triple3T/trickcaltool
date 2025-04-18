import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ItemSlotProps {
  rarityInfo: {
    s: string;
    b?: string;
  };
  item: string | ReactNode;
  fullItemPath?: boolean;
  amount?: number | ReactNode;
  size?: number;
  innerSize?: number;
  ring?: boolean | string;
}

const ItemSlot = ({
  rarityInfo,
  item,
  fullItemPath,
  amount,
  size = 5,
  innerSize = 60,
  ring = false,
}: ItemSlotProps) => {
  return (
    <div
      className={cn(
        "bg-cover bg-center bg-no-repeat rounded-[18%] relative",
        ring && (typeof ring === "string" ? ring : "ring-green-500"),
        ring && "ring"
      )}
      style={{
        width: `${size}rem`,
        height: `${size}rem`,
        backgroundImage: `url(/itemslot/ItemSlot_${rarityInfo.s}.png)`,
      }}
    >
      <div
        className="absolute top-0 left-0 bottom-[2.655%] right-[2.655%] overflow-hidden"
        style={{
          borderColor: rarityInfo.b ?? "transparent",
          borderStyle: "solid",
          borderRadius: "18%",
          borderWidth: `${0.03539823 * size}rem`,
        }}
      >
        <div
          className="flex justify-center items-center w-full h-full"
          style={{
            padding: `${(size * (100 - innerSize)) / 200}rem`,
          }}
        >
          {typeof item === "string" ? (
            <img
              src={fullItemPath ? `${item}.png` : `/items/Icon_${item}.png`}
              className="max-w-full max-h-full"
              // style={{
              //   maxWidth: "100%",
              //   maxHeight: "100%",
              //   objectFit: "contain",
              // }}
            />
          ) : (
            <div className="w-full h-full">{item}</div>
          )}
        </div>
      </div>

      {typeof amount !== "undefined" && (
        <div className="absolute bottom-[2.5%] left-[5%] right-[8%] bg-contain bg-item-slot-value aspect-[196/28]" />
      )}
      {typeof amount === "number" ? (
        <div
          className={cn(
            "absolute bottom-[3%] left-0 right-0 w-full text-center text-slate-900",
            size < 4 ? "text-xs" : "text-sm"
          )}
          style={{
            textShadow: Array(20).fill("0 0 1.2px #fff").join(", "),
          }}
        >
          {amount > 9999
            ? amount > 9999999
              ? `${Math.floor(amount / 1000000)}M`
              : `${Math.floor(amount / 1000)}K`
            : amount}
        </div>
      ) : (
        amount && (
          <div
            className={cn(
              "absolute bottom-[3%] left-0 right-0 w-full text-center text-slate-900",
              size < 4 ? "text-xs" : "text-sm"
            )}
            style={{
              textShadow: Array(20).fill("0 0 1.2px #fff").join(", "),
            }}
          >
            {amount}
          </div>
        )
      )}
    </div>
  );
};

export default ItemSlot;
