import StatisticsView from "../view/statistics.js";
import {render, RenderPosition, remove} from "../utils/dom.js";

export default class Statistics {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._component = null;
  }

  init() {
    if (this._component !== null) {
      this.destroy();
    }

    this._component = new StatisticsView(this._pointsModel.get());
    render(this._container, this._component, RenderPosition.AFTER_END);
  }

  destroy() {
    remove(this._component);
    this._component = null;
  }
}
