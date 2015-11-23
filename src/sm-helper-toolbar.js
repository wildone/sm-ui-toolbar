import commands from './behaviors/commands';
import positioning from './behaviors/positioning';
import selectionEvent from './plugins/selection-event.js';
import createLinkCommand from './plugins/create-link.js';
import unlinkCommand from 'scribe-plugin-intelligent-unlink-command';

const PLUGINS = [selectionEvent, createLinkCommand, unlinkCommand];

class SmHelperToolbar {
  beforeRegister() {
    this.is = 'sm-helper-toolbar';

    this.properties = {
      range: Object,
      scribe: Object
    };

    this.observers = [
      '_loadPlugins(scribe)',
      '_watchForRange(scribe)',
      '_watchForActive(scribe)'
    ];
  }

  get behaviors() {
    return [].concat(
      simpla.behaviors.active({
        reflectToAttribute: true
      }),
      commands,
      positioning
    );
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

  _watchForActive(scribe) {
    scribe.on('select', () => this.active = true);
    scribe.on('deselect', () => this.active = false);
  }
}

Polymer(SmHelperToolbar);
