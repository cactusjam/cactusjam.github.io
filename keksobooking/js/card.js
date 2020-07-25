'use strict';

(function () {

  var cardTemplate = document.querySelector('#card')
    .content
    .querySelector('.map__card');

  function renderAdvertCard(advertData) {
    var card = cardTemplate.cloneNode(true);
    var popupClose = card.querySelector('.popup__close');
    var cardPrice = card.querySelector('.popup__text--price');
    var cardTime = card.querySelector('.popup__text--time');
    var cardDescription = card.querySelector('.popup__description');
    card.querySelector('.popup__avatar').src = advertData.author.avatar;
    card.querySelector('.popup__title').textContent = advertData.offer.title;
    card.querySelector('.popup__text--address').textContent = advertData.offer.address;
    card.querySelector('.popup__type').textContent = window.form.placeType[advertData.offer.type].label;
    card.querySelector('.popup__text--capacity').textContent = advertData.offer.rooms + ' комнаты для ' + advertData.offer.guests + ' гостей';

    addCardPhotos(card, advertData);
    addCardFeatures(card, advertData);

    if (advertData.offer.price) {
      cardPrice.textContent = advertData.offer.price + ' ₽/ночь';
    } else {
      cardPrice.remove();
    }

    if (advertData.offer.checkin && advertData.offer.checkout) {
      cardTime.textContent = 'Заезд после ' + advertData.offer.checkin + ', выезд до ' + advertData.offer.checkout;
    } else {
      cardTime.remove();
    }

    if (advertData.offer.description) {
      cardDescription.textContent = advertData.offer.description;
    } else {
      cardDescription.remove();
    }

    window.map.element.insertAdjacentElement('afterbegin', card);

    popupClose.addEventListener('click', function () {
      removeCard();
    });
  }

  function addCardFeatures(card, advertData) {
    var popupFeatures = card.querySelector('.popup__features');
    var featuresFragment = document.createDocumentFragment();

    if (advertData.offer.features.length) {
      popupFeatures.innerHTML = '';
      advertData.offer.features.forEach(function (feature) {
        var featureItem = document.createElement('li');
        featureItem.classList = 'popup__feature popup__feature--' + feature;
        featuresFragment.appendChild(featureItem);
      });
      popupFeatures.appendChild(featuresFragment);
    } else {
      popupFeatures.remove();
    }
  }

  function addCardPhotos(card, advertData) {
    var cardsPhotoCollection = card.querySelector('.popup__photos');
    var popupPhoto = card.querySelector('.popup__photo');
    if (advertData.offer.photos.length) {
      popupPhoto.src = advertData.offer.photos[0];

      advertData.offer.photos.forEach(function (photo) {
        var newPhotoImg = popupPhoto.cloneNode(true);
        newPhotoImg.src = photo;
        cardsPhotoCollection.appendChild(newPhotoImg);
      });
    } else {
      popupPhoto.remove();
    }
  }

  document.addEventListener('keydown', function (evt) {
    if (window.util.isEscKey(evt)) {
      removeCard();
    }
  });

  function removeCard() {
    var card = document.querySelector('.popup');
    if (card) {
      document.removeEventListener('keydown', window.util.isEscKey);
      card.remove();
    }
  }

  window.card = {
    render: renderAdvertCard,
    remove: removeCard
  };
})();
