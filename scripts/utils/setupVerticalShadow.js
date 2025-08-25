function setupVerticalShadow({
  container = this,
  heightShadowPercentage = 100,
  startHideShadowPercent = 1,
  endHideShadowPercent = 5,
  shadowTop = 'auto',
  shadowBottom = 'auto',
  shadowClassName = 'shadow',
  simplebarUsed = false,
  resetMediaQuery = null, 
} = {}) {
  if (!(container instanceof HTMLElement)) {
    throw new Error('Container must be a valid HTMLElement.');
  }

  if (simplebarUsed) {
    container = container.querySelector('.simplebar-content-wrapper');
  }

  const containerStyles = getComputedStyle(container);
  const containerPaddingTop = parseInt(containerStyles.paddingTop);
  const containerPaddingLeft = parseInt(containerStyles.paddingLeft);
  const containerPaddingBottom = parseInt(containerStyles.paddingBottom);
  const containerPaddingRight = parseInt(containerStyles.paddingRight);

  const shadow = document.createElement('div');
  shadow.style.width = `${container.clientWidth - 
    containerPaddingRight - containerPaddingLeft}px`;
  shadow.style.height = `${(container.clientHeight * heightShadowPercentage) 
    / 100}px`;
  shadow.style.marginTop = `-${shadow.style.height}`;
  shadow.style.position = 'sticky';
  shadow.style.flexShrink = 0;
  shadow.classList.add(shadowClassName);

  if (shadowTop !== 'auto' && shadowBottom !== 'auto') throw new Error(
    'Either shadowTop or shadowBottom must be set.');
  shadow.style.top = shadowTop === 'auto' ? 'auto' : `${shadowTop 
    - containerPaddingTop}px`;
  shadow.style.bottom = shadowBottom === 'auto' ? 'auto' : `${shadowBottom 
    - containerPaddingBottom}px`;

  if (shadowTop !== 'auto') container.prepend(shadow);
  else container.append(shadow);
  
  const scrollStartHidePosition = container.scrollHeight 
    / 100 * startHideShadowPercent;
  const scrollEndHidePosition = container.scrollHeight 
    / 100 * endHideShadowPercent;

  const updateOpacity = () => {
    const progress = Math.min(1, Math.max(0, 
      (container.scrollTop - scrollStartHidePosition) 
      / (scrollEndHidePosition - scrollStartHidePosition)));
    shadow.style.opacity = 1 - progress;
  };

  container.addEventListener('scroll', updateOpacity);
  updateOpacity(); 

  if (!resetMediaQuery) return;

  const mediaQuery = window.matchMedia(resetMediaQuery);

  const resetFunction = () => {
    shadow.classList.remove(shadowClassName);
    console.log("f");
  }
  
  mediaQuery.addEventListener('chanch', resetFunction);
  handleTabletChange(mediaQuery);
}

export default setupVerticalShadow;