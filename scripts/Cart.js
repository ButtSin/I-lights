const rootSelector = '[data-js-cart]';

class Cart {
  selectors = {
    input: '[data-js-cart-input]',

    form: '[data-js-cart-form]',
    formMail: '[data-js-cart-form-mail]',
    formCalc: '[data-js-cart-form-calc]',

    dialogMailThanks: '[data-js-cart-dialog-mail-thanks]',
    dialogCalcThanks: '[data-js-cart-dialog-calc-thanks]',
  }

  styleSelectors = {
    dialog: 'dialog',
  }

  attributes = {
    min: 'min',
    max: 'max',
    value: 'value',
  }

  constructor(rootElement) {
    this.rootElement = rootElement;
    this.inputElements = this.rootElement.querySelectorAll(this.selectors.input);
    this.inputElementsData = new Map();
    this.inputElements.forEach(input => {
      this.inputElementsData.set(input, {
        min: input.getAttribute(this.attributes.min),
        max: input.getAttribute(this.attributes.max),
        value: input.getAttribute(this.attributes.value),
        maxLength: input.getAttribute(this.attributes.max).length,
      });
    });

    this.mainFormElement = this.rootElement.querySelector(this.selectors.form);
    this.mailFormElement = this.rootElement.querySelector(this.selectors.formMail);
    this.calcFormElement = this.rootElement.querySelector(this.selectors.formCalc);

    this.mailDialogThanksElement = this.rootElement.querySelector(this.selectors.dialogMailThanks);
    this.calcDialogThanksElement = this.rootElement.querySelector(this.selectors.dialogCalcThanks);

    this.bindEvents();
  }

  onInputInput = (event) => {
    const currentInput = event.currentTarget;
    let currentValue = currentInput.value;

    if (currentValue === '') { 
      currentInput.value = this.inputElementsData.get(currentInput).value;
      return;
    }
    
    this.inputElementsData.get(currentInput).value = currentValue;    
  }

  onInputChange = (event) => {
    const currentInput = event.currentTarget;
    const maxValue = this.inputElementsData.get(currentInput).max;
    const minValue = this.inputElementsData.get(currentInput).min;
    const maxLength = this.inputElementsData.get(currentInput).maxLength;

    let currentValue = currentInput.value;

    if (currentValue.length > maxLength) {
      currentValue = currentValue.slice(0, maxLength);;    
    }

    if (currentValue > maxValue) currentValue = maxValue;
    if (currentValue < minValue) currentValue = minValue;
      
    currentInput.value = currentValue;
    this.inputElementsData.get(currentInput).value = currentInput.value
  }

  onInputFocus = (event) => {
    event.target.select();
  }

  getFormsData(event) {
    const cartData = new FormData(this.mainFormElement);
    const thisData = new FormData(event.currentTarget);

    const allData = new URLSearchParams([
      ...cartData.entries(), 
      ...thisData.entries(),
    ]);

    return allData;
  } 

  onMailFormSubmit = (event) => {
    event.preventDefault(); 

    const currentDialog = event.currentTarget.closest(this.styleSelectors.dialog);

    if (!this.mainFormElement.checkValidity()) {
      currentDialog.close();
      this.mainFormElement.reportValidity();
      return;
    }

    // fetch('', {
    //   method: '',
    //   body: this.getFormsData(event),
    // });...

    currentDialog.close();
    this.mailDialogThanksElement.showModal();
  }

  onCalcFormSubmit = (event) => {
    event.preventDefault(); 

    const currentDialog = event.currentTarget.closest(this.styleSelectors.dialog);

    if (!this.mainFormElement.checkValidity()) {
      currentDialog.close();
      this.mainFormElement.reportValidity();
      return;
    }

    // fetch('', {
    //   method: '',
    //   body: this.getFormsData(event),
    // });...

    currentDialog.close();
    this.calcDialogThanksElement.showModal();
  }

  bindEvents() {
    this.mailFormElement.addEventListener('submit', this.onMailFormSubmit);
    this.calcFormElement.addEventListener('submit', this.onCalcFormSubmit)

    this.inputElements.forEach(element => {
      element.addEventListener('focus', this.onInputFocus);
      element.addEventListener('input', this.onInputInput);
      element.addEventListener('change', this.onInputChange);
    })
  }
}

class CartCollection {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new Cart(element);
    })
  }
}

export default CartCollection;