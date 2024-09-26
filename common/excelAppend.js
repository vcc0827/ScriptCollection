const xlsx = require('xlsx');
const path = require('path');

// 读取 Excel 文件
const filePath = path.join(__dirname, 'errorFile.xlsx'); // 替换为您的 Excel 文件名
const workbook = xlsx.readFile(filePath);
const sheetName = workbook.SheetNames[0]; // 默认使用第一个工作表
const worksheet = workbook.Sheets[sheetName];

// 将工作表转换为 JSON 数据
const data = xlsx.utils.sheet_to_json(worksheet);

// 处理数据，生成新的 URL
data.forEach(row => {
    const playbackId = row['回放id'];
    if (playbackId) {
        const [date, sessionIdPart] = playbackId.split('/');
        const sessionId = `${date}%2F${sessionIdPart}`;
        const newUrl = `https://dev.weixin.qq.com/console/analytics/sessions?id=wx725f33fc0066b85f&spaceId=wx400488f53485bc1b&sessionId=${sessionId}`;
        https://dev.weixin.qq.com/console/analytics/sessions?id=wx725f33fc0066b85f&spaceId=wx400488f53485bc1b&sessionId=202409192233%2F6de2e-69df-41ca-2e4e-39a67
        // 将新的 URL 添加到行中
        row['新链接'] = newUrl; // 创建新列“新链接”并赋值
    }
});

// 将处理后的数据写回新的 Excel 文件
const newWorksheet = xlsx.utils.json_to_sheet(data);
const newWorkbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, 'Processed Data');
xlsx.writeFile(newWorkbook, path.join(__dirname, 'processed_file.xlsx')); // 生成新的文件

console.log('处理完成，生成新的 Excel 文件 processed_file.xlsx');