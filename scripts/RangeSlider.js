const rootSelector = '[data-js-range-slider]';

class RangeSlider {
  selectors = {
    maxInput: '[data-js-range-slider-max]',
    minInput: '[data-js-range-slider-min]',
    control: '[data-js-range-slider-control]',

    handleLower: '.noUi-handle-lower',
    handleUpper: '.noUi-handle-upper',
  }

  attributes = {
    ariaLabelledby: 'aria-labelledby',
    value: 'value',
    min: 'min',
    max: 'max',
  }

  constructor(rootElement) {
    this.rootElement = rootElement;
    this.maxInputElement = this.rootElement.querySelector(this.selectors.maxInput);
    this.minInputElement = this.rootElement.querySelector(this.selectors.minInput);

    this.controlElement = rootElement.querySelector(this.selectors.control);

    this.minCurrentValue = Number(this.minInputElement.getAttribute(this.attributes.value));
    this.maxCurrentValue = Number(this.maxInputElement.getAttribute(this.attributes.value));
    this.minValue = Number(this.minInputElement.getAttribute(this.attributes.min));
    this.maxValue = Number(this.maxInputElement.getAttribute(this.attributes.max));
    this.minInitialValue = Number(this.minInputElement.value);
    this.maxInitialValue = Number(this.maxInputElement.value);
    this.ariaLabelMin = this.minInputElement.getAttribute(this.attributes.ariaLabelledby);
    this.ariaLabelMax = this.maxInputElement.getAttribute(this.attributes.ariaLabelledby);

    this.maxInputLength = 6;

    this.rangeSliderOption = {
      start: [this.minCurrentValue, this.maxCurrentValue],
      connect: true,
      step: 1,
      range: {
        'min': this.minValue,
        'max': this.maxValue
      },
      
      ariaFormat: wNumb({
        decimals: 0
      }),
    }
    noUiSlider.create(this.controlElement, this.rangeSliderOption);

    this.handleLowerElement = this.rootElement.querySelector(this.selectors.handleLower);
    this.handleUpperElement = this.rootElement.querySelector(this.selectors.handleUpper); 
    this.handleLowerElement.setAttribute('aria-labelledby', this.ariaLabelMin);
    this.handleUpperElement.setAttribute('aria-labelledby', this.ariaLabelMax);

    this.bindEvents();
  }

  onControlDragStart = () => {
    document.body.style.cursor = "grabbing";

    this.minInputElement.style.pointerEvents = 'none';
    this.maxInputElement.style.pointerEvents = 'none';
  }

  onControlDragEnd = () => {
    this.minInputElement.style.pointerEvents = 'auto';
    this.maxInputElement.style.pointerEvents = 'auto';
  }

  onMaxInputInput = (event) => {
    if (event.target.value == '') {
      event.target.value = this.maxCurrentValue;
    } else {
      this.maxCurrentValue = event.target.value;
    }
     
    if (event.target.value.length > this.maxInputLength) {
      event.target.value = event.target.value.slice(0, this.maxInputLength);
    }
  }

  onMinInputInput = (event) => {
    if (event.target.value == '') {
      event.target.value = this.minCurrentValue;
    } else {
      this.minCurrentValue = event.target.value;
    }
     
    if (event.target.value.length > this.maxInputLength) {
      event.target.value = event.target.value.slice(0, this.maxInputLength);
    }
  }

  onMaxInputChange = (event) => {
    if (event.target.value === '') {
      event.target.value = this.maxCurrentValue;
    } else {
      this.minCurrentValue = event.target.value;
      this.controlElement.noUiSlider.set([null, Number(event.target.value)]);
    }
  }

  onMinInputChange = (event) => {
    if (event.target.value === '') {
      event.target.value = this.minCurrentValue;
    } else {
      this.maxCurrentValue = event.target.value;
      this.controlElement.noUiSlider.set([Number(event.target.value), null]);
    }
  }

  onSliderUpdate = (values, handle) => {
    if (handle === 0) {
      this.minCurrentValue = Math.round(values[0]);
      this.minInputElement.value = Math.round(values[0]);
    } else {
      this.maxCurrentValue = Math.round(values[1]);
      this.maxInputElement.value = Math.round(values[1]);
    }
  }

  onInputFocus = (event) => {
    event.target.select();
  }

  onDocumentReset = (event) => {
    if (event.target.contains(this.rootElement)) {     
      this.controlElement.noUiSlider.set([this.minInitialValue, this.maxInitialValue]);
      
      requestAnimationFrame(() => {
        this.controlElement.noUiSlider.set([this.minInitialValue, this.maxInitialValue]);
      });
    };
  }

  bindEvents() {
    this.controlElement.noUiSlider.on('update', this.onSliderUpdate);
    this.controlElement.noUiSlider.on('start', this.onControlDragStart);
    this.controlElement.noUiSlider.on('end', this.onControlDragEnd);

    this.maxInputElement.addEventListener('input', this.onMaxInputInput);
    this.minInputElement.addEventListener('input', this.onMinInputInput);

    this.maxInputElement.addEventListener('change', this.onMaxInputChange);
    this.minInputElement.addEventListener('change', this.onMinInputChange);

    this.maxInputElement.addEventListener('focus', this.onInputFocus);
    this.minInputElement.addEventListener('focus', this.onInputFocus);

    document.addEventListener('reset', this.onDocumentReset);
  }
}

class RangeSliderCollection {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new RangeSlider(element);
    })
  }
}

export default RangeSliderCollection;