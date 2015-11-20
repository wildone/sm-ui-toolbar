import commands from './behaviors/commands';
import positioning from './behaviors/positioning';

class SmHelperToolbar {
  beforeRegister() {
    this.is = 'sm-helper-toolbar';

    this.properties = {
      range: Object,
      scribe: Object
    };
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
}

Polymer(SmHelperToolbar);
