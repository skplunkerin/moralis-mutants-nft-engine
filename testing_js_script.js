const console = require("console");
const dotenv = require("dotenv");
dotenv.config(); // setup dotenv
const {
  layers1,
  layers2,
  width,
  height,
  editionSize,
  startEditionFrom,
  rarityWeights,
} = require("./input/config.js");

console.log("config.js imported...");
// console.log("-------------");
// // console.log("layers1:", layers1);
// // console.log("-------------");
// console.log("layers2:", layers2);
// console.log("-------------");
