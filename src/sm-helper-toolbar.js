import commands from './behaviors/commands';
import positioning from './behaviors/positioning';
import selectionEvent from './plugins/selection-event.js';

const PLUGINS = [selectionEvent];

class SmHelperToolbar {
  beforeRegister() {
    this.is = 'sm-helper-toolbar';

    this.properties = {
      range: Object,
      scribe: Object
    };

    this.observers = [
      '_loadPlugins(scribe)',
      '_watchForRange(scribe)'
    ];
  }

  get behaviors() {
    return [
      simpla.behaviors.active({
        reflectToAttribute: true
      }),
      commands,
      positioning
    ];
  }

  _loadPlugins(scribe) {
    PLUGINS.forEach(plugin => scribe.use(plugin));
  }

  _watchForRange(scribe) {
    scribe.on('selectionchange', (event) => {
      if (event && event.range) {
        this.range = event.range;
      }
    });
  }
}

Polymer(SmHelperToolbar);
