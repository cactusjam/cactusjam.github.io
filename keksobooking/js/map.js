'use strict';
(function () {
  var map = document.querySelector('.map');
  var pinsContainer = document.querySelector('.map__pins');
  var mapItems = document.querySelectorAll('select, fieldset');
  var filterForm = document.querySelector('.map__filters');

  var mapSize = {
    yMin: 130,
    yMax: 630,
    xMin: 0,
    xMax: 1200
  };

  function DataLoadHandler(responseData) {
    responseData.forEach(function (adv, index) {
      adv.id = index + 1;
    });
    window.map.offers = responseData;
    window.filter.updatePins();
  }

  function updatePinsOnMap(filteredData) {
    var pinsMarkup = window.pin.renderList(filteredData);
    pinsContainer.appendChild(pinsMarkup);
  }

  function enableMap() {
    if (map.classList.contains('map--faded')) {
      window.backend.load(DataLoadHandler);
      map.classList.remove('map--faded');
      window.util.toggleElementsDisabled(mapItems, false);
    }
  }

  function disableMap() {
    if (!map.classList.contains('map--faded')) {
      map.classList.add('map--faded');
      window.util.toggleElementsDisabled(mapItems, true);
      window.pin.remove();
      filterForm.reset();
      window.pin.centerTheElement();
    }
  }

  disableMap();

  window.map = {
    size: mapSize,
    element: map,
    enable: enableMap,
    disable: disableMap,
    pinsContainer: pinsContainer,
    updatePins: updatePinsOnMap,
    filterForm: filterForm
  };
})();
