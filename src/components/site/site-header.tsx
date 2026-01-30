"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "./logo";
import { Menu, X } from "lucide-react";

const navigation = [
  { name: "Sobre", href: "/sobre" },
  { name: "Soluções", href: "/solucoes" },
  { name: "Carreiras", href: "/carreiras" },
  { name: "Blog", href: "/blog" },
  { name: "Contato", href: "/contato" },
];

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-slate-300 hover:text-ness transition-colors duration-200 font-medium font-montserrat"
                >
                  {item.name}
                </Link>
              ))}
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
              <div className="py-4 space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block text-slate-300 hover:text-ness transition-colors duration-200 font-medium font-montserrat"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  href="/contato"
                  className="block w-full text-center rounded-md border border-slate-600 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-ness"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Fale conosco
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
