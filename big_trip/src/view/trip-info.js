import AbstractView from "./abstract.js";

const createTripInfoTemplate = (citiesInfo, durationInfo, finalAmount) => {
  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${citiesInfo}</h1>

        <p class="trip-info__dates">${durationInfo}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${finalAmount}</span>
      </p>
    </section>`
  );
};

export default class TripInfo extends AbstractView {
  constructor(citiesInfo, durationInfo, finalAmount) {
    super();

    this._citiesInfo = citiesInfo;
    this._durationInfo = durationInfo;
    this._finalAmount = finalAmount;

  }
  getTemplate() {
    return createTripInfoTemplate(this._citiesInfo, this._durationInfo, this._finalAmount);
  }
}
