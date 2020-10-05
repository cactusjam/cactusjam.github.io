import Observer from "../utils/observer.js";

const getPointIndex = (points, point) => points.findIndex((item) => item.id === point.id);
export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
    this._destinations = [];
    this._offers = {};
  }

  set(updateType, points) {
    this._points = points.slice();
    this._notify(updateType);
  }

  setDestinations(destinations) {
    this._destinations = destinations.slice();
  }

  setOffers(offers) {
    this._offers = offers;
  }

  getOffers() {
    return this._offers;
  }

  get() {
    return this._points;
  }

  getDestinations() {
    return this._destinations;
  }

  update(updateType, update) {
    const index = getPointIndex(this._points, update);

    if (index === -1) {
      throw new Error(`Can't update unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  add(updateType, update) {
    this._points = [
      update,
      ...this._points
    ];

    this._notify(updateType, update);
  }

  delete(updateType, update) {
    const index = getPointIndex(this._points, update);

    if (index === -1) {
      throw new Error(`Can't delete unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType);
  }

  static adaptToClient(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          price: point.base_price,
          destination: {
            name: point.destination.name,
            description: point.destination.description,
            photos: point.destination.pictures.map((picture) => ({
              href: picture.src,
              description: picture.description,
            }))
          },
          services: point.offers,
          startDate: new Date(point.date_from),
          endDate: new Date(point.date_to),
          isFavorite: point.is_favorite,
        }
    );

    delete adaptedPoint.base_price;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.is_favorite;
    delete adaptedPoint.offers;
    delete adaptedPoint.destination.pictures;

    return adaptedPoint;
  }

  static adaptOffersToClient(offers) {
    return offers.reduce((mapOffer, offer) => {
      mapOffer[offer.type] = offer.offers;
      return mapOffer;
    }, {});
  }

  static adaptOffersToServer(offers) {
    return Object
        .keys(offers)
        .map((key) => ({
          type: key,
          offers: offers[key],
        }));
  }

  static adaptToServer(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          "base_price": point.price,
          "date_from": point.startDate.toISOString(),
          "date_to": point.endDate.toISOString(),
          "is_favorite": point.isFavorite,
          "offers": point.services,
          "destination": {
            "name": point.destination.name,
            "description": point.destination.description,
            "pictures": point.destination.photos.map((photo) => ({
              "src": photo.href,
              "description": photo.description,
            }))
          }
        }
    );

    delete adaptedPoint.price;
    delete adaptedPoint.startDate;
    delete adaptedPoint.endDate;
    delete adaptedPoint.destination.photos;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }
}
