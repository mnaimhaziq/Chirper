'use client'

import React from "react";
import { toggleButton } from "@/constants";
import Link from "next/link";
import { usePathname} from 'next/navigation';
export default function ToggleButtons() {
  const pathname = usePathname();

  return (
    <section className="">
      <div className="flex justify-center mb-4">
        {toggleButton.map((link) => {
          const isActive = (pathname.includes(link.route) && link.route.length > 1 ) || pathname === link.route;

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`cursor-pointer py-2 px-4 rounded focus:outline-none transition ${isActive && 'dark:bg-primary-500 bg-lightmode-3'}`}
            >
              <p className=" dark:text-light-1 text-dark-1 max-lg:hidden">{link.label}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}