import { ContactForm } from "@/components/site/contact-form";

export default function ContatoPage() {
  return (
    <section className="container mx-auto px-4 py-16 max-w-xl">
      <h1 className="text-3xl font-bold mb-2 text-white">Contato</h1>
      <p className="text-slate-400 mb-8">
        Tem dúvidas sobre nossas soluções ou quer uma proposta? Preencha o formulário
        e nossa equipe entrará em contato em breve.
      </p>
      <ContactForm />
    </section>
  );
}
