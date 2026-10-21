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

6. Start the local website:

   ```powershell
   npm run dev
   ```

7. Open the local address printed in the terminal, usually `http://localhost:5173`.
   Keep the terminal running while you work. Press **Ctrl+C** in the terminal to stop the website.

## Useful commands

```powershell
npm run dev       # Start the development website
npm run build     # Check TypeScript and create a production build
npm run lint      # Check the code for common issues
npm run preview   # Preview a production build locally
```

## Publish the website on Render

This project includes a Render Blueprint file (`render.yaml`) that configures a
static website and the page fallback needed for React Router.

1. Create a GitHub account if you do not already have one, then create a **private**
   repository for this project.
2. In VS Code, open **Source Control** and choose **Initialize Repository**. Review
   the listed files, commit your project, and use VS Code's **Publish to GitHub**
   option to send it to the private repository. Do not add passwords, API keys or
   other secrets to the repository.
3. Create or sign in to your account at [render.com](https://render.com/).
4. In the Render dashboard, select **New → Blueprint**, connect the GitHub
   repository, and deploy the Blueprint. Render reads `render.yaml`, builds the
   website, and provides its public `onrender.com` address.
5. After publishing changes, commit and push them to GitHub; Render can rebuild
   the website from the connected repository.

The live site is public. The current homepage has no database or form that stores
personal information. Event records are samples; confirm them before announcing
them. Connect a custom domain later through Render's dashboard after verifying
that you control the domain.

## Project notes

- The homepage is the first implementation stage; additional website pages and the membership form will be added in later stages.
- The homepage banner uses the supplied mentorship photograph. The additional homepage photo and online fonts are illustrative/external resources.
- The event cards are explicitly labelled sample content. Verify event details before publishing them as announcements.
- No membership application is collected or stored yet. Database, administrator access and email notifications are not configured.
- Official address, registration information, social media links, event details and office-bearer information remain to be confirmed.
