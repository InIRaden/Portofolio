"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Links = [
  {
    name: "home",
    path: "/",
  },
  {
    name: "work",
    path: "/work",
  },
  {
    name: "contact",
    path: "/contact",
  },
];

const Nav = () => {
  const pathname = usePathname();
  return (
    <nav className="flex gap-8">
      {Links.map((link, index) => {
        return (
          <Link
            href={link.path}
            key={index}
            className={`${
              link.path === pathname
                ? "text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-cyan-500 border-b-2 border-white"
                : "text-white"
            } capitalize font-medium transition-all hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-yellow-500 hover:to-cyan-500`}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
};

export default Nav;
