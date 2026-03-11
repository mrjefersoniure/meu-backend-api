import fs from 'fs';
import path from 'path';

function replaceInFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Revert the previous bad replacements
  content = content.replace(/fetch\(`\$\{API_URL\}\/api\//g, "fetch('/api/");
  
  // Do it properly:
  // For single quotes: fetch('/api/xxx') -> fetch(`${API_URL}/api/xxx`)
  content = content.replace(/fetch\('(\/api\/[^']+)'/g, 'fetch(`${API_URL}$1`');
  
  // For backticks: fetch(`/api/xxx${var}`) -> fetch(`${API_URL}/api/xxx${var}`)
  content = content.replace(/fetch\(`(\/api\/[^`]+)`/g, 'fetch(`${API_URL}$1`');
  
  fs.writeFileSync(filePath, content);
}

replaceInFile('./src/App.tsx');
replaceInFile('./src/components/GlobalAdminView.tsx');
replaceInFile('./src/components/LoginForm.tsx');
console.log('Done');
