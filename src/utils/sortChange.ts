import { SortOrFilter, SortBy, SortType } from "@/types/enums";

const sortChange = (sortAndFilter: number[][], sortBy: SortBy) => {
  const sortData = sortAndFilter.find((v) => v[0] === SortOrFilter.Sort) ?? [
    0, 0, 0,
  ];
  const elseData = sortAndFilter.filter((v) => v[0] !== SortOrFilter.Sort);
  const direction =
    sortData[1] === sortBy
      ? sortData[2] === SortType.Asc
        ? SortType.Desc
        : SortType.Asc
      : sortBy === SortBy.StarGrade
      ? SortType.Desc
      : SortType.Asc;
  return [[SortOrFilter.Sort, sortBy, direction], ...elseData];
};

export default sortChange;
