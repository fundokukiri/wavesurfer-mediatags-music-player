const fs = require("fs");
const path = require("path");

const folderPath = "./audio";
const files = fs.readdirSync(folderPath);

const fileArray = files.map((file) => {
  const name = path.parse(file).name;
  const ext = path.parse(file).ext;
  return { name, type: ext };
});

console.log(
  fileArray.map((item) => `{name:${item.name},type:${item.type}}`).join(", ")
);
let data =
  "playList =[" +
  fileArray
    .map((item) => `{name:"${item.name}",type:"${item.type}"}`)
    .join(", ") +
  "]";

fs.writeFile("./js/playlist.js", data, function (err) {
  if (err) throw err;
  console.log("Saved!");
});
