import FilterView from "../view/filters";
import {render, replace, remove, RenderPosition} from "../utils/dom.js";
import {UpdateType, FilterType} from "../constants.js";
import {filterTypeToPoints} from "../utils/filter.js";

export default class Filter {
  constructor(container, tripModel, model) {
    this._container = container;
    this._tripModel = tripModel;
    this._model = model;
    this._current = null;

    this._component = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleTypeChange = this._handleTypeChange.bind(this);

    this._model.addObserver(this._handleModelEvent);
    this._tripModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._current = this._model.get();
    const prevComponent = this._component;
    const currentFilters = this._getFilters();

    this._component = new FilterView(this._current, currentFilters);
    this._component.setTypeChangeHandler(this._handleTypeChange);

    if (prevComponent === null) {
      render(this._container, this._component, RenderPosition.AFTER_END);
      return;
    }

    replace(this._component, prevComponent);
    remove(prevComponent);
  }

  _getFilters() {
    const points = this._tripModel.get();
    const currentDate = new Date();
    const filters = {};

    Object
      .values(FilterType)
      .forEach((filterTitle) => {
        const isFilteredTasksExist = filterTypeToPoints[filterTitle](points, currentDate).length > 0;
        filters[filterTitle] = isFilteredTasksExist;
      });

    return filters;
  }

  _handleModelEvent() {
    this.init();
  }

  _handleTypeChange(type) {
    if (this._current === type) {
      return;
    }

    this._model.set(UpdateType.MINOR, type);
  }
}
