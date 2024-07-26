const fs = require('fs');
const path = require('path');

// 读取 fs.proj.js 文件
const filePath = path.join(__dirname, 'fs.proj.js');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    // 提取 export default 后面的数组部分
    const arrayMatch = data.match(/export default (\[.*?\]);/s);
    if (!arrayMatch) {
        console.error('No array found in the export default statement.');
        return;
    }

    // 将字符串转换为数组
    const fileNames = eval(arrayMatch[1]);

    // 获取文件后缀的函数
    const getFileExtension = (fileName) => {
        const parts = fileName.split('.');
        return parts.length > 1 ? parts.pop().toLowerCase() : '';
    };

    // 根据文件后缀分类的函数
    const categorizeByExtension = (fileNames) => {
        return fileNames.reduce((acc, fileName) => {
            const ext = getFileExtension(fileName);
            if (!acc[ext]) {
                acc[ext] = [];
            }
            acc[ext].push(fileName);
            return acc;
        }, {});
    };

    // 分类文件名数组
    const categorizedFiles = categorizeByExtension(fileNames);

    // 准备输出结果
    const outputContent = JSON.stringify(categorizedFiles, null, 2);

    // 将结果写入 result.json 文件
    const resultFilePath = path.join(__dirname, 'result.json');
    fs.writeFile(resultFilePath, outputContent, 'utf8', (err) => {
        if (err) {
            console.error('Error writing result to file:', err);
            return;
        }
        console.log(`Categorized file names have been written to ${resultFilePath}`);
    });
});