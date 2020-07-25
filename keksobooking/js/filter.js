'use strict';
(function () {
  var DEFAULT_FILTER_VALUE = 'any';
  var MAX_COUNT_PINS_ON_MAP = 5;
  var Price = {
    MIDDLE: 10000,
    HIGH: 50000
  };
  var filterForm = document.querySelector('.map__filters');
  var housingType = filterForm.querySelector('#housing-type');
  var housingPrice = filterForm.querySelector('#housing-price');
  var housingRooms = filterForm.querySelector('#housing-rooms');
  var housingGuests = filterForm.querySelector('#housing-guests');

  var HousingPriceType = {
    LOW: 'low',
    MIDDLE: 'middle',
    HIGH: 'high'
  };

  function filterByType(item) {
    return item.offer.type === housingType.value || housingType.value === DEFAULT_FILTER_VALUE;
  }

  function filterByPrice(item) {
    switch (housingPrice.value) {
      case HousingPriceType.LOW:
        return parseInt(item.offer.price, 10) < Price.MIDDLE;
      case HousingPriceType.MIDDLE:
        return parseInt(item.offer.price, 10) >= Price.MIDDLE && parseInt(item.offer.price, 10) < Price.HIGH;
      case HousingPriceType.HIGH:
        return parseInt(item.offer.price, 10) >= Price.HIGH;
      default:
        return true;
    }
  }

  function filterByRooms(item) {
    return Number(housingRooms.value) === item.offer.rooms || housingRooms.value === DEFAULT_FILTER_VALUE;
  }

  function filterByGuests(item) {
    return Number(housingGuests.value) === item.offer.guests || housingGuests.value === DEFAULT_FILTER_VALUE;
  }

  function filterByFeatures(item) {
    var checkedFeatures = filterForm.querySelectorAll('input:checked');

    return Array.from(checkedFeatures).every(function (feature) {
      return item.offer.features.includes(feature.value);
    });
  }

  function filterOffers(adverts) {
    var ads = [];
    for (var i = 0; i < adverts.length; i++) {
      var item = adverts[i];
      if (filterByType(item) &&
        filterByPrice(item) &&
        filterByRooms(item) &&
        filterByGuests(item) &&
        filterByFeatures(item)
      ) {
        ads.push(item);
      }
      if (ads.length === MAX_COUNT_PINS_ON_MAP) {
        break;
      }
    }
    return ads;
  }

  function updatePins() {
    var filtration = filterOffers(window.map.offers);
    window.map.updatePins(filtration);
  }

  filterForm.addEventListener('change', window.debounce(function () {
    window.card.remove();
    window.pin.remove();
    updatePins();
  }));

  window.filter = {
    run: filterOffers,
    updatePins: updatePins
  };
})();
