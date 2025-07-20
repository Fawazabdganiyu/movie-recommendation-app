# Movie Recommendation App - Frontend

This is the frontend for the Movie Recommendation App, built with [Next.js](https://nextjs.org) and bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Tech Stack

- **Next.js 14+** with App Router
- **React.js** with modern hooks and Server Components
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Axios** for API calls

## Getting Started

First, install dependencies and run the development server:

```bash
npm install
npm run dev
# or
yarn install && yarn dev
# or
pnpm install && pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Home page
│   ├── auth/         # Authentication pages
│   ├── movies/       # Movie-related pages
│   └── profile/      # User profile pages
├── components/       # Reusable UI components
│   ├── ui/          # Basic UI components
│   ├── forms/       # Form components
│   └── layout/      # Layout components
├── hooks/           # Custom React hooks
├── lib/             # Utility libraries and configurations
├── services/        # API service calls
└── types/           # TypeScript type definitions
```

## Features

- **Movie Discovery**: Search and browse movies
- **User Authentication**: Login/register functionality
- **Personalized Recommendations**: AI-powered movie suggestions
- **Watchlists**: Save and organize favorite movies
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Environment Variables

Create a `.env.local` file in the frontend directory:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
