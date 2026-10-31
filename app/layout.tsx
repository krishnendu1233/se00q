import "./globals.css";

export const metadata = {
  title: "se00q | Creators Tool Suite",
  description: "Democratizing content analytics through community breakdown.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* font-mono is applied globally in globals.css as configured earlier */}
      <body>{children}</body>
    </html>
  );
}
