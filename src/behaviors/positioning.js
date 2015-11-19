const DISPLAY_SHOW = 'flex',
      TRANSLATE_HALF = '50%',
      GUTTER_X = 8,
      GUTTER_Y = 8;

export default {
  properties: {
    position: {
      type: Object,
      value: () => ({ top: 0, left: 0, offsetLeft: 0, offsetTop: 0 })
    }
  },

  observers: [
    '_positionChanged(position.left, position.top)',
    '_offsetsChanged(position.offsetLeft, position.offsetTop)',
    '_updateOffsets(range)',
    '_rangeChanged(range)'
  ],

  get _translateX() {
    return `calc(-${TRANSLATE_HALF} + ${this.position.offsetLeft}px)`;
  },

  get _translateY() {
    return `calc(${this.position.offsetTop}px)`;
  },

  _positionChanged(left, top) {
    this.style.left = `${left}px`;
    this.style.top = `${top}px`;
  },

  _offsetsChanged() {
    this.style.transform = `translate(${this._translateX}, ${this._translateY})`;
  },

  _updateOffsets(range) {
    let offsetLeft = 0,
        offsetTop = 0,
        rangeHeight,
        edges = {},
        height,
        width;

    if (!range.getBoundingClientRect) {
      return;
    }

    ({ height, width } = (() => {
      let previousDisplay = this.style.display,
          computed;

      this.style.display = DISPLAY_SHOW;
      computed = window.getComputedStyle(this);
      height = parseFloat(computed.height);
      width = parseFloat(computed.width);
      this.style.display = previousDisplay;

      return { height, width };
    })());

    ({ edges, rangeHeight } = (() => {
      let rangeBounds = range.getBoundingClientRect(),
          rangeMiddle = rangeBounds.left + rangeBounds.width / 2,
          edges = {};

      edges.left = rangeMiddle - width / 2;
      edges.right = rangeMiddle + width / 2;
      edges.top = rangeBounds.top - height;

      return { edges, rangeMiddle, rangeHeight: rangeBounds.height };
    })());


    // Check left is offscreen
    if (edges.left < 0) {
      offsetLeft = -(edges.left - GUTTER_X);
    }

    // Check right is offscreen
    if (edges.right > window.innerWidth) {
      offsetLeft = -(edges.right - window.innerWidth + GUTTER_X);
    }

    // Check top is offscreen
    if (edges.top < 0) {
      // If the range is smaller than the toolbar, put it at the bottom of the range
      if (rangeHeight < height) {
        offsetTop = rangeHeight + GUTTER_Y;
      } else {
        offsetTop = 0;
      }
    } else {
      // Otherwise it's fine to put it above the range
      offsetTop = -(height + GUTTER_Y);
    }

    this.set('position.offsetLeft', offsetLeft);
    this.set('position.offsetTop', offsetTop);
  },

  _rangeChanged(range) {
    let bounds,
        scrollTop,
        scrollLeft,
        left,
        top,
        outsideViewport,
        position;

    if (!range.getBoundingClientRect) {
      return;
    }

    if (range.collapsed) {
      this.active = false;
      return;
    }

    bounds = range.getBoundingClientRect();
    scrollTop = window.pageYOffset;
    scrollLeft = window.pageXOffset;

    top = bounds.top;
    left = bounds.left + bounds.width / 2;

    this.set('position.top', top + scrollTop);
    this.set('position.left', left + scrollLeft);
  }
};
