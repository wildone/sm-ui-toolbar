const PROMPT_WIDTH = '280px',
      easings = simpla.constants.easings,
      opts = {
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
      let tools = [].slice.call(Polymer.dom(this.root).querySelectorAll('.tool')),
          input = this.$$('.link'),
          offset = tools[0].offsetWidth * (tools.length - 1);

      return [
        {
          target: tools[0],
          begin: { 'margin-left': 0 },
          end: { 'margin-left': '-' + offset },
          options: opts
        },
        {
          target: input,
          begin: { 'width': 0 },
          end: { 'width': PROMPT_WIDTH },
          options: opts
        }
      ]},

    _toggleLinkPrompt(direction) {

      this._linkAnimations.forEach(({ target, begin, end, options }) => {
        let frames = direction === 'open' ? [begin, end] : [end, begin];
        target.animate(frames, options);
      });

    },

    _handleLinkOpen(open) {
      this._toggleLinkPrompt(open ? 'open' : 'close');
    }
  }
};
