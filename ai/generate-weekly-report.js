import { createXai } from '@ai-sdk/xai'
import { generateText } from 'ai'
import { execSync } from 'child_process'
import dotenv from 'dotenv'
import fs from 'fs' // ← 新增
import path from 'path'

import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// === 強制清除舊 Key + 強制使用 .env ===
delete process.env.XAI_API_KEY
process.env.XAI_API_KEY = undefined

const result = dotenv.config({
  path: path.resolve(__dirname, '.env'),
  override: true,
  debug: true,
})

console.log('=== API Key 強制載入狀態 ===')
console.log('載入成功?', !result.error)
console.log('目前使用的 Key 前10碼:', process.env.XAI_API_KEY ? process.env.XAI_API_KEY.substring(0, 10) : '無')
console.log('目前完整 Key 長度:', process.env.XAI_API_KEY ? process.env.XAI_API_KEY.length : 0)
console.log('================================\n')

if (!process.env.XAI_API_KEY || !process.env.XAI_API_KEY.startsWith('xai-')) {
  console.error('錯誤：Key 載入失敗')
  process.exit(1)
}

// ==================== 取得 Git 週報資料 ====================
let gitSummary = ''

try {
  gitSummary = execSync(`git log --author="Tim" --since="1 week ago"`, { encoding: 'utf8' }).trim()
} catch (err) {
  console.error('無法取得 Git log，請確認目前在 Git 專案目錄下')
  gitSummary = '（無法取得 Git 記錄）'
}

// ==================== 呼叫 Grok 生成週報 ====================
const xai = createXai({
  apiKey: process.env.XAI_API_KEY,
})

const { text } = await generateText({
  model: xai('grok-4.3'),

  prompt: `
  你是一位專業的前端工程師，請根據以下 Git commit 記錄，產生符合 Marp 格式的 Weekly Report Markdown。
  **嚴格要求：**
1. 全部使用英文
2. 第一頁必須是標題頁，包含：
   - # Weekly Report
   - **Author: Tim Chou**
   - **Period: June 11–12, 2026**（或當週日期）
3. 內容結構：
   - Main Tasks and Work Items（佔約 75-80%）
   - Impact（佔約 20%）
4. **分頁規則（非常重要）：**
   - 每張投影片最多 5-6 個 bullet points
   - 每個主要功能或模組請獨立成一張 slide
   - 如果內容太多，**必須**使用 --- 進行分頁
   - 不要讓任何一張 slide 內容過長導致被切掉
5. 內容要清晰、專業、簡潔，使用 bullet points 詳細描述做了什麼、哪些模組、哪些功能、bug fix、refactor 等
6. 全局樣式：
   ---
   marp: true
   backgroundColor: #f8f9fa
   backgroundImage: "linear-gradient(to bottom, #f8f9fa, #e9ecef)"
   ---
7. 最後一頁加上 **Thank you for reading!**
8. 產生的內容**不要**包含 \`\`\`markdown 標記，直接輸出純 Marp Markdown
Git commit 記錄: 
${gitSummary}
`,

  maxTokens: 1200,
  temperature: 0.7,
})

// ==================== 儲存為 weekly-report.md ====================
const reportPath = path.resolve(__dirname, 'weekly-report.md')

try {
  fs.writeFileSync(reportPath, text, 'utf8')
  console.log(`\n✅ Weekly report 已成功儲存至：${reportPath}`)
} catch (err) {
  console.error('❌ 寫入檔案失敗：', err.message)
}

console.log('\n=== AI 生成的週報內容 ===')
console.log(text)
