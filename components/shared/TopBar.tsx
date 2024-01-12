import { OrganizationSwitcher, SignOutButton, SignedIn } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import ThemeToggle from './ThemeToggle'

export default function TopBar() {
  return (
    <nav className='topbar'>
        <Link href='/' className='flex items-center gap-4'>
            <Image src="/assets/logo.svg" alt="logo" width={28} height={28}/>
            <p className='text-heading3-bold dark:text-light-1 text-dark-1 max-xs:hidden'>Chirper</p>
        </Link>
        <div>
          <ThemeToggle/>
        </div>
        <div className="flex items-center gap-1">
          <div className='block md:hidden'>
            <SignedIn>
              <SignOutButton>
                <div className='flex cursor-pointer'>
                  <Image src='/assets/logout.svg' alt='logout' width={24} height={24} />
                </div>
              </SignOutButton>
            </SignedIn>

          
          </div>
          <OrganizationSwitcher
            appearance={{
              baseTheme: dark,
              elements: {
                organizationSwitcherTrigger: "py-2 px-4"
              }
            }}/>
        </div>
    </nav>
  )
}
