# sun.chat — Local Prototype

A full high-fidelity implementation of the Figma design (landing, chat,
safety modal, feedback modal, privacy policy, local communities, and
security/safety-tips pages, in both English and Turkish), built with
Flask + plain HTML/CSS/JS. No Node.js required — just Python.

## Authorship and use of AI

The visual design (Figma) and the system prompt are my own work.
The application code in this repository (`server.py`,
`static/index.html`, `static/style.css`, `static/script.js`) was
generated with Claude (Anthropic) from my Figma design, using Figma
Dev Mode, and then tested and adjusted by me. See Sections 3.7 and 5
of the project report.


## Folder Structure
```
prototip-chat/
  server.py
  requirements.txt
  static/
    index.html
    style.css
    script.js
    sun-logo.svg
    community-illustration.svg
```

## Setup

1. **Check that Python is installed**
   ```
   python3 --version
   ```
   If not, download it from python.org.

2. **Install the required packages**
   ```
   pip install -r requirements.txt
   ```

3. **Set your API key**
   Mac/Linux:
   ```
   export ANTHROPIC_API_KEY="your-key-here"
   ```
   Windows (PowerShell):
   ```
   $env:ANTHROPIC_API_KEY="your-key-here"
   ```
   You'll need to re-enter this in every new terminal window/session.

4. **Run it**
   ```
   python3 server.py
   ```
   Then open `http://localhost:5000` in your browser (some machines —
   especially Macs with AirPlay Receiver enabled — may need a different
   port if 5000 is already in use; change the `port=` value at the
   bottom of `server.py` if so).

## Why proxy through Flask (Python)?

The API key is never exposed in the browser — it only lives on this
server, as an environment variable. The browser only calls this app's
own `/api/chat` endpoint; Flask makes the actual call to the Claude API
behind the scenes. This is safer than embedding the key directly in
client-side code (the `anthropic-dangerous-direct-browser-access`
approach).

## What you can customise

- **System prompt**: the `SYSTEM_PROMPT` variable inside `server.py`.
- **Colours/fonts**: the `:root { ... }` block at the top of
  `static/style.css` — these were pulled directly from the Figma file,
  but you can update them here if the design changes.
- **Copy/text**: edit directly inside the relevant section of
  `static/index.html`. UI text exists in both English and Turkish
  inside the `TRANSLATIONS` object in `static/script.js` (the chat
  itself doesn't need a translation layer — Claude automatically
  replies in whichever language the visitor types in).

## Notes

- Conversation history resets on page reload (`state.messages` is kept
  in browser memory only, not persisted anywhere).
- The "Quick Exit" button (red, top right) and the ESC key both send
  the browser straight to the real google.com, using
  `window.location.replace()` rather than a normal navigation — so the
  page isn't left in browser history, and pressing "back" afterwards
  won't return to sun.chat. This mirrors the safety pattern used by
  real domestic-abuse support tools.

## Deployment

This prototype is also deployed for participant testing via
[Render](https://render.com) (free tier), connected to this GitHub
repository with continuous deployment — every push to `main` triggers a fresh
deploy automatically. The `ANTHROPIC_API_KEY` is set as an environment
variable directly in Render's dashboard, never committed to the repo.
