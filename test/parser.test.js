import Parser from "../src/parser.js";

test("gets a tagName from html", () => {
  const html = "<div>";
  const parser = new Parser(html);
  expect(parser.parsedHTML).toEqual([{ tagName: "div" }]);
});
