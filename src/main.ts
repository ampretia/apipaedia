import * as fs from "fs";
import * as path from "path";
import RewritingStream from "parse5-html-rewriting-stream";

const root = path.resolve(__dirname, "..");

const htmlRoot = path.join(root, "jsdoc", "index.html");

const rewriter = new RewritingStream();

// Replace divs with spans
rewriter.on("startTag", startTag => {
  rewriter.emitStartTag(startTag);
  if (startTag.tagName === "body") {
    console.log(startTag);
    rewriter.emitRaw("<wibble>");
  }
});

rewriter.on("endTag", endTag => {
  if (endTag.tagName === "head") {
    console.log(endTag);
    rewriter.emitRaw("<wobble>");
  }
  rewriter.emitEndTag(endTag);
});
const file = fs.createWriteStream("temp.html");
const stream = fs.createReadStream(htmlRoot, "utf8");
stream.pipe(rewriter).pipe(file);
