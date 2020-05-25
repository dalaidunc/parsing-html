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

function isValidAttributeName(c) {
  return /\w/.test(c);
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
  const htmlStacks = [parsedHTML];
  let currentAttribute = {
    name: "",
    value: "",
    valueWrapChar: null,
  };

  function addAttribute() {
    currentTag.attributes = currentTag.attributes || {};
    currentTag.attributes[currentAttribute.name] = currentAttribute.value;
    currentAttribute = {
      name: "",
      value: "",
      valueWrapChar: null,
    };
  }

  function changeMode(shouldInvoke) {
    modeStack.pop();
    if (shouldInvoke) {
      const nextMode = modeStack[modeStack.length - 1];
      nextMode();
    }
  }

  const modes = {
    attributeName() {
      if (isValidAttributeName(currentChar)) {
        currentAttribute.name += currentChar;
      } else if (currentChar === "=") {
        modeStack.push(modes.attributeValue);
      } else {
        addAttribute();
        changeMode(true);
      }
    },
    attributeValue() {
      if (!currentAttribute.valueWrapChar) {
        if (currentChar === `'` || currentChar === `"`) {
          currentAttribute.valueWrapChar = currentChar;
        } else if (currentChar === " " || isEndOfTag(currentChar)) {
          changeMode(true);
        } else {
          currentAttribute.value += currentChar;
        }
      } else if (currentAttribute.valueWrapChar === currentChar) {
        changeMode();
      } else {
        currentAttribute.value += currentChar;
      }
    },
    tag() {
      if (currentTag.tagName && isValidAttributeName(currentChar)) {
        modes.attributeName();
        modeStack.push(modes.attributeName);
      } else if (!currentTag.tagName) {
        if (currentChar === "/") {
          // closing tag - ignore
          modeStack.push(modes.closingTag);
        }
        currentTag.tagName = currentChar;
        modeStack.push(modes.tagName);
      } else if (isEndOfTag(currentChar)) {
        const htmlStack = htmlStacks[htmlStacks.length - 1];
        htmlStack.push(currentTag);
        changeMode();
        if (!SELF_CLOSING_TAGS.has(currentTag.tagName.toLowerCase())) {
          currentTag.children = [];
          htmlStacks.push(currentTag.children);
        }
      }
    },
    closingTag() {
      // More robust to tokenize the closing tag name and ensure it matches the current tag name
      if (isEndOfTag(currentChar)) {
        changeMode(); // back to tag mode
        changeMode(); // tag is closed so go back one more mode
        htmlStacks.pop(); // no longer getting children of the closed tag
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
