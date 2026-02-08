# Amahari – Amazon Creators API Helper (Electron)

Amazon Creators API を使って  
**ASIN または Amazon 商品URLから商品情報を取得し、  
ブログ貼付用HTMLを生成するデスクトップアプリ**です。

## ✨ 主な機能

- ASIN / Amazon URL 自動判別
- Creators API GetItems 対応
- 商品情報をGUI表示
- ブログ貼付用HTMLを自動生成
- 設定（Credential / PartnerTag）をローカル保存
- Windows向け Electron アプリ

※ Amazon公式ロゴは使用していません。

---

## 🖥 動作環境

- Windows 10 / 11
- Node.js 18+
- Amazon Creators API アカウント

---

## 🚀 起動方法（開発）

```bash
git clone https://github.com/yourname/amahari.git
cd amahari/electron-app
npm install
npm start
```
---

## ⚙ 初期設定

起動後、以下を設定画面に入力してください：

-   CredentialId
    
-   CredentialSecret
    
-   PartnerTag
    
-   API Version（通常 2.3）
    

※ これらは **ローカルにのみ保存**されます。

---

## ⚠ 注意事項

-   本アプリは Amazon 非公式ツールです
    
-   Amazon ロゴ・商標は使用していません
    
-   Creators API の利用規約を遵守してください

This project is not affiliated with Amazon.com, Inc.