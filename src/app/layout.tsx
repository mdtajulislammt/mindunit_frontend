import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/redux/providers";

export const metadata: Metadata = {
  title: "MindUnite | Networking for Brain Health Professionals & Students",
  description: "The networking platform for brain health professionals and students to communicate, collaborate, and connect.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
