import type { Metadata } from "next";
import AuthProviders from "./providers/AuthProvider";

import "./styles/main.scss";
import Menu from "./components/Menu/Menu";
import Logotype from "./components/logotype/Logotype";

export const metadata: Metadata = {
  title: "WorkTime by ELFASA TASA",
  description: "WorkTime by ELFASA TASA",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Подключение шрифта Inter через Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,500;1,14..32,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Inter', sans-serif" }}>
       <Logotype/>
  
        <AuthProviders>{children}</AuthProviders>
         <Menu/>
      </body>
    </html>
  );
}