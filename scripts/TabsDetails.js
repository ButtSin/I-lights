import BaseComponent from './BaseComponent.js'

const rootSelector = '[data-js-tabs-details]';

class TabsDetails extends BaseComponent {
  selectors = {
    root: rootSelector,
    button: '[data-js-tabs-details-button]',
    content: '[data-js-tabs-details-content]',
    link: '[data-js-tabs-details-link]',  
    image: '[data-js-tabs-details-image]',
    gallery: '[data-js-tabs-details-gallery]',
    galleryHeading: '[data-js-tabs-details-gallery-heading]',
    imageDescription: '[data-js-tabs-details-image-description]', 
    imageLink: '[data-js-tabs-details-image-link]',
  }

  stateClasses = {
    isActive: 'is-active',
  }

  stateAttributes = {
    ariaSelected: 'aria-selected',
    ariaExpanded: 'aria-expanded',
    ariaLabelledby: 'aria-labelledby',
    ariaHidden: 'aria-hidden',
    tabIndex: 'tabIndex',
    alt: 'alt',
    src: 'src',
    href: 'href',
  }

  galleryData = {
    "details-track": [
      {
        alt: "Светильник трековый модель A1",
        src: "./images/tabs/lamp.webp",
        description: "Arco",
        href: "/products/track-a1"
      },
      {
        alt: "Светильник трековый модель B2",
        src: "./images/tabs/lamp.webp",
        description: "Evo M",
        href: "/products/track-b2"
      },
      {
        alt: "Светильник трековый модель C3",
        src: "./images/tabs/lamp.webp",
        description: "Evo L",
        href: "/products/track-c3"
      },
      {
        alt: "Светильник трековый модель D4",
        src: "./images/tabs/lamp.webp",
        description: "Alfa",
        href: "/products/track-d4"
      }
    ],
    "details-armstrong": [
      {
        alt: "Светильник Армстронг модель X5",
        src: "./images/tabs/lamp2.webp",
        description: "Армстронг X5",
        href: "/products/armstrong-x5"
      },
      {
        alt: "Светильник Армстронг модель Y6",
        src: "./images/tabs/lamp.webp",
        description: "Армстронг Y6",
        href: "/products/armstrong-y6"
      },
      {
        alt: "Светильник Армстронг модель Z7",
        src: "./images/tabs/lamp2.webp",
        description: "Армстронг Z7",
        href: "/products/armstrong-z7"
      },
      {
        alt: "Светильник Армстронг модель W8",
        src: "./images/tabs/lamp.webp",
        description: "Армстронг W8",
        href: "/products/armstrong-w8"
      }
    ],
    "details-uniform-armstrong": [
      {
        alt: "Светильник Армстронг Uniform модель U1",
        src: "./images/tabs/lamp2.webp",
        description: "Uniform U1",
        href: "/products/uniform-u1"
      },
      {
        alt: "Светильник Армстронг Uniform модель U2",
        src: "./images/tabs/lamp2.webp",
        description: "Uniform U2",
        href: "/products/uniform-u2"
      },
      {
        alt: "Светильник Армстронг Uniform модель U3",
        src: "./images/tabs/lamp2.webp",
        description: "Uniform U3",
        href: "/products/uniform-u3"
      },
      {
        alt: "Светильник Армстронг Uniform модель U4",
        src: "./images/tabs/lamp2.webp",
        description: "Uniform U4",
        href: "/products/uniform-u4"
      }
    ],
    "details-figured": [
      {
        alt: "Фигурный светильник Fancy 101",
        src: "./images/tabs/lamp2.webp",
        description: "Fancy 101",
        href: "/products/fancy-101"
      },
      {
        alt: "Фигурный светильник Fancy 202",
        src: "./images/tabs/lamp2.webp",
        description: "Fancy 202",
        href: "/products/fancy-202"
      },
      {
        alt: "Фигурный светильник Fancy 303",
        src: "./images/tabs/lamp.webp",
        description: "Fancy 303",
        href: "/products/fancy-303"
      },
      {
        alt: "Фигурный светильник Fancy 404",
        src: "./images/tabs/lamp2.webp",
        description: "Fancy 404",
        href: "/products/fancy-404"
      }
    ],
    "details-recessed": [
      {
        alt: "Встраиваемый светильник Recess R1",
        src: "./images/tabs/lamp.webp",
        description: "Recess R1",
        href: "/products/recess-r1"
      },
      {
        alt: "Встраиваемый светильник Recess R2",
        src: "./images/tabs/lamp2.webp",
        description: "Recess R2",
        href: "/products/recess-r2"
      },
      {
        alt: "Встраиваемый светильник Recess R3",
        src: "./images/tabs/lamp2.webp",
        description: "Recess R3",
        href: "/products/recess-r3"
      },
      {
        alt: "Встраиваемый светильник Recess R4",
        src: "./images/tabs/lamp2.webp",
        description: "Recess R4",
        href: "/products/recess-r4"
      }
    ]
  }

