# Auth-lab (for own study)

## 🇯🇵 日本語

認証方式の学習・検証用リポジトリです。  
Nuxt + Laravel を使って、複数の認証パターンを段階的に試しています。

### 構成
- `api/` : Laravel API
- `web/` : Nuxt フロントエンド

### 学習した認証方式
このリポジトリでは、以下の順で認証方式を検証しました。

1. **Sanctum API Token**
   - Bearer Token による基本的な API 認証

2. **Sanctum Cookie 認証**
   - Cookie + CSRF を使った SPA 認証
   - フロントエンドとバックエンドの責務分離を確認

3. **JWT 認証（現在）**
   - HttpOnly Cookie による access / refresh token 管理
   - refresh token による自動延命
   - Nuxt の plugin / middleware を用いた認証制御

### JWT 構成メモ
- plugin では API を叩かない（初期化のみ）
- 認証判定は middleware で `me` API に委譲
- `useApi` では画面遷移を行わない（状態管理のみ）
- 未ログイン / ログイン済みの分岐は middleware の責務

※ 学習用コードのため、今後整理・削除・統合する可能性があります。

---

## 🇬🇧🇺🇸 English

This repository is for learning and experimenting with authentication patterns.  
Using Nuxt and Laravel, multiple authentication approaches are implemented step by step.

### Structure
- `api/` : Laravel API
- `web/` : Nuxt frontend

### Authentication methods explored
The following authentication methods were implemented in this order:

1. **Sanctum API Token**
   - Basic API authentication using Bearer tokens

2. **Sanctum Cookie Authentication**
   - SPA authentication using cookies and CSRF protection
   - Verification of responsibility separation between frontend and backend

3. **JWT Authentication (current)**
   - Access / refresh token management via HttpOnly cookies
   - Automatic token renewal using refresh tokens
   - Authentication control using Nuxt plugins and middleware

### JWT design notes
- Plugins do not call APIs directly (initialization only)
- Authentication checks are delegated to the `me` API via middleware
- `useApi` does not handle navigation (state updates only)
- Login / guest branching is handled by middleware

※ This repository is for study purposes and may be refactored, reorganized, or removed in the future.
