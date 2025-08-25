import BaseComponent from './BaseComponent.js';

const rootSelector = '[data-js-tabs]';

class Tabs extends BaseComponent {
  selectors = {
    root: rootSelector,
    button: '[data-js-tabs-button]',
    buttonsContainer: '[data-js-tabs-buttons-container]',
    content: '[data-js-tabs-content]',

    image: '[data-js-tabs-gallery-image]',
    imageButton: '[data-js-tabs-gallery-image-button]',
    mainImage: '[data-js-tabs-gallery-image-main]',
    gallery: '[data-js-tabs-gallery]',
  }

  stateClasses = {
    isActive: 'is-active',
    button: 'button',
  }

  stateAttributes = {
    ariaLabelledby: 'aria-labelledby',
    ariaPressed: 'aria-pressed',
    ariaSelected: 'aria-selected',
    tabIndex: 'tabindex',
    alt: 'alt',
    src: 'src',
    href: 'href',
  }

  attributes = {
    ariaOrientation: 'aria-orientation',
  }

  galleryData = {
    "tab-1-1": [
      {
        alt: "Миниатюра магазина 1 с осветительными приборами от i-lights",
        src: "./images/about-company/gallery-1.webp",
        active: true,
      },
      {
        alt: "Миниатюра магазина 2 с осветительными приборами от i-lights",
        src: "./images/about-company/gallery-1.webp",
        active: false,
      },
      {
        alt: "Миниатюра магазина 3 с осветительными приборами от i-lights",
        src: "./images/about-company/gallery-1.webp",
        active: false,
      },
    ],
    "tab-2-2": [
      {
        alt: "Миниатюра магазина 4 с осветительными приборами от i-lights",
        src: "./images/about-company/gallery-2.webp",
        active: true,
      },
      {
        alt: "Миниатюра магазина 5 с осветительными приборами от i-lights",
        src: "./images/about-company/gallery-1.webp",
        active: false,
      },
      {
        alt: "Миниатюра магазина 6 с осветительными приборами от i-lights",
        src: "./images/about-company/gallery-2.webp",
        active: false,
      },
    ],
    "tab-3-3": [
      {
        alt: "Миниатюра магазина 7 с осветительными приборами от i-lights",
        src: "./images/about-company/gallery-2.webp",
        active: true,
      },
      {
        alt: "Миниатюра магазина 8 с осветительными приборами от i-lights",
        src: "./images/about-company/gallery-2.webp",
        active: false,
      },
      {
        alt: "Миниатюра магазина 9 с осветительными приборами от i-lights",
        src: "./images/about-company/gallery-2.webp",
        active: false,
      },
    ],
    "tab-4-4": [
      {
        alt: "Миниатюра магазина 10 с осветительными приборами от i-lights",
        src: "./images/about-company/gallery-2.webp",
        active: true,
      },
      {
        alt: "Миниатюра магазина 11 с осветительными приборами от i-lights",
        src: "./images/about-company/gallery-2.webp",
        active: false,
      },
      {
        alt: "Миниатюра магазина 12 с осветительными приборами от i-lights",
        src: "./images/about-company/gallery-1.webp",
        active: false,
      },
    ],
    "tab-5-5": [
      {
        alt: "Миниатюра магазина 13 с осветительными приборами от i-lights",
        src: "./images/about-company/gallery-1.webp",
        active: true,
      },
      {
        alt: "Миниатюра магазина 14 с осветительными приборами от i-lights",
        src: "./images/about-company/gallery-2.webp",
        active: false,
      },
      {
        alt: "Миниатюра магазина 15 с осветительными приборами от i-lights",
        src: "./images/about-company/gallery-2.webp",
        active: false,
      },
    ],
    "tab-6-6": [
      {
        alt: "Миниатюра магазина 16 с осветительными приборами от i-lights",
        src: "./images/about-company/gallery-2.webp",
        active: true,
      },
      {
        alt: "Миниатюра магазина 17 с осветительными приборами от i-lights",
        src: "./images/about-company/gallery-2.webp",
        active: false,
      },
      {
        alt: "Миниатюра магазина 18 с осветительными приборами от i-lights",
        src: "./images/about-company/gallery-1.webp",
        active: false,
      },
    ],
  }

  constructor(rootElement) {
    super();

    this.rootElement = rootElement;
    this.buttonElements = this.rootElement.querySelectorAll(this.selectors.button);
    this.buttonsContainerElement = this.rootElement.querySelector(this.selectors.buttonsContainer);
    this.contentElements = this.rootElement.querySelectorAll(this.selectors.content);

    this.galleryElement = this.rootElement.querySelector(this.selectors.gallery);
    if (this.rootElement.contains(this.galleryElement)) {
      this.hasGallery = true;

      this.galleryImageElements = this.rootElement.querySelectorAll(this.selectors.image);
      this.galleryImageButtons = this.rootElement.querySelectorAll(this.selectors.imageButton);
      this.galleryMainImage = this.rootElement.querySelector(this.selectors.mainImage);
    } else this.hasGallery = false;

    this.state = this.getProxyState({
      activeTabIndex: [...this.buttonElements]
        .findIndex((buttonElement) => buttonElement.classList.contains(this.stateClasses.isActive)),
    });

    this.limitTabsIndex = this.buttonElements.length - 1;
    this.isVerticalTabs = this.buttonsContainerElement?.getAttribute(this.attributes.ariaOrientation);
    
    this.bindEvents();
  }

