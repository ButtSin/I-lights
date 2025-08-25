import BaseComponent from "./BaseComponent.js";

const rootSelector = '[data-js-gallery]';

class Gallery extends BaseComponent {
  selectors = {
    image: '[data-js-gallery-image]',
    button: '[data-js-gallery-button]',
  }

  stateClasses = {
    isActive: 'is-active',
  }

  stateAttributes = {
    ariaPressed: 'aria-pressed',
  }

  dataAttributes = {
    imageSrc: 'jsGalleryImageSrc',
    imageAlt: 'jsGalleryImageAlt',
  }

  constructor(rootElement) {
    super();

    this.rootElement = rootElement;
    this.imageElement = this.rootElement.querySelector(this.selectors.image);
    this.buttonElements = this.rootElement.querySelectorAll(this.selectors.button);
    this.state = this.getProxyState({
      activeImageIndex: [...this.buttonElements].findIndex((buttonElement) => 
        buttonElement.classList.contains(this.stateClasses.isActive))
    });

    this.bindEvents();
  }

  updateUI() {
    const {activeImageIndex} = this.state;

    this.buttonElements.forEach((buttonElement, index) => {
      const isActive = activeImageIndex === index;

      buttonElement.classList.toggle(this.stateClasses.isActive, isActive);
      buttonElement.setAttribute(this.stateAttributes.ariaPressed, isActive.toString());

      if (!isActive) return;

      const imageSrc = buttonElement.dataset[this.dataAttributes.imageSrc];
      const imageAlt = buttonElement.dataset[this.dataAttributes.imageAlt];

      this.imageElement.setAttribute('src', imageSrc);
      this.imageElement.setAttribute('alt', imageAlt);
    });
  }

  onButtonClick(buttonIndex) {
    this.state.activeImageIndex = buttonIndex;
  }

  bindEvents() {
    this.buttonElements.forEach((button, index) => { 
      button.addEventListener('click', () => this.onButtonClick(index));
    });
  }
}

class GalleryCollection {
  constructor() {
    this.init()
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new Gallery(element);
    })
  }
}

export default GalleryCollection;