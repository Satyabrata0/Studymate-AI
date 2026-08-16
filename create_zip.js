import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log("Building production bundle...");
execSync('npm run build', { stdio: 'inherit' });

console.log("Packaging deployment zip bundle (excluding node_modules)...");

const psScript = `
$tempFolder = "$env:TEMP\\eb-deploy-temp"
if (Test-Path $tempFolder) { Remove-Item -Recurse -Force $tempFolder }
New-Item -ItemType Directory -Path $tempFolder | Out-Null

Copy-Item Dockerfile "$tempFolder\\"
Copy-Item package.json "$tempFolder\\"
Copy-Item package-lock.json "$tempFolder\\"
Copy-Item tsconfig.json "$tempFolder\\"
Copy-Item -Recurse dist "$tempFolder\\dist"
Copy-Item -Recurse backend "$tempFolder\\backend" -Exclude "node_modules"
Copy-Item -Recurse frontend "$tempFolder\\frontend" -Exclude "node_modules"

if (Test-Path "$tempFolder\\frontend\\node_modules") { Remove-Item -Recurse -Force "$tempFolder\\frontend\\node_modules" }
if (Test-Path "$tempFolder\\backend\\node_modules") { Remove-Item -Recurse -Force "$tempFolder\\backend\\node_modules" }

Compress-Archive -Path "$tempFolder\\*" -DestinationPath studymate-ai-deploy.zip -Force
Remove-Item -Recurse -Force $tempFolder
`;

fs.writeFileSync('make_zip.ps1', psScript);
execSync('powershell -ExecutionPolicy Bypass -File make_zip.ps1', { stdio: 'inherit' });
fs.unlinkSync('make_zip.ps1');

console.log("Lightweight zip package created successfully!");
