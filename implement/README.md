# 檔案角色   
| 檔案             | 作用        |
| --------------- | ---------   |
| core.ts         | 怎麼做 -> Implementation       |
| README.md       | 我要不要用這個 -> decision  |
| usage.md        | 我要怎麼用 (copy-pasts) -> execution     |
| design-notes.md | 為什麼這樣設計 -> reasioning    |

---

# design-notes.md 的目的不是記 code，是避免你未來推翻你自己。
   - Code 只能告訴你「怎麼做」，但不能告訴你「為什麼這樣做」    
   - 你未來會「忘記當初的 tradeoff」。今天你覺得合理的設計，三個月後你會開始懷疑。如果沒有 design notes，你會重複踩同樣的坑。
   - 它是「防止你自己重構自己」的文件，很多工程問題不是 bug，是人一直推翻自己以前的設計。
   - design-notes.md 的作用是: 幫你保留「當初為什麼這樣設計是合理的證據」。  

---

# 🧪 usage.md = 操作手冊
   - 回答：
     我要怎麼用？

   - 內容：
     - 最短可用 code
     - copy-paste example
     - real scenario   
     - ❌不解釋 why       

---

# 🧠 design-notes.md = 思考歷史

- 回答：
  為什麼這樣設計？

- 內容：
  - tradeoff
  - rejected solutions
  - architecture thinking
