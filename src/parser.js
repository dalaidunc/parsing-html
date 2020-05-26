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

function isValidTagName(c) {
  return /[a-zA-Z0-9\-]/.test(c);
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
  let currentText = "";

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
      if (nextMode) {
        nextMode();
      } else {
        modes.defaultMode();
      }
    }
  }

  function addToCurrentStack(thing) {
    const stack = htmlStacks[htmlStacks.length - 1];
    stack.push(thing);
    return stack;
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
        addToCurrentStack(currentTag);
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
      if (isValidTagName(currentChar)) {
        currentTag.tagName += currentChar;
      } else {
        changeMode(true);
      }
    },
    text() {
      if (currentChar === "<") {
        addToCurrentStack(currentText);
        currentText = "";
        changeMode(true);
      } else {
        currentText += currentChar;
      }
    },
    defaultMode() {
      if (currentChar === "<") {
        currentTag = {};
        modeStack.push(modes.tag);
      } else {
        modes.text(currentChar);
        modeStack.push(modes.text);
      }
    },
  };

  while ((currentChar = htmlString.charAt(index))) {
    const mode = modeStack[modeStack.length - 1] || modes.defaultMode;
    mode();
    index++;
  }

  if (currentText) {
    addToCurrentStack(currentText);
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
