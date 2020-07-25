'use strict';

(function () {
  var MAX_RENDERED_PINS_COUNT = 5;
  var pinSize = {
    HEIGHT: 70,
    WIDTH: 50
  };
  var mapPinMain = {
    WIDTH: 62 / 2,
    HEIGHT: 62,
    POINTER: 14,
    START_LEFT: 570,
    START_TOP: 375
  };
  var pin = document.querySelector('#pin').content.querySelector('.map__pin');
  var mainPin = document.querySelector('.map__pin--main');

  function createPin(adv) {
    var mapPin = pin.cloneNode(true);
    var pinImage = mapPin.querySelector('img');
    mapPin.dataset.id = adv.id;
    mapPin.style.left = adv.location.x - pinSize.WIDTH + 'px';
    mapPin.style.top = adv.location.y - pinSize.HEIGHT + 'px';
    pinImage.alt = adv.offer.title;
    pinImage.src = adv.author.avatar;
    return mapPin;
  }

  function renderPins(offers) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < MAX_RENDERED_PINS_COUNT; i++) {
      if (offers[i]) {
        var createdPin = createPin(offers[i]);
        fragment.appendChild(createdPin);
      }
    }
    return fragment;
  }

  function removePins() {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    pins.forEach(function (item) {
      item.remove();
    });
  }

  document.addEventListener('click', pinClickHandler);

  function pinClickHandler(event) {
    var target = event.target;
    var isClickOnPin = target.classList.contains('map__pin');
    var closestPin = target.closest('.map__pin');
    var id;
    if (isClickOnPin) {
      id = target.dataset.id;
    }
    if (closestPin) {
      id = closestPin.dataset.id;
    }
    if (id) {
      var targetAdv = window.map.offers.find(function (adv) {
        return adv.id === Number(id);
      });
      window.card.remove();
      window.card.render(targetAdv);
    }
  }

  mainPin.addEventListener('mousedown', function (evt) {
    function mouseUpHandler(upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    }
    if (evt.which === 1) {
      var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      window.form.enable();
      window.map.enable();
    }

    function mouseMoveHandler(moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var mainPinPosition = {
        x: mainPin.offsetLeft - shift.x,
        y: mainPin.offsetTop - shift.y
      };

      var Border = {
        TOP: window.map.size.yMin - mapPinMain.HEIGHT - mapPinMain.POINTER,
        BOTTOM: window.map.size.yMax - mapPinMain.HEIGHT - mapPinMain.POINTER,
        LEFT: window.map.size.xMin - mapPinMain.WIDTH,
        RIGHT: window.map.size.xMax - mapPinMain.WIDTH
      };

      if (mainPinPosition.x >= Border.LEFT && mainPinPosition.x <= Border.RIGHT) {
        mainPin.style.left = mainPinPosition.x + 'px';
      }
      if (mainPinPosition.y >= Border.TOP && mainPinPosition.y <= Border.BOTTOM) {
        mainPin.style.top = mainPinPosition.y + 'px';
      }
      window.form.addressCoords(getMapPinMainCoords(true));
    }
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });

  mainPin.addEventListener('keydown', function (evt) {
    if (window.util.isEnterKey(evt)) {
      window.form.enable();
      window.map.enable();
    }
  });

  function getMapPinMainCoords(active) {
    var pointerCoord = active === true ? mapPinMain.HEIGHT / 2 + mapPinMain.POINTER : 0;
    var coordX = mainPin.offsetLeft + mapPinMain.WIDTH;
    var coordY = mainPin.offsetTop + mapPinMain.HEIGHT / 2 + pointerCoord;

    return {
      x: coordX,
      y: coordY
    };
  }

  function getMainPinDefaultCoords() {
    return {
      x: mapPinMain.START_LEFT + mapPinMain.WIDTH,
      y: mapPinMain.START_TOP + mapPinMain.HEIGHT / 2
    };
  }

  function centerTheMainPin() {
    mainPin.style.left = mapPinMain.START_LEFT + 'px';
    mainPin.style.top = mapPinMain.START_TOP + 'px';
  }

  window.pin = {
    coords: getMapPinMainCoords,
    remove: removePins,
    renderList: renderPins,
    centerTheElement: centerTheMainPin,
    defaultCoords: getMainPinDefaultCoords
  };
})();
