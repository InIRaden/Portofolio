import Link from "next/link"
import { Button } from "./ui/button"

// components
import Nav from "./Nav"
import MobileNav from "./MobileNav"

const header = () => {
  return (
    <header className="py-8 xl:py-12 text-white">
        <div className="container mx-auto flex justify-between items-center">
            {/* logo */}
            <Link href="/">
            <h1 className="text-4xl font-semibold text-gradient bg-gradient-to-r from-yellow-500 to-cyan-500 bg-clip-text text-transparent">
                Mahesa<span className="text-accent">.</span>
            </h1>
            </Link>


            {/* dekstop nav & button*/}
            <div className="hidden xl:flex items-center gap-8">
                <Nav />
                <Link href="/contact">
                    <Button>Hire me</Button>
                </Link>
            </div>

            {/* mobile nav */}
            <div className="xl:hidden">
                <MobileNav />
            </div>

        </div>
    </header>

  )
}

export default header
