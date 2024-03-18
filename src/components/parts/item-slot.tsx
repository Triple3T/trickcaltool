interface ItemSlotProps {
  rarityInfo: {
    s: string;
    b?: string;
  };
  item: string;
  fullItemPath?: boolean;
  amount?: number;
  size?: number;
}
const ItemSlot = ({ rarityInfo, item, fullItemPath, amount, size = 5 }: ItemSlotProps) => {
  return (
    <div
      className="bg-cover bg-center bg-no-repeat rounded-[18%] relative"
      style={{
        width: `${size}rem`,
        height: `${size}rem`,
        backgroundImage: `url(/itemslot/ItemSlot_${rarityInfo.s}.png)`,
      }}
    >
      <img
        src={fullItemPath ? `${item}.png` : `/items/Icon_${item}.png`}
        style={{
          width: `${(size * 6) / 10}rem`,
          height: `${(size * 6) / 10}rem`,
          margin: `${(size * 2) / 10}rem`,
        }}
      />
      {typeof rarityInfo.b === "string" && (
        <div
          className="absolute top-0 left-0 bottom-[2.655%] right-[2.655%]"
          style={{
            borderColor: rarityInfo.b,
            borderStyle: "solid",
            borderRadius: "18%",
            borderWidth: `${0.03539823 * size}rem`,
          }}
        />
      )}
      {typeof amount === "number" && (
        <div
          className="absolute bottom-[2.5%] left-[5%] right-[8%] bg-contain"
          style={{
            aspectRatio: "196/28",
            backgroundImage: "url(/itemslot/ItemSlot_ValueBase.png)",
          }}
        />
      )}
      {typeof amount === "number" && (
        <div
          className={`absolute bottom-[3%] left-0 right-0 w-full text-center text-slate-900 ${
            size < 4 ? "text-xs" : "text-sm"
          }`}
          style={{
            textShadow: Array(20).fill("0 0 1.2px #fff").join(", "),
          }}
        >
          {amount > 9999 ? `${Math.floor(amount / 1000)}K` : amount}
        </div>
      )}
    </div>
  );
};

export default ItemSlot;
