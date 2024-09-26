const fs = require('fs');
const path = require('path');

// 递归读取目录下的所有文件
const getAllFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      fileList = getAllFiles(filePath, fileList);
    } else if (filePath.endsWith('.js')) {
      fileList.push(filePath);
    }
  });

  return fileList;
};

// 转换方法名
const transformMethodNames = content => {
  // 匹配 async function
  return content.replace(/(\w+): async function \(/g, 'async $1(')
    // 匹配普通 function
    .replace(/(\w+): function \(/g, '$1(');
};

// 扫描并转换文件
const scanAndTransformFiles = dir => {
  const jsFiles = getAllFiles(dir);

  jsFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const transformedContent = transformMethodNames(content);

    fs.writeFileSync(file, transformedContent, 'utf8');
    console.log(`Transformed: ${file}`);
  });
};

// 扫描和转换当前目录下的所有 JS 文件
const currentDir = path.resolve('.');
scanAndTransformFiles(currentDir);
