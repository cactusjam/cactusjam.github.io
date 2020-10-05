import {FilterType} from "../constants";

const filterTypeToPoints = {
  [FilterType.EVERYTHING]: (points) => points.slice(),
  [FilterType.FUTURE]: (points, now) => points.filter((point) => point.startDate > now),
  [FilterType.PAST]: (points, now) => points.filter(({startDate}) => startDate < now)
};

export {filterTypeToPoints};
