import { StaticPage, staticPageMetadata } from "@/components/static-page";

export const metadata = staticPageMetadata("editorial-policy");

export default function Page() {
  return <StaticPage slug="editorial-policy" />;
}
