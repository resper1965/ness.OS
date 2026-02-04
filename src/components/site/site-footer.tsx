import Link from "next/link";
import { Logo } from "./logo";
import { MapPin, Phone, Mail } from "lucide-react";
import {
  getFullAddress,
  getMainPhone,
  getMainEmail,
  contactData,
} from "@/lib/data/contact";

const footerLinks = {
  company: [
    { name: "Sobre", href: "/sobre" },
    { name: "ness.OS", href: "/nessos" },
    { name: "Carreiras", href: "/carreiras" },
    { name: "Contato", href: "/contato" },
    { name: "Blog", href: "/blog" },
  ],
  services: [
    { name: "n.secops", href: "/solucoes/nsecops" },
    { name: "n.infraops", href: "/solucoes/ninfraops" },
    { name: "n.devarch", href: "/solucoes/ndevarch" },
    { name: "n.autoops", href: "/solucoes/nautoops" },
    { name: "n.cirt", href: "/solucoes/ncirt" },
    { name: "DPOaaS", href: "/solucoes/trustness-dpo" },
  ],
  products: [
    { name: "n.privacy", href: "/solucoes/nprivacy" },
    { name: "n.faturasONS", href: "/solucoes/nfaturasons" },
    { name: "n.flow", href: "/solucoes/nflow" },
    { name: "n.discovery", href: "/solucoes/ndiscovery" },
  ],
  verticals: [
    { name: "forense.io", href: "/solucoes/forense" },
    { name: "trustness.", href: "/solucoes/trustness" },
  ],
  legal: [
    { name: "Privacidade", href: "/legal/privacidade" },
    { name: "Termos", href: "/legal/termos" },
  ],
};

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-7 gap-8">
            {/* Logo e descrição */}
            <div className="lg:col-span-2">
              <Logo variant="light" size="default" href="/" className="mb-6" />
              <p className="text-slate-300 leading-relaxed mb-6 max-w-md font-normal">
                Soluções tecnológicas inovadoras para impulsionar o crescimento e a transformação digital da sua empresa.
              </p>
              {contactData.socialMedia.linkedin && (
                <a
                  href={contactData.socialMedia.linkedin}
                  className="inline-flex w-10 h-10 bg-slate-800 rounded-lg items-center justify-center text-slate-400 hover:bg-ness hover:text-white transition-all duration-300"
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              )}
            </div>

            {/* Empresa */}
            <div>
              <h3 className="text-white font-medium mb-4">Empresa</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-slate-300 hover:text-ness transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Serviços */}
            <div>
              <h3 className="text-white font-medium mb-4">Serviços</h3>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-slate-300 hover:text-ness transition-colors duration-300 font-montserrat"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Produtos */}
            <div>
              <h3 className="text-white font-medium mb-4">Produtos</h3>
              <ul className="space-y-3">
                {footerLinks.products.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-slate-300 hover:text-ness transition-colors duration-300 font-montserrat"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Verticais */}
            <div>
              <h3 className="text-white font-medium mb-4">Verticais</h3>
              <ul className="space-y-3">
                {footerLinks.verticals.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-slate-300 hover:text-ness transition-colors duration-300 font-montserrat"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contato */}
            <div>
              <h3 className="text-white font-medium mb-4">Contato</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-ness mt-0.5 flex-shrink-0" />
                  <p className="text-slate-300 text-sm font-normal">
                    {getFullAddress()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-ness flex-shrink-0" />
                  <a
                    href={`tel:${getMainPhone().replace(/\D/g, "")}`}
                    className="text-slate-300 hover:text-ness transition-colors duration-300 text-sm font-normal"
                  >
                    {getMainPhone()}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-ness flex-shrink-0" />
                  <a
                    href={`mailto:${getMainEmail()}`}
                    className="text-slate-300 hover:text-ness transition-colors duration-300 text-sm font-normal"
                  >
                    {getMainEmail()}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-400 text-sm">
              © {currentYear} ness. Todos os direitos reservados.
            </div>
            <div className="flex flex-wrap gap-6 items-center">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-slate-400 hover:text-ness transition-colors duration-300 text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
