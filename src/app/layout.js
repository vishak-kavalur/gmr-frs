"use client";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Suspense } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


const theme = createTheme({
  palette: {
    primary: {
      main: "#ad8b3a",
    },
  },
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Biometrik</title>
        <meta name="description" content="Description" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider theme={theme}>
          <Suspense>
            <Header />
            <div className="layoutBody">{children}</div>
            <Footer />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
