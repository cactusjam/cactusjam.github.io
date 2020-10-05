import {nanoid} from "nanoid";
import PointsModel from "../model/points";

const getSyncedPoints = (points) => {
  return points.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const getStoreStructure = (items) => {
  return items.reduce((point, current) => {
    return Object.assign(
        {},
        point,
        {
          [current.id]: current,
        });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._syncRequired = false;
  }

  get syncRequired() {
    return this._syncRequired;
  }

  set syncRequired(value) {
    this._syncRequired = value;
    this._store.syncRequired = value;
  }

  getPoints() {
    if (Provider.isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          const items = getStoreStructure(points.map(PointsModel.adaptToServer));
          this._store.setPoints(items);
          return points;
        });
    }

    const storePoints = Object.values(this._store.getPoints());

    return Promise.resolve(storePoints.map(PointsModel.adaptToClient));
  }

  getDestinations() {
    if (Provider.isOnline()) {
      return this._api.getDestinations()
         .then((destinations) => {
           this._store.setDestinations(destinations);
           return destinations;
         });
    }

    const storeDestinations = this._store.getDestinations();

    return Promise.resolve(storeDestinations);
  }

  getOffers() {
    if (Provider.isOnline()) {
      return this._api.getOffers()
         .then((offers) => {
           this._store.setOffers(offers);
           return offers;
         });
    }

    const storeOffers = Object.values(this._store.getOffers());

    return Promise.resolve(storeOffers);
  }

  updatePoint(point) {
    if (Provider.isOnline()) {
      return this._api.updatePoint(point)
        .then((updatedPoint) => {
          this._store.setPoint(updatedPoint.id, PointsModel.adaptToServer(updatedPoint));
          return updatedPoint;
        });
    }

    this._store.setPoint(
        point.id,
        PointsModel.adaptToServer(
            Object.assign(
                {},
                point
            )
        )
    );

    return Promise.resolve(point);
  }

  addPoint(point) {
    if (Provider.isOnline()) {
      return this._api.addPoint(point)
        .then((newPoint) => {
          this._store.setPoint(newPoint.id, PointsModel.adaptToServer(newPoint));
          return newPoint;
        });
    }

    const localNewPointId = nanoid();
    const localNewPoint = Object.assign(
        {},
        point,
        {
          id: localNewPointId
        }
    );

    this._store.setPoint(localNewPoint.id, PointsModel.adaptToServer(localNewPoint));

    return Promise.resolve(localNewPoint);
  }

  deletePoint(point) {
    if (Provider.isOnline()) {
      return this._api.deletePoint(point)
        .then(() => this._store.deletePoint(point.id));
    }

    this._store.deletePoint(point.id);

    return Promise.resolve();
  }

  sync() {
    if (Provider.isOnline()) {
      const storePoints = Object.values(this._store.getSyncRequired());

      return this._api.sync(storePoints)
        .then((response) => {
          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);

          const points = getStoreStructure([...createdPoints, ...updatedPoints]);

          this.syncRequired = false;

          this._store.setPoints(points);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  static isOnline() {
    return window.navigator.onLine;
  }
}
