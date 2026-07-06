import { getSiteSettings } from "@/lib/cms";
import { Container } from "@/components/ui/section";
import { NewsletterForm } from "@/components/newsletter-form";

export async function NewsletterSection() {
  const settings = await getSiteSettings();
  return (
    <section aria-label="Newsletter" id="newsletter">
      <Container>
        <div className="relative overflow-hidden rounded-xl border border-cyan/30 bg-surface p-8 sm:p-12">
          <div aria-hidden className="gp-grid-bg absolute inset-0" />
          <div className="relative max-w-xl">
            <h2 className="font-display text-2xl font-bold text-fg">{settings.newsletterHeading}</h2>
            <p className="mt-2 text-fg-secondary">{settings.newsletterSubheading}</p>
            <NewsletterForm placement="homepage" />
            <p className="mt-3 text-xs text-fg-muted">No spam, no data resale. Unsubscribe in one click.</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
