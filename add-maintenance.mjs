import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const pagesToProcess = [
  { file: 'pages/artikel/[id].vue', key: 'artikel', title: 'Artikel Paroki' },
  { file: 'pages/artikel/kategori/[id].vue', key: 'artikel', title: 'Kategori Artikel' },
]

for (const p of pagesToProcess) {
  const filePath = path.join(__dirname, p.file)
  if (!fs.existsSync(filePath)) {
    console.log(`[SKIPPED] ${p.file} - File not found`)
    continue
  }
  
  let content = fs.readFileSync(filePath, 'utf-8')
  
  if (content.includes('<PageMaintenance')) {
    console.log(`[SKIPPED] ${p.file} - Already has maintenance wrapper`)
    continue
  }
  
  // Wrap template
  content = content.replace(/<template>/, `<template>\n  <div>\n    <PageMaintenance v-if="isMaintenance" title="${p.title}" />\n    <div v-else>`)
  // Replace the last </template>
  const templateEndIndex = content.lastIndexOf('</template>')
  if (templateEndIndex !== -1) {
    content = content.slice(0, templateEndIndex) + '    </div>\n  </div>\n</template>' + content.slice(templateEndIndex + 11)
  }
  
  // Inject script
  const scriptMatch = content.match(/<script setup[^>]*>/)
  if (scriptMatch) {
    content = content.replace(scriptMatch[0], `${scriptMatch[0]}\nconst { isMaintenance } = useMaintenance('${p.key}')`)
  } else {
    // If no script setup, find <script> or add one at the end
    content += `\n<script setup lang="ts">\nconst { isMaintenance } = useMaintenance('${p.key}')\n</script>\n`
  }
  
  fs.writeFileSync(filePath, content, 'utf-8')
  console.log(`[PROCESSED] ${p.file}`)
}
