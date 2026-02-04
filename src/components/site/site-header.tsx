"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "./logo";
import { Menu, X, ChevronDown } from "lucide-react";

const servicesMenu = [
  { name: "n.secops", href: "/solucoes/nsecops" },
  { name: "n.infraops", href: "/solucoes/ninfraops" },
  { name: "n.devarch", href: "/solucoes/ndevarch" },
  { name: "n.autoops", href: "/solucoes/nautoops" },
  { name: "n.cirt", href: "/solucoes/ncirt" },
  { name: "DPOaaS", href: "/solucoes/trustness-dpo" },
];

const productsMenu = [
  { name: "n.privacy", href: "/solucoes/nprivacy" },
  { name: "n.faturasONS", href: "/solucoes/nfaturasons" },
  { name: "n.flow", href: "/solucoes/nflow" },
  { name: "n.discovery", href: "/solucoes/ndiscovery" },
];

const verticalsMenu = [
  { name: "forense.io", href: "/solucoes/forense" },
  { name: "trustness.", href: "/solucoes/trustness" },
];

const linkClass = "text-slate-300 hover:text-ness transition-colors duration-200 font-medium font-montserrat";

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [verticalsOpen, setVerticalsOpen] = useState(false);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-ness text-white px-4 py-2 rounded-md z-[100] focus:outline-none focus:ring-2 focus:ring-white"
      >
        Pular para o conteúdo
      </a>

      <header
        className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700 animate-slide-down"
        role="banner"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="transition-transform duration-200 hover:scale-105">
              <Logo variant="light" size="default" href="/" />
            </div>

            {/* Desktop Navigation */}
            <nav
              className="hidden md:flex items-center space-x-8"
              role="navigation"
              aria-label="Navegação principal"
            >
              <Link href="/sobre" className={linkClass}>sobre</Link>
              <Link href="/nessos" className={linkClass}>ness.OS</Link>

              <div
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <Link href="/solucoes" className={`${linkClass} flex items-center gap-0.5`}>
                  serviços
                  <ChevronDown className="w-4 h-4" />
                </Link>
                {servicesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 py-2 animate-fade-in">
                    {servicesMenu.map((s) => (
                      <Link key={s.href} href={s.href} className={`block px-4 py-2 ${linkClass} hover:bg-slate-700/50`}>
                        {s.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div
                className="relative"
                onMouseEnter={() => setProductsOpen(true)}
                onMouseLeave={() => setProductsOpen(false)}
              >
                <Link href="/solucoes" className={`${linkClass} flex items-center gap-0.5`}>
                  produtos
                  <ChevronDown className="w-4 h-4" />
                </Link>
                {productsOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 py-2 animate-fade-in">
                    {productsMenu.map((p) => (
                      <Link key={p.href} href={p.href} className={`block px-4 py-2 ${linkClass} hover:bg-slate-700/50`}>
                        {p.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div
                className="relative"
                onMouseEnter={() => setVerticalsOpen(true)}
                onMouseLeave={() => setVerticalsOpen(false)}
              >
                <Link href="/solucoes" className={`${linkClass} flex items-center gap-0.5`}>
                  verticais
                  <ChevronDown className="w-4 h-4" />
                </Link>
                {verticalsOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 py-2 animate-fade-in">
                    {verticalsMenu.map((v) => (
                      <Link key={v.href} href={v.href} className={`block px-4 py-2 ${linkClass} hover:bg-slate-700/50`}>
                        {v.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link href="/carreiras" className={linkClass}>carreiras</Link>
              <Link href="/blog" className={linkClass}>blog</Link>
            </nav>

            {/* CTA Button */}
            <div className="hidden md:flex items-center">
              <Link
                href="/contato"
                className="inline-flex items-center justify-center rounded-md border border-slate-600 bg-transparent px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-ness hover:border-ness transition-colors"
              >
                Fale conosco
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-slate-300 hover:text-ness"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-slate-700 animate-fade-in">
              <div className="py-4 space-y-1">
                <Link href="/sobre" className={`block px-4 py-2 ${linkClass}`} onClick={() => setIsMenuOpen(false)}>sobre</Link>
                <Link href="/nessos" className={`block px-4 py-2 ${linkClass}`} onClick={() => setIsMenuOpen(false)}>ness.OS</Link>
                <div className="px-4 py-2 text-slate-400 text-sm font-medium">serviços</div>
                {servicesMenu.map((s) => (
                  <Link key={s.href} href={s.href} className={`block px-6 py-2 ${linkClass} text-sm`} onClick={() => setIsMenuOpen(false)}>{s.name}</Link>
                ))}
                <div className="px-4 py-2 text-slate-400 text-sm font-medium">produtos</div>
                {productsMenu.map((p) => (
                  <Link key={p.href} href={p.href} className={`block px-6 py-2 ${linkClass} text-sm`} onClick={() => setIsMenuOpen(false)}>{p.name}</Link>
                ))}
                <div className="px-4 py-2 text-slate-400 text-sm font-medium">verticais</div>
                {verticalsMenu.map((v) => (
                  <Link key={v.href} href={v.href} className={`block px-6 py-2 ${linkClass} text-sm`} onClick={() => setIsMenuOpen(false)}>{v.name}</Link>
                ))}
                <Link href="/carreiras" className={`block px-4 py-2 ${linkClass}`} onClick={() => setIsMenuOpen(false)}>carreiras</Link>
                <Link href="/blog" className={`block px-4 py-2 ${linkClass}`} onClick={() => setIsMenuOpen(false)}>blog</Link>
                <Link href="/contato" className="block w-full mx-4 mt-4 text-center rounded-md border border-slate-600 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-ness" onClick={() => setIsMenuOpen(false)}>Fale conosco</Link>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
