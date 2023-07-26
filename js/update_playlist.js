const fs = require("fs");
const path = require("path");

const folderPath = "audio/";
const files = fs.readdirSync(folderPath);

const fileArray = files.map((file) => {
  const base = path.parse(file).base;
  const name = path.parse(file).name;
  const ext = path.parse(file).ext;
  const pathx = folderPath +base;
  return {base, name, type: ext, path: pathx };
}); 

console.log(
  fileArray.map((item) => `{base:${item.base},name:${item.name},type:${item.type},path:${item.path}}`).join(", ")
);
let data =
  "playList =[" +
  fileArray.map((item) => `{base:"${item.base}",name:"${item.name}",type:"${item.type}",path:"${item.path}"}`).join(", ") +
  "]";

fs.writeFile("js/playlist.js", data, function (err) {
  if (err) throw err;
  console.log("Saved!");
});
