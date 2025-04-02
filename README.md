# QuickBid CRM Sales Panel

A modern, responsive CRM system built with Next.js and TypeScript for managing sales leads and team performance.

## Features

- **Dashboard Overview**
  - Real-time analytics with charts and graphs
  - Lead source distribution
  - Team performance metrics
  - Live updates and notifications

- **Lead Management**
  - Comprehensive lead tracking
  - Lead assignment system
  - Status tracking and updates
  - Filter and search functionality

- **Team Management**
  - Sales team performance tracking
  - Lead assignment and distribution
  - Individual performance metrics
  - Role-based access control

- **Analytics & Reporting**
  - Detailed performance metrics
  - Conversion tracking
  - Response time analytics
  - Custom report generation

## Tech Stack

- **Frontend Framework**: Next.js 14 with TypeScript
- **UI Library**: Material-UI (MUI)
- **Charts**: Recharts
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Authentication**: NextAuth.js

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/quickbid-crm.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (dashboard)/       # Dashboard routes
│   ├── api/               # API routes
│   └── providers.tsx      # Theme and other providers
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── ui/               # UI components
│   ├── charts/           # Chart components
│   └── forms/            # Form components
├── lib/                   # Utility functions and hooks
│   ├── utils/            # Helper functions
│   ├── hooks/            # Custom hooks
│   └── types/            # TypeScript types
└── styles/               # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@quickbid.co.in or join our Slack channel.
