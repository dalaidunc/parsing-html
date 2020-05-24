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
