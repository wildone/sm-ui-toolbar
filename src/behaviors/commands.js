const DEFAULT_COMMANDS = ['bold', 'italic', 'underline', 'link'];

export default {
  properties: {
    commands: {
      type: Array,
      value: () => DEFAULT_COMMANDS.slice()
    }
  }
};
