module.exports = function markdownItUnderline(md) {
  function renderEm(tokens, idx, opts, _, slf) {
    console.log("tokens :", tokens); // TODO: ^ 으로는 token 이 나오지 않는다.
    console.log("idx :", idx);
    console.log("opts :", opts);
    console.log("_ :", _);
    console.log("slf :", slf);

    var token = tokens[idx];

    console.log("token.markup :", token.markup);

    if (token.markup === "^") {
      token.tag = "u";
    }
    return slf.renderToken(tokens, idx, opts);
  }

  md.renderer.rules.em_open = renderEm;
  md.renderer.rules.em_close = renderEm;
};
