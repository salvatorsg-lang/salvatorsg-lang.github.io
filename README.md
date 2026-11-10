# Jonny Chai — Personal Portfolio Site

Plain static site — `index.html` + `styles.css` + `script.js` + `recruiter.html`,
no framework, no build step. All JavaScript is client-side; nothing is tracked.

## Files

- `index.html` — public page: about, interactive health-score demo, AI prompt
  playground, before/after strip, experience, AI video work (Instagram embeds
  with plain links as fallback), skills, contact.
- `recruiter.html` — unlisted recruiter pack (has `<meta name="robots"
  content="noindex">`, NOT linked from the public page — share the link
  directly with recruiters only). Fuller experience detail + how J uses AI
  in CS work + link to the CS Toolkit repo. No resume PDF is linked: no
  generic ATS resume PDF exists (every resume PDF on file is tailored to a
  specific employer), so the page says "resume on request".
- `script.js` — dark-mode toggle (localStorage), animated hero counters,
  health-score demo (mirrors `health_score.py` exactly), playground tabs
  and copy buttons.
- `styles.css` — light theme + dark theme.

## Preview locally

Open `index.html` in any browser, or serve it with:

```bash
cd ~/workspace/portfolio-site
python3 -m http.server 8000
```

then visit http://localhost:8000

## Publish to GitHub Pages (do NOT do this until J approves)

1. Create a new public repo on GitHub named `salvatorsg-lang.github.io`
   (the user-site repo, so it serves at `https://salvatorsg-lang.github.io/`).
2. Push all files in this folder to the repo's `main` branch.
3. In the repo: Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`.
4. The site will be live at `https://salvatorsg-lang.github.io/` and the
   recruiter pack at `https://salvatorsg-lang.github.io/recruiter.html`.
   The CS Toolkit repo (`salvatorsg-lang/cs-toolkit`) is published separately.

## Content rules

Every fact on the page comes from J's verified background only:

- 6+ years managing 100+ agencies as an embedded Meta partner across APAC;
  12+ years in enterprise technology; portfolio revenue +30% YoY;
  Highest MTD Revenue Achiever, Agency SEA, September 2024.
- Verified certifications only: Meta Certified Media Buying Professional;
  Meta Certified Media Measurement Specialist.
- AI video work is labelled honestly as AI-generated experiments, not client work.

Do NOT add: renewal/quota ownership, Salesforce, eSignature/CLM, crypto/AML,
or capital-markets experience; any job application, employer applied to, or salary;
income promises; a photo of J (none supplied — the site uses a "JC" initials mark).
