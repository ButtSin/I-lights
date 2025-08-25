const rootSelector = '[data-js-shadow]'

class Shadow {
  selectors = {
    root: rootSelector,
  }

  styleClasses = {
    shadow: 'fade',
  }

  constructor({
    rootElement, 
    heightShadowPercentage = 70, 
    startHideShadowPercent = 1, 
    endHideShadowPercent = 5,
    resetMediaQuery = null}) {

    this.rootElement = rootElement;

    this.containerStyles = getComputedStyle(rootElement);
    this.containerPaddingTop = parseInt(this.containerStyles.paddingTop);
    this.containerPaddingLeft = parseInt(this.containerStyles.paddingLeft);
    this.containerPaddingBottom = parseInt(this.containerStyles.paddingBottom);
    this.containerPaddingRight = parseInt(this.containerStyles.paddingRight);

    this.heightShadowPercentage = heightShadowPercentage;
    this.startHideShadowPercent = startHideShadowPercent;
    this.endHideShadowPercent = endHideShadowPercent;

    this.resetMediaQuery = resetMediaQuery;

    this.init();
  }

  init() {
    this.createShadow();

    this.bindEvents();
  }

  createShadow() {
    this.shadow = document.createElement('div');
    this.shadow.style.width = `calc(100% - ${this.containerPaddingRight} - ${this.containerPaddingLeft})`; 
    this.shadow.style.height = `${(this.rootElement.clientHeight * this.heightShadowPercentage) / 100}px`;
    this.shadow.style.marginTop = `-${this.shadow.style.height}`;
    this.shadow.style.position = 'sticky';
    this.shadow.style.flexShrink = 0;
    this.shadow.classList.add(this.styleClasses.shadow);
    this.shadow.style.bottom = 0;

    if (this.rootElement.scrollHeight > this.rootElement.clientHeight || this.resetMediaQuery) 
      this.rootElement.append(this.shadow);
  }

  updateOpacity = () => {
    const scrollStartHidePosition = this.rootElement.scrollHeight / 100 * this.startHideShadowPercent;
    const scrollEndHidePosition = this.rootElement.scrollHeight / 100 * this.endHideShadowPercent;

    const progress = Math.min(1, Math.max(0, (this.rootElement.scrollTop - scrollStartHidePosition) / 
      (scrollEndHidePosition - scrollStartHidePosition)));

    this.shadow.style.opacity = 1 - progress;
  }

  resetMediaMin = (event) => {
    if (event.matches) {
      this.shadow.hidden = false;
    } else {
      this.shadow.hidden = true;
    }
  }

  resetMediaMax = (event) => {
    if (event.matches) {
      this.shadow.hidden = true;
    } else {
      this.shadow.hidden = false;
    }
  }

  bindEvents() {
    if (!this.rootElement.contains(this.shadow)) return; 
      
    this.rootElement.addEventListener('scroll', this.updateOpacity);

    if (!this.resetMediaQuery) return;

    const mediaQueryMin = window.matchMedia(`(min-width: ${this.resetMediaQuery})`);
    const mediaQueryMax = window.matchMedia(`(max-width: ${this.resetMediaQuery})`);

    mediaQueryMin.addEventListener('change', this.resetMediaMin);
    mediaQueryMax.addEventListener('change', this.resetMediaMax);
    
    this.resetMediaMin(mediaQueryMin);
    this.resetMediaMax(mediaQueryMax);
  }
}

class ShadowCollection {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {

      let resetMediaQuery = null;

      for (let attrName in element.dataset) {
        let indexMediaQuery = attrName.indexOf('-');

        if (indexMediaQuery === -1) continue;

        resetMediaQuery = attrName.slice(indexMediaQuery + 1);
      }

      const options = {
        rootElement: element,
        resetMediaQuery
      };

      new Shadow(options);
    })
  }
}

export default ShadowCollection;