<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/6bc4d326-a553-4a08-9d96-95065b406793

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy Free on Render

This app needs a Node server, so deploy it as a free Render Web Service.

1. Push this project to a GitHub repository.
2. Open [Render](https://render.com), create a free account, and choose **New > Blueprint**.
3. Connect the GitHub repository. Render will read `render.yaml`.
4. Add these environment variables when Render asks:
   - `GEMINI_API_KEY`: your Gemini API key
   - `ALLOWED_ORIGINS`: your Render app URL after the first deploy, for example `https://indian-law-order-chatbot.onrender.com`
5. Deploy.

Render free services can sleep when inactive, so the first request after a quiet period may take a little longer.
