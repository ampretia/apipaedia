const { Transform, pipeline } = require("stream");
const fs = require("fs-extra");
const path = require("path");
const vfs = require("vinyl-fs");
const cheerio = require("cheerio");

class HtmlTransform {
  constructor(directory, output, html) {
    this.directory = path.resolve(directory);
    this.output = path.resolve(output);
    fs.ensureDirSync(this.output);
    this.html = html;

    this.transform = new Transform({
      objectMode: true,
      transform(chunk, encoding, cb) {
        let file = chunk;
        console.log(file.path);
        const $ = cheerio.load(file.contents.toString());
        $("body").after(html);
        file.contents = Buffer.from($.html(), "utf8");
        cb(null, file);
      }
    });
  }

  run() {
    console.log(`${this.directory} --> ${this.output}`);
    pipeline(
      vfs.src(["**/*.html"], {
        buffer: true,
        cwd: this.directory
      }),
      this.transform,
      vfs.dest(this.output),
      err => {
        if (err) {
          console.error("Pipeline failed.", err);
        } else {
          console.log("Pipeline succeeded.");
        }
      }
    );

    pipeline(
      vfs.src(["**/*", "!**/*.html"], {
        buffer: true,
        cwd: this.directory
      }),
      vfs.dest(this.output),
      err => {
        if (err) {
          console.error("Pipeline failed.", err);
        } else {
          console.log("Pipeline succeeded.");
        }
      }
    );
  }
}

module.exports = HtmlTransform;
