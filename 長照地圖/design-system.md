# 長照機構搜尋 — 設計系統規格文件

本文件定義專案的完整視覺與互動設計系統，作為知識庫的單一真實來源。所有前端實作必須嚴格遵循此規格，以確保一致性、高級感與溫暖的長照機構美學。

---

## 1. 主題理念

本設計系統以「高級醫院 × 現代長照 App」為核心美學，追求精緻、溫暖且令人安心的視覺體驗。整體氛圍如同走進一家高端長照機構：乾淨、柔和、專業，卻不失人性溫度。背景採用精緻奶茶色調，營造柔和與包容感，避免冰冷的醫療白。高光使用暖琥珀色系，象徵關懷、希望與穩定。英雄區塊透過優雅的長輩照護攝影搭配由上至下的暖色漸層遮罩，建立情感連結並引導視線至核心操作。卡片與輸入元件採用半透明白與細緻邊框，呈現輕盈與層次。圓角偏柔和，避免銳利感，強化親和力。陰影使用低透明度暖棕色調，營造自然浮起的高級質感。互動狀態以微妙縮放與顏色過渡呈現，保持克制而不喧賓奪主。整體優先暖色模式，讓焦慮中的家屬感受到被溫柔接住的感覺。此系統同時支援行動優先與桌面擴展，確保在任何裝置上都能保持一致的優雅與可用性。

---

## 2. 色彩調色盤

所有顏色以 CSS 變數定義，優先使用 HSL 以方便調整明度與飽和度。Hex 僅作為參考。

### 基礎中性色（Neutral）

| Token | CSS 變數 | HSL | Hex | 使用情境 |
|-------|----------|-----|-----|----------|
| background | `--color-bg` | `hsl(36 33% 95%)` | `#F7F3EE` | 頁面主背景、空狀態背景 |
| surface | `--color-surface` | `hsl(40 40% 98%)` | `#FBF9F6` | 輸入欄背景、次要表面 |
| surface-elevated | `--color-surface-elevated` | `hsl(0 0% 100% / 0.95)` | `rgba(255,255,255,0.95)` | 主要卡片、彈出層 |
| border | `--color-border` | `hsl(33 25% 89%)` | `#EDE6DC` | 卡片邊框、分隔線 |
| border-subtle | `--color-border-subtle` | `hsl(33 22% 84%)` | `#E0D5C8` | 輸入欄預設邊框 |
| text-primary | `--color-text-primary` | `hsl(24 40% 16%)` | `#3D2817` | 主要標題、重要內文 |
| text-secondary | `--color-text-secondary` | `hsl(24 22% 30%)` | `#5C4A3A` | 標籤、次要標題 |
| text-muted | `--color-text-muted` | `hsl(30 24% 44%)` | `#8B7355` | 輔助說明、頁尾文字 |
| text-placeholder | `--color-text-placeholder` | `hsl(30 20% 58%)` | `#A8937E` | 輸入欄 placeholder |

### 品牌與高光色（Brand / Accent）

| Token | CSS 變數 | HSL | Hex | 使用情境 |
|-------|----------|-----|-----|----------|
| primary | `--color-primary` | `hsl(33 35% 64%)` | `#C4A484` | 主要按鈕起點、焦點環 |
| primary-hover | `--color-primary-hover` | `hsl(33 35% 56%)` | `#B8956E` | 按鈕 hover 起點 |
| primary-active | `--color-primary-active` | `hsl(33 33% 50%)` | `#A8845C` | 按鈕 active / 按下狀態 |
| primary-disabled | `--color-primary-disabled` | `hsl(33 20% 78%)` | `#D4C8B8` | 停用按鈕背景 |
| primary-foreground | `--color-primary-foreground` | `hsl(0 0% 100%)` | `#FFFFFF` | 主要按鈕文字 |
| accent-soft | `--color-accent-soft` | `hsl(33 30% 92%)` | `#F0E6D8` | 輕微強調背景、徽章淺底 |

### 語意色（Semantic）

