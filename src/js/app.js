import ImageManager from './ImageManager';

const manager = new ImageManager(
  document.querySelector('.form-container'),
  document.querySelector('.images-container'),
);

manager.bindToDOM();
