import fs from 'fs/promises';
import path from 'path';
import { rimraf } from 'rimraf';

async function deleteNodeModules(dir = process.cwd()) {
    let deletedCount = 0;
    
    async function scanDirectory(currentPath) {
        const files = await fs.readdir(currentPath);
        
        for (const file of files) {
            const filePath = path.join(currentPath, file);
            const stats = await fs.lstat(filePath);

            if (stats.isDirectory()) {
                if (file === 'node_modules') {
                    console.log(`🗑️  Deleting ${filePath}`);
                    await rimraf(filePath);
                    deletedCount++;
                } else {
                    await scanDirectory(filePath);
                }
            }
        }
    }

    console.log('🚀 Starting node_modules cleanup...');
    await scanDirectory(dir);
    console.log(`✅ Cleanup complete! Deleted ${deletedCount} node_modules directories`);
}

// 执行并捕获错误
deleteNodeModules().catch(err => {
    console.error('❌ Cleanup failed:', err);
    process.exit(1);
});