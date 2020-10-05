import EventEditView from "../view/event-edit.js";
import {render, remove, RenderPosition} from "../utils/dom.js";
import {UserAction, UpdateType} from "../constants.js";
import {isEscapeEvent} from "../utils/dom-event.js";

const createEmptyPoint = () => ({
  type: `taxi`,
  destination: {
    name: ``,
    photos: [],
    description: ``
  },
  startDate: new Date(),
  endDate: new Date(),
  services: [],
  isFavorite: false,
  price: 0,
});

export default class PointNew {
  constructor(changeData, newPointFormCloseCallback) {
    this._changeData = changeData;
    this._newPointFormCloseCallback = newPointFormCloseCallback;

    this._destinations = null;
    this._attributes = null;
    this._component = null;
    this._offers = null;

    this._handleDeleteButtonClick = this._handleDeleteButtonClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleSubmitButtonClick = this._handleSubmitButtonClick.bind(this);
  }

  init(container, destinations, offers) {
    this._container = container;
    this._attributes = createEmptyPoint();
    this._destinations = destinations;
    this._offers = offers;
    const isNewEvent = true;
    if (this._component !== null) {
      return;
    }

    this._component = new EventEditView(this._attributes, this._destinations, this._offers, isNewEvent);
    this._component.setFormSubmitHandler(this._handleSubmitButtonClick);
    this._component.setFormResetHandler(this._handleDeleteButtonClick);

    render(this._container, this._component, RenderPosition.AFTER_END);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  setSaving() {
    this._component.updateData({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._component.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this._component.shake(resetFormState);
  }

  destroy() {
    if (this._component === null) {
      return;
    }

    remove(this._component);
    this._component = null;

    this._newPointFormCloseCallback();
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleSubmitButtonClick(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        point
    );
    this.destroy();
  }

  _handleDeleteButtonClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (isEscapeEvent(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
