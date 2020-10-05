import EventEditView from "../view/event-edit.js";
import TripEventView from "../view/trip-event.js";
import {render, replace, remove} from "../utils/dom.js";
import {isDatesEqual} from "../utils/date.js";
import {isEscapeEvent} from "../utils/dom-event.js";
import {UserAction, UpdateType, State} from "../constants.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class Point {
  constructor(container, changeData, changeMode) {
    this._container = container;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._destinations = null;
    this._card = null;
    this._component = null;
    this._editComponent = null;
    this._offers = null;
    this._mode = Mode.DEFAULT;
    this._handleRollupPoint = this._handleRollupPoint.bind(this);
    this._handleRollupPointEdit = this._handleRollupPointEdit.bind(this);
    this._handleSubmitPointEdit = this._handleSubmitPointEdit.bind(this);
    this._handleDeletePointEdit = this._handleDeletePointEdit.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(card, destinations, offers) {
    this._card = card;
    this._destinations = destinations;
    this._offers = offers;
    const prevComponent = this._component;
    const prevEditComponent = this._editComponent;
    this._component = new TripEventView(card);
    this._editComponent = new EventEditView(card, this._destinations, this._offers);

    this._component.setRollupButtonClickHandler(this._handleRollupPoint);
    this._editComponent.setFormSubmitHandler(this._handleSubmitPointEdit);
    this._editComponent.setFormResetHandler(this._handleDeletePointEdit);
    this._editComponent.setRollDownButtonClickHandler(this._handleRollupPointEdit);
    this._editComponent.setFavoriteChangeHandler(this._handleFavoriteClick);

    if (prevComponent === null || prevEditComponent === null) {
      render(this._container, this._component);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._component, prevComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._editComponent, prevEditComponent);
    }

    remove(prevComponent);
    remove(prevEditComponent);
  }

  setViewState(state) {
    switch (state) {
      case State.SAVING:
        this._editComponent.updateData({
          isDisabled: true,
          isSaving: true
        });
        break;
      case State.DELETING:
        this._editComponent.updateData({
          isDisabled: true,
          isDeleting: true
        });
        break;
      case State.ABORTING:
        const resetFormState = () => {
          this._editComponent.updateData({
            isDisabled: false,
            isSaving: false,
            isDeleting: false
          });
        };
        this._component.shake(resetFormState);
        this._editComponent.shake(resetFormState);
        break;
    }
  }

  destroy() {
    remove(this._component);
    remove(this._editComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
      this._replaceFormToEvent();
    }
  }

  _replaceEventToForm() {
    replace(this._editComponent, this._component);
    this._changeMode();
    this._mode = Mode.EDITING;
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _replaceFormToEvent() {
    replace(this._component, this._editComponent);
    this._mode = Mode.DEFAULT;
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleRollupPoint() {
    this._replaceEventToForm();
  }

  _handleRollupPointEdit() {
    this._editComponent.reset(this._card);
    this._replaceFormToEvent();
  }

  _handleSubmitPointEdit(editedPoint) {
    const isPatchUpdate = isDatesEqual(this._card.startDate, editedPoint.startDate);

    this._changeData(
        UserAction.UPDATE_POINT,
        isPatchUpdate ? UpdateType.PATCH : UpdateType.MINOR,
        editedPoint
    );
    this._replaceFormToEvent();
  }

  _handleDeletePointEdit() {
    this._changeData(
        UserAction.DELETE_POINT,
        UpdateType.MINOR,
        this._card
    );
  }

  _handleFavoriteClick(isFavorite) {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._card,
            {
              isFavorite
            }
        )
    );
  }

  _escKeyDownHandler(evt) {
    if (isEscapeEvent(evt)) {
      evt.preventDefault();
      this._editComponent.reset(this._card);
      this._replaceFormToEvent();
    }
  }
}
