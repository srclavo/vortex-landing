#!/usr/bin/env python3
"""
Generate static HTML blog pages from the Vortex blog API.
Each post gets its own /blog/{slug}.html with full SEO metadata.

Usage:
  python3 generate_static.py          # Generate all active posts
  python3 generate_static.py <slug>   # Generate a single post
"""

import json
import os
import re
import sys
import urllib.request

API = "https://api.vortexagents.ai/api/v1/blog/posts"
BLOG_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_URL = "https://vortexagents.ai"


def md_to_html(md: str) -> str:
    """Minimal markdown to HTML converter."""
    if not md:
        return ""
    html = md
    # Headings
    html = re.sub(r"^### (.+)$", r"<h3>\1</h3>", html, flags=re.MULTILINE)
    html = re.sub(r"^## (.+)$", r"<h2>\1</h2>", html, flags=re.MULTILINE)
    html = re.sub(r"^# (.+)$", r"<h1>\1</h1>", html, flags=re.MULTILINE)
    # Bold & italic
    html = re.sub(r"\*\*\*(.+?)\*\*\*", r"<strong><em>\1</em></strong>", html)
    html = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", html)
    html = re.sub(r"\*(.+?)\*", r"<em>\1</em>", html)
    # HR
    html = re.sub(r"^---$", "<hr>", html, flags=re.MULTILINE)
    # Blockquotes
    html = re.sub(r"^> (.+)$", r"<blockquote>\1</blockquote>", html, flags=re.MULTILINE)
    # Lists
    html = re.sub(r"^[\*\-] (.+)$", r"<li>\1</li>", html, flags=re.MULTILINE)
    html = re.sub(r"^\d+\. (.+)$", r"<li>\1</li>", html, flags=re.MULTILINE)
    # Links
    html = re.sub(
        r"\[(.+?)\]\((.+?)\)",
        r'<a href="\2" target="_blank" rel="noopener">\1</a>',
        html,
    )
    # Wrap consecutive <li> in <ul>
    html = re.sub(
        r"((?:<li>.*?</li>\n?)+)",
        lambda m: f"<ul>\n{m.group(0)}</ul>\n",
        html,
    )
    # Paragraphs
    lines = html.split("\n")
    out = []
    for line in lines:
        t = line.strip()
        if not t:
            continue
        if re.match(r"^<(h[1-3]|ul|li|blockquote|hr|p|/)", t):
            out.append(t)
        else:
            out.append(f"<p>{t}</p>")
    return "\n".join(out)


def fmt_date(iso: str) -> str:
    """Format ISO date to human-readable."""
    from datetime import datetime

    try:
        dt = datetime.fromisoformat(iso.replace("Z", "+00:00"))
        return dt.strftime("%B %d, %Y")
    except Exception:
        return iso[:10]


