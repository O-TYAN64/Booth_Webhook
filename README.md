# 📦 BOOTH Watcher Bot (for Cloudflare Workers)

BOOTHの新着商品を自動で毎晩21時にDiscordに通知するBotです。
タグ・除外タグのフィルター機能や、商品画像・価格・作者の情報付きEmbed表示に対応しています。


---

#🔧 機能概要

機能	説明

🔍 タグ検索	指定タグを含む商品を検索・通知
❌ 除外タグ対応	NGワードを含む商品をスキップ
📷 商品画像	最大9枚の画像を取得、1枚をEmbed、残りはURL列挙
💴 商品価格	商品詳細ページから価格を取得
🧑‍🎨 作者名	出品者名も取得して表示
⏰ 定時実行	毎日21:00（JST）に自動通知
🔁 重複防止	すでに通知した商品は記録し、再通知しない（KV使用）
🎲 通知数	毎回ランダムに2～3件を紹介



---

# 🚀 使用方法

1. Cloudflare Workers 環境準備

npm install -g wrangler
wrangler login

2. このリポジトリをクローン

git clone https://github.com/yourname/booth-watcher.git
cd booth-watcher

3. KV名前空間を作成

wrangler kv:namespace create NOTIFIED_KV

wrangler.toml に自動で追記されます。手動で以下のように記述してもOK：

[[kv_namespaces]]
binding = "NOTIFIED_KV"
id = "取得したID"

4. 環境変数を設定（wrangler.toml）

[vars]
DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/xxx/yyy"
INCLUDE_TAGS = "Live2D VRChat"
EXCLUDE_TAGS = "R-18 NSFW"

5. 通知タイミングを設定（日本時間21時）

[[triggers]]
cron = "0 12 * * *"  # 毎日 21:00 JST 実行

6. デプロイ

wrangler deploy


---

📤 通知例（Discord）

🛍️ 今日の新着BOOTH商品（Live2D VRChat）より3件紹介

[Embed1]
タイトル: かわいいLive2Dモデル
画像: メイン画像
価格: ¥1,500
作者: にゃんこ堂
他の画像: https://...jpg など

[Embed2] ...


---

# 🔒 注意点・制限

Embedで画像表示できるのは1枚。他画像はURL表示

Cloudflare Workers + KV を使用。無料枠でも十分動作可能

検索対象はBOOTHの公開商品ページのみ（R-18など除外可能）



---

# 🛠 今後の改善予定（Optional）

[ ] 毎週ランキング通知機能

[ ] 商品在庫や価格変更の追跡

[ ] 複数Webhookへの通知（カテゴリ分け）

[ ] コマンドによる検索機能（/booth 検索など）



---

# 📄 ライセンス

MIT License（自由に改変・再配布可）


---

必要なら「英語版README」や「GitHub用バッジ付き」も書けます！
また、README.md本文の構成や内容の書き方もカスタマイズ可能ですので、「どんな感じにしたい」などあれば教えてください！

