const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let input = [];

rl.on("line", function (line) {
  input.push(line);
}).on("close", function () {
  const line = input[0].trim();
  if (line === "") {
    console.log(0);
  } else {
    console.log(line.split(/\s+/).length);
  }
});
