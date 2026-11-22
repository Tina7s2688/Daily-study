# 每日學習燈

每天 15 分鐘：多益聽力 2 組（6 題）＋ SQL 一關。

## 檔案說明

| 檔案 | 用途 |
|---|---|
| `index.html` | 網頁骨架 |
| `style.css` | 外觀 |
| `app.js` | 所有功能：今日任務、聽力作答、SQL 執行與批改、進度統計 |
| `data/listening.js` | 多益聽力題庫（12 組、36 題） |
| `data/sql-levels.js` | SQL 練習資料庫（茶飲出口公司）和 12 個關卡 |
| `serve.js` | 在自己電腦預覽用：`node serve.js`，打開 http://localhost:5173 |

## 目前階段

第一階段：進度存在瀏覽器的 localStorage，換電腦或清除瀏覽器資料會不見。
第二階段會接上 Supabase，進度改存雲端。
