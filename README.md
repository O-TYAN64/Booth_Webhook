# 📦 BOOTH Watcher Bot (Cloudflare Workers)

**BOOTHの新着商品を自動でDiscordに通知するBotです。**  
Cloudflare Workers 上で動作し、毎晩21時（JST）に最大3件の新着商品を通知します。  
商品画像・価格・作者名付きのEmbed形式で表示され、タグフィルターや重複防止にも対応しています。

---

## ✨ 主な機能

| 機能 | 説明 |
|------|------|
| 🔍 タグ検索 | 指定タグに一致する商品だけ通知 |
| ❌ 除外タグ | 不要なワードを含む商品は除外 |
| 🖼️ 商品画像取得 | 最大9枚の画像を取得（1枚はEmbed、残りはURL列挙） |
| 💴 価格取得 | 商品ページから価格を取得して表示 |
| 🧑‍🎨 作者名取得 | 出品者名（ショップ名）を取得して表示 |
| 🔁 重複防止 | KVストレージで通知済み商品を記録し、再通知しない |
| ⏰ 定期実行 | 毎日21:00（JST）に自動でDiscordに通知 |
| 🎲 通知件数 | 通知数は毎回ランダムで2〜3件（新着から選出） |
