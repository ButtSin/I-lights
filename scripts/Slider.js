const rootSelector = '[data-js-slider-swiper]';

class Slider {
  selectors = {
    previousButton: '[data-js-slider-previous-button]',
    nextButton: '[data-js-slider-next-button]',
    pagination: '[data-js-slider-pagination]',
    thumb: '[data-js-slider-thumbs]',
    slide: '[data-js-slider-slide]',
    scrollable: '[data-js-slider-scrollable]',
    shadow: '.fade',
  }

  dataAttributes = {
    sliderProduct: 'data-js-slider-swiper-alt',
  }

  constructor(rootElement) {
    this.rootElement = rootElement;
    this.previousButtonElement = this.rootElement.querySelector(this.selectors.previousButton);
    this.nextButtonElement = this.rootElement.querySelector(this.selectors.nextButton);
    this.paginationElement = this.rootElement.querySelector(this.selectors.pagination);
    this.slideElements = this.rootElement.querySelectorAll(this.selectors.slide);
    this.scrollableElements = this.rootElement.querySelectorAll(this.selectors.scrollable);
    this.thumbElement = this.rootElement.querySelector(this.selectors.thumb);

    this.isSliderAlt = this.rootElement.hasAttribute(this.dataAttributes.sliderProduct);
    
    this.init();
  }

  init() {
    let context = this;
    let thumbSwiper = null;

    if (context.isSliderAlt) {
      thumbSwiper = new Swiper(this.thumbElement, {
        direction: 'vertical',
        slidesPerView: 3,
        spaceBetween: 6,
        loop: true,
    
        freeMode: {
          sticky: true,
        },

        breakpoints: {
          500.98: {
            slidesPerView: 4,
            spaceBetween: 8,

            freeMode: {
              sticky: true,
            },
          },

          924.98: {
            slidesPerView: 5,
            spaceBetween: 10,

            freeMode: {
              enabled: true,
              sticky: false,
            },
          }
        },

      on: {
        slideChangeTransitionEnd: this.updateShadowOpacity.bind(context),
        
        breakpoint: (swiper) => { 
          if (swiper.currentBreakpoint === '500.98' || swiper.currentBreakpoint === 'max') {
            swiper.changeDirection('horizontal');
          } else {
            swiper.changeDirection('vertical');
          }
        }
      },
      });
    }


    new Swiper(this.rootElement, {
      direction: context.isSliderAlt ? 'vertical' : 'horizontal',
      loop: true,
      simulateTouch: false,
      speed: 600,
      slidesPerView: 1,

      pagination: {
        el: this.selectors.pagination,
        clickable: true,
      },

      navigation: {
        nextEl: this.selectors.nextButton,
        prevEl: this.selectors.previousButton,
      },

      keyboard: {
        enabled: true,
        onlyInViewport: true
      },

      thumbs: {
        swiper: thumbSwiper,
      },

      autoplay: {
        delay: 5000, 
        disableOnInteraction: true,
      },

      a11y: {
        nextSlideMessage: 'Следующий слайд',
        prevSlideMessage: 'Предыдущий слайд',

        paginationBulletMessage: 'Перейти к слайду {{index}}',

        firstSlideMessage: 'Это первый слайд',
        lastSlideMessage: 'Это последний слайд',
      },

      breakpoints: {
        924.98: {
          direction: 'horizontal',
        }
      },

      on: {
        slideChangeTransitionEnd: this.updateShadowOpacity.bind(context),
        
        breakpoint: (swiper) => { 
          if (!context.isSliderAlt) return;

          if (swiper.currentBreakpoint === '924' || swiper.currentBreakpoint === 'max') {
            swiper.changeDirection('horizontal');
          } else {
            swiper.changeDirection('vertical');
          }
        }
      }
    });
  }

  updateShadowOpacity = () => {
    [...this.scrollableElements].forEach(element => {
      element.scrollTop = 0;
    });
  }
}

class SliderCollection {
  constructor() {
    this.init()
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new Slider(element);
    })
  }
}

export default SliderCollection;