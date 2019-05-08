// https://github.com/markdown-it/markdown-it-sup/blob/master/index.js
// Process ^superscript^

"use strict";

// same as UNESCAPE_MD_RE plus a space
var UNESCAPE_RE = /\\([ \\!"#$%&'()*+,.\/:;<=>?@[\]^_`{|}~-])/g;

function underline(state, silent) {
  // state.cache: {5: 8, 15: 17} // 5번째 문자에서 8번째 문자까지. 15번째 문자에서 17번째 문자까지
  // ruler 의 method 는 after, at, before, disable, enable, enbableOnly, getRules, push 가 있다.
  console.log("state, silent :", state, silent);

  var found,
    content,
    token,
    max = state.posMax,
    start = state.pos;

  console.log("state.tokens.length :", state.tokens.length);
  console.log("start, max :", start, max);

  // TODO: state.pos 가 왜 첫번째 ^ 의 위치에 맞춰서 잘 나오는걸까? 'ㅅ')?
  if (state.src.charCodeAt(start) !== 0x5e) {
    // ^
    return false;
  }

  if (silent) {
    return false;
  } // don't run any pairs in validation mode

  // TODO: 연속된 ^ 가 나오면 거른다.
  if (start + 2 >= max) {
    // case : '^^'
    return false;
  }

  state.pos = start + 1;

  while (state.pos < max) {
    console.log("while state.pos < max :", state.pos, max);

    if (state.src.charCodeAt(state.pos) === 0x5e) {
      // ^
      found = true;
      break;
    }

    console.log("skipToken :", state);

    // skipToken 을 하는 순간
    state.md.inline.skipToken(state);
  }

  console.log("found :", found);

  if (!found || start + 1 === state.pos) {
    state.pos = start;
    return false;
  }

  content = state.src.slice(start + 1, state.pos);
  console.log("content :", content);

  // don't allow unescaped spaces/newlines inside
  if (content.match(/(^|[^\\])(\\\\)*\s/)) {
    state.pos = start;
    return false;
  }

  // found!
  state.posMax = state.pos;
  state.pos = start + 1;

  console.log("state.pos, state.posMax :", state.pos, state.posMax);

  // Earlier we checked !silent, but this implementation does not need it
  token = state.push("u_open", "u", 1);
  token.markup = "^";

  token = state.push("text", "", 0);
  token.content = content.replace(UNESCAPE_RE, "$1");

  token = state.push("u_close", "u", -1);
  token.markup = "^";

  state.pos = state.posMax + 1;
  state.posMax = max;

  return true;
}

module.exports = function underline_plugin(md) {
  md.inline.ruler.after("emphasis", "underline", underline);
};