| Token | CSS 變數 | HSL | Hex | 使用情境 |
|-------|----------|-----|-----|----------|
| error | `--color-error` | `hsl(14 52% 47%)` | `#B85C38` | 錯誤訊息、驗證失敗 |
| error-bg | `--color-error-bg` | `hsl(14 45% 96%)` | `#FDF4F0` | 錯誤狀態背景（未來使用） |
| success | `--color-success` | `hsl(145 35% 42%)` | `#4A8B6A` | 成功提示、已提供服務標示 |
| warning | `--color-warning` | `hsl(38 70% 50%)` | `#D4A017` | 未提供服務警示、注意標籤 |
| info | `--color-info` | `hsl(200 40% 50%)` | `#4A8BA8` | 資訊提示（次要） |

### 英雄與覆蓋色

| Token | CSS 變數 | 數值 | 使用情境 |
|-------|----------|------|----------|
| hero-overlay-start | `--color-hero-overlay-start` | `rgba(61, 40, 23, 0.55)` | 英雄漸層頂部 |
| hero-overlay-mid | `--color-hero-overlay-mid` | `rgba(120, 70, 40, 0.35)` | 英雄漸層中段 |
| hero-overlay-end | `--color-hero-overlay-end` | `rgba(247, 243, 238, 0.92)` | 英雄漸層底部（與頁面背景銜接） |

---

## 3. 字體排印

### 字體家族

- **標題與顯示字**：`"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", system-ui, sans-serif`
- **內文與介面字**：`"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", system-ui, sans-serif`
- 全站統一使用同一家族，透過字重與大小建立層級，避免混用襯線字造成醫療感過重。

### Google Fonts 匯入

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### 字重

| 用途 | 字重 | Tailwind / CSS |
|------|------|----------------|
| 輕量說明 | 300 | `font-light` |
| 內文、按鈕 | 400 / 500 | `font-normal` / `font-medium` |
| 小標題、標籤 | 500 / 600 | `font-medium` / `font-semibold` |
| 主標題 | 700 | `font-bold` |

### 文字大小與行高

| 層級 | 行動裝置 | 桌面 | Tailwind 類別 | 行高 | 使用情境 |
|------|----------|------|---------------|------|----------|
| Display / Hero 標題 | 24px / 1.5rem | 30px / 1.875rem | `text-2xl sm:text-3xl` | `leading-snug` | 英雄主標題 |
| 頁面標題 (H1) | 20px | 24px | `text-xl sm:text-2xl` | `leading-tight` | 詳情頁標題 |
| 區塊標題 (H2) | 18px | 20px | `text-lg sm:text-xl` | `leading-snug` | 卡片標題、機構名稱 |
| 小標題 / 標籤 | 14px | 14px | `text-sm` | `leading-normal` | 表單 label、徽章 |
| 內文 | 16px | 16px | `text-base` | `leading-relaxed` | 主要說明文字 |
| 輔助文字 | 13–14px | 13–14px | `text-sm` | `leading-relaxed` | 次要資訊 |
| 頁尾 / 極小 | 12px | 12px | `text-xs` | `leading-relaxed` | 免責、提示 |

追蹤（letter-spacing）：
- 標題：`tracking-tight` 或 `tracking-wide`（品牌列）
- 內文：預設（0）

---

## 4. 圓角

基礎變數：`--radius: 0.75rem`（12px）

| 尺寸 | 數值 | Tailwind 類別 | 常見使用模式 |
|------|------|---------------|--------------|
| xs | 6px | `rounded-md` | 小徽章、小圖示容器 |
| sm | 8px | `rounded-lg` | 次要按鈕、小卡片 |
| md | 12px | `rounded-xl` | 輸入欄、主要按鈕、中型卡片 |
| lg | 16px | `rounded-2xl` | 主要內容卡片、模態 |
| full | 9999px | `rounded-full` | 頭像、圓形圖示容器、膠囊標籤 |

優先使用 `rounded-xl` 與 `rounded-2xl`，營造柔和高級感，避免過大圓角造成玩具感。

---

## 5. 陰影

