import makeLinkPrompt from './link-prompt';

let iconFor = (command) => {
      switch (command) {
      case 'createLink':
        return 'link';
      default:
        return command;
      }
    },
    expandCommand = (name) => ({ name, enabled: true, active: false, use: true, icon: iconFor(name) }),
    upper = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const DEFAULT = ['bold', 'italic', 'underline', 'createLink'],
      STANDARD = ['bold', 'italic', 'underline'];

export default [ makeLinkPrompt('_linkOpen'), {
  properties: {
    commands: {
      type: Array,
      value: () => DEFAULT.map(expandCommand)
    },
    _usingLink: {
      type: Boolean,
      computed: '_computeUsingLink(commands.*)'
    },
    _linkOpen: Boolean
  },

  observers: [
    '_watchCommandStatus(scribe, commands)',
    '_checkUsedCommands(scribe, commands)'
  ],

  execute(commandName, commandValue) {
    let scribe = this.scribe,
        command;

    if (!scribe) {
      return;
    }

    command = scribe.getCommand(commandName);

    // Restore focus,
    // See https://github.com/guardian/scribe-plugin-toolbar/blob/master/src/scribe-plugin-toolbar.js#L21
    scribe.el.focus();
    command.execute(commandValue);
  },

  _executeCreateLink() {
    this._linkOpen = true;
  },

  _usingCommand(command) {
    return command.use;
  },

  _handleToolTap(event) {
    let tool = event.currentTarget,
        command = tool.id;

    if (STANDARD.indexOf(command) !== -1) {
      this.execute(command);
    } else {
      this[`_execute${upper(command)}`]();
    }
  },

  _watchCommandStatus(scribe, commands) {
    let updateCommands = () => {
      commands
        .map(({ name }) => scribe.getCommand(name))

        // Ensure is valid command
        .filter(command => command && command.queryState && command.queryEnabled)

        // Update enabled / active
        .forEach((command, index) => {
          let active = command.queryState(),
              enabled = command.queryEnabled();

          this.set(`commands.${index}.active`, active);
          this.set(`commands.${index}.enabled`, enabled);
        });
    };

    ['selectionchange', 'content-changed']
      .forEach(event => scribe.on(event, updateCommands));
  },

  _checkUsedCommands(scribe, commands) {
    let isEnabled = ({ name }) => scribe._smEnabled.indexOf(name) !== -1,
        updateCommand = (enabled, index) => this.set(`commands.${index}.use`, enabled);

    if (scribe._smEnabled) {
      commands
        .map(isEnabled)
        .forEach(updateCommand);
    }
  },

  _computeUsingLink() {
    return this.commands &&
            this.commands.some( ({ name, use }) => name === 'createLink' && use );
  }
}];
