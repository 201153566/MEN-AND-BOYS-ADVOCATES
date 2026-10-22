# Men and Boys Advocates (MBA)

A responsive website for Men and Boys Advocates, a community-based organisation in Mamelodi, Pretoria.

## Run the website on your computer

1. Install the current **Node.js LTS** release from [nodejs.org](https://nodejs.org/). Node.js includes npm.
2. Open this project folder in Visual Studio Code.
3. Open the VS Code terminal using **Terminal → New Terminal**.
4. Check that Node.js and npm are available:

   ```powershell
   node --version
   npm --version
   ```

5. Install the project packages (the first time only):

   ```powershell
   npm install
   ```

6. Create a local `.env` file from `.env.example`, configure a PostgreSQL
   database, and replace the example admin credentials and session secret. Keep
   `.env` private; it is excluded from Git.

   ```powershell
   Copy-Item .env.example .env
   ```

7. Start the API in one terminal:

   ```powershell
   npm run dev:api
   ```

8. Start the local website in a second terminal:

   ```powershell
   npm run dev
   ```

9. Open the local address printed in the terminal, usually `http://localhost:5173`.
   Keep both terminals running while you work. Press **Ctrl+C** in each terminal to stop them.

## Useful commands

```powershell
npm run dev       # Start the development website
npm run build     # Check TypeScript and create a production build
npm run lint      # Check the code for common issues
npm run preview   # Preview a production build locally
npm test          # Run application validation tests
```

## Publish the website on Render

The Render Blueprint in `render.yaml` configures the static website, a Node API,
and a PostgreSQL database. It also connects the website to the API and the API
to the database.

1. In the Render dashboard, create or update the Blueprint connected to this
   GitHub repository. Review the resources and environment variables before
   applying changes.
2. Set a unique `ADMIN_EMAIL` and strong `ADMIN_PASSWORD` when prompted. These
   credentials protect the application inbox at `/admin`; change them only
   through the Render service environment settings.
3. Configure `SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD`, and `SMTP_FROM` on the
   `mba-api` service to enable application email notifications. Notifications go
   to `info.112mba@gmail.com`; if SMTP is not configured, the form tells the
   applicant that the application was saved but no notification was sent.
4. Render can rebuild and deploy future website changes when they are pushed to
   the connected GitHub branch.

The API Blueprint allows requests from the current Render website host
(`mba-website-r8ok.onrender.com`). Update `FRONTEND_HOST` on `mba-api` if the
website's Render host changes.

**Important database limitation:** the Blueprint uses Render's free PostgreSQL
plan as requested. Render documents that free databases expire 30 days after
creation, have no backups, and are deleted after a further 14-day grace period
unless upgraded. Do not use this plan for long-term application records. Upgrade
to a paid database or export the applications before expiration; free services
can also sleep when idle.

The forms collect names and contact details to review membership, volunteer and
partnership applications. Staff can review or delete submissions from the
password-protected `/admin` page. Before collecting real applications, MBA
should review its privacy notice and retention process. Do not submit sensitive
health information through these forms. Event records are samples; verify them
before announcing them.

## Project notes

- The homepage includes membership, volunteer and partnership applications, an authenticated admin inbox and optional email notifications.
- The homepage banner uses the supplied mentorship photograph. The additional homepage photo and online fonts are illustrative/external resources.
- The event cards are explicitly labelled sample content. Verify event details before publishing them as announcements.
- Official address, registration information, social media links, event details and office-bearer information remain to be confirmed.
