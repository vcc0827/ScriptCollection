const { info } = require('console');
const fs = require('fs');
const path = require('path');

// 扫描目录并返回所有文件路径
function getFiles(dir, files_) {
    files_ = files_ || [];
    const files = fs.readdirSync(dir);
    for (const i in files) {
        const name = path.join(dir, files[i]);
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files_);
        } else if (name.endsWith('.js')) {
            files_.push(name);
        }
    }
    return files_;
}

// 从文件中提取以 wx.mew 开头的句子
function extractSentences(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(/[\r\n]+/);
    const sentences = [];
    const regex = /\bwx\.mew\.[^\s=;]+/g;

    lines.forEach(line => {
        let match;
        while ((match = regex.exec(line)) !== null) {
            sentences.push(match[0] + ';');
        }
    });

    return sentences;
}

// 将结果写入 output.txt，并去重
function writeOutput(fileMap) {
    const output = [];

    for (const file in fileMap) {
        const uniqueSentences = [...new Set(fileMap[file])]; // 去重
        uniqueSentences.forEach(sentence => {
            output.push({
                path: file,
                child: sentence
            });
        });
    }
    // output.push(fileMap)
    try {
        fs.writeFileSync('uni.json', JSON.stringify(output,null,2), 'utf-8');
        console.log('the result is in output.txt');
    } catch (error) {
        
    }
}

// 主函数
function main() {
    const startDir = '../tuodan-mini';  // 请根据需要更改起始目录
    const files = getFiles(startDir);
    const fileMap = {};

    files.forEach(file => {
        const sentences = extractSentences(file);
        if (sentences.length > 0) {
            fileMap[file] = sentences;
        }
    });

    writeOutput(fileMap);
}

main();
