/** internal
 * class Core
 *
 * Top-level rules executor. Glues block/inline parsers and does intermediate
 * transformations.
 **/
// "use strict";

var Ruler = require("./ruler");

var _rules = [
  ["normalize", require("./rules_core/normalize")],
  ["block", require("./rules_core/block")],
  ["inline", require("./rules_core/inline")]
  /*
  ["linkify", require("./rules_core/linkify")],
  ["replacements", require("./rules_core/replacements")],
  ["smartquotes", require("./rules_core/smartquotes")]
  */
];

/**
 * new Core()
 **/
function Core() {
  /**
   * Core#ruler -> Ruler
   *
   * [[Ruler]] instance. Keep configuration of core rules.
   **/
  this.ruler = new Ruler();

  for (var i = 0; i < _rules.length; i++) {
    this.ruler.push(_rules[i][0], _rules[i][1]);
  }
  /*
  // then,
  ruler.__rule__ = [
    { name: 'normalize', enabled: true, fn: require("./rules_core/normalize"), alt: []}
    { name: 'block', enabled: true, fn: require("./rules_core/block"), alt: []}
    { name: 'inline', enabled: true, fn: require("./rules_core/inline"), alt: []}
    { name: 'linkify', enabled: true, fn: require("./rules_core/linkify"), alt: []}
    { name: 'replacements', enabled: true, fn: require("./rules_core/replacements"), alt: []}
    { name: 'smartquotes', enabled: true, fn: require("./rules_core/smartquotes"), alt: []}
  ]

  ruler.__cache__ = null;
  */
}

/**
 * Core.process(state)
 *
 * Executes core chain rules.
 **/
Core.prototype.process = function(state) {
  var i, l, rules;

  rules = this.ruler.getRules("");
  // then, ruler.__compile__() , return this.__cache__[''] || [];
  // console.log("core rules :", rules);

  for (i = 0, l = rules.length; i < l; i++) {
    rules[i](state);
  }
};

Core.prototype.State = require("./rules_core/state_core");

module.exports = Core;
