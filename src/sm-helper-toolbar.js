import commands from './behaviors/commands';

class SmHelperToolbar {
  beforeRegister() {
    this.is = 'sm-helper-toolbar';
  }

  get behaviors() {
    return [
      simpla.behaviors.active({
        reflectToAttribute: true
      }),
      commands
    ];
  }
}

Polymer(SmHelperToolbar);
