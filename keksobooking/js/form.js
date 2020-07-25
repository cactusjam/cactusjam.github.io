'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var adFormFieldset = adForm.querySelectorAll('fieldset');
  var adFormSubmit = adForm.querySelector('.ad-form__submit');
  var buttonReset = adForm.querySelector('.ad-form__reset');
  var main = document.querySelector('main');
  var adFormAddress = adForm.querySelector('#address');
  var adFormRooms = adForm.querySelector('#room_number');
  var adFormGuests = adForm.querySelector('#capacity');
  var houseType = adForm.querySelector('#type');
  var rentPrice = adForm.querySelector('#price');
  var timeIn = adForm.querySelector('#timein');
  var timeOut = adForm.querySelector('#timeout');
  var successPopupTemplate = document.querySelector('#success')
    .content
    .querySelector('.success');
  var errorPopupTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');

  var placeType = {
    flat: {
      label: 'Квартира',
      minPrice: 1000
    },
    bungalo: {
      label: 'Бунгало',
      minPrice: 0
    },
    house: {
      label: 'Дом',
      minPrice: 5000
    },
    palace: {
      label: 'Дворец',
      minPrice: 10000
    }
  };

  function onHouseTypeChange(event) {
    var target = event.target;
    var minAmount = placeType[target.value].minPrice;
    rentPrice.min = minAmount;
    rentPrice.placeholder = minAmount;
  }
  houseType.addEventListener('change', onHouseTypeChange);

  function priceValidityCheckHandler() {
    var minAmount = placeType[houseType.value].minPrice;
    if (rentPrice.value < minAmount) {
      rentPrice.setCustomValidity('Для данного типа жилья минимальная цена должна быть больше');
    } else {
      rentPrice.setCustomValidity('');
    }
  }
  rentPrice.addEventListener('change', priceValidityCheckHandler);

  function addFormListener() {
    adFormSubmit.addEventListener('click', adFormSubmitClickHandler);
  }

  function removeFormListener() {
    adFormSubmit.removeEventListener('click', adFormSubmitClickHandler);
  }

  function addressCoords(coords) {
    adFormAddress.value = coords.x + ', ' + coords.y;
  }

  function enableForm() {
    if (adForm.classList.contains('ad-form--disabled')) {
      adForm.classList.remove('ad-form--disabled');
      window.util.toggleElementsDisabled(adFormFieldset, false);
      window.imgLoader.activate();
      addressCoords(window.pin.coords(true));
      addFormListener();
    }
  }

  function disableForm() {
    adForm.classList.add('ad-form--disabled');
    window.util.toggleElementsDisabled(adFormFieldset, true);
    adForm.reset();
    window.imgLoader.disable();
    addressCoords(window.pin.defaultCoords());
    removeFormListener();
  }
  disableForm();

  function roomValidityCheckHandler() {
    var roomsValue = Number(adFormRooms.value);
    var guestsValue = Number(adFormGuests.value);
    if (roomsValue === 100 && guestsValue !== 0) {
      adFormGuests.setCustomValidity('Возможен только вариант размещения "Не для гостей"');
    } else if (guestsValue > roomsValue) {
      adFormGuests.setCustomValidity('Недостаточно спальных мест для указанного количества гостей');
    } else if (guestsValue === 0 && roomsValue !== 100) {
      adFormGuests.setCustomValidity('Минимальное количество гостей - 1');
    } else {
      adFormGuests.setCustomValidity('');
    }
  }

  adFormRooms.addEventListener('change', roomValidityCheckHandler);
  adFormGuests.addEventListener('change', roomValidityCheckHandler);

  function adFormSubmitClickHandler() {
    roomValidityCheckHandler();
  }

  function createSuccessfulMessage() {
    var successMessagePopup = successPopupTemplate.cloneNode(true);
    main.appendChild(successMessagePopup);
    window.util.setRemoveOnclick(successMessagePopup);
    window.util.setCloseOnEsc(successMessagePopup);
  }

  function createErrorMessage() {
    var errorMessage = errorPopupTemplate.cloneNode(true);
    main.appendChild(errorMessage);

    window.util.setRemoveOnclick(errorMessage);
    window.util.setCloseOnEsc(errorMessage);
  }

  function formSuccessSendHandler() {
    createSuccessfulMessage();
    disableForm();
    window.map.disable();
  }

  adForm.addEventListener('submit', function (evt) {
    window.backend.upload(
        new FormData(adForm),
        formSuccessSendHandler,
        createErrorMessage
    );
    evt.preventDefault();
  });

  buttonReset.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    if (evt.which === 1) {
      disableForm();
      window.map.disable();
    }
  });

  timeIn.addEventListener('change', function () {
    timeOut.value = timeIn.value;
  });

  timeOut.addEventListener('change', function () {
    timeIn.value = timeOut.value;
  });

  window.form = {
    enable: enableForm,
    placeType: placeType,
    addressCoords: addressCoords
  };
})();
