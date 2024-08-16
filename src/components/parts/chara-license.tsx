import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LicenseImgFixedSizeProps {
  size: number;
  name: string;
  fullSize?: false;
}
interface LicenseImgFullSizeProps {
  fullSize: true;
  name: string;
}
type LicenseImgProps = LicenseImgFixedSizeProps | LicenseImgFullSizeProps;

const LicenseImg = (props: LicenseImgProps) => {
  return (
    <div
      className="bg-cover bg-no-repeat relative"
      style={{
        backgroundImage: "url(/icons/LicenseBg.png)",
        width: props.fullSize ? "100%" : props.size,
        height: props.fullSize ? "100%" : props.size,
      }}
    >
      <div
        className={cn(
          "relative overflow-hidden aspect-square opacity-100",
          "w-[38.25%] h-[38.25%] rounded-[13.5%] rotate-[10.2deg] translate-x-[47%] translate-y-[75%]"
        )}
      >
        <img
          src={`/charas/${props.name}.png`}
          alt=""
          className="absolute max-w-[calc(100%_/_0.43)] w-[calc(100%_/_0.43)] h-[calc(100%_/_0.43)] aspect-square -top-[46%] -left-[64%]"
        />
      </div>
    </div>
  );
};

const sizeDict = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-md",
  lg: "text-lg",
  xl: "text-xl",
};
interface LicenseSlotFixedSizeProps {
  amount?: number | ReactNode;
  size: number;
  fullSize?: false;
  children?: ReactNode;
  amountSize: "xs" | "sm" | "md" | "lg";
}
interface LicenseSlotFullSizeProps {
  amount?: number | ReactNode;
  fullSize: true;
  children?: ReactNode;
  amountSize: "xs" | "sm" | "md" | "lg";
}
type LicenseSlotProps = LicenseSlotFixedSizeProps | LicenseSlotFullSizeProps;

const LicenseSlot = (props: LicenseSlotProps) => {
  return (
    <div
      className="bg-cover bg-no-repeat relative font-onemobile"
      style={{
        backgroundImage: "url(/itemslot/ItemSlot_LightGreen.png)",
        width: props.fullSize ? "100%" : props.size,
        height: props.fullSize ? "100%" : props.size,
      }}
    >
      <div className="w-full h-full p-[4%]">{props.children}</div>

      {typeof props.amount !== "undefined" && (
        <div className="absolute bottom-[2.5%] left-[5%] right-[8%] bg-contain bg-item-slot-value aspect-[196/28]" />
      )}
      {typeof props.amount === "number" ? (
        <div
          className={cn(
            "absolute bottom-[3%] left-0 right-0 w-full text-center text-slate-900",
            sizeDict[props.amountSize]
          )}
          style={{
            textShadow: Array(20).fill("0 0 1.2px #fff").join(", "),
          }}
        >
          {props.amount > 9999
            ? `${Math.floor(props.amount / 1000)}K`
            : props.amount}
        </div>
      ) : (
        props.amount && (
          <div
            className={cn(
              "absolute bottom-[3%] left-0 right-0 w-full text-center text-slate-900",
              sizeDict[props.amountSize]
            )}
            style={{
              textShadow: Array(20).fill("0 0 1.2px #fff").join(", "),
            }}
          >
            {props.amount}
          </div>
        )
      )}
    </div>
  );
};

interface CharaLicenseCoreProps {
  amount?: number | ReactNode;
  name: string;
  amountSize?: "xs" | "sm" | "md" | "lg";
  withSlot?: boolean;
}
interface CharaLicenseSlotFixedSizeProps extends CharaLicenseCoreProps {
  size: number;
  fullSize?: false;
}
interface CharaLicenseSlotFullSizeProps extends CharaLicenseCoreProps {
  fullSize: true;
}
type CharaLicenseProps =
  | CharaLicenseSlotFixedSizeProps
  | CharaLicenseSlotFullSizeProps;

const CharaLicense = ({
  amount,
  name,
  amountSize = "sm",
  withSlot,
  ...sizeProps
}: CharaLicenseProps) => {
  if (withSlot) {
    return (
      <LicenseSlot amount={amount} amountSize={amountSize} {...sizeProps}>
        <LicenseImg name={name} fullSize={true} />
      </LicenseSlot>
    );
  }
  return <LicenseImg name={name} {...sizeProps} />;
};

export default CharaLicense;
