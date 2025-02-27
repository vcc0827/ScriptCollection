import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

// 配置项
const CONFIG = {
  markers: [
    'package.json',
    'Cargo.toml',
    'pyproject.toml',
    'build.gradle',
    'pom.xml',
    '.git'
  ],
  exclude: ['node_modules', '.git', 'dist', 'build', '.cache'],
  maxDepth: 1,
  sizeUnit: 'MB'
};

// 增强版错误处理
async function safeStat(path) {
  try {
    return await fs.stat(path);
  } catch (error) {
    console.log(chalk.dim(`[跳过] 无法访问: ${path}`));
    return null;
  }
}

async function safeReaddir(path) {
  try {
    return await fs.readdir(path);
  } catch (error) {
    console.log(chalk.dim(`[跳过] 目录不可读: ${path}`));
    return [];
  }
}

// 项目检测（带路径验证）
async function isProjectFolder(currentPath, depth = 0) {
  const stats = await safeStat(currentPath);
  if (!stats || !stats.isDirectory()) return false;

  const files = await safeReaddir(currentPath);
  if (files.some(file => CONFIG.markers.includes(file))) return true;

  if (depth >= CONFIG.maxDepth) return false;

  for (const file of files) {
    const fullPath = path.join(currentPath, file);
    const childStats = await safeStat(fullPath);
    
    if (childStats?.isDirectory() && 
        !CONFIG.exclude.includes(file) &&
        !file.startsWith('.')) {
      if (await isProjectFolder(fullPath, depth + 1)) {
        return true;
      }
    }
  }
  return false;
}

// 稳健的大小计算
async function calculateSize(folderPath) {
  let total = 0;
  
  async function scan(currentPath) {
    const entries = await fs.readdir(currentPath, { withFileTypes: true }).catch(() => []);
    
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      
      try {
        if (entry.isDirectory()) {
          if (CONFIG.exclude.includes(entry.name)) continue;
          await scan(fullPath);
        } else {
          const stats = await safeStat(fullPath);
          if (stats) total += stats.size;
        }
      } catch (error) {
        console.log(chalk.dim(`[跳过] ${fullPath}: ${error.message}`));
      }
    }
  }

  await scan(folderPath);
  return total;
}

// 主程序（带进度清理）
async function analyzeProjects(rootDir = process.cwd()) {
  console.log(chalk.blue('🔍 开始扫描项目文件夹...'));
  
  const items = await safeReaddir(rootDir);
  const results = [];

  for (const [index, name] of items.entries()) {
    if (CONFIG.exclude.includes(name)) continue;
    
    const folderPath = path.join(rootDir, name);
    process.stdout.write(`\r🔄 扫描进度: ${index + 1}/${items.length}`);

    if (await isProjectFolder(folderPath)) {
      const sizeBytes = await calculateSize(folderPath);
      const sizeMB = sizeBytes / (1024 ** 2);
      
      results.push({
        name,
        path: folderPath,
        size: `${sizeMB.toFixed(2)} ${CONFIG.sizeUnit}`
      });
    }
  }

  process.stdout.clearLine();
  console.log('\n✅ 扫描完成！');
  return results.sort((a, b) => 
    parseFloat(b.size) - parseFloat(a.size)
  );
}

// 终端友好输出
function formatOutput(results) {
  console.log(chalk.bold('\n项目大小统计：'));
  
  if (!results.length) {
    console.log(chalk.yellow('⚠️ 未发现有效项目目录'));
    return;
  }

  const maxNameLen = Math.max(...results.map(p => p.name.length));
  
  results.forEach((project, index) => {
    console.log(
      `${chalk.blue(`#${index + 1}`)} ${chalk.cyan(project.name.padEnd(maxNameLen))} ` +
      chalk.yellow(project.size)
    );
    console.log(chalk.gray(`  ${project.path}`));
    console.log(chalk.dim('-'.repeat(50)));
  });
}

// 启动程序
analyzeProjects()
  .then(formatOutput)
  .catch(error => {
    console.log(chalk.red('\n❌ 扫描中断：'), error.message);
    process.exit(1);
  });