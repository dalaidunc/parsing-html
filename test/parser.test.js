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
  test("gets 2 tags", () => {
    const html = "<div><div></div></div>";
    const parser = new Parser(html);
    expect(parser.parsedHTML).toEqual([
      { tagName: "div", children: [{ tagName: "div" }] },
    ]);
  });
});
