import { SortOrFilter, FilterBy } from "@/types/enums";

const filterChange = (
  sortAndFilter: number[][],
  filterBy: FilterBy,
  target: number
) => {
  const sortData = sortAndFilter.find((v) => v[0] === SortOrFilter.Sort) ?? [
    0, 0, 0,
  ];
  const elseData = sortAndFilter.filter((v) => v[0] !== SortOrFilter.Sort);
  const targetFilterData = elseData.find(
    (v) => v[0] === SortOrFilter.Filter && v[1] === filterBy
  );
  const nonTargetFilterData = elseData.filter(
    (v) => !(v[0] === SortOrFilter.Filter && v[1] === filterBy)
  );
  const targetFilter = targetFilterData ?? [SortOrFilter.Filter, filterBy, 0];
  const filterData = targetFilter[2] ^ (1 << target);
  return [sortData, ...nonTargetFilterData, [SortOrFilter.Filter, filterBy, filterData]];
};

export default filterChange;
