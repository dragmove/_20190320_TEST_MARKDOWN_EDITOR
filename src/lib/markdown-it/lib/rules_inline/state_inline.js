// Inline parser state

// 'use strict';

var Token = require("../token");
var isWhiteSpace = require("../common/utils").isWhiteSpace;
var isPunctChar = require("../common/utils").isPunctChar;
var isMdAsciiPunct = require("../common/utils").isMdAsciiPunct;

function StateInline(src, md, env, outTokens) {
  this.src = src;
  this.env = env;
  this.md = md;
  this.tokens = outTokens;

  this.pos = 0;
  this.posMax = this.src.length;
  this.level = 0;
  this.pending = "";
  this.pendingLevel = 0;

  this.cache = {}; // Stores { start: end } pairs. Useful for backtrack
  // optimization of pairs parse (emphasis, strikes).

  this.delimiters = []; // Emphasis-like delimiters
}

// Flush pending text
//
StateInline.prototype.pushPending = function() {
  var token = new Token("text", "", 0);
  token.content = this.pending;
  token.level = this.pendingLevel;
  this.tokens.push(token);
  this.pending = "";
  return token;
};

// Push new token to "stream".
// If pending text exists - flush it as text token
//
StateInline.prototype.push = function(type, tag, nesting) {
  if (this.pending) {
    this.pushPending();
  }

  var token = new Token(type, tag, nesting);

  if (nesting < 0) {
    this.level--;
  }
  token.level = this.level;
  if (nesting > 0) {
    this.level++;
  }

  this.pendingLevel = this.level;
  this.tokens.push(token);
  return token;
};

// Scan a sequence of emphasis-like markers, and determine whether
// it can start an emphasis sequence or end an emphasis sequence.
//
//  - start - position to scan from (it should point at a valid marker);
//  - canSplitWord - determine if these markers can be found inside a word
//
StateInline.prototype.scanDelims = function(start, canSplitWord) {
  var pos = start,
    lastChar,
    nextChar,
    count,
    can_open,
    can_close,
    isLastWhiteSpace,
    isLastPunctChar,
    isNextWhiteSpace,
    isNextPunctChar,
    left_flanking = true,
    right_flanking = true,
    max = this.posMax,
    marker = this.src.charCodeAt(start);

  // treat beginning of the line as a whitespace
  lastChar = start > 0 ? this.src.charCodeAt(start - 1) : 0x20;

  while (pos < max && this.src.charCodeAt(pos) === marker) {
    pos++;
  }

  count = pos - start;

  // treat end of the line as a whitespace
  nextChar = pos < max ? this.src.charCodeAt(pos) : 0x20;

  isLastPunctChar =
    isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
  isNextPunctChar =
    isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));

  isLastWhiteSpace = isWhiteSpace(lastChar);
  isNextWhiteSpace = isWhiteSpace(nextChar);

  if (isNextWhiteSpace) {
    left_flanking = false;
  } else if (isNextPunctChar) {
    if (!(isLastWhiteSpace || isLastPunctChar)) {
      left_flanking = false;
    }
  }

  if (isLastWhiteSpace) {
    right_flanking = false;
  } else if (isLastPunctChar) {
    if (!(isNextWhiteSpace || isNextPunctChar)) {
      right_flanking = false;
    }
  }

  if (!canSplitWord) {
    can_open = left_flanking && (!right_flanking || isLastPunctChar);
    can_close = right_flanking && (!left_flanking || isNextPunctChar);
  } else {
    can_open = left_flanking;
    can_close = right_flanking;
  }

  return {
    can_open: can_open,
    can_close: can_close,
    length: count
  };
};

// re-export Token class to use in block rules
StateInline.prototype.Token = Token;

module.exports = StateInline;
