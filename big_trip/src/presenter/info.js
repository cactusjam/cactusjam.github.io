import TripInfoView from "../view/trip-info.js";
import {render, RenderPosition, replace, remove} from "../utils/dom.js";
import {getRoute, getTripDateDuration, getTotalTripCost} from "../utils/info.js";
import {sortEventsByDate} from "../utils/utils.js";

export default class Info {
  constructor(container, pointsModel, filterModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;

    this._component = null;
    this._tripComponent = null;
    this._tripDuration = [];
    this._tripCities = [];
    this._tripCost = 0;

    this._updateViews = this._updateViews.bind(this);
    this._pointsModel.addObserver(this._updateViews);
    this._filterModel.addObserver(this._updateViews);
  }
  init() {
    this._getInfo();
    this._renderInfo();
  }

  _getInfo() {
    const newPoints = this._pointsModel.get().slice();
    const points = newPoints.sort(sortEventsByDate);

    this._tripCities = getRoute(points);
    this._tripDuration = getTripDateDuration(points);
    this._tripCost = getTotalTripCost(points);
  }

  _renderInfo() {
    const prevComponent = this._tripComponent;

    this._component = new TripInfoView(this._tripCities, this._tripDuration, this._tripCost);

    if (prevComponent === null) {
      this._tripComponent = this._component;
      render(this._container, this._component, RenderPosition.AFTER_BEGIN);
      return;
    }

    this._tripComponent = this._component;
    replace(this._component, prevComponent);
    remove(prevComponent);
  }

  _updateViews() {
    this.init();
  }
}
