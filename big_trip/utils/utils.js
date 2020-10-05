import {TypeParticle, ACTIVITY_TYPES} from "../constants.js";

const getTypeParticle = (type) => ACTIVITY_TYPES.includes(type)
  ? TypeParticle.ACTIVITY
  : TypeParticle.TRANSFER;

const getFirstUpperCase = (element) => element[0].toUpperCase() + element.slice(1);

const sortEventsByPrice = (priceA, priceB) => {
  return priceB.price - priceA.price;
};

const sortEventsByTime = (eventA, eventB) => {
  const duration = (eventB.endDate - eventB.startDate) - (eventA.endDate - eventA.startDate);

  return duration;
};

const sortEventsByDate = (eventA, eventB) => {
  return eventA.startDate - eventB.startDate;
};

const adaptDestinationsToClient = (pointDestinations) =>
  pointDestinations.map((pointDestination) => ({
    name: pointDestination.name,
    description: pointDestination.description,
    photos: pointDestination.pictures.map((picture) => ({
      href: picture.src,
      description: picture.description,
    }))
  }));

export {getTypeParticle, getFirstUpperCase, sortEventsByPrice, sortEventsByTime, sortEventsByDate, adaptDestinationsToClient};