def generate_html(post: dict) -> str:
    """Generate a complete static HTML page for a blog post."""
    title = post.get("meta_title") or post["title"]
    description = post.get("meta_description", "")
    keyword = post.get("keyword", "")
    slug = post["slug"]
    body_html = md_to_html(post.get("body", ""))
    pub_date = fmt_date(post.get("published_at", ""))
    canonical = f"{BASE_URL}/blog/{slug}.html"

    # Strip the H1 from body if it matches the title (avoid duplicate)
    body_html = re.sub(r"^<h1>.*?</h1>\n?", "", body_html, count=1)

    # Schema.org structured data
    schema = json.dumps(
        {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post["title"],
            "description": description,
            "keywords": keyword,
            "datePublished": post.get("published_at", ""),
            "author": {
                "@type": "Person",
                "name": "Daniel Orozco",
                "url": "https://vortexagents.ai",
            },
            "publisher": {
                "@type": "Organization",
                "name": "Vortex AI Agents",
                "url": "https://vortexagents.ai",
            },
            "mainEntityOfPage": canonical,
        },
        indent=2,
    )

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>{title} — Vortex AI Agents</title>
  <meta name="description" content="{description}"/>
  <meta name="keywords" content="{keyword}"/>
  <link rel="canonical" href="{canonical}"/>
  <meta property="og:title" content="{title}"/>
  <meta property="og:description" content="{description}"/>
  <meta property="og:url" content="{canonical}"/>
  <meta property="og:type" content="article"/>
  <meta property="og:site_name" content="Vortex AI Agents"/>
  <meta name="twitter:card" content="summary"/>
  <meta name="twitter:title" content="{title}"/>
  <meta name="twitter:description" content="{description}"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
  <script type="application/ld+json">
{schema}
  </script>
  <style>
    :root{{--bg:#080a0f;--surface:#0d1117;--surface2:#141920;--border:rgba(255,255,255,0.07);--green:#00ff88;--white:#f0f4f8;--muted:rgba(240,244,248,0.45);}}
    *{{margin:0;padding:0;box-sizing:border-box;}}
    body{{background:var(--bg);color:var(--white);font-family:'DM Sans',sans-serif;min-height:100vh;}}
    nav{{display:flex;align-items:center;justify-content:space-between;padding:1.2rem 2rem;border-bottom:1px solid var(--border);position:sticky;top:0;background:rgba(8,10,15,0.95);backdrop-filter:blur(12px);z-index:100;}}
    .logo{{font-weight:700;font-size:1.1rem;color:var(--white);text-decoration:none;}}
    .logo span{{color:var(--green);}}
    .nav-links{{display:flex;gap:1.5rem;align-items:center;}}
    .nav-links a{{color:var(--muted);text-decoration:none;font-size:.9rem;transition:color .2s;}}
    .nav-links a:hover,.nav-links a.active{{color:var(--white);}}
    .cta-btn{{background:var(--green);color:#080a0f;padding:.5rem 1.2rem;border-radius:6px;font-weight:600;font-size:.85rem;text-decoration:none;transition:opacity .2s;}}
    .cta-btn:hover{{opacity:.85;}}
    .article-wrap{{max-width:720px;margin:0 auto;padding:3rem 2rem 5rem;}}
    .back-link{{display:inline-flex;align-items:center;gap:.4rem;color:var(--muted);font-size:.85rem;text-decoration:none;margin-bottom:2rem;transition:color .2s;}}
    .back-link:hover{{color:var(--green);}}
    .post-meta{{font-size:.8rem;color:var(--muted);margin-bottom:.75rem;}}
    .post-keyword{{display:inline-block;background:rgba(0,255,136,0.1);color:var(--green);font-size:.75rem;padding:.2rem .6rem;border-radius:20px;margin-right:.5rem;}}
    h1.post-title{{font-size:2rem;font-weight:700;line-height:1.3;margin-bottom:1.5rem;}}
    .post-body{{color:rgba(240,244,248,0.85);line-height:1.8;font-size:1rem;}}
    .post-body h1,.post-body h2,.post-body h3{{color:var(--white);margin:2rem 0 .75rem;line-height:1.3;}}
    .post-body h1{{font-size:1.6rem;}}
    .post-body h2{{font-size:1.3rem;}}
    .post-body h3{{font-size:1.1rem;color:var(--green);}}
    .post-body p{{margin-bottom:1rem;}}
    .post-body ul,.post-body ol{{margin:0 0 1rem 1.5rem;}}
    .post-body li{{margin-bottom:.4rem;}}
    .post-body strong{{color:var(--white);}}
    .post-body em{{color:var(--muted);}}
    .post-body blockquote{{border-left:3px solid var(--green);padding-left:1rem;margin:1.5rem 0;color:var(--muted);font-style:italic;}}
    .post-body a{{color:var(--green);text-decoration:none;}}
    .post-body a:hover{{text-decoration:underline;}}
    .post-body hr{{border:none;border-top:1px solid var(--border);margin:2rem 0;}}
    .post-cta{{margin-top:3rem;background:var(--surface);border:1px solid rgba(0,255,136,0.2);border-radius:12px;padding:2rem;text-align:center;}}
    .post-cta h3{{font-size:1.2rem;margin-bottom:.5rem;}}
    .post-cta p{{color:var(--muted);font-size:.9rem;margin-bottom:1.25rem;}}
    footer{{border-top:1px solid var(--border);padding:1.5rem 2rem;text-align:center;color:var(--muted);font-size:.8rem;}}
    footer a{{color:var(--green);text-decoration:none;}}
  </style>
</head>
<body>

<nav>
  <a href="/" class="logo">VORTEX <span>AI</span></a>
  <div class="nav-links">
    <a href="/">Home</a>
    <a href="/blog/" class="active">Blog</a>
    <a href="/#solution">Agents</a>
    <a href="/#cta" class="cta-btn">Book a Call</a>
  </div>
</nav>

<article class="article-wrap">
  <a href="/blog/" class="back-link">&larr; All articles</a>
  <div class="post-meta">
    <span class="post-keyword">{keyword}</span>
    {pub_date}
  </div>
  <h1 class="post-title">{post["title"]}</h1>
  <div class="post-body">
{body_html}
  </div>
  <div class="post-cta">
    <h3>Ready to see what AI agents can do for your business?</h3>
    <p>We build connected teams of AI that work inside your operations — no new tools to learn.</p>
    <a href="/#cta" class="cta-btn" style="display:inline-block;margin-top:.25rem;">Book a free strategy call &rarr;</a>
  </div>
</article>

<footer>
  &copy; 2026 Vortex AI Agents &middot; <a href="https://vortexagents.ai">vortexagents.ai</a> &middot; The Woodlands, TX
</footer>

</body>
</html>
"""


def fetch_posts(slug=None):
    """Fetch posts from the API."""
    url = f"{API}/{slug}" if slug else API
    req = urllib.request.Request(url, headers={
        "X-API-Key": "vortex_public_2026",
        "User-Agent": "VortexBlogGenerator/1.0",
    })
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read().decode())
    return [data] if slug else data


def main():
    slug = sys.argv[1] if len(sys.argv) > 1 else None

    if slug:
        posts = fetch_posts(slug)
        print(f"Generating 1 post: {slug}")
    else:
        posts = fetch_posts()
        # For listing, we need full body — fetch each individually
        full_posts = []
        for p in posts:
            try:
                full = fetch_posts(p["slug"])
                full_posts.extend(full)
            except Exception as e:
                print(f"  SKIP {p['slug']}: {e}")
        posts = full_posts
        print(f"Generating {len(posts)} posts")

    generated = 0
    for post in posts:
        if not post.get("body"):
            print(f"  SKIP {post['slug']}: no body")
            continue

        html = generate_html(post)
        filepath = os.path.join(BLOG_DIR, f"{post['slug']}.html")
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(html)
        generated += 1
        print(f"  OK {post['slug']}.html")

    print(f"\nDone: {generated} pages generated in {BLOG_DIR}/")


if __name__ == "__main__":
    main()
