const leftSpacesRegex = /^(\s*)/;
const rightSpacesRegex = /(\s*)$/;

export const getLeftSpaces = str => {
  return str.match(leftSpacesRegex)[0];
};

export const getRightSpaces = str => {
  return str.match(rightSpacesRegex)[0];
};

export const separateCharsByRegex = (str, regex, convertMatchFunc) => {
  let list = [],
    match = null,
    lastIndex = 0,
    prevStr = "",
    matchStr = "";

  while ((match = regex.exec(str))) {
    // if (match.index == regex.lastIndex) regex.lastIndex++;

    prevStr = str.substr(lastIndex, match.index - lastIndex);
    matchStr = match[0];

    if (convertMatchFunc) matchStr = convertMatchFunc(matchStr);
    list.push(prevStr, matchStr);

    lastIndex = match.index + match[0].length;
  }

  list.push(str.substr(lastIndex));

  return list;
};
