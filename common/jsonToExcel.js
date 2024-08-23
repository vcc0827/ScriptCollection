const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const readline = require('readline');

// 创建 readline 接口，用于获取用户输入
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 询问用户要转换的 JSON 文件名
rl.question('请输入要转换的 JSON 文件名（可以省略 .json 后缀）：', (inputFileName) => {
    // 默认文件扩展名为 .json
    const jsonFileName = inputFileName.endsWith('.json') ? inputFileName : `${inputFileName}.json`;

    // 获取当前脚本所在目录
    const currentDirectory = __dirname;

    // 构建 JSON 文件的完整路径
    const jsonFilePath = path.join(currentDirectory, jsonFileName);

    // 检查文件是否存在
    if (!fs.existsSync(jsonFilePath)) {
        console.error(`文件 ${jsonFileName} 不存在，请检查文件名后重试。`);
        rl.close();
        return;
    }

    // 读取 JSON 文件内容
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

    // 获取表名（第一个对象的键名）
    const tableName = Object.keys(jsonData)[0];

    // 获取数据数组
    const dataArray = jsonData[tableName];

    // 将 JSON 数据转换为工作簿格式
    const worksheet = xlsx.utils.json_to_sheet(dataArray);

    // 创建一个新的工作簿并附加工作表
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, tableName);

    // 输出 Excel 文件
    const excelFileName = `${tableName}.xlsx`;  // 输出文件名为表名
    const excelFilePath = path.join(currentDirectory, excelFileName);
    xlsx.writeFile(workbook, excelFilePath);

    console.log(`Excel 文件已成功保存为 ${excelFilePath}`);

    // 关闭 readline 接口
    rl.close();
});