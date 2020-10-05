import {StoreSubKey} from "../constants.js";

export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._key = key;
    this._syncRequired = false;
  }

  get syncRequired() {
    return this._syncRequired;
  }

  set syncRequired(value) {
    this._syncRequired = value;
  }

  getPoints() {
    return this._getItems()[StoreSubKey.POINTS];
  }

  getDestinations() {
    return this._getItems()[StoreSubKey.DESTINATIONS];
  }

  getOffers() {
    return this._getItems()[StoreSubKey.OFFERS];
  }

  getSyncRequired() {
    return this._getItems()[StoreSubKey.SYNC_REQUIRED];
  }

  setPoint(id, point) {
    const storedPoints = this.getPoints();

    this.setPoints(
        Object.assign(
            {},
            storedPoints,
            {
              [id]: point,
            }
        )
    );
  }

  setPoints(points) {
    if (this._syncRequired) {
      this._setItem(StoreSubKey.SYNC_REQUIRED, points);
    } else {
      this._setItem(StoreSubKey.POINTS, points);
    }
  }

  setOffers(offers) {
    this._setItem(StoreSubKey.OFFERS, offers);
  }

  setDestinations(destinations) {
    this._setItem(StoreSubKey.DESTINATIONS, destinations);
  }

  deletePoint(id) {
    const storedPoints = this.getPoints();
    delete storedPoints[id];
    this.setPoints(storedPoints);
  }

  _getItems() {
    try {
      return JSON.parse(
          this._storage.getItem(this._key)
      ) || {};
    } catch (error) {
      return {};
    }
  }

  _setItem(key, value) {
    const store = this._getItems();

    this._storage.setItem(
        this._key,
        JSON.stringify(
            Object.assign(
                {},
                store,
                {
                  [key]: value,
                }
            )
        )
    );
  }
}
