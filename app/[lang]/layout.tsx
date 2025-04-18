import "../assets/scss/globals.scss";
import "../assets/scss/theme.scss";
import { Inter } from "next/font/google";
import { siteConfig } from "@/config/site";
import Providers from "@/provider/providers";
import "simplebar-react/dist/simplebar.min.css";
import TanstackProvider from "@/provider/providers.client";
import "flatpickr/dist/themes/light.css";
import DirectionProvider from "@/provider/direction.provider";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({ children, params: { lang } }: { children: React.ReactNode; params: { lang: string } }) {
  return (
    <html lang={lang}>
      
        <TanstackProvider>
          <Providers>
            <DirectionProvider lang={lang}>{children}</DirectionProvider>
          </Providers>
        </TanstackProvider>

    </html>
  );
}
