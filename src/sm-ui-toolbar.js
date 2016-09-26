import commands from './behaviors/commands';
import positioning from './behaviors/positioning';
import simplaConnector from './behaviors/simpla-connector';
import selectionEvent from './plugins/selection-event.js';
import createLinkCommand from './plugins/create-link.js';
import unlinkCommand from 'scribe-plugin-intelligent-unlink-command';

const PLUGINS = [selectionEvent, createLinkCommand, unlinkCommand];

class SmUiToolbar {
  beforeRegister() {
    this.is = 'sm-ui-toolbar';

    this.properties = {
      range: Object,
      scribe: Object,
      active: {
        type: Boolean,
        reflectToAttribute: true,
        notify: true,
        value: false
      }
    };

    this.observers = [
      '_loadPlugins(scribe)',
      '_watchForRange(scribe)',
      '_watchForActive(scribe)',
      '_toggleWindowListener(active)',
      '_ensureVisible(active)'
    ];

    this.listeners = {
      'click': '_protectClick'
    }
  }

  get behaviors() {
    return [].concat(
      commands,
      positioning,
      simplaConnector
    );
  }

  use(scribe) {
    scribe.on('select', () => {
      this.scribe = scribe;
      this.active = true;
    });

    scribe.on('deselect', () => this.active = false);

    PLUGINS.forEach(plugin => scribe.use(plugin));

    scribe.on('selectionchange', (event) => {
      if (event && event.range) {
        this.range = event.range;
      }
    });
  }

  _loadPlugins(scribe) {

  }

  _watchForRange(scribe) {

  }

  _watchForActive(scribe) {

  }

  _toggleWindowListener(active) {
    if (active) {
      this._windowListener = (ev) => {
        if (!ev._protected) {
          this.active = false;
        }
      };
      window.addEventListener('click', this._windowListener);
    } else if (this._windowListener) {
      window.removeEventListener('click', this._windowListener);
      this._windowListener = null;
    }
  }

  _protectClick(event) {
    event._protected = true;
  }

  _ensureVisible(active) {
    if (active) {
      this.hidden = false;
    }
  }
}

Polymer(SmUiToolbar);

// Inject a singleton
let singleton = document.createElement('sm-ui-toolbar');

window.SmUiToolbar = SmUiToolbar;
window.SmUiToolbar.singleton = singleton;

singleton.hidden = true;

// Inject
if (document.body) {
  document.body.appendChild(singleton);
} else {
  document.addEventListener('readystatechange', () => {
    if (document.body) {
      document.body.appendChild(singleton);
    }
  });
}
