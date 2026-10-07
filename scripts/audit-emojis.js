import fs from 'fs';
import path from 'path';

const emojiRegex = /(\p{Extended_Pictographic}|\p{Emoji_Presentation})/u;

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        results = results.concat(walk(fullPath));
      }
    } else if (/\.(jsx?|tsx?)$/.test(file)) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = walk('./src');
const emojiUsage = {};

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (emojiRegex.test(line)) {
      if (!emojiUsage[f]) emojiUsage[f] = [];
      emojiUsage[f].push({ line: idx + 1, text: line.trim() });
    }
  });
});

let out = '';
let total = 0;
for (const [file, items] of Object.entries(emojiUsage)) {
  total += items.length;
  out += `\n=== ${file} (${items.length} occurrences) ===\n`;
  items.forEach(i => {
    out += `  L${i.line}: ${i.text}\n`;
  });
}
out += `\nTOTAL EMOJI OCCURRENCES: ${total}\n`;

fs.writeFileSync('./scripts/audit-results.txt', out, 'utf8');
console.log(`Audit complete: ${total} occurrences written to scripts/audit-results.txt`);
