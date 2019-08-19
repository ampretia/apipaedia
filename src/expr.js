const { Transform, pipeline } = require("stream");
const fs = require("fs-extra");
const path = require("path");
const vfs = require("vinyl-fs");
const cheerio = require("cheerio");

const html = fs.readFileSync("./jsdoc/classes.list.html", "utf8");
// const style = `<style>
// .pae-container {
//     display: inline-block;
//     cursor: pointer;
//     position: fixed;
//     top: 0;
//     right: 0;
//   }

// </style>`;
const style = fs.readFileSync("./resources/navigation.html", "utf8");
console.log(style);
const $ = cheerio.load(html);
$("body").append(style);
console.log($.html());
