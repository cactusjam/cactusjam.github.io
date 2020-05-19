var navMain = document.querySelector('.header-nav');
var navToggle = document.querySelector('.header-nav__toggle');
var modal = document.querySelector('.modal-overlay');
var btnAdd = document.querySelectorAll('.btn--add');

navMain.classList.remove('header-nav--nojs');

navToggle.addEventListener('click', function () {
  if (navMain.classList.contains('header-nav--closed')) {
    navMain.classList.remove('header-nav--closed');
    navMain.classList.add('header-nav--opened');
  } else {
    navMain.classList.add('header-nav--closed');
    navMain.classList.remove('header-nav--opened');
  }
});


// ------заказать-----------

for (var i = 0; i < btnAdd.length; i++) {
  btnAdd[i].addEventListener("click", function () {
    event.preventDefault();
    modal.classList.add('modal-overlay--open');
  })
}

window.addEventListener("keydown", function (evt) {
  if (evt.keyCode === 27 && modal.classList.contains("modal-overlay--open")) {
    evt.preventDefault();
    modal.classList.remove("modal-overlay--open");
  }
});

// ------ карта --------
var mapIp = document.querySelector('.map__ip');
if (mapIp) {
  mapIp.classList.remove('map__ip--nojs');
}

if (document.querySelector('.map')) {
  var imgMap = document.querySelector('.map__wrapper');

  function initMap() {
    var coordinates = {
        lat: 59.9385794,
        lng: 30.3230152
      },
      markerImg = '../img/icon-map-pin.svg',

      map = new google.maps.Map(document.getElementById('google-map'), {
        zoom: 17,
        center: coordinates
      });

    marker = new google.maps.Marker({
      position: coordinates,
      map: map,
      animation: google.maps.Animation.DROP,
      icon: markerImg
    });
  }

  function hideImgMap() {
    imgMap.classList.add('map__wrapper--hidden');
  }

  window.onload = hideImgMap;
  window.addEventListener("load", initMap);
}
