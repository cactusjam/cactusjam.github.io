import AbstractView from "./abstract.js";
import {TabItem} from "../constants.js";

const createTripEventButtonTemplate = () => {
  return (
    `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" data-value="${TabItem.NEW_POINT}">New event</button>`
  );
};

export default class EventAddButton extends AbstractView {
  constructor() {
    super();

    this._menuItemClickHandler = this._menuItemClickHandler.bind(this);
  }

  getTemplate() {
    return createTripEventButtonTemplate();
  }

  setDisabled(value) {
    this.getElement().disabled = value;
  }

  _menuItemClickHandler(evt) {
    evt.preventDefault();
    const currentActive = evt.target;
    this._callback.menuClick(currentActive.dataset.value);
  }

  setMenuItemClickHandler(callback) {
    this._callback.menuClick = callback;

    this.getElement().addEventListener(`click`, this._menuItemClickHandler);
  }
}
