# 另外有一個網站是隨著scroll由遠到近，例如從宇宙->地球 -> 雲層 -> 地面 -> 建築物。

你描述的這個效果也很有意思！而且它又延伸出另一種很值得研究的捲動動畫。

例如：

- Scroll 0%：從宇宙遠處觀看地球。
- Scroll 20%：逐漸靠近地球。
- Scroll 40%：進入大氣層，穿越雲層。
- Scroll 60%：接近地面。
- Scroll 80%：靠近城市與建築物。
- Scroll 100%：抵達建築物，甚至進入室內。

這種效果的核心不是讓前、中、後景以不同速度移動，而是讓攝影機（Camera）隨著捲動持續改變位置與視角。

它通常稱為 Scroll-driven Camera Animation，也可以稱為 Scroll-controlled 3D Camera Fly-through。

[Beyond Earth - Satellite Applications Catapult](https://images.openai.com/static-rsc-4/oYRh39xm119YDKrog0VBbzkZpo9OFRBFqUIw8IsizFaf98dRjN4-A26tfxj75jyzltiz1LcAAR9DBHlD_WKCvRTUwP4Fsj9ThVNdXoPs5R4A_UGAdrMftOCdHOyE0sUmNShXrHcp0GpDKAlPu10Xt2c0ZmwuhshkWsjYMylqpEE?purpose=inline)

[Cloudy with a chance of warming: how physicists are studying the dynamical impact of clouds on climate change – Physics World](https://images.openai.com/static-rsc-4/Wu8hMWVenBugM5rXs4wkGge9nrmn34BaKadWXcWKjn4a1Wwfsn1CcwXBfwDCAF_HyxcCAGeuR763Fpf0vtuyDRzjtlr5WyoQNyhkQvwfXapYVPq_pjvqrwIPpy9a2qggo9rbvCPGLDJcLfzSN5cj1iQNlg12bNzw5a5UEs4TgAc?purpose=inline)

[Infrastructure Consenting | Stantec](https://images.openai.com/static-rsc-4/S61ByMG-YTlG-aKAkmohVAWtOBXq4DOc04Iq9FjMRPkVqZfNMlsfRRLyKbXc38HuZQ6MZzvvrDdl_xMREZtGRE_NFv4NXZFbiKIReKatU5HUWaODkHv8Fn-oAeN_Dw_jdc5brmk7trFLvvfNa9F28NUwcNa2fQ-GLL71b06iWd4?purpose=inline)

5

## 1. 它與前面兩種效果有什麼不同？

現在我們已經有三種不同的應用：

[- YouTube](https://images.openai.com/static-rsc-4/-syvwEQlLISbumZfrXoeMpjeCgSNwrZdO0fZ2QROqF3VQjD7T1RyWosNq7XBDw4NhOZUISokQDBhp3nZGUre-LuzY-8gZGZESgGyr3-CcWlv7sGc8DX2B2cSleAeaUW_g86R5Y0cB9JyPSOe-xQHYgkFxyEHQNAaIKYQ4FwTduc?purpose=inline)

① Parallax Scrolling（視差滾動）

控制不同圖層的移動速度。

核心：Layer Position

[عرض تفكيكي ثلاثي الأبعاد للمنتج | 3D Exploded Product View | مكتبة أوامر الصور | ARWriter](https://images.openai.com/static-rsc-4/W3rD-z9n_q0-V6z-eoTmjAH4IRc3haAK2MliJH-W9Ecbrwd1pPSvy2LQpph83I0FYjRHFMrSrlLPVL2FYFtAaQ2EckuBlc8m_4wwjhwtcRyyDRsYmyhrx5SNfZmLwbjQ_EUojDikgUyzbHfhbdV3gRh5ymWLAPOV1YB6iU_FvY4?purpose=inline)

② Exploded View Animation（爆炸視圖）

控制每個零件在 3D 空間的位置。

核心：Object Position

[Орбита Земли с освещёнными облаками - wQXGA широкоформатные и для Apple MacBook Air 13 обои (2560x1600)](https://images.openai.com/static-rsc-4/M0X2Z8mk_Wwpxf_TsZZ2Mqqv0nLVwgzCxKdNMRPiPKVAs3J9VQA-VtGZ2fOd_8wbm2gz2e3fk5MnNq2Y-s3YoYt4u2MDAuNfapRploPRWDLwI4sbWJlZRW0ewEvrnaCslPCvCt3jnUMh7yEAy4goHA0D6t0zqKSUOCQjhRApBYw?purpose=inline)

③ Camera Fly-through（攝影機穿越）

控制攝影機在 3D 空間中的移動。

核心：Camera Position / Rotation

## 2. 第三種效果的運作原理

這次不是移動物件，而是移動 Camera。

假設我們使用 Three.js：

| Scroll Progress | Camera Position | 畫面   |
| --------------- | --------------- | ---- |
| 0%              | 遠處              | 宇宙   |
| 20%             | 靠近地球            | 地球全貌 |
| 40%             | 穿越大氣層           | 雲層   |
| 60%             | 接近地表            | 地面   |
| 80%             | 城市上空            | 建築群  |
| 100%            | 建築物附近           | 建築細節 |

概念程式碼：

```
const progress = getScrollProgress();

camera.position.lerpVectors(
  startPosition,
  endPosition,
  progress
);
```

這只是簡化示意。真正的宇宙到地面的路徑，通常需要多個 Camera Keyframes，甚至使用曲線（Spline）控制攝影機的移動軌跡。

## 3. 三種效果其實可以統一理解

## Scroll-driven Animation

Scroll Position → Animation Progress

Layer

視差滾動

Object

爆炸視圖

Camera

攝影機穿越

Visual Experience

換句話說：

- 視差滾動：移動場景中的圖層。
- 爆炸視圖：移動場景中的物件。
- Camera Fly-through：移動觀察場景的攝影機。

這三種甚至可以同時使用。例如攝影機往建築物靠近時，雲層以不同速度移動，建築物的零件再逐漸展開。

## 4. 推薦你觀察的實際範例

以下有幾個很接近你描述的網站：

1. [HELIOS – 從銀河穿越太陽系到冥王星](https://vibecruiser.com/v/amanxdev0--helios?utm_source=chatgpt.com)：捲動控制整段宇宙旅程。
2. [Scroll Through Space](https://discourse.threejs.org/t/scroll-through-space-interactive-3d-background-with-three-js/83611?utm_source=chatgpt.com)：從星空、星雲穿越到雲層與海洋。
3. [Cosmic Voyage](https://github.com/aarravhacker/cosmic-voyage?utm_source=chatgpt.com)：Three.js 製作的 3D 宇宙場景。
4. [Camera Fly-through on Scroll](https://motionlab.one/library/camera-flythrough-scroll?utm_source=chatgpt.com)：攝影機沿著 3D 曲線移動的互動範例。

## 5. 我想幫你整理出一個值得研究的方向

你現在接觸到的，其實不只是 Parallax Scrolling。

更大的研究主題是：

Scroll-driven Web Experience（捲動驅動的網頁體驗）

這是一種設計思維：把使用者的捲動行為當成動畫的控制器。

我建議你接下來先研究三個核心能力：

1. Scroll Progress：如何取得並計算捲動進度。
2. Animation Mapping：如何將進度映射到位置、旋轉、縮放等屬性。
3. 3D Scene Control：如何控制 Three.js 的 Object 和 Camera。

掌握這三個概念後，你看到的很多創意網頁效果，就能用同一套思維拆解，而不必每看到一種效果，就重新學一套完全不同的技術。