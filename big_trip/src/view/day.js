import {getDayFormat, convertDateToISOString} from "../utils/date.js";
import AbstractView from "./abstract.js";

const createDayTemplate = (counter, startDate) => {
  return (
    `<li class="trip-days__item day">
      <div class="day__info">
      ${counter !== 0 ? `<span class="day__counter">${counter}</span>
        <time class="day__date" datetime="${convertDateToISOString(startDate)}">${getDayFormat(startDate)}</time>` : ``}
      </div>
    </li>`
  );
};

export default class Day extends AbstractView {
  constructor(counter, startDate) {
    super();
    this._counter = counter;
    this._startDate = startDate;
  }

  getTemplate() {
    return createDayTemplate(this._counter, this._startDate);
  }
}
