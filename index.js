export default {
  async scheduled(event, env, ctx) {
    const includeTags = env.INCLUDE_TAGS || "";
    const excludeTags = (env.EXCLUDE_TAGS || "").split(" ");
    const keyword = includeTags.trim().replace(/\s+/g, " ");
    const searchUrl = `https://booth.pm/ja/search/${encodeURIComponent(keyword)}`;

    const res = await fetch(searchUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const html = await res.text();

    const itemRegex = /<a class="item-card__link"[^>]*href="([^"]+)"[^>]*aria-label="([^"]+)".*?<img[^>]+src="([^"]+)"/gs;
    const items = [];

    let match;
    while ((match = itemRegex.exec(html)) !== null) {
      const path = match[1];
      const url = "https://booth.pm" + path;
      const title = match[2];
      const thumb = match[3];
      if (excludeTags.some(tag => title.includes(tag))) continue;
      const already = await env.NOTIFIED_KV.get(path);
      if (already) continue;
      items.push({ path, url, title, thumb });
    }

    if (items.length === 0) {
      await fetch(env.DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `🔍 ${keyword} の条件に合う新着商品は見つかりませんでした。`,
        }),
      });
      return;
    }

    // 通知数（ランダム2〜3件、最大 items.length）
    const count = Math.min(items.length, Math.floor(Math.random() * 2) + 2);
    const selectedItems = items.slice(0, count);

    const embeds = [];

    for (const item of selectedItems) {
      const detail = await fetch(item.url, {
        headers: { "User-Agent": "Mozilla/5.0" },
      });
      const detailHtml = await detail.text();

      const priceMatch = detailHtml.match(/<span class="price">\s*([¥￥][0-9,]+)\s*<\/span>/);
      const authorMatch = detailHtml.match(/<a class="shop-link__name"[^>]*>(.*?)<\/a>/);
      const price = priceMatch ? priceMatch[1] : "価格不明";
      const author = authorMatch ? authorMatch[1].trim() : "作者不明";

      // 複数画像取得
      const imageMatches = [...detailHtml.matchAll(/<img[^>]+src="(https:\/\/booth\.pximg\.net\/[^"]+\/original\.[^"]+)"/g)];
      const images = imageMatches.map(m => m[1]).slice(0, 9);
      const mainImage = images[0];
      const otherImages = images.slice(1);

      await env.NOTIFIED_KV.put(item.path, "sent");

      embeds.push({
        title: item.title,
        url: item.url,
        image: { url: mainImage || item.thumb },
        fields: [
          { name: "💴 価格", value: price, inline: true },
          { name: "🧑‍🎨 作者", value: author, inline: true },
          ...(otherImages.length > 0
            ? [{ name: "🖼️ 他の画像", value: otherImages.join("\n").slice(0, 1024) }]
            : []),
        ],
      });
    }

    await fetch(env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `🛍️ **今日の新着BOOTH商品（${keyword}）より${count}件紹介**`,
        embeds,
      }),
    });
  },
};
