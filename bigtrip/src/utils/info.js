import {getMonthFormat, getDayFormat, getDayPlusMonthFormat} from "../utils/date.js";

const LIMIT_ROUTE_CITY = 3;

const getRoute = (points) => {
  const count = points.length;
  if (count === 0) {
    return ``;
  }

  if (count <= LIMIT_ROUTE_CITY) {
    return points.map((point) => point.destination.name).join(` — `);
  }

  return `${points[0].destination.name} — ... — ${points[count - 1].destination.name}`;
};

const getTripDateDuration = (points) => {
  if (points.length === 0) {
    return ``;
  }

  const startDate = points[0].startDate;
  const endDate = points[points.length - 1].endDate;

  const endMonthFormat = startDate.getMonth() === endDate.getMonth()
    ? getDayFormat(endDate)
    : getDayPlusMonthFormat(endDate);

  return `${getMonthFormat(startDate)}&nbsp;&mdash;&nbsp;${endMonthFormat}`;
};

const getTotalTripCost = (points) =>
  points.reduce((price, point) => {
    price += point.price + point.services.reduce((offersPrice, offer) => offersPrice + offer.price, 0);
    return price;
  }, 0);

export {getRoute, getTripDateDuration, getTotalTripCost};

