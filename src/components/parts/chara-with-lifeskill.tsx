import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import LifeskillIcon from "./lifeskill-icon";

interface CharaWithLifeskillProps {
  charaId: string;
  lifeskills: number[];
  selectedLifeskills: number[];
  searchChara?: (charaId: string) => void;
}

const CharaWithLifeskill = ({
  charaId,
  lifeskills,
  selectedLifeskills,
  searchChara,
}: CharaWithLifeskillProps) => {
  const { t } = useTranslation();
  return (
    <div className="w-72 rounded-xl px-2 py-4 ring-4 bg-taskcard text-taskcard-foreground ring-taskcard-border">
      <div className="flex flex-row gap-2.5 items-center">
        <img
          className="w-12 h-12 aspect-square"
          src={`/charas/${charaId}.png`}
        />
        <div>
          <div className="text-left text-2xl flex items-center">
            {t(`chara.${charaId}`)}
            {searchChara && (
              <Search
                className="w-4 h-4 inline-block ml-2"
                onClick={() => searchChara(charaId)}
              />
            )}
          </div>
          {selectedLifeskills.length > 1 && (
            <div className="text-left text-sm">
              {t(`ui.tasksearch.skillMatchCount`, {
                0: `${
                  lifeskills.filter((lfs) => selectedLifeskills.includes(lfs))
                    .length
                }`,
              })}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-row gap-0.5 my-2">
        {lifeskills.map((lifeskillId, index) => {
          return (
            <LifeskillIcon
              key={index}
              id={lifeskillId}
              active={selectedLifeskills.includes(lifeskillId)}
              size="small"
              additionalClassName="mx-auto flex-1"
              showName
              nameClassName="-mt-1"
            />
          );
        })}
      </div>
    </div>
  );
};

export default CharaWithLifeskill;
