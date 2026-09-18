import "./globals.css";

export const metadata = {
  title: "Master Store Builder",
  description: "Multi-client e-commerce website builder"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
