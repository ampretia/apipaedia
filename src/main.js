const fs = require("fs-extra");
const path = require("path");
const { pipeline } = require("stream");
const vfs = require("vinyl-fs");
const HtmlTransform = require("./go2.js");
const nunjucks = require("nunjucks");
const resourceDir = path.resolve(__dirname, "..", "resources");
let templateRoot = path.join(resourceDir, "templates");

nunjucks.configure(templateRoot);

let data = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data.json")));

let indexRoot = path.resolve("./output");
fs.emptyDirSync(indexRoot);

const main = () => {
  let transformsToDo = [];
  for (const component in data.components) {
    for (const version in data.components[component]) {
      for (const language in data.components[component][version]) {
        data.components[component][version][language].opPath = path.join(
          component,
          version,
          language
        );
      }
    }
  }

  for (const component in data.components) {
    for (const version in data.components[component]) {
      for (const language in data.components[component][version]) {
        const newHtml = nunjucks.render("navigation.html", {
          component,
          version,
          language,
          data
        });

        const opPath = path.join(indexRoot, component, version, language);
        const ipPath = data.components[component][version][language].url;

        const jsdoc = new HtmlTransform(ipPath, opPath, newHtml);
        jsdoc.run();
      }
    }
  }

  fs.writeFileSync(
    path.join(indexRoot, "index.html"),
    nunjucks.render("index.njk", data)
  );
  fs.writeFileSync(
    path.join(indexRoot, "script.js"),
    nunjucks.render("script.njk", data)
  );

  pipeline(
    vfs.src(["resources/imgs/*"], {
      buffer: true
    }),
    vfs.dest(`${indexRoot}/imgs`),
    err => {
      if (err) {
        console.error("Pipeline failed.", err);
      } else {
        console.log("Pipeline succeeded.");
      }
    }
  );
};

main();
// .then(() => {
//   process.exit(0);
// })
// .catch(err => {
//   console.log(err);
//   process.exit(-1);
// });
