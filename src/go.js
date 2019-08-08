var map = require('map-stream');
var vfs = require('vinyl-fs');
const RewritingStream = require("parse5-html-rewriting-stream");
var transform = require('vinyl-transform')

var log = function (file, cb) {
  console.log('--------------------------------')
  console.log(file.path)
  console.log(file.isBuffer());
  // file.contents = file.contents.toString();
  cb(null, file);
};

var str = (file,cb) =>{
  // console.log(file.toString());
  console.log('.')
  cb(null,file);
}
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

vfs.src(['jsdoc/**/*'], { buffer: true })
  .pipe(map(log))
  .pipe(transform(()=>rewriter/*map(str)*/))
  .pipe(vfs.dest('./output'));