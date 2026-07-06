import Link from "next/link";
import type { NavItem, SiteSettings } from "@/lib/cms/types";
import { Container } from "@/components/ui/section";
import { NewsletterForm } from "@/components/newsletter-form";

export function Footer({ footerNav, settings }: { footerNav: NavItem[]; settings: SiteSettings }) {
  const about = footerNav.filter((item) => ["/about", "/contact", "/advertise", "/submit-tip"].includes(item.href));
  const legal = footerNav.filter((item) => ["/privacy", "/terms", "/cookies"].includes(item.href));

  return (
    <footer className="mt-20 border-t border-edge bg-bg-secondary">
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-lg font-bold text-fg">
              Gaming<span className="text-cyan">Pulse</span>
            </p>
            <p className="mt-2 text-sm text-fg-muted">{settings.tagline}</p>
          </div>

          <FooterColumn title="Site" items={about} />
          <FooterColumn title="Legal" items={legal} />
        </div>

        <div className="mt-10 border-t border-edge pt-8" id="newsletter-footer">
          <div className="max-w-md">
            <p className="font-display font-bold text-fg">{settings.newsletterHeading}</p>
            <p className="mt-1 text-sm text-fg-muted">{settings.newsletterSubheading}</p>
            <NewsletterForm placement="footer" />
          </div>
        </div>

        <div className="mt-10 border-t border-edge pt-6">
          <p className="text-xs leading-relaxed text-fg-muted">{settings.demoNotice}</p>
          <p className="mt-2 text-xs text-fg-muted">© {new Date().getFullYear()} Gaming Pulse.</p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <nav aria-label={title}>
      <p className="font-label text-xs font-semibold uppercase tracking-widest text-fg-muted">{title}</p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="text-sm text-fg-secondary transition-colors hover:text-cyan">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
