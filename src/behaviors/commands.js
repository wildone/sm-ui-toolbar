const DEFAULT_COMMANDS = ['bold', 'italic', 'underline', 'link'],
      STANDARD = ['bold', 'italic', 'underline'];

export default {
  properties: {
    commands: {
      type: Array,
      value: () => DEFAULT_COMMANDS.slice()
    }
  },

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

  _handleToolTap(event) {
    let tool = event.currentTarget,
        command = tool.id;

    if (STANDARD.indexOf(command) !== -1) {
      this.execute(command);
    }
  }
};
