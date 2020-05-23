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
});
