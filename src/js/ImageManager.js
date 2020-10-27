import { url, runRequest } from './request';

export default class ImageManager {
  constructor(formContainer, imageContainer) {
    this.formContainer = formContainer;
    this.imageContainer = imageContainer;
  }

  static get ctrlId() {
    return {
      form: 'image-manager',
      file: 'file',
      container: 'image-manager-images',
      image: 'image',
    };
  }

  static get formSelector() {
    return `[data-widget=${this.ctrlId.form}]`;
  }

  static get fileInputSelector() {
    return `[data-id=${this.ctrlId.file}]`;
  }

  static get containerSelector() {
    return `[data-widget=${this.ctrlId.container}]`;
  }

  static get imageSelector() {
    return `[data-id=${this.ctrlId.image}]`;
  }

  async bindToDOM() {
    this.formContainer.innerHTML = `
      <form data-widget="${this.constructor.ctrlId.form}">
        <label>Drag and Drop files here or Click to select</label>
        <input type="file" name="file" data-id="${this.constructor.ctrlId.file}" multiple>
      </form>  
    `;
    this.form = this.formContainer.querySelector(this.constructor.formSelector);
    this.fileInput = this.form.querySelector(this.constructor.fileInputSelector);

    this.imageContainer.innerHTML = `
      <div data-widget="${this.constructor.ctrlId.container}">
      </div>  
    `;
    this.container = this.imageContainer.querySelector(this.constructor.containerSelector);

    await this.loadImages();

    this.form.addEventListener('click', () => {
      this.fileInput.dispatchEvent(new MouseEvent('click'));
    });

    this.fileInput.addEventListener('change', (event) => this.addImages(event.target.files));

    this.form.addEventListener('dragover', (event) => event.preventDefault());

    this.form.addEventListener('drop', (event) => {
      event.preventDefault();
      this.addImages(event.dataTransfer.files);
    });
  }

  async loadImages() {
    let images;

    const params = {
      data: {
        method: 'allImages',
      },
      responseType: 'json',
      method: 'GET',
    };

    try {
      images = await runRequest(params);
    } catch (error) {
      alert(error);
      throw (error);
    }

    this.redraw(images);
  }

  redraw(images) {
    this.container.innerHTML = '';
    images.forEach(({ id, name }) => {
      const imageEl = document.createElement('div');
      imageEl.dataset.id = this.constructor.ctrlId.image;
      imageEl.innerHTML = `
        <img src="" alt="нет картинки" height="100">
        <p data-id="${id}">&#x274C;</p>
      `;

      const image = imageEl.querySelector('img');
      image.src = `${url}\\${name}`;

      this.container.appendChild(imageEl);

      image.addEventListener('load', () => {
        imageEl.querySelector('p').addEventListener('click', () => this.deleteImage(id));
      });

      image.addEventListener('error', () => this.deleteImage(id));
    });
  }

  async addImages(files) {
    let images;

    const data = { method: 'addImages' };
    files.forEach((file, i) => {
      data[`f${i}`] = file;
    });

    const params = {
      data,
      responseType: 'json',
      method: 'POST',
    };

    try {
      images = await runRequest(params);
    } catch (error) {
      alert(error);
      throw (error);
    }

    this.redraw(images);
  }

  async deleteImage(id) {
    let images;

    const params = {
      data: {
        method: 'deleteImage',
        id,
      },
      responseType: 'json',
      method: 'POST',
    };

    try {
      images = await runRequest(params);
    } catch (error) {
      alert(error);
      throw (error);
    }

    this.redraw(images);
  }
}
