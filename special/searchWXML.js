const fs = require('fs');
const path = require('path');

// 要扫描的文件路径
const filePath = path.join(__dirname, 'fs.proj.js'); // 假设文件在当前目录下

// 存储结果的数组
let resultLines = [];

// 检查文件内容并提取包含'wxml'的行
function scanFile(file) {
    if (fs.existsSync(file)) {
        const contents = fs.readFileSync(file, 'utf8');
        const lines = contents.split('\n');
        lines.forEach(line => {
            if (line.includes('wxml')) {
                resultLines.push(line.trim());
            }
        });
    } else {
        console.log(`文件 ${file} 不存在`);
    }
}

// 开始扫描
scanFile(filePath);

// 将结果写入files.json
fs.writeFileSync('files.json', JSON.stringify(resultLines, null, 2), 'utf8');

console.log('扫描完成，结果已写入files.json');