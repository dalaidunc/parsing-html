import Parser from "../src/parser.js";

describe("gets a tagName from html", () => {
  test("basic single tag", () => {
    const html = "<div>";
    const parser = new Parser(html);
    expect(parser.parsedHTML).toEqual([{ tagName: "div" }]);
  });
  test("self-closing tag", () => {
    const html = "<br/>";
    const parser = new Parser(html);
    expect(parser.parsedHTML).toEqual([{ tagName: "br" }]);
  });
  test("correctly handles a closing tag", () => {
    const html = "<div></div>";
    const parser = new Parser(html);
    expect(parser.parsedHTML).toEqual([{ tagName: "div" }]);
  });
});

describe("children tags", () => {
  test("2 tags", () => {
    const html = "<div><span></span></div>";
    const parser = new Parser(html);
    expect(parser.parsedHTML).toEqual([
      { tagName: "div", children: [{ tagName: "span" }] },
    ]);
  });
  test("2 tags, inner is self-closing tag", () => {
    const html = "<div><br /></div>";
    const parser = new Parser(html);
    expect(parser.parsedHTML).toEqual([
      { tagName: "div", children: [{ tagName: "br" }] },
    ]);
  });
  test("sibling children", () => {
    const html =
      "<div><br /><a></a><ul><li></li><li></li></ul><span></span></div>";
    const parser = new Parser(html);
    expect(parser.parsedHTML).toEqual([
      {
        tagName: "div",
        children: [
          { tagName: "br" },
          { tagName: "a" },
          { tagName: "ul", children: [{ tagName: "li" }, { tagName: "li" }] },
          { tagName: "span" },
        ],
      },
    ]);
  });
});

describe("gets attributes for a tag correctly", () => {
  test("attribute of a single tag", () => {
    const html = "<div class='main'></div>";
    const parser = new Parser(html);
    expect(parser.parsedHTML).toEqual([
      {
        tagName: "div",
        attributes: {
          class: "main",
        },
      },
    ]);
  });
  test("attribute of a single tag, no quotes around attribute value", () => {
    const html = "<div class=main></div>";
    const parser = new Parser(html);
    expect(parser.parsedHTML).toEqual([
      {
        tagName: "div",
        attributes: {
          class: "main",
        },
      },
    ]);
  });
  test("multiple attributes", () => {
    const html = "<a class='aaa bbb' href='#'></a>";
    const parser = new Parser(html);
    expect(parser.parsedHTML).toEqual([
      {
        tagName: "a",
        attributes: {
          class: "aaa bbb",
          href: "#",
        },
      },
    ]);
  });
});

describe("get text within tags", () => {
  test("text within one attribute", () => {
    const html = "<body>My text</body>";
    const parser = new Parser(html);
    expect(parser.parsedHTML).toEqual([
      {
        tagName: "body",
        children: ["My text"],
      },
    ]);
  });
  test("sibling text", () => {
    const html = "<body><div>My text<span> hello </span> yes</div></body>";
    const parser = new Parser(html);
    expect(parser.parsedHTML).toEqual([
      {
        tagName: "body",
        children: [
          {
            tagName: "div",
            children: [
              "My text",
              {
                tagName: "span",
                children: [" hello "],
              },
              " yes",
            ],
          },
        ],
      },
    ]);
  });
});

describe("complete example", () => {
  test("full html", () => {
    const html = `
      <html><body class='container' style='background: "blue";'><h1>Header</h1><a href='localhost:8080'>my website</a></body></html>
    `.trim();
    const parser = new Parser(html);
    expect(parser.parsedHTML).toEqual([
      {
        tagName: "html",
        children: [
          {
            tagName: "body",
            attributes: {
              class: "container",
              style: 'background: "blue";',
            },
            children: [
              {
                tagName: "h1",
                children: ["Header"],
              },
              {
                tagName: "a",
                attributes: {
                  href: "localhost:8080",
                },
                children: ["my website"],
              },
            ],
          },
        ],
      },
    ]);
  });
});
