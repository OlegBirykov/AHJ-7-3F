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

  bindToDOM() {
    this.formContainer.innerHTML = `
      <form data-widget="${this.constructor.ctrlId.form}">
        <label>Drag and Drop files here or Click to select</label>
        <input type="file" data-id="${this.constructor.ctrlId.file}" multiple>
      </form>  
    `;
    this.form = this.formContainer.querySelector(this.constructor.formSelector);
    this.fileInput = this.form.querySelector(this.constructor.fileInputSelector);

    this.imageContainer.innerHTML = `
      <div data-widget="${this.constructor.ctrlId.container}">
      </div>  
    `;
    this.container = this.imageContainer.querySelector(this.constructor.containerSelector);

    this.form.addEventListener('click', () => {
      this.fileInput.dispatchEvent(new MouseEvent('click'));
    });

    this.fileInput.addEventListener('change', (event) => this.addImage(Array.from(event.target.files)));

    this.form.addEventListener('dragover', (event) => event.preventDefault());

    this.form.addEventListener('drop', (event) => {
      event.preventDefault();
      this.addImage(Array.from(event.dataTransfer.files));
    });
  }

  addImage(files) {
    if (!files) {
      return;
    }
    files.forEach((file) => {
      const imageEl = document.createElement('div');
      imageEl.dataset.id = this.constructor.ctrlId.image;
      imageEl.innerHTML = `
        <img src="" alt="нет картинки" height="100">
        <p>&#x274C;</p>
      `;

      const image = imageEl.querySelector('img');
      image.src = URL.createObjectURL(file);

      this.container.appendChild(imageEl);

      image.addEventListener('load', () => {
        URL.revokeObjectURL(image.src);
        imageEl.querySelector('p').addEventListener('click', () => imageEl.remove());
      });

      image.addEventListener('error', () => imageEl.remove());
    });
  }
}
