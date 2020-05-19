var navHead = document.querySelector(".page-header__nav");
var navBtn = document.querySelector(".page-header__btn");

// ----- меню в шапке-----

navHead.classList.remove("page-header__nav--nojs");

navBtn.addEventListener("click", function () {
  if (navHead.classList.contains("page-header__nav--closed")) {
    navHead.classList.remove("page-header__nav--closed");
    navHead.classList.add("page-header__nav--opened");
  } else {
    navHead.classList.add("page-header__nav--closed");
    navHead.classList.remove("page-header__nav--opened");
  }
});

// ------отправка формы-----

var popup = document.querySelector(".popup");
var form = document.querySelector(".review-form");

if (form) {
  var link = document.querySelector(".review-form__btn");
  var errorPopup = document.querySelector(".popup--mistake");
  var successPopup = document.querySelector(".popup--done");

  link.addEventListener("click", function (evt) {
    event.preventDefault();

    if (form.checkValidity()) {
      successPopup.classList.add("popup__show");
      form.reset()
    } else {
      errorPopup.classList.add("popup__show");
    }
  });

  var errorBtn = errorPopup.querySelector(".popup__btn--ok");

  errorBtn.addEventListener("click", function (event) {
    event.preventDefault();
    errorPopup.classList.remove("popup__show");
  })

  var successBtn = successPopup.querySelector(".popup__btn--close");

  successBtn.addEventListener("click", function (event) {
    event.preventDefault();
    successPopup.classList.remove("popup__show");
  })
}


// -----map---------
var mapjs = document.querySelector(".map__location");

if (mapjs) {
  mapjs.classList.remove("map__location--nojs");
}
