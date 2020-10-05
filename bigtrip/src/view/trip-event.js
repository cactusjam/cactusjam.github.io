import {getTimeFormat, formatDuration, convertDateToISOString} from "../utils/date.js";
import AbstractView from "./abstract.js";
import {getTypeParticle, getFirstUpperCase} from "../utils/utils.js";

const SERVICES_COUNT = 3;

const createTripEventTemplate = (point) => {
  const {type, destination, services, price, startDate, endDate} = point;
  const formattedDuration = formatDuration(startDate, endDate);
  const typeName = getFirstUpperCase(type);
  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${typeName} ${getTypeParticle(type)} ${destination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${convertDateToISOString(startDate)}">${getTimeFormat(startDate)}</time>
            &mdash;
            <time class="event__end-time" datetime="${convertDateToISOString(endDate)}">${getTimeFormat(endDate)}</time>
          </p>
          <p class="event__duration">${formattedDuration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${services.slice(0, SERVICES_COUNT).map((offer) =>`
          <li class="event__offer">
          <span class="event__offer-title">${offer.title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
          </li>
          `).join(``)}
        </ul>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class TripEvent extends AbstractView {
  constructor(point) {
    super();
    this._point = point;
    this._rollupButtonClickHandler = this._rollupButtonClickHandler.bind(this);
  }

  getTemplate() {
    return createTripEventTemplate(this._point);
  }

  _rollupButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.rollupButtonClick();
  }

  setRollupButtonClickHandler(callback) {
    this._callback.rollupButtonClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._rollupButtonClickHandler);
  }

}
