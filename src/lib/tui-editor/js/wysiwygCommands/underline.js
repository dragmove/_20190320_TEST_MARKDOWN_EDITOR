// TODO: Add custom wysiwyg command

import CommandManager from "../commandManager";

/**
 * Underline
 * Add underline to selected wysiwyg editor content
 * @extends Command
 * @module wysiwygCommands/Underline
 * @ignore
 */
const Underline = CommandManager.command(
  "wysiwyg",
  /** @lends Underline */ {
    name: "Underline",
    keyMap: [], // ["CTRL+S", "META+S"],
    /**
     * command handler
     * @param {WysiwygEditor} wwe WysiwygEditor instance
     */
    exec(wwe) {
      const sq = wwe.getEditor();
      const tableSelectionManager = wwe.componentManager.getManager(
        "tableSelection"
      );

      wwe.focus();

      if (
        sq.hasFormat("table") &&
        tableSelectionManager.getSelectedCells().length
      ) {
        tableSelectionManager.styleToSelectedCells(styleUnderline);

        const range = sq.getSelection();
        range.collapse(true);
        sq.setSelection(range);
      } else {
        styleUnderline(sq);
      }
    }
  }
);

/**
 * Style underline.
 * @param {object} sq - squire editor instance
 */
function styleUnderline(sq) {
  if (sq.hasFormat("U")) {
    sq.changeFormat(null, { tag: "U" });
  } else if (!sq.hasFormat("a") && !sq.hasFormat("PRE")) {
    if (sq.hasFormat("code")) {
      sq.changeFormat(null, { tag: "code" });
    }
    sq.underline();
  }
}

export default Underline;
