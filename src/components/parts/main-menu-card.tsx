import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
interface MenuCardLinkProps {
  icon: string;
  title: string;
  to: string;
  greenIcon?: boolean;
}

interface MainMenuCardProps {
  title: string;
  description: ReactNode | ReactNode[] | undefined;
  subMenus: MenuCardLinkProps[];
}

const MainMenuCard = ({
  title,
  description,
  subMenus,
}: MainMenuCardProps) => {
  return (
    <div className="flex flex-col bg-gray-200/75 dark:bg-gray-500/75 p-4 rounded-lg shadow-md space-y-2">
      <h4 className="text-lg font-medium lg:text-xl text-gray-800 dark:text-gray-200">
        {title}
      </h4>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        {description}
      </p>
      <div />
      <div className="flex flex-row items-stretch justify-between mt-4 divide-x divide-slate-500/50">
        {subMenus.map(({ icon, title, to, greenIcon = false }, index) => {
          return (
            <Link key={index} to={to} className="flex-1">
              <div className="flex flex-col justify-start items-center gap-1 w-full p-1">
                <img
                  src={icon}
                  alt=""
                  className={cn(
                    "w-6 h-6",
                    greenIcon ? "bg-greenicon rounded-full" : ""
                  )}
                />
                <p className="text-xs text-gray-700 dark:text-gray-300 break-keep">
                  {title}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MainMenuCard;
