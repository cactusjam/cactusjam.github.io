'use strict';
(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var avatarChooser = document.querySelector('#avatar');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var defaultAvatar = avatarPreview.src;
  var imageChooser = document.querySelector('#images');
  var imagePreview = document.querySelector('.ad-form__photo');

  function isTrueImg(file) {
    var fileName = file.name.toLowerCase();
    return FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
  }

  function imageInputChangeHandler() {
    var file = imageChooser.files[0];

    if (isTrueImg(file)) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        var img = document.createElement('img');
        img.src = reader.result;
        img.style = 'max-width: 100%;';
        imagePreview.appendChild(img);
      });

      reader.readAsDataURL(file);
    }
  }

  function avatarInputChangeHandler() {
    var file = avatarChooser.files[0];

    if (isTrueImg(file)) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        avatarPreview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  }

  function activateImgLoader() {
    imageChooser.addEventListener('change', imageInputChangeHandler);
    avatarChooser.addEventListener('change', avatarInputChangeHandler);
  }

  function disableImgLoader() {
    imageChooser.removeEventListener('change', imageInputChangeHandler);
    avatarChooser.removeEventListener('change', avatarInputChangeHandler);
    avatarPreview.src = defaultAvatar;
    imagePreview.innerHTML = '';
  }

  window.imgLoader = {
    activate: activateImgLoader,
    disable: disableImgLoader
  };
})();