  constructor(rootElement) {
    super();

    this.rootElement = rootElement;
    this.galleryElement = this.rootElement.querySelector(this.selectors.gallery);
    this.galleryHeadingElement = this.rootElement.querySelector(this.selectors.galleryHeading);
    this.buttonElements = this.rootElement.querySelectorAll(this.selectors.button);
    this.contentElements = this.rootElement.querySelectorAll(this.selectors.content);
    this.linkElements = this.rootElement.querySelectorAll(this.selectors.link);
    this.imageElements = this.rootElement.querySelectorAll(this.selectors.image);
    this.imageDescriptionsElements = this.rootElement.querySelectorAll(this.selectors.imageDescription);
    this.imageLinkElements = this.rootElement.querySelectorAll(this.selectors.imageLink);
    
    this.state = this.getProxyState({
      activeTabIndex: [...this.buttonElements].findIndex((buttonElement) =>
        buttonElement.classList.contains(this.stateClasses.isActive)), 
    });
    this.limitTabsIndex = this.buttonElements.length - 1;

    this.bindEvents(); 
  }

  updateUI() {
    this.updateTabs();
    this.updateGallery();
  }

  updateTabs() {
    const {activeTabIndex} = this.state;

    this.buttonElements.forEach((buttonElement, index) => {
      const isActive = index === activeTabIndex;

      buttonElement.classList.toggle(this.stateClasses.isActive, isActive);
      buttonElement.setAttribute(this.stateAttributes.ariaSelected, isActive.toString());
      buttonElement.setAttribute(this.stateAttributes.ariaExpanded, isActive.toString());
      buttonElement.setAttribute(this.stateAttributes.tabIndex, isActive ? '0' : '-1');

      this.contentElements[index].setAttribute(this.stateAttributes.ariaHidden, isActive ? 'false' : 'true');
    });
    
    this.linkElements.forEach((linkElement, index) => {
      const isActive = index === activeTabIndex;

      if (isActive) linkElement.setAttribute(this.stateAttributes.tabIndex, '0');
      else linkElement.setAttribute(this.stateAttributes.tabIndex, '-1');
    });
  }

  updateGallery() {
    const activeButtonId = this.buttonElements[this.state.activeTabIndex].id;

    this.galleryElement.setAttribute(this.stateAttributes.ariaLabelledby, this.galleryHeadingElement.id + " " +
      activeButtonId);

    this.imageElements.forEach((image, index) => {
      image.setAttribute(this.stateAttributes.src, this.galleryData[activeButtonId][index].src);
      image.setAttribute(this.stateAttributes.alt, this.galleryData[activeButtonId][index].alt);
    }); 

    this.imageDescriptionsElements.forEach((description, index) => {
      description.innerHTML = `<p>${this.galleryData[activeButtonId][index].description}</p>`;
    });

    this.imageLinkElements.forEach((link, index) => {
      link.setAttribute(this.stateAttributes.href, this.galleryData[activeButtonId][index].href);
    });
  }

  onButtonClick(buttonIndex) {
    this.state.activeTabIndex = buttonIndex;
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

  onKeyDown = (event) => {
    const {code, metaKey} = event;

    const action = {
      ArrowUp: this.previousTab,
      ArrowDown: this.nextTab,
      Home: this.firstTab,
      End: this.lastTab,
    }[code];

    const isMacHomeKey = metaKey && code === 'ArrowTop';
    if (isMacHomeKey) {
      this.firstTab();
      return;
    }

    const isMacEndKey = metaKey && code === 'ArrowDown';
    if (isMacEndKey) {
      this.lastTab();
      return;
    }

    action?.(event);
  }

  bindEvents() {
    this.buttonElements.forEach((buttonElement, index) => {
      buttonElement.addEventListener('click', () => this.onButtonClick(index)); 
    });

    this.rootElement.addEventListener('keydown', this.onKeyDown);
  }
}

class TabsDetailsCollection {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll(rootSelector).forEach(element => {
      new TabsDetails(element); 
    });
  }
}

export default TabsDetailsCollection;