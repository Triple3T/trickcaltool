import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MainMenuCardPropsWithoutTo {
  title: string;
  description: ReactNode | ReactNode[] | undefined;
  subDescription?: ReactNode | ReactNode[] | undefined;
  icon: string;
  greenIcon?: boolean;
  to?: string;
  secondaryTitle: string;
  secondaryDescription: ReactNode | ReactNode[] | undefined;
  secondarySubDescription?: ReactNode | ReactNode[] | undefined;
  secondaryIcon: string;
  secondaryGreenIcon?: boolean;
  secondaryTo?: string;
}
interface MainMenuCardPropsWithTo extends MainMenuCardPropsWithoutTo {
  to: string;
  secondaryTo: string;
}

type MainMenuCardProps = MainMenuCardPropsWithTo | MainMenuCardPropsWithoutTo;

const MainMenuCardSwitchable = ({
  title,
  description,
  subDescription,
  icon,
  greenIcon,
  to,
  secondaryTitle,
  secondaryDescription,
  secondarySubDescription,
  secondaryIcon,
  secondaryGreenIcon,
  secondaryTo,
}: MainMenuCardProps) => {
  const [isPrimary, setIsPrimary] = useState<boolean>(true);
  if (!to || !secondaryTo)
    return (
      <div className="relative">
        <div
          className="h-5 w-8 lg:h-7 lg:w-10 absolute right-4 top-4"
          onClick={() => {
            setIsPrimary((v) => !v);
          }}
        >
          <img
            src={isPrimary ? secondaryIcon : icon}
            className={cn(
              "h-4 w-4 lg:h-6 lg:w-6 absolute right-0 top-0 opacity-75",
              (isPrimary ? secondaryGreenIcon : greenIcon)
                ? " bg-greenicon rounded-full"
                : ""
            )}
          />
          <div className="h-4 w-4 p-0.5 lg:h-6 lg:w-6 lg:p-1 absolute right-3 lg:right-4 top-1 rounded-full bg-slate-500/80 opacity-75">
            <ArrowLeftRight className="h-full w-full" strokeWidth={3} />
          </div>
        </div>
        <div className="flex flex-col bg-gray-200/60 dark:bg-gray-500/60 p-4 rounded-lg shadow-md space-y-4">
          <img
            src={isPrimary ? icon : secondaryIcon}
            className={cn(
              "h-6 w-6 lg:h-8 lg:w-8",
              (isPrimary ? greenIcon : secondaryGreenIcon)
                ? " bg-greenicon rounded-full"
                : ""
            )}
          />
          <h3 className="text-lg font-medium lg:text-xl text-gray-800 dark:text-gray-200">
            {isPrimary ? title : secondaryTitle}
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {isPrimary ? description : secondaryDescription}
          </p>
        </div>
      </div>
    );
  return (
    <div className="relative">
      <div
        className="h-5 w-8 lg:h-7 lg:w-10 absolute right-4 top-4"
        onClick={() => {
          setIsPrimary((v) => !v);
        }}
      >
        <img
          src={isPrimary ? secondaryIcon : icon}
          className={cn(
            "h-4 w-4 lg:h-6 lg:w-6 absolute right-0 top-0 opacity-75",
            (isPrimary ? secondaryGreenIcon : greenIcon)
              ? " bg-greenicon rounded-full"
              : ""
          )}
        />
        <div className="h-4 w-4 p-0.5 lg:h-6 lg:w-6 lg:p-1 absolute right-3 lg:right-4 top-1 rounded-full bg-slate-500/80 opacity-75">
          <ArrowLeftRight className="h-full w-full" strokeWidth={3} />
        </div>
      </div>
      <Link to={isPrimary ? to : secondaryTo}>
        <div className="flex flex-col bg-gray-200/60 dark:bg-gray-500/60 p-4 rounded-lg shadow-md space-y-4">
          <img
            src={isPrimary ? icon : secondaryIcon}
            className={cn(
              "h-6 w-6 lg:h-8 lg:w-8",
              (isPrimary ? greenIcon : secondaryGreenIcon)
                ? " bg-greenicon rounded-full"
                : ""
            )}
          />
          <h3 className="text-lg font-medium lg:text-xl text-gray-800 dark:text-gray-200">
            {isPrimary ? title : secondaryTitle}
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {isPrimary ? description : secondaryDescription}
            <br />
            {isPrimary ? subDescription : secondarySubDescription}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default MainMenuCardSwitchable;
