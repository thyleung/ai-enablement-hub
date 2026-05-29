import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="header-brand">
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-mark-inner" />
          </span>
          <span className="brand-name">AI Enablement Hub</span>
        </Link>

        <nav className="header-nav" aria-label="Primary navigation">
          <Link
            href="/"
            className={`nav-link${router.pathname === '/' ? ' active' : ''}`}
          >
            Submit Request
          </Link>

          <span className="nav-divider" aria-hidden="true" />

          <Link
            href="/review"
            className={`nav-link-reviewer${router.pathname === '/review' ? ' active' : ''}`}
            title="Internal reviewer view: demo only"
          >
            Reviewer View
          </Link>
        </nav>
      </div>
    </header>
  );
}
