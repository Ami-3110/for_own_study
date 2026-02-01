# Auth-lab (for own study)

認証方式の学習・検証用リポジトリです。  
Nuxt + Laravel を使って、複数の認証パターンを段階的に試しています。

## 構成
- `api/` : Laravel API
- `web/` : Nuxt フロントエンド

## 学習した認証方式
このリポジトリでは、以下の順で認証を検証しました。

1. **Sanctum API Token**
   - Bearer Token による基本的な API 認証

2. **Sanctum Cookie 認証**
   - Cookie + CSRF を使った SPA 認証
   - フロントとバックエンドの責務分離を確認

3. **JWT 認証（現在）**
   - HttpOnly Cookie による access / refresh token 管理
   - refresh token による自動延命
   - Nuxt plugin / middleware を使った認証制御

## JWT 構成メモ
- plugin では API を叩かない（初期化のみ）
- 認証判定は middleware で `me` API に委譲
- `useApi` では画面遷移を行わない（状態更新のみ）
- 未ログイン / ログイン済みの分岐は middleware の責務

※ 学習用コードのため、今後整理・削除・統合する可能性があります。
