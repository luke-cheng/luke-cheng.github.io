# Luke's Personal Website

## Core Vision

An experimental, static-first personal website powered by Chrome's on-device AI (`languageModel`). The site uses Next.js to render static pages built from Markdown content, while relying on local browser SLMs to dynamically dictate themes, layouts, question responses, and content expansion on the fly.

## High-Level Architecture & Intent

* **Static Base, Runtime AI**: The site compiles to purely static files (`npm run build` $\rightarrow$ `out/`). All AI capabilities run exclusively on the client side inside the visitor's browser.
* **Markdown as Ground Truth**: Build-time Markdown sources (`content-source/LukeCheng.md`, `content-source/blogs/`) act as the absolute knowledge base for all AI contexts and static page routes.
* **Graceful Degradation**: Always feature-detect Chrome's Prompt API. Ensure the site remains fully navigable, readable, and functional when on-device AI is absent, downloading, or unsupported.
* **Client-Side Safety**: Any dynamic markup generated or dictated by the SLM must be sanitized before injection.
* **Layout Agnostic**: The SLM controls spatial and structural layout dynamically. Keep UI modular, flexible, and decoupled from rigid structural assumptions.

## Tech Stack Guidelines

* Next.js 16 (check `/agents.md` for breaking change) with static export enabled (`output: 'export'`).
* Google Chrome's Prompt API (check /docs)
