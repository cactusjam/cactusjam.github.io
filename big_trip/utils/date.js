import moment from "moment";

const isDate = (date) => date instanceof Date;

const getTimeFormat = (date) => moment(date).format(`HH:mm`);

const getDayFormat = (date) => moment(date).format(`MMM D`);

const getMonthFormat = (date) => {
  return moment(date).format(`MMM DD`);
};

const getDayPlusMonthFormat = (date) => {
  moment(date).format(`DD MMM`);
};

const convertDateNumbers = (value) => String(value).padStart(2, `0`);

const convertDate = (date) => isDate(date) ? moment(date).format(`DD/MM/YY HH:mm`) : ``;

const getHourDuration = (startDate, endDate) => endDate - startDate;

const formatDuration = (start, end) => {
  const momentDiff = moment(end).diff(moment(start));
  const momentDuration = moment.duration(momentDiff);

  const duration = {
    days: momentDuration.get(`days`) > 0 ? `${convertDateNumbers(momentDuration.get(`days`))}D` : ``,
    hours: momentDuration.get(`days`) > 0 || momentDuration.get(`hours`) > 0 ? `${convertDateNumbers(momentDuration.get(`hours`))}H` : ``,
    minutes: `${convertDateNumbers(momentDuration.get(`minutes`))}M`
  };
  return `${duration.days} ${duration.hours} ${duration.minutes}`;
};

const convertDateToDay = (date) => {
  return `${date.getDate()}${date.getMonth()}${date.getFullYear()}`;
};

const groupCardsByDay = (cardsCollections) => {
  const reduceCardByDay = (days, card) => {
    const dayDate = convertDateToDay(card.startDate);

    if (Array.isArray(days[dayDate])) {
      days[dayDate].push(card);
    } else {
      days[dayDate] = [card];
    }

    return days;
  };

  return cardsCollections.reduce(reduceCardByDay, {});
};

const convertDateToISOString = (date) => moment(date).format();

const isDatesEqual = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return true;
  }

  return moment(dateA).isSame(dateB, `day`);
};

export {getTimeFormat, getDayFormat, convertDate, formatDuration, groupCardsByDay, convertDateToISOString, isDatesEqual, getHourDuration, getMonthFormat, getDayPlusMonthFormat};
