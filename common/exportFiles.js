const xlsx = require('xlsx');
const fs = require('fs');

const data = [{ "date": "20240906", "value": "1057" }, { "date": "20240907", "value": "1984" }, { "date": "20240921", "value": "3506" }, { "date": "20240920", "value": "2740" }, { "date": "20240831", "value": "624" }, { "date": "20240924", "value": "1011" }, { "date": "20240925", "value": "1147" }, { "date": "20240903", "value": "989" }, { "date": "20240902", "value": "1041" }, { "date": "20240909", "value": "2523" }, { "date": "20240908", "value": "1476" }, { "date": "20240918", "value": "2827" }, { "date": "20240919", "value": "2804" }, { "date": "20240912", "value": "2014" }, { "date": "20240913", "value": "1637" }, { "date": "20240917", "value": "3673" }, { "date": "20240916", "value": "4449" }, { "date": "20240914", "value": "2145" }, { "date": "20240915", "value": "2842" }, { "date": "20240911", "value": "2470" }, { "date": "20240910", "value": "2736" }, { "date": "20240901", "value": "1569" }, { "date": "20240922", "value": "1579" }, { "date": "20240923", "value": "737" }, { "date": "20240905", "value": "1073" }, { "date": "20240904", "value": "1213" }]

// 创建一个新的工作簿
const workbook = xlsx.utils.book_new();

// 将数据转换为工作表
const worksheet = xlsx.utils.json_to_sheet(data);

// 将工作表添加到工作簿
xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

// 将工作簿写入文件
xlsx.writeFile(workbook, 'output.xlsx');

console.log('Excel file has been created successfully.');