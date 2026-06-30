/*
* 1. 介面擴展的實作架構
* 讓我們用你的 Dashboard 為例。所有的圖表都有基本的渲染功能，但某些特定圖表（如折線圖）可能需要額外的「縮放 (Zoom)」或「導出資料 (Export)」功能。
*/

// 通用規格：所有圖表都必須能畫出來
interface Renderable {
  render: (data: any) => void;
}

// 特化規格：折線圖不但要能畫，還要能縮放
interface ZoomableRenderer extends Renderable {
  zoom: (scale: number) => void;
}

// 實作時，TypeScript 會強迫你實現 render 且同時實現 zoom
const MyLineChart: ZoomableRenderer = {
  render: (data) => console.log("Rendering lines..."),
  zoom: (scale) => console.log(`Zooming to ${scale}x`)
};


/*
*  在 TypeScript 中，你甚至可以使用 聯集 (Union) 或 交集 (Intersection) 來達到類似 extends 的效果，但更有彈性：
*  雖然 extends 是 OOP 的語法，但在 FP 的思維下，我們可以把這些介面看作是「行為組合」。
*/
type Chart = Renderable & Zoomable; // 組合多個行為規格