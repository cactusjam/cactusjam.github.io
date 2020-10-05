import {convertDate} from "../utils/date.js";
import {getTypeParticle, getFirstUpperCase} from "../utils/utils.js";
import {TRANSFER_TYPES, ACTIVITY_TYPES} from "../constants.js";
import SmartView from "./smart.js";
import flatpickr from "flatpickr";
import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const BLANK_DESTINATION = {
  name: ``,
  description: ``,
  photos: []
};

const ButtonName = {
  CANCEL: `Cancel`,
  DELETE: `Delete`,
  DELETING: `Deleting...`,
};

const SaveButtonName = {
  SAVE: `Save`,
  SAVING: `Saving...`,
};

const getDestination = (destinations, destinationName) => destinations.find((item) => (
  item.name === destinationName
));

const isOfferInclude = (offers, currentOffer) => offers.some((offer) => (
  offer.title === currentOffer.title && offer.price === currentOffer.price
));

const convertToRenderedServices = (offers, activeOffers) => offers.map((offer) => {
  return {
    title: offer.title,
    price: offer.price,
    isActivated: activeOffers.length > 0 && isOfferInclude(activeOffers, offer),
  };
});

const getDeleteCaption = (isDeleting) => isDeleting ? ButtonName.DELETING : ButtonName.DELETE;

const convertFromRenderedServices = (renderedServices) => renderedServices.reduce((offers, offer) => {
  if (offer.isActivated) {
    offers.push({
      title: offer.title,
      price: offer.price,
    });
  }

  return offers;
}, []);

const createRadioTemplate = (cardType, legendTypes, pointId) => {
  return (
    legendTypes.map((legendType, legendIndex) => {
      return (`<div class="event__type-item">
        <input id="event-type-${legendType}-${pointId}-${legendIndex}" class="event__type-input visually-hidden" type="radio" name="event-type" value="${legendType}" ${cardType === legendType ? `checked` : ``}>
        <label class="event__type-label  event__type-label--${legendType}" for="event-type-${legendType}-${pointId}-${legendIndex}">${getFirstUpperCase(legendType)}</label>
      </div>`);
    }).join(``)
  );
};

const createDestinationTemplate = (destinations, pointType, destination, isDisabled) => {
  const typeName = getFirstUpperCase(pointType);
  return (
    `<div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${typeName} ${getTypeParticle(pointType)}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1" ${isDisabled ? `disabled` : ``}>
      <datalist id="destination-list-1">
      ${destinations.map(({name}) => `<option value="${name}"></option>`).join(``)}
      </datalist>
    </div>`
  );
};

const createResetButtonTemplate = (isNewEvent, isDeleting, isDisabled) => {
  return (
    `<button class="event__reset-btn" type="reset" ${isDisabled ? `disabled` : ``}>
      ${isNewEvent ? ButtonName.CANCEL : getDeleteCaption(isDeleting)}
    </button>`
  );
};

