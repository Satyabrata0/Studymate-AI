import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const psScript = `
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead("studymate-ai-deploy.zip")
foreach ($entry in $zip.Entries) {
    Write-Host $entry.FullName
}
$zip.Dispose()
`;

fs.writeFileSync('read_zip.ps1', psScript);
try {
  const out = execSync('powershell -ExecutionPolicy Bypass -File read_zip.ps1').toString();
  console.log("Zip Contents:\n" + out);
} catch (err) {
  console.error(err.message);
} finally {
  if (fs.existsSync('read_zip.ps1')) fs.unlinkSync('read_zip.ps1');
}
