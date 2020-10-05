import AbstractView from "../view/abstract.js";

const RenderPosition = {
  AFTER_BEGIN: `afterbegin`,
  BEFORE_END: `beforeend`,
  BEFORE_BEGIN: `beforebegin`,
  AFTER_END: `afterend`
};

const render = (container, element, position = RenderPosition.BEFORE_END) => {
  if (container instanceof AbstractView) {
    container = container.getElement();
  }

  if (element instanceof AbstractView) {
    element = element.getElement();
  }

  switch (position) {
    case RenderPosition.BEFORE_BEGIN:
      container.before(element);
      break;
    case RenderPosition.AFTER_BEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFORE_END:
      container.append(element);
      break;
    case RenderPosition.AFTER_END:
      container.after(element);
      break;
    default:
      throw new Error(`Unknown render position: ${position}`);
  }
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

const replace = (newChild, oldChild) => {
  if (oldChild instanceof AbstractView) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof AbstractView) {
    newChild = newChild.getElement();
  }

  oldChild.replaceWith(newChild);
};

const remove = (component) => {
  if (component === null) {
    return;
  }
  if (!(component instanceof AbstractView)) {
    throw new Error(`Can remove only components`);
  }

  component.getElement().remove();
  component.removeElement();
};

export {render, createElement, RenderPosition, replace, remove};
