'use strict';

(function () {

  function toggleElementsDisabled(elements, state) {
    elements.forEach(function (select) {
      select.disabled = state;
    });
  }

  function isEscKey(evt) {
    return evt.key === 'Escape';
  }

  function isEnterKey(evt) {
    return evt.key === 'Enter';
  }

  function setRemoveOnclick(element) {
    document.addEventListener('click', function () {
      element.remove();
    });
  }

  function setCloseOnEsc(element) {
    document.addEventListener('keydown', function (evt) {
      if (window.util.isEscKey(evt)) {
        element.remove();
      }
    });
  }

  window.util = {
    toggleElementsDisabled: toggleElementsDisabled,
    isEscKey: isEscKey,
    isEnterKey: isEnterKey,
    setRemoveOnclick: setRemoveOnclick,
    setCloseOnEsc: setCloseOnEsc
  };
})();
