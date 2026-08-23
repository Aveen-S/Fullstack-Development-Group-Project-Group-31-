import {
  BellIcon,
  ChevronDownIcon,
  CommandLineIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';

const navItems = ['Overview', 'Boards', 'Team'];

function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1480px] items-center gap-5 px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <a
          href="#"
          className="focus-ring flex shrink-0 items-center gap-2.5 rounded-xl"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-[0_8px_24px_rgba(99,91,255,0.24)]">
            <Squares2X2Icon
              className="h-5 w-5"
              strokeWidth={2}
            />
          </span>

          <span className="hidden font-display text-[17px] font-extrabold tracking-[-0.025em] text-ink sm:block">
            CollabBoard
          </span>
        </a>

        {/* Divider */}
        <div className="hidden h-6 w-px bg-line md:block" />

        {/* Workspace selector */}
        <button className="focus-ring hidden items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-ink-soft transition hover:bg-canvas md:flex">
          Product Team

          <ChevronDownIcon className="h-4 w-4 text-muted" />
        </button>

        {/* Main Navigation */}
        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Primary navigation"
        >
          {navItems.map((item, index) => (
            <button
              key={item}
              className={`focus-ring rounded-lg px-3 py-2 text-sm font-medium transition ${
                index === 1
                  ? 'bg-primary-soft text-primary'
                  : 'text-muted hover:bg-canvas hover:text-ink'
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">

          {/* Search */}
          <div className="hidden min-w-64 items-center gap-2 rounded-xl border border-line bg-canvas/70 px-3 py-2 text-sm text-muted transition focus-within:border-primary/40 focus-within:bg-surface focus-within:ring-4 focus-within:ring-primary/10 xl:flex">

            <CommandLineIcon className="h-4 w-4 shrink-0" />

            <input
              aria-label="Search workspace"
              className="w-full bg-transparent text-ink outline-none placeholder:text-muted"
              placeholder="Search workspace"
            />

            <kbd className="rounded-md border border-line-strong bg-surface px-1.5 py-0.5 text-[10px] font-semibold text-muted">
              ⌘K
            </kbd>
          </div>

          {/* Notification */}
          <button
            className="focus-ring relative flex h-9 w-9 items-center justify-center rounded-xl text-muted transition hover:bg-canvas hover:text-ink"
            aria-label="Notifications"
          >
            <BellIcon className="h-5 w-5" />

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-high ring-2 ring-surface" />
          </button>

          {/* User */}
          <button
            className="focus-ring flex items-center gap-2 rounded-xl p-1 transition hover:bg-canvas"
            aria-label="Open profile menu"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-white">
              JD
            </span>

            <ChevronDownIcon className="hidden h-4 w-4 text-muted sm:block" />
          </button>

        </div>
      </div>
    </header>
  );
}

export default Navbar;
