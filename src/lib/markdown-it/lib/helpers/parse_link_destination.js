// Parse link destination
//
// 'use strict';

var isSpace = require("../common/utils").isSpace;
var unescapeAll = require("../common/utils").unescapeAll;

module.exports = function parseLinkDestination(str, pos, max) {
  var code,
    level,
    lines = 0,
    start = pos,
    result = {
      ok: false,
      pos: 0,
      lines: 0,
      str: ""
    };

  if (str.charCodeAt(pos) === 0x3c /* < */) {
    pos++;
    while (pos < max) {
      code = str.charCodeAt(pos);
      if (code === 0x0a /* \n */ || isSpace(code)) {
        return result;
      }
      if (code === 0x3e /* > */) {
        result.pos = pos + 1;
        result.str = unescapeAll(str.slice(start + 1, pos));
        result.ok = true;
        return result;
      }
      if (code === 0x5c /* \ */ && pos + 1 < max) {
        pos += 2;
        continue;
      }

      pos++;
    }

    // no closing '>'
    return result;
  }

  // this should be ... } else { ... branch

  level = 0;
  while (pos < max) {
    code = str.charCodeAt(pos);

    if (code === 0x20) {
      break;
    }

    // ascii control characters
    if (code < 0x20 || code === 0x7f) {
      break;
    }

    if (code === 0x5c /* \ */ && pos + 1 < max) {
      pos += 2;
      continue;
    }

    if (code === 0x28 /* ( */) {
      level++;
    }

    if (code === 0x29 /* ) */) {
      if (level === 0) {
        break;
      }
      level--;
    }

    pos++;
  }

  if (start === pos) {
    return result;
  }
  if (level !== 0) {
    return result;
  }

  result.str = unescapeAll(str.slice(start, pos));
  result.lines = lines;
  result.pos = pos;
  result.ok = true;
  return result;
};
