import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { NAV_LINKS, SITE_CONFIG } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <Container>
        <div className="py-12">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Branding */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {SITE_CONFIG.name}
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {SITE_CONFIG.description}
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                Navigation
              </h4>
              <ul className="mt-4 space-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-accent-blue dark:text-gray-400 dark:hover:text-accent-blue"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                Contact
              </h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <a
                    href={`mailto:${SITE_CONFIG.author.email}`}
                    className="text-sm text-gray-600 hover:text-accent-blue dark:text-gray-400 dark:hover:text-accent-blue"
                  >
                    {SITE_CONFIG.author.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-800">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              &copy; {currentYear} {SITE_CONFIG.name}. Tous droits réservés.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
