
import { title, subtitle } from "../components/primitives";
import { Link } from "@heroui/link";
import { Navbar } from "../components/navbar";

export default function Home() {
  return (
    <>
    <Navbar />
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <h1 className={title()}>Welcome to Next.js + HeroUI</h1>
        <p className={subtitle()}>
          A simple starter template to build your Next.js project with HeroUI
          components.
        </p>
        </div>
    </section>
    <footer className="w-full flex items-center justify-center py-3">
              <Link
                isExternal
                className="flex items-center gap-1 text-current"
                href="https://danymitte.vercel.app"
                title="danymitte.vercel.app"
              >
                <span className="text-default-600">Creado por</span>
                <p className="text-primary">Dany Mitte</p>
              </Link>
            </footer>
    </>
  );
}
