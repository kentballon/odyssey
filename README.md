# Findings

A personal collection of technical write-ups, built with [Hugo](https://gohugo.io)
and deployed via GitHub Pages. The visual style is a lightweight homage to
[Oxide's RFD site](https://rfd.shared.oxide.computer/) — dark by default,
monospace metadata, a numbered index, and a per-entry state badge.

## Adding a new finding

```bash
hugo new findings/0003-some-slug.md
```

This uses `archetypes/findings.md`. Fill in the front matter:

```yaml
---
title: "Short, specific title"
number: 3            # bump this — drives the FD number and default sort order
author: "Kent"
state: "draft"        # draft | discussion | published | abandoned | notes
date: 2026-08-03
tags: ["gitaly", "performance"]
---
```

`state` just changes the badge color/label on the index and the entry page —
use it to signal how baked a write-up is (e.g. `notes` for a working scratch
pad, `published` once you're happy with it).

## Local development

```bash
hugo server -D    # -D includes draft: true pages, if you use that field
```

Then open http://localhost:1313.

## Deployment

`.github/workflows/hugo.yml` builds the site with the Hugo extended CLI and
publishes it via GitHub Pages' native Actions deployment whenever `main`
changes. To turn it on after pushing this repo to GitHub:

1. Go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Push to `main` (or run the workflow manually from the **Actions** tab).

The site will be live at:

```
https://<your-username>.github.io/<repo-name>/
```

The workflow passes the correct base URL to Hugo automatically via
`actions/configure-pages`, so it works whether the repo is a project site
(`/repo-name/` subpath) or a user/org root site (`<username>.github.io`).

## Structure

```
content/findings/    one Markdown file per finding, numbered
layouts/              custom templates (index list, single entry, base shell)
static/css/style.css  the whole theme — dark/light tokens + layout
static/js/theme.js    dark/light toggle, persisted in localStorage
archetypes/findings.md front matter template for `hugo new`
```