  updateUI() {
    this.updateTabs();

    if (this.hasGallery) this.updateGallery();
  }

  updateTabs() {
    const {activeTabIndex} = this.state;

    this.buttonElements.forEach((buttonElement, index) => {
      const isActive = index === activeTabIndex;

      buttonElement.classList.toggle(this.stateClasses.isActive, isActive);
      buttonElement.classList.toggle(this.stateClasses.button, isActive);
      buttonElement.setAttribute(this.stateAttributes.ariaSelected, 
        isActive.toString());
      buttonElement.setAttribute(this.stateAttributes.tabIndex, 
        isActive ? "0" : "-1");
    });

    if (!this.hasGallery) {
      this.contentElements.forEach((contentElement, index) => {
        const isActive = index === activeTabIndex;

        contentElement.classList.toggle(this.stateClasses.isActive, isActive);
      });
    }
  }

  updateGallery() {
    const activeButtonId = this.buttonElements[this.state.activeTabIndex].id;
    
    this.contentElements[0].setAttribute(this.stateAttributes.ariaLabelledby, activeButtonId);

    this.galleryImageElements.forEach((image, index) => {
      const isActive = this.galleryData[activeButtonId][index].active;
      
      image.setAttribute(this.stateAttributes.src, this.galleryData[activeButtonId][index].src);
      image.setAttribute(this.stateAttributes.alt, this.galleryData[activeButtonId][index].alt);

      this.galleryImageButtons[index].classList.toggle(this.stateClasses.isActive, isActive);

      if (isActive) {
        this.galleryMainImage.setAttribute(this.stateAttributes.src, this.galleryData[activeButtonId][index].src);
        this.galleryMainImage.setAttribute(this.stateAttributes.alt, 
          this.galleryData[activeButtonId][index].alt.replace('Миниатюра', 'Изображение'));
      }
    }); 
  }

  activateTab(newTabIndex) {
    this.state.activeTabIndex = newTabIndex;
    this.buttonElements[newTabIndex].focus();
  }

  previousTab = (event) => {
    const newTabIndex = this.state.activeTabIndex === 0
      ? this.limitTabsIndex
      : this.state.activeTabIndex - 1;
    
    event.preventDefault();

    this.activateTab(newTabIndex);
  }

  nextTab = (event) => {
    const newTabIndex = this.state.activeTabIndex === this.limitTabsIndex
      ? 0
      : this.state.activeTabIndex + 1;

    event.preventDefault();

    this.activateTab(newTabIndex);
  }

  firstTab = (event) => {
    event.preventDefault();

    this.activateTab(0);
  }

  lastTab = (event) => {
    event.preventDefault();

    this.activateTab(this.limitTabsIndex);
  }

  onButtonClick(buttonIndex) {
    this.state.activeTabIndex = buttonIndex;
  }

  onKeyDown = (event) => {
    const {code, metaKey} = event;

    const action = {
      ArrowLeft: this.previousTab,
      ArrowRight: this.nextTab,

      ArrowUp: this.previousTab,
      ArrowDown: this.nextTab,

      Home: this.firstTab,
      End: this.lastTab,
    }[code];

    const isMacHomeKey = metaKey && code === 'ArrowLeft' && !this.isVerticalTabs 
      || metaKey && code === 'ArrowUp' && this.isVerticalTabs;
    
    if (isMacHomeKey) {
      this.firstTab();
      return;
    }

    const isMacEndKey = metaKey && code === 'ArrowRight' && !this.isVerticalTabs 
      || metaKey && code === 'ArrowDown' && this.isVerticalTabs;

    if (isMacEndKey) {
      this.lastTab();
      return;
    }
    
    if (this.isVerticalTabs && code === 'ArrowUp' || this.isVerticalTabs && code ==='ArrowDown') action?.(event);
    if (!this.isVerticalTabs && code ==='ArrowLeft' || !this.isVerticalTabs && code ==='ArrowRight') action?.(event);
  }

  onButtonImageClick(indexTarget) {
    const {src, alt} = this.stateAttributes;

    const newMainSrc = this.galleryImageElements[indexTarget].getAttribute(src);
    const newMailAlt = this.galleryImageElements[indexTarget].getAttribute(alt);
    
    this.galleryMainImage.setAttribute(src, newMainSrc);
    this.galleryMainImage.setAttribute(alt, newMailAlt.replace('Миниатюра', 'Изображение'));

    this.galleryImageButtons.forEach((element, index) => {
      const isActive = indexTarget === index;
      const activeButtonId = this.buttonElements[this.state.activeTabIndex].id;
      const currentData = this.galleryData[activeButtonId];

      element.classList.toggle(this.stateClasses.isActive, isActive);
      element.setAttribute(this.stateAttributes.ariaPressed, isActive);

      currentData[index].active = isActive;
    });
  }

  bindEvents() {
    this.buttonElements.forEach((buttonElement, index) => {
      buttonElement.addEventListener('click', () => this.onButtonClick(index));
    });

    this.rootElement.addEventListener('keydown', this.onKeyDown);

    if (this.hasGallery) {
      this.galleryImageButtons.forEach((buttonElement, index) => {
        buttonElement.addEventListener('click', () => this.onButtonImageClick(index));
      });
    }
  }
}

class TabsCollection {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new Tabs(element);
    });
  }
}

export default TabsCollection;