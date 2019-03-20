import React, { Component } from "react";
import "codemirror/lib/codemirror.css";
import "tui-editor/dist/tui-editor.min.css";
import "tui-editor/dist/tui-editor-contents.min.css";
import { Editor, Viewer } from "@toast-ui/react-editor";

var content = [
  "![image](https://cloud.githubusercontent.com/assets/389021/16107646/9729e556-33d8-11e6-933f-5b09fa3a53bb.png)",
  "# Heading 1",
  "## Heading 2",
  "### Heading 3",
  "#### Heading 4",
  "##### Heading 5",
  "###### Heading 6",
  "    code block",
  "```js",
  'console.log("fenced code block");',
  "```",
  "<pre>**HTML block**</pre>",
  "* list",
  "    * list indented",
  "1. ordered",
  "2. list",
  "    1. ordered list",
  "    2. indented",
  "",
  "- [ ] task",
  "- [x] list completed",
  "",
  "[link](https://nhnent.github.io/tui.editor/)",
  "> block quote",
  "---",
  "horizontal line",
  "***",
  '`code`, *italic*, **bold**, ~~strikethrough~~, <span style="color:#e11d21">Red color</span>',
  "|table|head|",
  "|---|---|",
  "|table|body|"
].join("\n");

class TestTUIEditor extends Component {
  constructor(props) {
    super(props);

    const _ = this;

    _._editor = null;

    _.state = {
      isViewer: false,
      content: content
    };

    _.editorRef = React.createRef();
    _.viewerRef = React.createRef();
  }

  getEditor = () => {
    return (
      <Editor
        ref={this.editorRef}
        initialValue={this.state.content}
        previewStyle="vertical"
        height="600px"
        initialEditType="markdown"
        /*
        useCommandShortcut={true}
        exts={[
          {
            name: "chart",
            minWidth: 100,
            maxWidth: 600,
            minHeight: 100,
            maxHeight: 300
          },
          "scrollSync",
          "colorSyntax",
          "uml",
          "mark",
          "table"
        ]}
        */
      />
    );
  };

  getViewer = () => {
    return (
      <Viewer
        ref={this.viewerRef}
        initialValue={this.state.content}
        previewStyle="vertical"
        height="600px"
        initialEditType="markdown"
        /*
        useCommandShortcut={true}
        exts={[
          {
            name: "chart",
            minWidth: 100,
            maxWidth: 600,
            minHeight: 100,
            maxHeight: 300
          },
          "scrollSync",
          "colorSyntax",
          "uml",
          "mark",
          "table"
        ]}
        */
      />
    );
  };

  handleClick = () => {
    const _ = this;
    // this.editorRef.current.getInstance().exec("Bold");

    if (_.state.isViewer) {
      // Viewer
      const viewer = this.viewerRef.current.getInstance();
      console.log("viewer.isMarkdownMode() :", viewer.isMarkdownMode());
      console.log("viewer.isViewer() :", viewer.isViewer());
      console.log("viewer.isWysiwygMode() :", viewer.isWysiwygMode());
      // viewer.setValue("# Hello. viewer.setValue method");

      // public addHook(type: string, handler: HandlerFunc): void;
      // public isMarkdownMode(): boolean;
      // public isViewer(): boolean;
      // public isWysiwygMode(): boolean;
      // public off(type: string): void;
      // public on(type: string, handler: HandlerFunc): void;
      // public remove(): void;
      // public setMarkdown(markdown: string): void;
      // public setValue(markdown: string): void;
    } else {
      // Editor
      const editor = this.editorRef.current.getInstance();
      console.log("editor.getHtml() :", editor.getHtml());
      console.log("editor.isViewer() :", editor.isViewer());
      console.log("editor.getMarkdown() :", editor.getMarkdown());

      // public addHook(type: string, handler: HandlerFunc): void;
      // public addWidget(selection: Range, node: Node, style: string, offset?: number): void;
      // public afterAddedCommand(): void;
      // public blur(): void;
      // public changeMode(mode: string, isWithoutFocus?: boolean): void;
      // public changePreviewStyle(style: string): void;
      // public exec(name: string, ...args: any[]): void;
      // public focus(): void;
      // public getCodeMirror(): CodeMirrorType;
      // public getCurrentModeEditor(): MarkDownEditor | WysiwygEditor;
      // public getCurrentPreviewStyle(): string;
      // public getHtml(): string;
      // public getMarkdown(): string;
      // public getRange(): RangeType;
      // public getSelectedText(): string;
      // public getSquire(): SquireExt;
      // public getTextObject(range: RangeType): IMdTextObject | IWwTextObject;
      // public getUI(): IUI;
      // public getValue(): string;
      // public height(height: string): string;
      // public hide(): void;
      // public insertText(text: string): void;
      // public isMarkdownMode(): boolean;
      // public isViewer(): boolean;
      // public isWysiwygMode(): boolean;
      // public minHeight(minHeight: string): string;
      // public moveCursorToEnd(): void;
      // public moveCursorToStart(): void;
      // public off(type: string): void;
      // public on(type: string, handler: HandlerFunc): void;
      // public remove(): void;
      // public removeHook(type: string): void;
      // public reset(): void;
      // public scrollTop(value: number): number;
      // public setHtml(html: string, cursorToEnd?: boolean): void;
      // public setMarkdown(markdown: string, cursorToEnd?: boolean): void;
      // public setUI(UI: IUI): void;
      // public setValue(value: string, cursorToEnd?: boolean): void;
      // public show(): void;
    }
  };

  toggleEditorViewer = () => {
    const _ = this;

    _.setState(function(prevState, props) {
      return { isViewer: !prevState.isViewer };
    });
  };

  render() {
    const _ = this;

    return (
      <div className="app">
        {this.state.isViewer ? _.getViewer() : _.getEditor()}
        <button onClick={_.handleClick}>console editor/viewer</button>
        <button onClick={_.toggleEditorViewer}>toggle editor/viewer</button>
      </div>
    );
  }
}

export default TestTUIEditor;
