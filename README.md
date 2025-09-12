# Infinite Chess Analytics Dashboard

[User Opens Dashboard] 
        ↓
[index.html loads in browser]
        ↓
[Enter Google Sheet ID & API Key]
        ↓
[Click "Connect"]
        ↓
[JavaScript makes API call to Google Sheets]
        ↓
[Google Sheets API returns raw data]
        ↓
[JavaScript processes data]
        ↓
[Updates charts & displays]
        ↓
[User interacts with dashboard]

# After making changes to your files

# 1. Check what changed
git status

# 2. Add changes
git add .

# 3. Commit
git commit -m "Update dashboard with new features"

# 4. Push
git push

## 📊 專案說明
這是為自閉症基金會 Infinite Chess Project 開發的志工觀察數據分析平台。

## 🚀 快速開始

### 1. 設定 Google Sheets API
1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案或選擇現有專案
3. 啟用 Google Sheets API
4. 建立 API Key 憑證
758438914807-auiouu7tt0u5tvo2nm8hnr8pala0jvrl.apps.googleusercontent.com

### 2. 準備 Google Sheet
確保您的 Google Sheet 包含以下欄位：
- 日期
- 學生姓名
- 志工姓名
- 情緒穩定 (1-5)
- 專注力 (1-5)
- 社交互動 (1-5)
- 正向行為
- 需削弱行為

### 3. 連接資料
1. 開啟 Dashboard
2. 輸入您的 Google Sheet ID (從 URL 複製)
3. 輸入您的 API Key
4. 點擊「連接資料」

## 📈 功能特色
- 即時數據視覺化
- STAM 評分趨勢追蹤
- 學生個別進度分析
- 行為模式識別
- 自動生成報告

## 🔒 隱私保護
- 所有資料僅在瀏覽器本地處理
- API Key 儲存在 localStorage
- 不會將資料傳送到第三方伺服器

## 📝 授權
MIT License

## 👥 團隊
- Infinite Chess Project 志工團隊
- 自閉症基金會

## 📧 聯絡
如有問題請聯繫：[your-email]