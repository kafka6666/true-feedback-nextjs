# True Feedback

A modern, anonymous feedback and messaging platform built with Next.js. True Feedback enables users to receive honest messages while maintaining sender anonymity, similar to platforms like Qooh.me.

![True Feedback](public/images/logo.png)

## Features

- **Anonymous Messaging**: Send honest feedback without revealing your identity
- **User Dashboard**: Manage all your received messages in one place
- **AI-Powered Suggestions**: Get message suggestions powered by Google's Gemini AI
- **Customizable Privacy**: Toggle message reception on/off with a simple switch
- **Secure Authentication**: Robust user authentication with Next Auth
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Dark Mode Support**: Choose between light and dark themes

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **State Management**: React Hook Form, Context API
- **Backend**: Next.js API Routes, Edge Runtime
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js v5
- **AI Integration**: Google Gemini 2.0 via Vercel AI SDK
- **Deployment**: Optimized for Vercel deployment

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm/yarn/pnpm
- MongoDB connection string
- Google Gemini API key

### Environment Setup

1. Clone the repository
2. Copy `.env.sample` to `.env.local` and fill in the required environment variables:

```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key
```

### Installation

```bash
# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Run the development server
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. Create an account or sign in
2. Copy your unique profile link from the dashboard
3. Share your link with others to receive anonymous messages
4. Toggle the "Accept messages" switch to control when you can receive messages
5. View, refresh, and manage your messages from the dashboard

## API Routes

- `/api/auth/*` - Authentication endpoints
- `/api/sign-up` - User registration
- `/api/check-usrnm-unique` - Username availability check
- `/api/verify-user` - User verification
- `/api/send-message` - Send anonymous messages
- `/api/get-messages` - Retrieve user messages
- `/api/delete-message` - Delete messages
- `/api/accept-messages` - Toggle message acceptance
- `/api/suggest-messages` - AI-powered message suggestions

## Deployment

The easiest way to deploy your True Feedback app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Google Gemini AI](https://ai.google.dev/)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
