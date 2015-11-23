const LINK_NODE = 'A';

export default function (scribe) {
  let createLinkCommand = new scribe.api.Command('createLink');

  createLinkCommand.nodeName = LINK_NODE;

  createLinkCommand.execute = function(href) {
    let selection = new scribe.api.Selection(),
        range = selection.range,
        anchorNode = selection.getContaining(node => node.nodeName === this.nodeName);

    if (anchorNode) {
      range.selectNode(anchorNode);
      selection.selection.removeAllRanges();
      selection.selection.addRange(range);
    }

    scribe.api.SimpleCommand.prototype.execute.call(this, href);
  };

  createLinkCommand.queryState = function () {
    /**
     * We override the native `document.queryCommandState` for links because
     * the `createLink` and `unlink` commands are not supported.
     * As per: http://jsbin.com/OCiJUZO/1/edit?js,console,output
     */
    let selection = new scribe.api.Selection();
    return !!selection.getContaining(node => node.nodeName === this.nodeName);
  };

  scribe.commands.createLink = createLinkCommand;
};
