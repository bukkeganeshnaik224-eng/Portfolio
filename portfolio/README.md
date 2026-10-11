# Bukke Ganesh Naik — Portfolio

A fast, dependency-free portfolio site (plain HTML, CSS and JavaScript). There is **no build step**, so it deploys anywhere that serves static files (Vercel, Netlify, GitHub Pages, Cloudflare Pages).

## Preview locally

Browsers block some features on `file://` (resume check, GitHub API), so use a tiny local server:

```bash
cd portfolio
python3 -m http.server 8000      # then open http://localhost:8000
# or: npx serve .
```

## Everything you edit lives in `js/data/`

| File | What it controls |
| --- | --- |
| `profile.js` | Name, headline, rotating roles, email, GitHub, **LinkedIn**, availability badge, resume path, contact form endpoint, SEO site URL |
| `skills.js` | Skill groups and badges (no percentages) |
| `projects.js` | Project cards. Copy one object to add a project. Set `show: false` to hide one |
| `certificates.js` | Certificate gallery. Copy one object to add a certificate |
| `education.js` | Education timeline, hackathons/activities, learning journey, future experience |

## Things still waiting on you (nothing was invented)

1. **Resume PDF**: save it as `documents/resume.pdf`. The hero button and Documents card switch on automatically.
2. **Certificate PDFs**: put each file in `certificates/` and set `pdf: "certificates/yourfile.pdf"` on its entry in `certificates.js`. Optional thumbnail: `thumb: "certificates/yourfile.jpg"` (make one with `pdftoppm -jpeg -r 60 -singlefile yourfile.pdf yourfile`). Add `date` and `verifyUrl` only if the certificate shows them. Some issuers are marked "Issuer to be confirmed" (MS Office, Daily Quiz). Fix them from the certificates.
3. **LinkedIn**: set `linkedin` in `profile.js` and the button appears everywhere.
4. **Project repo links**: set `repo` for AI_Nexus (and any other) in `projects.js`. Add `screenshot: "assets/projects/name.png"` to replace the generated preview graphic.
5. **Hidden projects**: AAROGYASATHI AI and SkillGap AI are in `projects.js` with `show: false`. Fill in real details and set `show: true` when you want them. (Your resume replaced SkillGap AI with AI_Nexus, so it is hidden.)
6. **Contact form delivery**: create a free form at formspree.io and paste its URL into `contactForm.endpoint`. Until then the form opens the visitor's email app and tells them so. It never claims to have sent anything it did not.
7. **Site URL**: after deploying, set `seo.siteUrl` in `profile.js`, replace `YOUR-DOMAIN` in `sitemap.xml` and `robots.txt`, and (for link previews) change the two `og:image`/`twitter:image` tags in `index.html` to absolute URLs.

## Deploy

**Vercel (recommended)**
1. Push this folder to a GitHub repo.
2. vercel.com → *Add New → Project* → import the repo.
3. Framework preset: **Other**. Build command: *(empty)*. Output directory: *(empty / root)*. Deploy.

**Netlify**: drag the folder onto app.netlify.com/drop.
**GitHub Pages**: Settings → Pages → deploy from `main` / root. (Change the absolute `/css/...` links in `404.html` to relative ones if you host under a sub-path.)

`vercel.json` already adds security headers and long-term caching for images. No secrets are used anywhere; the GitHub section only calls the public API.

## Privacy defaults

* Your phone number is **not** published. It only appears if you set both `phone` and `showPhone: true`.
* Anything in `certificates/` and `documents/` is public once deployed. Only add files you want visitors to see.

## Features

Animated cyber grid and particles, identity-card hero with your photo, typing role headline, simulated terminal (never runs real commands), skills dashboard, filterable projects, searchable certificate gallery with modal / full-screen / open-PDF, resume centre, education timeline, hackathons and learning journey, GitHub section with cache and fallback, validated contact form with honeypot, light/dark theme, reduced-motion support, keyboard focus states, desktop-only custom cursor, back-to-top, custom 404, Open Graph tags, JSON-LD, sitemap and robots.
