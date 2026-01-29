export default function Footer() {
  return (
    <footer className="mt-12 border-t border-brand-primary/20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <div className="text-sm text-brand-light">© {new Date().getFullYear()} Beaulytics. All rights reserved.</div>
          <div className="flex items-center gap-4 text-sm">
            <a href="#" className="text-brand-light hover:text-brand-dark">Privacy</a>
            <a href="#" className="text-brand-light hover:text-brand-dark">Terms</a>
            <a href="#" className="text-brand-light hover:text-brand-dark">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
