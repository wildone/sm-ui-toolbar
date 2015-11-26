const easings = simpla.constants.easings,
      TOOLS = '.tool',
      PROMPT = '.link',
      INPUT = '.link__input',
      PROMPT_WIDTH = '280px',
      OPTIONS = {
        easing: easings.easeOutCubic,
        fill: 'both',
        duration: 180
      };

/**
 * Build link prompt open / close behavior
 * @param  {string} observable Observable Boolean property to trigger open /
 *                             	closing of link prompt
 * @return {object}            Behavior to use
 */
export default function(observable) {
  return {
    observers: [
      `_handleLinkOpen(${observable})`
    ],

    get _linkAnimations() {
      let tools = [].slice.call(Polymer.dom(this.root).querySelectorAll(TOOLS)),
          prompt = this.$$(PROMPT),
          offset = tools[0].offsetWidth * (tools.length - 1);

      return {
        tools: {
          target: tools[0],
          frames: [
            { 'margin-left': 0 },
            { 'margin-left': '-' + `${offset}px` }
          ]
        },
        input: {
          target: prompt,
          frames: [
            { 'width': 0 },
            { 'width': PROMPT_WIDTH }
          ]
        }
      }
    },

    _toggleLinkPrompt(direction) {
      let { tools, input } = this._linkAnimations,
          linkPrompt = this.$$(INPUT),
          inputAnimation;

      if (direction === 'open') {
        tools.target.animate(tools.frames, OPTIONS);
        inputAnimation = input.target.animate(input.frames, OPTIONS);
        inputAnimation.onfinish = () => linkPrompt.focus();
      } else {
        tools.target.animate(tools.frames.reverse(), OPTIONS);
        input.target.animate(input.frames.reverse(), OPTIONS);
      }

    },

    _handleLinkOpen(open) {
      this._toggleLinkPrompt(open ? 'open' : 'close');
    }
  }
};
