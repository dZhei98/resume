import { NfButton } from "@/components/browse/ui/Buttons";
import { Wordmark } from "@/components/browse/ui/Brand";
import Link from "next/link";

const BACKDROP =
  "radial-gradient(ellipse at 50% 35%, rgba(74, 92, 140, 0.28) 0%, rgba(20, 20, 20, 0) 60%), radial-gradient(ellipse at center, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 75%, #000 100%)";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col bg-netflix-bg font-netflix text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: BACKDROP }} />

      <header className="relative z-10 flex h-14 items-center px-4 md:h-[68px] md:px-gutter">
        <Link
          href="/"
          aria-label="Joshua Nee home"
          className="rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <Wordmark className="text-[1.75rem] md:text-[2.1rem]" />
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-6xl">Lost your way?</h1>
        <p className="mt-4 max-w-md text-lg font-light text-netflix-light md:mt-6 md:max-w-2xl md:text-2xl">
          Sorry, we can't find that page. You'll find lots to explore on the home page.
        </p>
        <NfButton href="/" size="lg" className="mt-8">
          Joshua Nee Home
        </NfButton>
        <p className="mt-10 border-l-2 border-netflix-red pl-3 text-base font-light tracking-[0.15em] text-netflix-light md:mt-12 md:text-2xl">
          Error Code <strong className="font-bold">NSES-404</strong>
        </p>
      </main>
    </div>
  );
}
