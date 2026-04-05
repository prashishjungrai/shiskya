import ThemeProvider from "@/components/ThemeProvider";
import PublicSiteChrome from "@/components/public/PublicSiteChrome";
import { getPublicSettings } from "@/lib/get-public-settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getPublicSettings();

  return (
    <ThemeProvider initialSettings={settings}>
      <PublicSiteChrome>{children}</PublicSiteChrome>
    </ThemeProvider>
  );
}
