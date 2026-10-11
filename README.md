# Ahmed Elhossary — Portfolio

Personal portfolio website of **Ahmed Elhossary**, an AI Automation Engineer and Software Engineering student based in Cairo, Egypt (graduating 2027).

The site presents my skills, projects and learning journey, and includes a built-in **admin dashboard** that lets me edit every part of the content and read contact messages — without touching the code.

> **Live site:** _add your Vercel link here_

---

## Features

- **Responsive portfolio** — Hero, About, Skills, Projects, Journey and Contact sections, with a smooth-scrolling navbar that highlights the current section.
- **Project showcase** — project cards that open a detailed popup with the overview and technologies used, each linking to its GitHub repository.
- **Journey timeline** — my path from first lines of code to AI and automation.
- **Download CV** button in the navbar.
- **Contact form** — visitors can send a message; it is saved to the database and also emailed to me.
- **Admin dashboard** (`/admin`) protected by Google sign-in:
  - Edit all text: hero, ticker, about, skills, projects, journey, contact and footer.
  - Add, remove and reorder skills, projects and timeline milestones.
  - **Add new sections** that appear before Contact and get their own navbar link automatically.
  - **Messages inbox** — unread count, mark as read, archive, delete, and reply in Gmail with one click.
- Content falls back to built-in defaults, so the site always renders even if the database is unreachable.

## Tech stack

| Area | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org/) (App Router) and React |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Database | [Firebase Firestore](https://firebase.google.com/docs/firestore) |
| Authentication | Firebase Authentication (Google sign-in) |
| Email copy of messages | [Web3Forms](https://web3forms.com/) |
| Hosting | [Vercel](https://vercel.com/) |

## Project structure

```
my-portfolio/
├── public/                      # Static files (photo, CV PDF, images)
├── src/
│   ├── app/
│   │   ├── page.js              # The public portfolio page
│   │   ├── layout.js
│   │   ├── globals.css
│   │   └── admin/
│   │       ├── page.jsx         # Admin dashboard (Google sign-in)
│   │       └── layout.jsx
│   └── lib/
│       ├── defaultContent.js    # Built-in content (shown until edited in /admin)
│       ├── content.js           # Load/save content and messages (Firestore)
│       ├── firebase.js          # Firebase initialisation
│       └── firebaseAuth.js      # Firebase Auth (used only by /admin)
├── firestore.rules              # Firestore security rules
└── .env.local.example           # Environment variables template
```

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/ahmedelhossary22/my-portfolio.git
cd my-portfolio
npm install
```

### 2. Set up Firebase

1. Create a project at the [Firebase Console](https://console.firebase.google.com/).
2. Add a **Web app** and copy its configuration values.
3. Create a **Firestore** database (production mode, Standard edition).
4. In **Authentication**, enable the **Google** sign-in provider.
5. In Firestore, open **Rules**, paste the contents of [`firestore.rules`](./firestore.rules) and publish.

### 3. Add environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### 4. Set the admin account

Only one Google account can open the dashboard. Set your email in **both** places:

- `ADMIN_EMAIL` in `src/lib/content.js`
- the `isAdmin()` function in `firestore.rules`

### 5. Run locally

```bash
npm run dev
```

- Portfolio: <http://localhost:3000>
- Admin dashboard: <http://localhost:3000/admin>

## Contact form email copy (optional)

The form always saves messages to Firestore. To also receive each message by email, create a free access key at [web3forms.com](https://web3forms.com/) and set `WEB3FORMS_KEY` in `src/app/page.js`.

## Deploying to Vercel

1. Push this repository to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Add the six `NEXT_PUBLIC_FIREBASE_*` environment variables.
4. Click **Deploy**.
5. In Firebase, go to **Authentication → Settings → Authorized domains** and add your Vercel domain so Google sign-in works on the live site.

Every `git push` to `main` redeploys automatically. Changes made in the admin dashboard are live immediately and need no redeploy.

## Editing content

Open `/admin`, sign in with the admin Google account, choose a section under **Edit website**, make your changes and press **Save changes**. Use **Reset section** to restore the original text of any section.

## Security notes

- Firebase web configuration values are public by design. Access is controlled by the Firestore security rules in this repository.
- Visitors can only **create** valid messages; only the admin account can read, update or delete them, and only the admin can edit the site content.
- The admin page is not linked from the public site and is excluded from search engines.

## Author

**Ahmed Elhossary** — AI Automation Engineer & Software Engineering student

- GitHub: [@ahmedelhossary22](https://github.com/ahmedelhossary22)
- LinkedIn: [Ahmed Elhossary](https://www.linkedin.com/in/ahmed-elhossary-ai-engineer/)

---

© Ahmed Elhossary. All rights reserved.
