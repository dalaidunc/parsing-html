import https from "https";

const baseURL = "https://en.wikipedia.org/wiki/";

export function getPage(page) {
  const url = baseURL + page;
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let htmlString = "";
        res.on("data", (data) => {
          htmlString += data;
        });

        res.on("end", () => {
          resolve(htmlString);
        });
      })
      .on("error", (error) => {
        console.error(error);
        reject(error);
      });
  });
}