所有陰影使用暖棕色調，避免冷灰，以維持溫暖氛圍。

| Token | CSS 數值 | Tailwind 近似 | 使用情境 |
|-------|----------|---------------|----------|
| shadow-sm | `0 1px 2px rgba(120, 70, 40, 0.05)` | 自訂 | 輕微分隔 |
| shadow-card | `0 8px 30px rgba(120, 70, 40, 0.08)` | 自訂 | 主要內容卡片 |
| shadow-button | `0 4px 14px rgba(180, 140, 90, 0.35)` | 自訂 | 主要按鈕預設 |
| shadow-button-hover | `0 6px 18px rgba(180, 140, 90, 0.4)` | 自訂 | 按鈕 hover（可選） |
| shadow-elevated | `0 12px 40px rgba(120, 70, 40, 0.12)` | 自訂 | 模態、抽屜 |

---

## 6. 漸層

| 名稱 | CSS 數值 | 使用情境 |
|------|----------|----------|
| hero-overlay | `linear-gradient(to bottom, rgba(61, 40, 23, 0.55) 0%, rgba(120, 70, 40, 0.35) 45%, rgba(247, 243, 238, 0.92) 100%)` | 英雄區塊遮罩，由深暖棕過渡至頁面背景 |
| button-primary | `linear-gradient(to right, #C4A484, #B8956E)` | 主要 CTA 按鈕 |
| button-primary-hover | `linear-gradient(to right, #B8956E, #A8845C)` | 主要按鈕 hover |
| button-disabled | `linear-gradient(to right, #D4C8B8, #D4C8B8)` | 停用按鈕 |

---

## 7. 按鈕規格

### 尺寸變體

| 尺寸 | 高度 | 水平內距 | 文字大小 | Tailwind 範例 |
|------|------|----------|----------|---------------|
| sm | 36px | 16px | 14px | `h-9 px-4 text-sm` |
| md（預設） | 48–52px | 24px | 16px | `py-3.5 px-6 text-base` |
| lg | 56px | 28px | 16–18px | `py-4 px-7 text-base` |

全寬按鈕在行動裝置上使用 `w-full`。

### 樣式變體

**Primary（主要）**
- 背景：`bg-gradient-to-r from-[#C4A484] to-[#B8956E]`
- 文字：白色
- 陰影：`shadow-[0_4px_14px_rgba(180,140,90,0.35)]`
- Hover：`from-[#B8956E] to-[#A8845C]`
- Active：`active:scale-[0.98]`
- Focus：`focus:ring-2 focus:ring-[#C4A484] focus:ring-offset-2 focus:ring-offset-[#F7F3EE]`
- Disabled：背景 `#D4C8B8`，文字 `#F5F0E8`，無陰影，`cursor-not-allowed`

**Secondary（次要）**
- 背景：透明或 `#FBF9F6`
- 邊框：`1px solid #E0D5C8`
- 文字：`#5C4A3A`
- Hover：背景 `#F0E6D8`

**Ghost / Text**
- 無背景、無邊框
- 文字：`#8B7355` 或 `#C4A484`
- Hover：文字加深或底線

過渡：`transition-all duration-200`

---

## 8. 卡片規格

**基礎卡片**
```
bg-white/95 backdrop-blur-sm
rounded-2xl
border border-[#EDE6DC]
shadow-[0_8px_30px_rgba(120,70,40,0.08)]
p-6 sm:p-7
```

**強化變體（結果列表卡片）**
- 增加 hover 時輕微上浮與陰影加深
- 圖片區域固定比例（建議 16:9 或 4:3）
- 內部使用 `space-y-3` 或 `space-y-4` 排列資訊

**空狀態卡片**
- 同基礎卡片，但內容置中，搭配柔和插圖與明確 CTA

---

## 9. 輸入欄規格

