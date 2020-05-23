import { getPage } from "./util.js";

async function init() {
  const html = await getPage("JavaScript");
  console.log(html);
}

init();
