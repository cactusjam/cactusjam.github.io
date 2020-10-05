import {KeyboardKey} from "../constants.js";

const isEscapeEvent = (evt) => {
  return (evt.key === KeyboardKey.ESCAPE || evt.key === KeyboardKey.ESCAPE_IE);
};

export {isEscapeEvent};