- 高度：約 48–52px（`py-3.5`）
- 背景：`#FBF9F6`
- 邊框：`1px solid #E0D5C8`
- 圓角：`rounded-xl`
- 文字：`#3D2817`
- Placeholder：`#A8937E`
- Focus：`ring-2 ring-[#C4A484] border-[#C4A484]`
- Disabled：降低透明度，保持邊框
- 錯誤狀態：邊框與文字改為 `#B85C38`，並顯示錯誤訊息於下方

Label 使用 `text-sm font-medium text-[#5C4A3A]`，與輸入欄保持 `space-y-1.5`。

---

## 10. 徽章／標籤規格

**膠囊標籤（Pill）— 服務項目**
```
inline-flex items-center
px-2.5 py-0.5
rounded-full
text-xs font-medium
bg-[#F0E6D8] text-[#5C4A3A]
```

**警示標籤（未提供服務）**
```
bg-[#FDF4F0] text-[#B85C38]
或搭配 ⚠ 圖示
```

**適合失智症標籤**
```
bg-[#E8F0EC] text-[#4A8B6A]
```

**評分徽章**
- 使用琥珀色文字 + 星號圖示

所有標籤保持小尺寸、高可讀性，避免過多顏色競爭。

---

## 11. 圖示容器

| 尺寸 | 寬高 | 圓角 | 使用情境 |
|------|------|------|----------|
| sm | 28–32px | `rounded-full` 或 `rounded-lg` | 列表小圖示 |
| md | 36–40px | `rounded-full` | 品牌列、功能圖示 |
| lg | 48px+ | `rounded-xl` | 空狀態、大型操作 |

容器背景可使用 `bg-white/20 backdrop-blur-sm`（英雄區）或 `bg-[#F0E6D8]`（內容區）。

---

## 12. 動畫

**關鍵影格**

```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

使用方式：載入中 spinner 使用 `animate-spin`。

**過渡原則**
- 顏色與背景：`transition-colors duration-200`
- 變形與縮放：`transition-all duration-200`
- 按鈕按下：`active:scale-[0.98]`
- 避免超過 300ms 的動畫，保持即時回饋感

未來可加入卡片進入時的淡入上移（`opacity` + `translateY`），但需保持克制。

---

## 13. 間距與版面

**容器**
- 行動裝置內容最大寬度：`max-w-md`（28rem / 448px）
- 水平內距：`px-4` 或 `px-5`
- 垂直區塊間距：`space-y-5` ~ `space-y-8`

**頁面結構**
- 英雄高度：行動 `min-h-[42vh]`，較大螢幕 `min-h-[48vh]`
- 卡片與英雄重疊：`-mt-6` 產生自然銜接
- 底部安全區：`pb-10`

**間距模式**
- 元件內部：`space-y-1.5`（label + input）、`space-y-4`（表單）
- 卡片內邊距：`p-6 sm:p-7`
- 區塊之間：`mt-6` 或 `space-y-6`

---

## 14. 懸停與互動狀態

| 元件 | 預設 | Hover | Active | Focus | Disabled |
|------|------|-------|--------|-------|----------|
| Primary 按鈕 | 琥珀漸層 + 陰影 | 漸層加深 | `scale-[0.98]` | ring-2 琥珀色 + offset | 灰褐背景、無陰影、不可點 |
| 輸入欄 | 淺邊框 | — | — | ring-2 + 邊框變琥珀 | 降低透明度 |
| 卡片（未來列表） | 基礎陰影 | 陰影加深、輕微上移 | — | — | — |
| 文字連結 | 暖棕 | 顏色加深或底線 | — | 可見焦點環 | — |
| 徽章 | 靜態 | 無明顯變化（避免干擾） | — | — | — |

所有互動必須支援鍵盤操作，焦點環使用 `--color-primary` 並搭配足夠對比。

---

**文件版本：** 1.0  
**適用範圍：** 長照機構搜尋 App 全部前端頁面  
**維護原則：** 任何顏色、圓角、陰影或字級變更必須先更新此文件，再修改程式碼。


此設計系統規格文件可直接加入您的知識庫。需要我將它寫入專案檔案（例如 `DESIGN_SYSTEM.md`），或根據此規格繼續調整現有首頁並實作下一頁嗎？