// import React from "react";
// import ReactDOM from "react-dom";
// import "./index.css";
import MarkdownIt from "./lib/markdown-it/index";
/*
import TestTUIEditor from "./TestTUIEditor";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<TestTUIEditor />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
*/

import underline_plugin from "./markdown-it-underline";
import emphasis_plugin from "./markdown-it-emphasis";
import strikethrough_plugin from "./markdown-it-strikethrough";

const markdownit = new MarkdownIt({
  html: true,
  breaks: true,
  quotes: "“”‘’",
  langPrefix: "lang-"
});

// TODO: test markdownit
// const str = "*he^llo^*\n*^wo^rld*\nfoo";
// const str = "**h^e^*^llo^***\n***^w^o****rl*d\nfoo";
// const str = "h**el*l^o^***\n***^worl^*^d^**\n**^f^o**o";
// const str = "h~~ell~~o\n^world^\n^fo^o";
// const str = "h~~ell~~o\n^world^\n^fo^o^^";
// const str = "**hel^lo wo^**^rld foo b^ar";
// const str = "**hel**^**lo wo**rld foo b^ar";
const str =
  "***^If you load^*** *^script directly^* ^into the page^, without package system &nbsp; &nbsp; <br>";
// const str = "***~~If you load~~*** *~~script directly~~* ~~into the page~~, without package system";

let md = markdownit.use(underline_plugin);

const state = md.parse(str);
console.log("1st state :", state);

let token,
  childrenTokensOfTextToken,
  childToken,
  parsedChildState,
  tokenIndex,
  inlineTokenHasChildren,
  start,
  center,
  end;
for (let i = 0; i < state.length; i++) {
  token = state[i];
  if (!(token.type === "inline" && token.children)) continue;

  // inline token's children
  childrenTokensOfTextToken = token.children.filter(
    child => child.type === "text" && child.content !== "" && !child.children
  );

  for (let j = 0, len = childrenTokensOfTextToken.length; j < len; j++) {
    childToken = childrenTokensOfTextToken[j];
    if (!/[~*^]/g.exec(childToken.content)) continue;

    parsedChildState = md.parse(childToken.content);
    if (parsedChildState.length <= 0) continue;

    inlineTokenHasChildren = parsedChildState[1];
    if (
      !inlineTokenHasChildren || // TODO: Added this protection!!!
      !inlineTokenHasChildren.children ||
      inlineTokenHasChildren.children.length <= 0
    )
      continue;

    // replace token.children with
    tokenIndex = token.children.indexOf(childToken);
    if (tokenIndex < 0) continue;

    start = token.children.slice(0, tokenIndex);
    center = inlineTokenHasChildren.children;
    end = token.children.slice(tokenIndex + 1);

    token.children = start.concat(center, end);
    // console.log("token.children :", token.children);
  }
}
console.log("new state :", state);

const html = md.renderer.render(state, md.options);
console.log("html :", html);

// 이 state 를 다시 ruler 를 돌리면 될 것 같다.

// const html = md.render(str);
// console.log("rendered html :", html);
