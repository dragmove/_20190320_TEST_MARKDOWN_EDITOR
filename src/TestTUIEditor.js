import React, { Component } from "react";
import "codemirror/lib/codemirror.css";
import "tui-editor/dist/tui-editor.min.css";
import "tui-editor/dist/tui-editor-contents.min.css";
import Editor from "tui-editor";

// import table extension
import "tui-editor/dist/tui-editor-extTable";

var content = [
  /*
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
  */
  /*"|table|head|",
  "|---|---|",
  "|table|body|",
  "---",
  "| @cols=2:merged |",
  "| --- | --- |",
  "| table | table |",
  "---",
  */
  "```youtube",
  "OxWqRo34UYI",
  "```",
  "---",
  ":abc:"
].join("\n");
console.log("content :", content);

class TestTUIEditor extends Component {
  constructor(props) {
    super(props);

    const _ = this;

    _._editor = null;

    _.state = {
      isViewer: false
    };
  }

  componentDidMount() {
    const _ = this;

    console.log("Editor :", Editor);

    // set own extensions
    Editor.defineExtension("emoticon", function() {
      console.log("emoticon extension");

      // preview
      // convertor
      // eventManager

      // TODO: 가능하면 extension 으로 할 수 있으면 좋을 듯 하다.
      // markdown 에 :abc: 를 넣는다.
      // :abc: 는 위지윅 에디터에 표시될 때는 다른 태그로 치환되어야 한다.
    });

    // youtube extension
    Editor.defineExtension("youtube", function() {
      // add codeBlock 'youtube'

      // runs while markdown-it transforms code block to HTML
      Editor.codeBlockManager.setReplacer("youtube", function(youtubeId) {
        // Indentify multiple code blocks
        var wrapperId =
          "yt" +
          Math.random()
            .toString(36)
            .substr(2, 10);

        // avoid sanitizing iframe tag
        setTimeout(renderYoutube.bind(null, wrapperId, youtubeId), 0);

        return '<div id="' + wrapperId + '"></div>';
      });
    });

    _._editor = new Editor({
      el: document.querySelector("#editor"),
      initialEditType: "markdown",
      previewStyle: "vertical",
      height: "800px",
      initialValue: content,
      exts: [
        "scrollSync",
        "colorSyntax",
        "uml",
        "chart",
        "mark",
        "table",
        "youtube",
        "emoticon"
      ]
    });

    console.log("_._editor :", _._editor);

    function renderYoutube(wrapperId, youtubeId) {
      var el = document.querySelector("#" + wrapperId);
      el.innerHTML =
        '<iframe width="420" height="315" src="https://www.youtube.com/embed/' +
        youtubeId +
        '"></iframe>';
    }
  }

  getEditor = () => {
    return "";
    /*
    return (
      <Editor
        ref={this.editorRef}
        initialValue={this.state.content}
        previewStyle="vertical"
        height="600px"
        initialEditType="markdown"
        // useCommandShortcut={true}
        // exts={[
        //   {
        //     name: "chart",
        //     minWidth: 100,
        //     maxWidth: 600,
        //     minHeight: 100,
        //     maxHeight: 300
        //   },
        //   "scrollSync",
        //   "colorSyntax",
        //   "uml",
        //   "mark",
        //   "table"
        // ]}
      />
    );
    */
  };

  getViewer = () => {
    return "";
    /*
    return (
      <Viewer
        ref={this.viewerRef}
        initialValue={this.state.content}
        previewStyle="vertical"
        height="600px"
        initialEditType="markdown"
        // useCommandShortcut={true}
        // exts={[
        //   {
        //     name: "chart",
        //     minWidth: 100,
        //     maxWidth: 600,
        //     minHeight: 100,
        //     maxHeight: 300
        //   },
        //   "scrollSync",
        //   "colorSyntax",
        //   "uml",
        //   "mark",
        //   "table"
        // ]}
      />
    );
    */
  };

  toggleEditorViewer = () => {
    const _ = this;

    _.setState(function(prevState, props) {
      return { isViewer: !prevState.isViewer };
    });
  };

  printConsole = () => {
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

      console.log("_._editor :", _._editor);

      const preview = _._editor.preview;
      preview.refresh("# title");

      // console.log("preview.getHTML() :", preview.getHTML());
      // preview.setHTML("<p>hello world</p>");
      // preview.refresh(markdown) // .render(this.convertor.toHTMLWithCodeHightlight(markdown));
      // preview.render(html) // eventManager.emit('previewBeforeHook', html); _$previewContent.html(html);

      // convertor.initHtmlSanitizer
      // convertor.getMarkdownitHighlightRenderer
      // convertor.toHTML
      // convertor.toHTMLWithCodeHightlight
      // convertor.toMarkdown

      // markdown input 시, preview 의 refresh 함수에서 convertor 의 toHTMLWithCodeHightlight 로 get html string
      // 이후, eventManager.listen('convertorAfterMarkdownToHtmlConverted') 으로 html 전송.

      /*
      const editor = this.editorRef.current.getInstance();
      console.log("editor.getHtml() :", editor.getHtml());
      console.log("editor.isViewer() :", editor.isViewer());
      console.log("editor.getMarkdown() :", editor.getMarkdown());
      */

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

  addEmoticon = () => {
    console.log("addEm");
  };

  render() {
    const _ = this;

    return (
      <div className="app">
        <div id="editor" />

        {/*this.state.isViewer ? _.getViewer() : _.getEditor()*/}
        <button onClick={_.toggleEditorViewer}>Toggle editor/viewer</button>
        <button onClick={_.printConsole}>console editor/viewer</button>
        <button onClick={_.addEmoticon}>Add emoticon</button>
      </div>
    );
  }
}

export default TestTUIEditor;
