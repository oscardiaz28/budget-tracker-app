"use client";

import React, { useState } from 'react'
import { Logo, LogoMobile } from './Logo'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { MenuIcon } from 'lucide-react';

export default function Navbar() {
    return (
        <>
            <DesktopNavbar />
            <MobileNavbar />
        </>
    )
}

const items = [
    { label: "Dashboard", link: "/" },
    { label: "Transacciones", link: "/transactions" },
    { label: "Configuración", link: "/manage" },
]

function MobileNavbar() {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div className='md:hidden block border-separate bg-background'>
            <nav className='container mx-auto flex items-center justify-between px-5 md:px-8'>
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button onClick={() => setIsOpen(true)} variant={"ghost"}>
                            <MenuIcon />
                        </Button>
                    </SheetTrigger>
                    <SheetContent className='w-100 sm:w-135' side='left'>
                        <div className='p-5'>
                            <SheetTitle>
                                <Logo />
                            </SheetTitle>
                            <div className='flex flex-col gap-3 pt-4'>
                                {items.map(item => (
                                    <NavbarItem 
                                    onClick={() => setIsOpen(prev => !prev) }
                                    key={item.label} label={item.label} link={item.link} />
                                ))}
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
                <div className='flex h-20 min-h-15 items-center gap-x-4'>
                    <LogoMobile />
                </div>
                <div className='flex items-center gap-2'>
                    <UserButton />
                </div>
            </nav>
        </div>
    )
}

function DesktopNavbar() {
    return (
        <div className='hidden border-separate border-b bg-background md:block'>
            <nav className='container mx-auto flex items-center justify-between px-5 md:px-8'>
                <div className='flex h-20 min-h-15 items-center gap-x-4'>
                    <Logo />
                    <div className='flex h-full gap-4'>
                        {items.map(item => {
                            return (
                                <NavbarItem key={item.label} link={item.link} label={item.label} />
                            )
                        })}
                    </div>
                </div>
                <div className='flex items-center'>
                    <UserButton />
                </div>
            </nav>
        </div>
    )
}

type NavbarItemProps = {
    link: string,
    label: string,
    onClick?: () => void
}

function NavbarItem({ label, link, onClick }: NavbarItemProps) {
    const pathName = usePathname()
    const isActive = pathName === link
    return (
        <div className='relative flex items-center'>
            <Link
                onClick={() => {
                    if( onClick ) onClick()
                }}
                className={`text-base ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                href={link}>
                {label}
            </Link>
            {isActive && (
                <div className='absolute bottom-1 left-1/2 hidden h-0.5 w-full -translate-x-1/2 rounded-xl bg-foreground md:block'></div>
            )}
        </div>
    )
}