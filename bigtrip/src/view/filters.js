import AbstractView from "./abstract.js";
import {FilterType} from "../constants";

const FILTERS = Object.values(FilterType);

const createFiltersTemplate = (currentType, availabilities) => {
  return (
    `<form class="trip-filters" action="#" method="get">
      ${FILTERS.map((type) => `
      <div class="trip-filters__filter">
        <input id="filter-${type.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}"
        ${type === currentType ? `checked` : ``}
        ${availabilities[type] ? `` : `disabled`}
        >
        <label class="trip-filters__filter-label ${availabilities[type] ? `` : `trip-filters__filter-label--empty`}" for="filter-${type.toLowerCase()}">${type}</label>
      </div>
      `).join(``)}
      <button class="visually-hidden" type="submit">Accept filter</button>
      </form>`
  );
};

export default class Filters extends AbstractView {
  constructor(currentType, availabilities) {
    super();
    this._currentType = currentType;
    this._availabilities = availabilities;
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate(this._currentType, this._availabilities);
  }

  setTypeChangeHandler(callback) {
    this._callback.typeChange = callback;
    this.getElement().addEventListener(`change`, this._typeChangeHandler);
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.typeChange(evt.target.value);
  }
}
