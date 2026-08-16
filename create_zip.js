import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import AdmZip from 'adm-zip';

console.log("Building production bundle...");
execSync('npm run build', { stdio: 'inherit' });

console.log("Packaging cross-platform Linux ZIP with POSIX forward slashes...");

const zip = new AdmZip();

function addFolderRecursively(localDir, zipDir) {
  const items = fs.readdirSync(localDir);
  for (const item of items) {
    if (item === 'node_modules' || item === '.git' || item === 'studymate-ai-deploy.zip' || item.endsWith('.env')) continue;
    const localPath = path.join(localDir, item);
    const zipPath = `${zipDir}/${item}`;
    const stat = fs.statSync(localPath);

    if (stat.isDirectory()) {
      addFolderRecursively(localPath, zipPath);
    } else {
      const buffer = fs.readFileSync(localPath);
      zip.addFile(zipPath, buffer);
    }
  }
}

// Add root files
const rootFiles = ['Dockerfile', 'Dockerrun.aws.json', 'package.json', 'package-lock.json', 'tsconfig.json'];
rootFiles.forEach(file => {
  if (fs.existsSync(file)) {
    zip.addLocalFile(file);
  }
});

// Add folders with Linux forward slash formatting
['dist', 'frontend', 'backend'].forEach(folder => {
  if (fs.existsSync(folder)) {
    addFolderRecursively(folder, folder);
  }
});

zip.writeZip('studymate-ai-deploy.zip');
console.log("POSIX Linux ZIP archive created successfully!");
