// "use strict";

module.exports = function block(state) {
  var token;

  if (state.inlineMode) {
    // console.log("core block - inline mode");
    token = new state.Token("inline", "", 0);
    token.content = state.src;
    token.map = [0, 1];
    token.children = [];
    state.tokens.push(token);
  } else {
    // console.log("core block - block mode");
    state.md.block.parse(state.src, state.md, state.env, state.tokens);
  }
};
