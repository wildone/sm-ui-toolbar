// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
  let timeout;
  return function(...args) {
    let context = this,
        later = function() {
          timeout = null;
          if (!immediate) {
            func.apply(context, args)
          };
        },
        callNow = immediate && !timeout;

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(context, args)
    };
  };
};

export default function(scribe) {
  function fire(event) {
    let selection = new scribe.api.Selection(),
        params = [selection],
        type = selection.range ? 'select' : 'deselect';

    scribe.trigger(type, params);
    scribe.trigger('selectionchange', params);
  };

  let debouncedFire = debounce(fire, 10),
      events = ['keyup', 'mouseup', 'focus', 'blur'];

  events.forEach(event => scribe.el.addEventListener(event, debouncedFire));
};
