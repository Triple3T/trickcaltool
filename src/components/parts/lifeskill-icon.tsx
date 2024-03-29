import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface ILifeSkillIconProps {
  id: string | number;
  active?: boolean;
  onClick?: () => void;
  size?: "small" | "default" | "large";
  additionalClassName?: string;
  showName?: boolean;
  nameClassName?: string;
}

const CLASS_NAME_SET: Record<
  NonNullable<ILifeSkillIconProps["size"]>,
  string[]
> = {
  large: [
    "w-16 h-16 relative",
    "",
    "w-16 h-16 rounded-full overflow-hidden",
    "w-24 absolute -left-4 -top-3",
    "w-16 absolute left-0 top-0",
  ],
  default: [
    "w-16 h-16 relative",
    "p-3",
    "w-10 h-10 rounded-full overflow-hidden",
    "w-16 absolute left-0 top-0.5",
    "w-10 absolute left-3 top-3",
  ],
  small: [
    "w-12 h-12 relative",
    "p-2",
    "w-8 h-8 rounded-full overflow-hidden",
    "w-12 absolute left-0 top-0.5",
    "w-8 absolute left-2 top-2",
  ],
};

const LifeskillIcon = ({
  id,
  active = false,
  onClick,
  size = "default",
  additionalClassName = "",
  showName = false,
  nameClassName = "",
}: ILifeSkillIconProps) => {
  const { t } = useTranslation();
  const classNames = CLASS_NAME_SET[size];
  return (
    <div className={cn(classNames[0], additionalClassName)} onClick={onClick}>
      <div className={classNames[1]}>
        <div className={classNames[2]}>
          <img
            className="w-full h-full dark:contrast-125 dark:brightness-80"
            src={`/schedule/LifeSkill${id}.png`}
          />
        </div>
      </div>
      {active ? (
        <div className={classNames[3]}>
          <img
            className="mx-auto aspect-[160/148]"
            src={`/schedule/Skill_EffectOn.png`}
          />
        </div>
      ) : (
        <div className={classNames[4]}>
          <img
            className="w-full h-full aspect-square"
            src={`/schedule/IconSkillBorder.png`}
          />
        </div>
      )}
      {showName && (
        <div
          className={cn(
            "text-sm flex justify-center -mt-1.5 whitespace-nowrap",
            nameClassName
          )}
        >
          <div className="w-max">{t(`lifeskill.${id}`)}</div>
        </div>
      )}
    </div>
  );
};

export default LifeskillIcon;
