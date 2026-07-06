import { StaticPage, staticPageMetadata } from "@/components/static-page";

export const metadata = staticPageMetadata("terms");

export default function Page() {
  return <StaticPage slug="terms" />;
}
