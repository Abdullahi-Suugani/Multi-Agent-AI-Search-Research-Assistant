import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Scout — AI research assistant", description: "A transparent multi-agent research workspace" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
