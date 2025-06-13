'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

const inter = Inter({ subsets: ["latin"] });

// Metadata can't be used with 'use client' directive
// Using static metadata in a separate metadata.ts file instead

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>QuickBid CRM</title>
        <meta name="description" content="Sales Panel for QuickBid CRM" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
        <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
