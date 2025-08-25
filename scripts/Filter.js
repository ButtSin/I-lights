const rootSelector = '[data-js-filter]';

class Filter {
  selectors = {
    button: '[data-js-filter-button]',
    modal: '[data-js-filter-modal]',
    heading: '[data-js-filter-modal-heading]',
    focusableElements: 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  }

  stateClasses = {
    isActive: 'is-active',
  }

  attributes = {
    role: 'role',
    ariaModal: 'aria-modal',
    ariaLabel: 'aria-label',
    ariaHidden: 'aria-hidden',
    ariaExpanded: 'aria-Expanded',
    title: 'title',
  }

  constructor(rootElement) {
    this.rootElement = rootElement;
    this.buttonElement = this.rootElement.querySelector(this.selectors.button);
    this.modalElement = this.rootElement.querySelector(this.selectors.modal);
    this.modalHeadingElement = this.rootElement.querySelector(this.selectors.heading);
    this.focusableElements = this.rootElement.querySelectorAll(this.selectors.focusableElements);
    this.previousActiveElement = null;

    this.mediaInitDialog = window.matchMedia(`(max-width: 768px)`);

    this.bindEvents();
  }

  onButtonClick = () => {
    const isActiveButton = this.modalElement.classList.contains(this.stateClasses.isActive);

    this.buttonElement.setAttribute(this.attributes.ariaExpanded, isActiveButton ? 'false' : 'true');
    this.buttonElement.classList.toggle(this.stateClasses.isActive);

    if (!isActiveButton) {
      this.previousActiveElement = document.activeElement;
      this.buttonElement.setAttribute(this.attributes.ariaLabel, 'Закрыть диалоговое окно с фильтром');
      this.buttonElement.setAttribute(this.attributes.title, 'Закрыть диалоговое окно с фильтром');
      this.openModal();
    } else {
      this.buttonElement.setAttribute(this.attributes.ariaLabel, 'Открыть диалоговое окно с фильтром');
      this.buttonElement.setAttribute(this.attributes.title, 'Открыть диалоговое окно с фильтром')
      this.closeModal();
    }
  }

  openModal() {
    this.modalElement.classList.add(this.stateClasses.isActive);
    this.modalElement.setAttribute(this.attributes.ariaModal, 'true');
    this.modalElement.setAttribute(this.attributes.role, 'dialog');
    this.modalHeadingElement.setAttribute(this.attributes.ariaHidden, 'false');
    
    document.addEventListener('keydown', this.onModalKeyDown);
  }

  closeModal() {
    this.modalElement.classList.remove(this.stateClasses.isActive);
    this.modalElement.removeAttribute(this.attributes.role);
    this.modalElement.removeAttribute(this.attributes.ariaModal);
    this.modalHeadingElement.setAttribute(this.attributes.ariaHidden, 'true');
    
    if (this.previousActiveElement) {
      this.previousActiveElement.focus();
    }

    document.removeEventListener('keydown', this.onModalKeyDown);
  }

  onModalKeyDown = (event) => {
    if (!this.modalElement.classList.contains(this.stateClasses.isActive)) return;

    switch(event.key) {
      case 'Tab': 
        if (this.focusableElements.length === 0) {
          event.preventDefault();
          return;
        }
        
        if (event.shiftKey && document.activeElement === this.focusableElements[0] || 
        event.shiftKey && document.activeElement && document.activeElement == this.modalElement) {
          event.preventDefault();
          this.focusableElements[this.focusableElements.length - 1].focus();
        } 
        else if (!event.shiftKey && 
        document.activeElement === this.focusableElements[this.focusableElements.length - 1]) {
          event.preventDefault();
          this.focusableElements[0].focus();
        }

        break;
        
      case 'Escape':
        this.onButtonClick();
        break;
    }
  }

  onButtonKeyDown = (event) => {
    if (event.key === ' ' || event.key === 'Enter') {
      const buttonElementRect = this.buttonElement.getBoundingClientRect();

      if (buttonElementRect.bottom < 0) {
        this.buttonElement.scrollIntoView();
      }
    }
  }

  onMediaInitDialogChange = (event) => {
    if (event.matches) {
      this.modalElement.setAttribute(this.attributes.role, 'dialog');
      this.modalHeadingElement.setAttribute(this.attributes.ariaHidden, 'false');
    } else {
      this.modalElement.removeAttribute(this.attributes.role);
      this.modalElement.removeAttribute(this.attributes.ariaModal);
      this.modalHeadingElement.setAttribute(this.attributes.ariaHidden, 'true');
    } 
  }

  bindEvents() {
    this.buttonElement.addEventListener('click', this.onButtonClick);
    this.buttonElement.addEventListener('keydown', this.onButtonKeyDown);

    this.mediaInitDialog.addEventListener('change', this.onMediaInitDialogChange);
    this.onMediaInitDialogChange(this.mediaInitDialog);
  }
}

class FilterCollection {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new Filter(element);
    })
  }
}

export default FilterCollection;