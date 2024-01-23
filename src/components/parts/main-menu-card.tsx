import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface MainMenuCardProps {
  title: string;
  description: ReactNode | ReactNode[] | undefined;
  icon: string;
  greenIcon?: boolean;
  to?: string;
}

const MainMenuCard = ({
  title,
  description,
  icon,
  greenIcon,
  to,
}: MainMenuCardProps) => {
  if (!to)
    return (
      <div className="flex flex-col bg-gray-200/60 dark:bg-gray-500/60 p-4 rounded-lg shadow-md space-y-4">
        <img
          src={icon}
          className={`h-6 w-6 lg:h-8 lg:w-8${
            greenIcon ? " bg-greenicon rounded-full" : ""
          }`}
        />
        <h3 className="text-lg font-medium lg:text-xl text-gray-800 dark:text-gray-200">
          {title}
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {description}
        </p>
      </div>
    );
  return (
    <Link to={to}>
      <div className="flex flex-col bg-gray-200/60 dark:bg-gray-500/60 p-4 rounded-lg shadow-md space-y-4">
        <img
          src={icon}
          className={`h-6 w-6 lg:h-8 lg:w-8${
            greenIcon ? " bg-greenicon rounded-full" : ""
          }`}
        />
        <h3 className="text-lg font-medium lg:text-xl text-gray-800 dark:text-gray-200">
          {title}
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {description}
        </p>
      </div>
    </Link>
  );
};

export default MainMenuCard;
