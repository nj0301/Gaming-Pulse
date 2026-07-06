import { StaticPage, staticPageMetadata } from "@/components/static-page";

export const metadata = staticPageMetadata("cookies");

export default function Page() {
  return <StaticPage slug="cookies" />;
}
