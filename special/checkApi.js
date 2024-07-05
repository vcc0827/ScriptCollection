const fs = require("fs");
const path = require("path");

const filesDirectory = "./tuodan-mini"; // 替换为实际的文件夹路径
const outputFileName = "output.json";

// 用于存储文件名和提取的部分
const outputData = [];

// 检查文件是否包含关键词，如果包含则提取指定部分
function checkFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const regex = /wx\.mew\.rpc\.blind\.mini\.[^\s.;]+/g;
  let match;
  while ((match = regex.exec(fileContent)) !== null) {
    if (match[0]) {
      if (!outputData.some(item => item.file === filePath)) {
        outputData.push({ file: filePath, part: [] });
      }
      outputData.find(item => item.file === filePath).part.push(match[0]);
    }
  }
}



// 递归遍历文件夹及其子文件夹，并检查是否包含 JS 文件
function traverseDirectory(directoryPath) {
  const files = fs.readdirSync(directoryPath);
  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      traverseDirectory(filePath); // 递归处理文件夹
    } else if (stats.isFile() && path.extname(file) === ".js") {
      checkFile(filePath); // 检查 JS 文件
    }
  });
}

// 开始遍历目录
traverseDirectory(filesDirectory);

// 将输出数据以 JSON 格式写入新文件
fs.writeFileSync(outputFileName, JSON.stringify(outputData, null, 2), "utf8");

console.log(`Output saved to ${outputFileName}`);
