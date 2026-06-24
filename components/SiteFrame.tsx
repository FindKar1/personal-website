import Link from "next/link";
import { navItems } from "@/lib/site-data";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/88 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="group flex items-baseline gap-3">
          <span className="font-serif text-2xl tracking-[-0.04em] text-ink transition-colors group-hover:text-rust">
            Kar Dhillon
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.26em] text-graphite/60 sm:inline">
            Field journal
          </span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-7">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-graphite transition-colors hover:text-rust"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-paper px-5 py-10 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="font-serif text-3xl leading-none tracking-[-0.04em] text-ink">
            Notes from the edge of software, science, infrastructure, and simulation.
          </p>
        </div>
        <div className="flex flex-col gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-graphite/75 md:items-end">
          <Link href="/contact" className="hover:text-rust">
            Contact
          </Link>
          <a href="https://www.kardhillon.com" className="hover:text-rust">
            kardhillon.com
          </a>
          <span>© {new Date().getFullYear()} / personal archive</span>
        </div>
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
