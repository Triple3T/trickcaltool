import { useTranslation } from "react-i18next";
import { Dot, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import LifeskillIcon from "./lifeskill-icon";
import ItemSlot from "./item-slot";

import material from "@/data/material";

interface TaskCardProp {
  taskId: string;
  frontImgWidthPercent?: number;
  skillIds: number[];
  activeSkillIds?: number[];
  levelRequired: number;
  acquireExp?: number[];
  rewardMaterials: string[];
  rewardAmount: number[][][];
  taskLevel: number;
  setTaskLevel: (taskLevel: number | ((prev: number) => number)) => void;
  searchTask?: (taskId: string) => void;
  small?: boolean;
}

const TaskCard = ({
  taskId,
  frontImgWidthPercent,
  skillIds,
  activeSkillIds = [],
  levelRequired,
  acquireExp,
  rewardMaterials,
  rewardAmount,
  taskLevel,
  setTaskLevel,
  searchTask,
  small,
}: TaskCardProp) => {
  const { t } = useTranslation();
  const [primarySkillId, ...otherSkillIds] = skillIds;
  return (
    <div
      className={cn(
        "rounded-xl p-4 ring-4 bg-taskcard text-taskcard-foreground ring-taskcard-border relative",
        small ? "w-64" : "w-72"
      )}
    >
      <div
        className={cn("absolute -top-2 -left-2 aspect-[55/71] bg-cover text-2xl text-slate-50", small ? "w-10 pt-1" : "w-11 pt-1.5")}
        style={{
          backgroundImage: `url(/tasks/Icon_Task_${taskLevel + 1}.webp)`,
        }}
        onClick={() => setTaskLevel((level: number) => (level + 1) % 5)}
      >
        {taskLevel + 1}
      </div>
      <div className="pl-2 mb-1">
        <div className="pr-2 pb-2.5 pt-0.5 bg-contain bg-no-repeat bg-center bg-task-title">
          <div className="text-xl">{t(`task.${taskId}`)}</div>
        </div>
      </div>
      <div className="w-full relative aspect-[254/176]">
        <img
          className="w-full aspect-[254/176] dark:contrast-125 dark:brightness-80"
          src={`/tasks/Img_${taskId}_Back.webp`}
        />
        {frontImgWidthPercent && (
          <img
            className="absolute bottom-0 left-0 dark:contrast-125 dark:brightness-80"
            src={`/tasks/Img_${taskId}_Front.webp`}
            style={{ width: `${frontImgWidthPercent}%` }}
          />
        )}
        <div className="absolute bottom-0 left-0 flex items-end">
          <LifeskillIcon
            id={primarySkillId}
            active={activeSkillIds.includes(primarySkillId)}
            additionalClassName="scale-125"
          />
          {otherSkillIds.map((lifeskillId, index) => {
            return (
              <LifeskillIcon
                key={index}
                id={lifeskillId}
                active={activeSkillIds.includes(lifeskillId)}
                size="small"
                additionalClassName="-mx-1"
              />
            );
          })}
        </div>
        {searchTask && (
          <div className="absolute right-0 top-0 p-1 m-1.5 ring-2 ring-taskcard-border rounded-sm bg-taskcard">
            <Search
              className="w-3 h-3"
              strokeWidth={3}
              onClick={() => searchTask(taskId)}
            />
          </div>
        )}
      </div>
      <div className="text-center text-sm p-1">
        {t("ui.tasksearch.reqLevel", {
          0: levelRequired > 0 ? levelRequired : "??",
        })}
        <Dot className="w-3 h-3 inline-block" strokeWidth={4} />
        {t("ui.tasksearch.expValue", {
          0: acquireExp ? `${acquireExp[taskLevel]}` : "0",
        })}
      </div>
      <div className="flex flex-row flex-wrap gap-2 p-2 mt-2 justify-center">
        {rewardMaterials.length > 0 ? (
          rewardMaterials.map((materialId, index) => {
            if (materialId.startsWith("_scheduleBox")) {
              return (
                <ItemSlot
                  key={index}
                  rarityInfo={material.r[2]}
                  item={`/icons/Schedule_Box${materialId.split(".")[1]}`}
                  fullItemPath
                  size={3.5}
                  amount={rewardAmount[taskLevel][index].join("~")}
                />
              );
            }
            const currrentMaterial = material.m[materialId];
            return (
              <ItemSlot
                key={index}
                rarityInfo={material.r[currrentMaterial.r]}
                item={materialId}
                size={3.5}
                amount={rewardAmount[taskLevel][index].join("~")}
              />
            );
          })
        ) : (
          <div className="text-xl text-center text-blue-600 bg-sky-200 rounded-full px-4 mt-3">
            <div className="-mt-3">
              {t("ui.tasksearch.stressReduction", {
                0: rewardAmount[taskLevel][0].join("~"),
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
