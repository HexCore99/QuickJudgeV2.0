

# QuickJudge V2.0

QuickJudge V2.0 is a frontend application built with Vite, React, Redux Toolkit, React Router, and Tailwind CSS v4.


## Prerequisites

Install the following before running the project:

- Node.js `^20.19.0 || >=22.12.0`
- npm

This repo already includes a `package-lock.json`, so the default and recommended package manager is `npm`.

## Installation

Clone the repository, then install dependencies:

```bash
npm install
```

If you are using Windows PowerShell and `npm` is blocked by execution policy, run the command with:

```bash
npm.cmd install
```

## Running the Project

Start the development server:

```bash
npm run dev
```

### Admin Demo

- Email: `admin@quickjudge.dev`
- Password: `123456`

Note: the admin login exists in the mock auth flow, but the admin route is not currently configured in `src/routes/AppRouter.jsx`.

## Project Structure

```text
QuickJudgeV2.0/
├── backend/
│   ├── package-lock.json
│   ├── package.json
│   └── src/
│       ├── config/
│       │   └── db.js
│       ├── controllers/
│       │   └── auth.controller.js
│       ├── routes/
│       │   └── auth.routes.js
│       └── server.js
├── public/
│   └── vite.svg
├── src/
│   ├── app/
│   │   └── store.js
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── admin/
│   │   ├── auth/
│   │   │   ├── AuthCard.jsx
│   │   │   ├── AuthHeader.jsx
│   │   │   ├── AuthInput.jsx
│   │   │   ├── AuthShell.jsx
│   │   │   ├── DemoAccess.jsx
│   │   │   └── PasswordStrengthBar.jsx
│   │   ├── common/
│   │   │   ├── AppSearchInput.jsx
│   │   │   ├── AppTextInput.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Error.jsx
│   │   │   ├── Info.jsx
│   │   │   ├── Loading.jsx
│   │   │   └── TagChip.jsx
│   │   ├── contest/
│   │   │   ├── contestDetails/
│   │   │   │   ├── ContestDetailsHeader.jsx
│   │   │   │   ├── ContestProblemsTable.jsx
│   │   │   │   └── ContestTabs.jsx
│   │   │   ├── ContestFilterBar.jsx
│   │   │   ├── ContestListCard.jsx
│   │   │   ├── ContestPageHeader.jsx
│   │   │   ├── ContestPasswordModal.jsx
│   │   │   ├── ContestSection.jsx
│   │   │   ├── ContestSectionTitle.jsx
│   │   │   ├── PastContestRow.jsx
│   │   │   └── PastContestTable.jsx
│   │   ├── landings/
│   │   │   ├── CTASection.jsx
│   │   │   ├── EdicationSection.jsx
│   │   │   ├── FeatureCard.jsx
│   │   │   ├── FeatureSection.jsx
│   │   │   └── HeroSection.jsx
│   │   ├── layout/
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PublicLayout.jsx
│   │   │   ├── StudentLayout.jsx
│   │   │   ├── StudentSidebar.jsx
│   │   │   └── StudentTopTabs.jsx
│   │   └── problems/
│   │       ├── ProblemDifficultyBadge.jsx
│   │       ├── ProblemStatusDot.jsx
│   │       └── ProblemTitleLink.jsx
│   ├── features/
│   │   ├── auth/
│   │   │   ├── authApi.js
│   │   │   ├── authSelectors.js
│   │   │   ├── authSlice.js
│   │   │   └── authThunks.js
│   │   └── contests/
│   │       ├── contestSlice.js
│   │       ├── contestsApi.js
│   │       ├── contestsMockData.js
│   │       ├── contestsSelectors.js
│   │       └── contestsThunks.js
│   ├── pages/
│   │   ├── public/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── SignupPage.jsx
│   │   └── student/
│   │       ├── ContestDetailsPage.jsx
│   │       ├── ContestPage.jsx
│   │       └── PastContestsPage.jsx
│   ├── routes/
│   │   └── AppRouter.jsx
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── prettier.config.js
├── README.md
├── vite.config.js
```

## Tech Stack

- Vite 7
- React 19
- Redux Toolkit
- React Router DOM
- Tailwind CSS v4
- ESLint
- Prettier

## Notes

- No backend setup is required for the current version.
- No environment variables are required for the current version.
- Authentication and contest content are mocked for UI development.
- The app is still in progress and is being aligned with the intended larger QuickJudge structure.