const createEventEditTemplate = (pointData, destinations, isNewEvent) => {
  const {id, type, startDate, endDate, price, isFavorite, destination, renderedServices, isDisabled, isSaving, isInvalid} = pointData;
  const isDisabledSaveButton = isInvalid || isDisabled;

  return (
    `<form class="trip-events__item event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox" ${isDisabled ? `disabled` : ``}>
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>
                ${createRadioTemplate(type, TRANSFER_TYPES, id)}
              </fieldset>
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>
                ${createRadioTemplate(type, ACTIVITY_TYPES)}
              </fieldset>
            </div>
          </div>
          ${createDestinationTemplate(destinations, type, destination, isDisabled)}
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${convertDate(startDate)}">
            —
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${convertDate(endDate)}">
          </div>
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              €
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${price}" min="0" required ${isDisabled ? `disabled` : ``}>
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabledSaveButton ? `disabled` : ``}>
            ${isSaving ? SaveButtonName.SAVING : SaveButtonName.SAVE}
          </button>
          ${createResetButtonTemplate(isNewEvent, isDisabled)}
          ${!isNewEvent ? `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``} ${isDisabled ? `disabled` : ``}>
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>
          <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>`
      : ``}
        </header>
        <section class="event__details">
        ${renderedServices.length > 0 ?
      `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
        ${renderedServices.map((offer, index) =>`
          <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.type}-${index}" type="checkbox" data-title="${offer.title}" data-price="${offer.price}" name="event-offer-${offer.type}" ${offer.isActivated ? `checked` : ``} ${isDisabled ? `disabled` : ``}>
            <label class="event__offer-label" for="event-offer-${offer.type}-${index}">
              <span class="event__offer-title">${offer.title}</span>
              +
              €&nbsp;<span class="event__offer-price">${offer.price}</span>
            </label>
          </div>
          `).join(``)}
        </div>
      </section>` : ``
    }
          ${destination.name.length > 0 ? `
          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destination.description}</p>
            ${destination.photos.length > 0 ? `
            <div class="event__photos-container">
              <div class="event__photos-tape">
              ${destination.photos.map((photo) => `
                <img class="event__photo" src="${photo.href}" alt="${photo.description}">
              `).join(``)}
              </div>
            </div>` : ``}
          </section>` : ``}
        </section>
      </form>`
  );
};

export default class EventEdit extends SmartView {
  constructor(point, destinations = BLANK_DESTINATION, offers, isNewEvent = false) {
    super();
    this._data = EventEdit.parsePointToData(point, destinations, offers);
    this._destinations = destinations;
    this._offers = offers;
    this._isNewEvent = isNewEvent;
    this._startDatePicker = null;
    this._endDatePicker = null;
    this.isStartDateUpdate = false;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formResetHandler = this._formResetHandler.bind(this);
    this._rollDownButtonClickHandler = this._rollDownButtonClickHandler.bind(this);
    this._favoriteCheckboxChangeHandler = this._favoriteCheckboxChangeHandler.bind(this);
    this._typeListChangeHandler = this._typeListChangeHandler.bind(this);
    this._offerChangeHandler = this._offerChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepicker();
  }

  reset(point) {
    this.updateData(
        EventEdit.parsePointToData(point, this._destinations, this._offers)
    );
  }

  getTemplate() {
    return createEventEditTemplate(this._data, this._destinations, this._isNewEvent);
  }

  removeElement() {
    super.removeElement();
    this._destroyPointDatePickers();
  }

  _destroyStartDatePicker() {
    if (this._startDatePicker !== null) {
      this._startDatePicker.destroy();
      this._startDatePicker = null;
    }
  }

  _destroyEndDatePicker() {
    if (this._endDatePicker !== null) {
      this._endDatePicker.destroy();
      this._endDatePicker = null;
    }
  }

  _destroyPointDatePickers() {
    this._destroyStartDatePicker();
    this._destroyEndDatePicker();
  }

