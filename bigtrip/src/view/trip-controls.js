import AbstractView from "./abstract.js";
import {TabItem} from "../constants.js";

const ACTIVE_CLASS = `trip-tabs__btn--active`;

const createTripControlsTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn ${ACTIVE_CLASS}" data-value="${TabItem.TABLE}" href="#">Table</a>
    <a class="trip-tabs__btn" data-value="${TabItem.STATISTICS}" href="#">Stats</a>
    </nav>`
  );
};

export default class TripControls extends AbstractView {
  constructor() {
    super();

    this._menuItemClickHandler = this._menuItemClickHandler.bind(this);
  }

  getTemplate() {
    return createTripControlsTemplate();
  }

  setMenuItem(tabsItem) {
    const element = this.getElement();
    const menuItems = element.querySelectorAll(`.trip-tabs__btn`);

    menuItems.forEach((item) => {
      if (item.classList.contains(ACTIVE_CLASS)) {
        item.classList.remove(ACTIVE_CLASS);
      }
    });

    const newActiveMenuItem = element.querySelector(`[data-value=${tabsItem}]`);
    if (newActiveMenuItem) {
      newActiveMenuItem.classList.add(ACTIVE_CLASS);
    }
  }

  setMenuItemClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuItemClickHandler);
  }

  _menuItemClickHandler(evt) {
    evt.preventDefault();
    const target = evt.target;
    if (target.tagName !== `A`
      || target.classList.contains(`trip-tabs__btn--active`)) {
      return;
    }

    this.setMenuItem(target.dataset.value);
    this._callback.menuClick(target.dataset.value);
  }
}
