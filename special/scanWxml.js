const fs = require('fs');
const path = require('path');

// 定义要搜索的属性列表
const attributes = [
  'navBarBackable',
  'nav-bar-backable',
  'navBarBackAble',
  'nav-bar-back-able'
];

// 获取当前目录下所有的文件
const files = fs.readdirSync(__dirname);

// 过滤出所有的 .wxml 文件
const wxmlFiles = files.filter(file => path.extname(file) === '.wxml');

// 存储包含目标属性的文件名
const resultFiles = [];

wxmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  // 判断文件内容是否包含目标属性
  const containsAttribute = attributes.some(attribute => 
    content.includes(`<mew-page`) && content.includes(attribute)
  );

  if (containsAttribute) {
    resultFiles.push(file);
  }
});

// 将结果写入 navBarFiles.json
fs.writeFileSync('navBarFiles.json', JSON.stringify(resultFiles, null, 2), 'utf-8');

console.log('扫描完成，结果已导出到 navBarFiles.json');
