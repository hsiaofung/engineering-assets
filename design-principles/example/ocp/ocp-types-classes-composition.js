/*
* 優先考慮組合 (Composition over Inheritance)：
* 如果一個圖表既要 Zoomable 又要 Exportable，與其寫一個 interface ZoomableAndExportable extends ...，不如讓你的函數同時接收多種規範：
* 雖然 extends 很方便，但在設計大型系統（如你的 ThemeForest 產品）時，要小心 「深度繼承陷阱」。 
*/
// 這種寫法比深層繼承更靈活
function handleAdvancedChart(chart: Renderable & Zoomable & Exportable) {
   chart.render();
   chart.zoom(2);
   chart.export();
}