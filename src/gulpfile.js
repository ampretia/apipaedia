const { src, dest } = require('gulp');

function copy() {
  return src('jsdoc/**/*',{base:'.'})
    .pipe(dest('output/'));
}

exports.copy = copy;