// http://xahlee.info/js/html5_non-closing_tag.html
const SELF_CLOSING_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

function isWord(c) {
  return /^[a-zA-Z]+$/.test(c);
}

function isEndOfTag(c) {
  return ">" === c;
}

function parse(htmlString) {
  let currentChar;
  let index = 0;
  let modeStack = [];
  let currentTag;
  let parsedHTML = [];

  const modes = {
    tag(currentChar) {
      if (!currentTag.tagName) {
        currentTag.tagName = currentChar;
        modeStack.push(modes.tagName);
      } else if (isEndOfTag(currentChar)) {
        parsedHTML.push(currentTag);
        modeStack.pop();
      }
    },
    tagName(currentChar) {
      if (isWord(currentChar)) {
        currentTag.tagName += currentChar;
      } else {
        const altMode = modeStack.pop();
        altMode(currentChar);
      }
    },
    defaultMode(currentChar) {
      if (currentChar === "<") {
        currentTag = {};
        modeStack.push(modes.tag);
      }
    },
  };

  while ((currentChar = htmlString.charAt(index))) {
    const mode = modeStack[modeStack.length - 1] || modes.defaultMode;
    mode(currentChar);
    index++;
  }

  return parsedHTML;
}

export default class Parser {
  constructor(htmlString) {
    this.load(htmlString);
  }
  load(htmlString) {
    this.parsedHTML = parse(htmlString);
  }
  getText(pattern) {
    return "This text";
  }
}
