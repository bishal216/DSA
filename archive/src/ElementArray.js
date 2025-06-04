/**
 * Handles DOM rendering operations for bar elements
 */
class BarRenderer {
  static DEFAULT_CLASS = "bar-element";

  constructor(containerId) {
    this.container = document.querySelector("#" + containerId);
    if (!this.container) throw new Error(`Container ${containerId} not found`);
  }

  clear() {
    this.container.innerHTML = "";
  }

  createBar(value, heightMultiplier, minHeight) {
    const bar = document.createElement("div");
    bar.className = BarRenderer.DEFAULT_CLASS;
    bar.textContent = value;
    bar.style.height = `${value * heightMultiplier + minHeight}px`;
    return bar;
  }

  updateBar(barElement, value, heightMultiplier, minHeight) {
    barElement.style.height = `${value * heightMultiplier + minHeight}px`;
    barElement.textContent = value;
  }

  addClass(element, className) {
    element.classList.add(className);
  }

  removeClass(element, className) {
    element.classList.remove(className);
  }
}

/**
 * Manages bar data and array operations
 */
class BarData {
  constructor(initialValues) {
    this.values = initialValues;
  }

  static generateRandomValues(length) {
    return Array.from({ length }, () => Math.floor(Math.random() * 100) + 1);
  }

  swap(i, j) {
    [this.values[i], this.values[j]] = [this.values[j], this.values[i]];
  }

  validateValues(values) {
    return values.map((value) => {
      const num = Number(value);
      return Number.isFinite(num) ? num : 0;
    });
  }
}

/**
 * Main bar visualization manager
 */
class BarManager {
  static DEFAULT_CONFIG = {
    animationDelay: 200,
    heightMultiplier: 3,
    minHeightOffset: 25,
    maxBars: 100,
  };

  constructor(containerId, config = {}) {
    this.config = { ...BarManager.DEFAULT_CONFIG, ...config };
    this.renderer = new BarRenderer(containerId);
    this.data = null;
    this.resizeHandler = this.debounce(() => this.handleResize(), 100);
  }

  initialize(values) {
    this.data = new BarData(
      Array.isArray(values)
        ? this.data.validateValues(values)
        : BarData.generateRandomValues(this.config.initialLength || 20)
    );
    this.render();
    this.addEventListeners();
  }

  reSize = (newLength) => {
    if (newLength > 0 && newLength <= this.config.maxBars) {
      this.data.values = BarData.generateRandomValues(newLength);
      this.render();
    } else {
      alert("Please enter a valid number between 1 and 100");
    }
  };
  render() {
    this.renderer.clear();

    this.data.values.forEach((value) => {
      const bar = this.renderer.createBar(
        value,
        this.config.heightMultiplier,
        this.config.minHeightOffset
      );
      this.renderer.container.appendChild(bar);
    });
  }

  async swap(i, j) {
    const bars = this.renderer.container.children;

    this.highlightElements("swapping", bars[i], bars[j]);
    await this.delay();

    this.data.swap(i, j);
    this.updateBarVisuals(bars[i], this.data.values[i]);
    this.updateBarVisuals(bars[j], this.data.values[j]);

    await this.delay();
    this.removeHighlight(["swapping"], bars[i], bars[j]);
  }

  async compare(i, j) {
    const bars = this.renderer.container.children;

    this.highlightElements("comparing", bars[i], bars[j]);
    await this.delay();

    if (this.data.values[i] <= this.data.values[j]) {
      this.highlightElements("no-swap", bars[i], bars[j]);
      await this.delay();
    }

    this.removeHighlight(["comparing", "no-swap"], bars[i], bars[j]);
  }

  highlightElements(className, ...elements) {
    elements.forEach((element) => this.renderer.addClass(element, className));
  }

  removeHighlight(classNames, ...elements) {
    elements.forEach((element) =>
      classNames.forEach((className) =>
        this.renderer.removeClass(element, className)
      )
    );
  }

  updateBarVisuals(barElement, value) {
    this.renderer.updateBar(
      barElement,
      value,
      this.config.heightMultiplier,
      this.config.minHeightOffset
    );
  }

  handleResize() {
    return;
  }

  debounce(fn, delay) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  delay() {
    return new Promise((resolve) =>
      setTimeout(resolve, this.config.animationDelay)
    );
  }

  addEventListeners() {
    window.addEventListener("resize", this.resizeHandler);
  }
  destroy() {
    window.removeEventListener("resize", this.resizeHandler);
    this.renderer.clear();
    this.data = null;
  }
}
