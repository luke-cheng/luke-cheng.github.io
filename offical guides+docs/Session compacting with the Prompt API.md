![Thomas Steiner](https://web.dev/images/authors/thomassteiner.jpg) Thomas Steiner [GitHub](https://github.com/tomayac) [LinkedIn](https://www.linkedin.com/in/thomassteinerlinkedin) [Mastodon](https://toot.cafe/@tomayac) [Bluesky](https://bsky.app/profile/tomayac.com) [Homepage](https://blog.tomayac.com/)

<br />


Published: June 23, 2026

<br />

Every [`LanguageModel`](https://developer.chrome.com/docs/ai/prompt-api) session has a finite context
window. As a conversation grows, the model accumulates the full message history
in its context: every user prompt and every assistant reply. When the window
fills, the browser's automatic overflow handling kicks in. It evicts the oldest
message pairs, one prompt and response pair at a time, to free up room for the
new prompt. If the incoming prompt is so large that removing the entire
conversation history doesn't fit it, the call fails outright with a
`QuotaExceededError`.

**Session compacting** is a proactive alternative: summarize the conversation
history with the [Summarizer
API](https://developer.mozilla.org/docs/Web/API/Summarizer), then restart a new
session using those summaries as `initialPrompts`. The browser never evicts
`initialPrompts` during runtime overflow handling, so the compacted summary
stays permanently anchored in the model's context, as long as the summaries
themselves fit within the context window when `create()` is called. The new
session carries the same conversational thread at a fraction of the original
token cost.

Session compacting gives long-lived `LanguageModel` conversations a way to stay
within the context window without losing continuity. The key steps are:

1. Monitor `contextUsage` relative to `contextWindow` and surface it to the user.
2. Listen for the `contextoverflow` event as an early warning.
3. Detect the language of each message with the Language Detector API, then summarize it with a language-aware Summarizer API instance.
4. Destroy the old session and seed a fresh one with `initialPrompts`.
5. Keep a `fullHistory` copy for error recovery.

## Track context usage

The Prompt API exposes two attributes for monitoring how full a session's
context is:

- `session.contextUsage`: the number of tokens currently consumed.
- `session.contextWindow`: the total token capacity of the session.

Reflect this in a `<progress>` element so users know at a glance how close the
session is to its limit. Set `value` and `max` directly to the token counts; the
browser scales the bar automatically:

    <progress id="token-bar" value="0" max="1"></progress>
    <label for="token-bar" id="token-label">Context: --- / --- tokens</label>

    function updateTokenDisplay(session) {
      const usage = session.contextUsage;
      const total = session.contextWindow;

      tokenBar.value = usage;
      tokenBar.max = total;
      tokenLabel.textContent =
        `${Math.round(usage)} / ${Math.round(total)} tokens ` +
        `(${Math.round((usage / total) * 100)}%)`;
    }

Call `updateTokenDisplay()` after every prompt response so the bar stays
current.

## Listen for context overflow

When a new prompt exceeds the remaining context, the browser's automatic
recovery begins: it removes the oldest prompt and response pairs one at a time until
it frees enough space. The `contextoverflow` event fires at the moment this
eviction starts. Register a handler immediately after creating the session:

    session.addEventListener('contextoverflow', () => {
      showWarning('⚠ Context window nearly full. Consider compacting the session.');
    });

There are two important properties of this eviction behavior:

- **`initialPrompts` are not evicted at runtime.** The browser doesn't remove them to make room for an incoming prompt. However, if the combined size of the `initialPrompts` passed to `LanguageModel.create()` is itself too large to fit in the context window, `create()` rejects with a `QuotaExceededError`, so make sure that the compaction is small enough to continue the conversation.
- **Eviction has a limit.** If the incoming prompt is so large that removing the entire prior conversation still doesn't fit it, the `prompt()` or `promptStreaming()` call fails with a `QuotaExceededError` and nothing is removed.

Read more about [context overflow
handling](https://developer.chrome.com/docs/ai/prompt-api#handling_context_overflow) in the Prompt API
documentation.

Use the `contextoverflow` event to warn the user, disable the send button, or
trigger compaction automatically before the browser starts silently discarding
conversation history.

## Compact the session

Compaction has three steps:

1. Summarize each message in the conversation history with the Summarizer API.
2. Destroy the old session.
3. Create a new session seeded with the summaries as `initialPrompts`.

### Summarize the history

The [Summarizer API](https://developer.mozilla.org/docs/Web/API/Summarizer) is a
natural fit for compressing individual chat messages. For each message, first
detect its language with the [Language Detector
API](https://developer.mozilla.org/docs/Web/API/LanguageDetector) so the
summarizer can be configured correctly:

    async function detectLanguage(text, threshold = 0.7) {
      const detector = await LanguageDetector.create();
      const results = await detector.detect(text);
      if (results.length > 0 && results[0].confidence >= threshold) {
        return results[0].detectedLanguage;
      }
      return null; // confidence too low --- caller falls back to navigator.language
    }

The `0.7` confidence threshold avoids acting on uncertain detections. When
confidence is below the threshold, fall back to `navigator.language`.

Next, create a summarizer configured for the detected language. Prefer
`preference: 'speed'` to select the smaller, lower-latency model variant, and
fall back to `preference: 'auto'` if the faster model doesn't support the
detected language:

    const summarizers = {}; // cache, keyed by `${format}:${lang}`

    async function getSummarizer(format, lang) {
      const key = `${format}:${lang}`;
      if (summarizers[key]) return summarizers[key];

      const baseOptions = {
        type: 'tldr',
        format, // 'markdown' or 'plain-text'
        length: 'short',
        expectedInputLanguages: [lang],
        expectedContextLanguages: [lang],
        outputLanguage: lang,
      };

      let options = { ...baseOptions, preference: 'speed' };
      let avail = await Summarizer.availability(options);

      if (avail === 'unavailable') {
        options = { ...baseOptions, preference: 'auto' };
        avail = await Summarizer.availability(options);
      }

      if (avail === 'unavailable') {
        throw new Error('Summarizer API unavailable on this device.');
      }

      summarizers[key] = await Summarizer.create(options);
      return summarizers[key];
    }

Caching summarizers per `format`+`lang` pair avoids redundant `create()` calls
when consecutive messages share the same language.

The `format` argument is derived from the message content itself. Specifying
`'markdown'` for plain prose can introduce unwanted formatting, and specifying
`'plain-text'` for Markdown strips code fences and emphasis. A small regular expression
distinguishes the two:

    function looksLikeMarkdown(text) {
      return /(?:^#{1,6} |^[-*+] |\d+\. |\*\*|__|\[.+?\]\(|^> |^```)/m.test(text);
    }

With language and format resolved, summarize each message and pass a `context` string so the model understands it's compressing a chat turn, not a standalone document:

    const compacted = [];

    for (const msg of history) {
      const lang = (await detectLanguage(msg.content)) ?? navigator.language;
      const format = looksLikeMarkdown(msg.content) ? 'markdown' : 'plain-text';
      const summarizer = await getSummarizer(format, lang);

      const summary = await summarizer.summarize(msg.content.trim(), {
        context:
          `This is a ${msg.role} turn from a chat conversation. ` +
          `Preserve its key meaning as concisely as possible.`,
      });

      // Only use the summary if it's actually shorter.
      compacted.push({
        role: msg.role,
        content:
          summary.trim().length < msg.content.length ? summary.trim() : msg.content,
      });
    }

### Destroy the old session

Release the old session's resources before creating the
replacement:

    session.destroy();
    session = null;

### Create a new session with compacted history

Pass the compacted messages as `initialPrompts` to seed the new session with the conversation context:

    // Collect every language the detector was confident about.
    const sessionLangs =
      confidentLangs.size > 0 ? [...confidentLangs] : [navigator.language];

    session = await LanguageModel.create({
      expectedInputs: [{ type: 'text', languages: sessionLangs }],
      expectedOutputs: [{ type: 'text', languages: sessionLangs }],
      initialPrompts: compacted,
    });

    // Re-register the overflow handler on the new session.
    session.addEventListener('contextoverflow', () => {
      /* ... */
    });

The new session starts at a lower `contextUsage`. The conversation continues from where it left off: the model has the summaries as its prior context, so it can answer follow-up questions about earlier topics.

## Handle errors

If summarization or session creation fails after the old session has already been destroyed, the user loses the ability to chat. Maintain a separate `fullHistory` array that is never overwritten by compaction and use it as a recovery fallback:

    const history = []; // current session's view, replaced on each compaction
    const fullHistory = []; // every original message, never overwritten

    // In the catch block:
    if (!session) {
      session = await LanguageModel.create({
        initialPrompts: fullHistory.map(({ role, content }) => ({ role, content })),
      });
      session.addEventListener('contextoverflow', () => {
        /* ... */
      });
    }

Recovering from `fullHistory` may place the context near capacity again, but the user is at least back in a working state and can immediately try another compaction.

## Optionally prevent some content from being compacted

If there are critical parts of a message that must always remain in the context, for example code samples, process them separately. The following example splits a message into alternating prose and code-fence segments, then only summarizes the prose parts while leaving the code segments intact:

    // Splits text into alternating prose and code-fence segments.
    // Returns [{ type: 'prose'|'code', content: string }, ...]
    function splitByCodeFences(text) {
      const parts = [];
      const re = /^```[^\n]*\n[\s\S]*?^```[ \t]*$/gm;
      let lastIndex = 0;
      let match;
      while ((match = re.exec(text)) !== null) {
        if (match.index > lastIndex) {
          parts.push({
            type: 'prose',
            content: text.slice(lastIndex, match.index),
          });
        }
        parts.push({ type: 'code', content: match[0] });
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < text.length) {
        parts.push({ type: 'prose', content: text.slice(lastIndex) });
      }
      return parts;
    }

## Try the demo

The [session compacting demo](https://chrome.dev/web-ai-demos/prompt-api-session-compacting/) lets you chat with the Prompt API and compact the session at any time. The token bar shows real-time context usage and changes color as the context fills up. After each compaction, a log entry records the token counts before and after so you can directly observe the reduction.

You can inspect the full and compacted conversation JSON in the collapsible **Debug: conversation JSON** section at the bottom of the page.

The [source code is on GitHub](https://github.com/GoogleChromeLabs/web-ai-demos/tree/main/prompt-api-session-compacting).
<iframe src="https://chrome.dev/web-ai-demos/prompt-api-session-compacting/" allow="language-model; summarizer; language-detector" style="width:100%; height:750px;"></iframe>