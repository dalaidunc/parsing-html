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

function removeEmptyChildren(stack) {
  return stack.map((elem) => {
    if (Array.isArray(elem.children)) {
      if (elem.children.length === 0) {
        delete elem.children;
      } else {
        elem.children = removeEmptyChildren(elem.children);
      }
    }
    return elem;
  });
}

function parse(htmlString) {
  let currentChar;
  let index = 0;
  let modeStack = [];
  let currentTag;
  let parsedHTML = []; // top level stack
  let htmlStack = parsedHTML;

  function changeMode(shouldInvoke) {
    modeStack.pop();
    if (shouldInvoke) {
      const nextMode = modeStack[modeStack.length - 1];
      nextMode();
    }
  }

  const modes = {
    tag() {
      if (!currentTag.tagName) {
        if (currentChar === "/") {
          // closing tag - ignore
          modeStack.push(modes.closingTag);
        }
        currentTag.tagName = currentChar;
        modeStack.push(modes.tagName);
      } else if (isEndOfTag(currentChar)) {
        console.log(htmlStack, parsedHTML);
        htmlStack.push(currentTag);
        changeMode();
        if (!SELF_CLOSING_TAGS.has(currentTag.tagName.toLowerCase())) {
          currentTag.children = [];
          htmlStack = currentTag.children;
        }
      }
    },
    closingTag() {
      // More robust to tokenize the closing tag name and ensure it matches the current tag name
      if (isEndOfTag(currentChar)) {
        changeMode(); // back to tag mode
        changeMode(); // tag is closed so go back one more mode
      }
    },
    tagName() {
      if (isWord(currentChar)) {
        currentTag.tagName += currentChar;
      } else {
        changeMode(true);
      }
    },
    defaultMode() {
      if (currentChar === "<") {
        currentTag = {};
        modeStack.push(modes.tag);
      }
    },
  };

  while ((currentChar = htmlString.charAt(index))) {
    const mode = modeStack[modeStack.length - 1] || modes.defaultMode;
    mode();
    index++;
  }

  return removeEmptyChildren(parsedHTML);
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
