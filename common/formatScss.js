const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const postcssScss = require('postcss-scss');

// 读取文件内容
function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

// 写入文件内容
function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

// 定义属性顺序
const propertyOrder = [
  // 定位
  'position', 'top', 'right', 'bottom', 'left', 'z-index',
  // 盒模型
  'display', 'flex', 'flex-direction', 'justify-content', 'align-items', 'align-content',
  'width', 'height', 'margin', 'padding', 'border', 'border-radius', 'box-sizing',
  // 背景
  'background', 'background-color', 'background-image', 'background-position', 'background-size', 'background-repeat',
  // 字体和文本样式
  'font', 'font-size', 'font-weight', 'line-height', 'text-align', 'text-decoration', 'color',
  // 其他视觉样式
  'opacity', 'visibility', 'overflow', 'transform', 'transition'
];

// 排序规则函数
function sortRules(rules) {
  return rules.sort((a, b) => {
    const aIndex = propertyOrder.indexOf(a.prop);
    const bIndex = propertyOrder.indexOf(b.prop);

    if (aIndex === -1 && bIndex === -1) {
      return a.prop.localeCompare(b.prop);
    }
    if (aIndex === -1) {
      return 1;
    }
    if (bIndex === -1) {
      return -1;
    }
    return aIndex - bIndex;
  });
}

// 格式化SCSS内容
function formatScss(content) {
  const root = postcss.parse(content, { syntax: postcssScss });
  
  root.walkRules(rule => {
    const declarations = rule.nodes.filter(node => node.type === 'decl');
    const otherNodes = rule.nodes.filter(node => node.type !== 'decl');
    const sortedDeclarations = sortRules(declarations);

    rule.removeAll();
    rule.append(sortedDeclarations);
    rule.append(otherNodes);
  });

  return root.toString();
}

// 处理单个文件
function processFile(filePath) {
  const content = readFile(filePath);
  const formattedContent = formatScss(content);

  // 生成新的文件路径
  const dir = path.dirname(filePath);
  const ext = path.extname(filePath);
  const baseName = path.basename(filePath, ext);
  const newFilePath = path.join(dir, `${baseName}-formatted${ext}`);
  
  writeFile(newFilePath, formattedContent);
}

// 递归处理目录下的所有文件
function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.lstatSync(filePath);

    if (stat.isDirectory()) {
      processDirectory(filePath); // 递归处理子目录
    } else if (path.extname(file) === '.scss') {
      processFile(filePath); // 处理 SCSS 文件
    }
  });
}

// 执行脚本
const currentDirectoryPath = process.cwd();
processDirectory(currentDirectoryPath);

console.log('SCSS files have been formatted.');
