export default function Header() {
  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-black text-white flex items-center justify-center font-bold">
            LOGO
          </div>
          <span className="text-lg font-semibold text-gray-900">
            CompanyName
          </span>
        </div>

        <nav className="text-sm text-gray-600">
          <span className="hidden sm:inline">Job Application Portal</span>
        </nav>
      </div>
    </header>
  );
}
