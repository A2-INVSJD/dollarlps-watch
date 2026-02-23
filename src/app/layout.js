import "./globals.css";

export const metadata = {
  title: "Dollar Watch | Data Fluid",
  description:
    "Real-time USD/HNL exchange rate dashboard powered by Banco Central de Honduras data. Track the dollar, inflation, interest rates, reserves, and remittances.",
  openGraph: {
    title: "Dollar Watch — Data Fluid",
    description: "Live Honduran economic dashboard tracking USD/Lempira exchange rates",
    siteName: "Data Fluid",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
