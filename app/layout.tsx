import './globals.css';

export const metadata = {
  title: 'Read to Speak AI Studio',
  description: 'Learn English through input and output — reading, listening, and real conversation practice.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