  _setDatepicker() {
    this._destroyStartDatePicker();
    this._startDatePicker = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        {
          'enableTime': true,
          'time_24hr': true,
          'dateFormat': `d/m/y H:i`,
          'defaultDate': this._data.startDate || new Date(),
          'maxDate': this._data.endDate,
          'onChange': this._startDateChangeHandler
        }
    );
    this._destroyEndDatePicker();
    this._endDatePicker = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        {
          'enableTime': true,
          'time_24hr': true,
          'dateFormat': `d/m/y H:i`,
          'defaultDate': this._data.endDate || new Date(),
          'minDate': this._data.startDate,
          'onChange': this._endDateChangeHandler
        }
    );
  }

  _startDateChangeHandler([startDate]) {
    this.isStartDateUpdate = startDate !== this._data.startDate;
    this.updateData({
      startDate
    }, true);
    this._endDatePicker.set(`minDate`, startDate);
  }

  _endDateChangeHandler([endDate]) {
    this.updateData({
      endDate
    }, true);
    this._startDatePicker.set(`maxDate`, endDate);
  }

  _offerChangeHandler(evt) {
    evt.preventDefault();
    const title = evt.target.dataset.title;
    const price = Number(evt.target.dataset.price);
    const renderedServices = this._data.renderedServices.map((offer) => {

      if (offer.title !== title && offer.price !== price) {
        return offer;
      }

      return {
        title,
        price,
        isActivated: evt.target.checked,
      };
    });

    this.updateData({
      renderedServices,
    }, true);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EventEdit.parseDataToPoint(this._data));
  }

  _formResetHandler(evt) {
    evt.preventDefault();
    this._callback.formReset(EventEdit.parseDataToPoint(this._data));
  }

  _rollDownButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback._rollDownButtonClick();
  }

  _favoriteCheckboxChangeHandler() {
    this._callback._favoriteClick(!this._data.isFavorite);

    this.updateData({
      isFavorite: !this._data.isFavorite
    }, true);
  }

  _typeListChangeHandler(evt) {
    evt.preventDefault();

    const type = evt.target.value.toLowerCase();
    const typeOffers = this._offers[type];

    const renderedServices = typeOffers.length > 0
      ? convertToRenderedServices(typeOffers, [])
      : [];

    this.updateData({
      type,
      renderedServices
    });
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    const destination = getDestination(this._destinations, evt.target.value);

    if (destination && evt.target.value !== this._data.destination.name) {
      this.updateData({
        destination,
        isInvalid: !destination
      });
      return;
    }
    evt.target.value = this._data.destination.name;
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      price: evt.target.valueAsNumber,
    }, true);
  }

  _setOffersChangeHandlers() {
    const offerCheckbox = this.getElement().querySelectorAll(`.event__offer-checkbox`);
    offerCheckbox.forEach((offer) => {
      offer.addEventListener(`change`, this._offerChangeHandler);
    });
  }

  _setInnerHandlers() {
    const element = this.getElement();

    if (!this._isNewEvent) {
      element.querySelector(`.event__favorite-checkbox`).addEventListener(`change`, this._favoriteCheckboxChangeHandler);
    }

    element.querySelector(`.event__type-list`).addEventListener(`change`, this._typeListChangeHandler);
    element.querySelector(`.event__input--destination`).addEventListener(`change`, this._destinationChangeHandler);
    element.querySelector(`.event__input--price`).addEventListener(`change`, this._priceChangeHandler);
    this._setOffersChangeHandlers();

  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  setFormResetHandler(callback) {
    this._callback.formReset = callback;
    this.getElement().addEventListener(`reset`, this._formResetHandler);
  }

  setRollDownButtonClickHandler(callback) {
    this._callback._rollDownButtonClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._rollDownButtonClickHandler);
  }

  setFavoriteChangeHandler(callback) {
    this._callback._favoriteClick = callback;
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFormResetHandler(this._callback.formReset);

    if (!this._isNewEvent) {
      this.setRollDownButtonClickHandler(this._callback._rollDownButtonClick);
    }
  }

  static parsePointToData(point, destinations, offers) {
    const {type, destination} = point;
    const isInvalidDestination = !getDestination(destinations, destination.name);

    const typeOffers = offers[type];

    const renderedServices = typeOffers.length > 0
      ? convertToRenderedServices(typeOffers, point.services)
      : [];

    return Object.assign(
        {},
        point,
        {
          renderedServices,
          isDisabled: false,
          isSaving: false,
          isDeleting: false,
          isInvalid: isInvalidDestination
        }
    );
  }

  static parseDataToPoint(pointData) {
    const services = convertFromRenderedServices(pointData.renderedServices);

    delete pointData.isDisabled;
    delete pointData.isSaving;
    delete pointData.isDeleting;
    delete pointData.isInvalid;

    return Object.assign(
        {},
        pointData,
        {
          services
        }
    );
  }
}

