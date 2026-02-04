import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle,
  ShieldCheck,
  Lightbulb,
  Users,
  BarChart3,
  Clock,
} from "lucide-react";

function renderBrandText(text: string) {
  if (!text.includes(".")) return text;
  const parts = text.split(".");
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && <span className="text-ness">.</span>}
        </span>
      ))}
    </>
  );
}

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Excelência Técnica",
    description:
      "Buscamos sempre a excelência em cada projeto, utilizando as melhores práticas e tecnologias mais avançadas.",
  },
  {
    icon: Lightbulb,
    title: "Inovação Constante",
    description:
      "Estamos sempre à frente das tendências tecnológicas, implementando soluções inovadoras para nossos clientes.",
  },
  {
    icon: Users,
    title: "Parceria Verdadeira",
    description:
      "Construímos relacionamentos duradouros baseados em confiança, transparência e resultados excepcionais.",
  },
  {
    icon: BarChart3,
    title: "Resultados Mensuráveis",
    description:
      "Focamos em entregar valor real e mensurável, com métricas claras de sucesso para cada projeto.",
  },
];

const WHY_CHOOSE = [
  "Experiência comprovada em projetos complexos",
  "Equipe altamente especializada",
  "Metodologia própria e testada",
  "Suporte 24/7 quando necessário",
];

const TIMELINE = [
  { year: "1991", event: "a ness. é fundada como tercerização da área de tecnologia de um grande grupo econômico." },
  { year: "1992", event: "atividades de infraestrutura, processamento de dados e BPO." },
  { year: "1998", event: "início na atividade de infraestrutura em grandes eventos por todo diversos países da europa, américas, africa e ásia." },
  { year: "2005", event: "início de serviços de privacidade e segurança digital." },
  { year: "2014", event: "lançamento da divisão de software e processos." },
  { year: "2014", event: "incubação de projetos de saúde. NESS Technology healthcare inicia como incubação." },
  { year: "2016", event: "incubação da Trustness." },
  { year: "2017", event: "criação da unidade de negócios NESS Health como Business Unit da NESS." },
  { year: "2018", event: "Trustness como unidade de negócios." },
  { year: "2019", event: "spin-off da NESS Health da NESS." },
  { year: "2020", event: "NESS Health renomeada como IONIC Health, nova sede no Tech-Park SJC, crescimento local com grandes clientes brasileiros da área de saúde." },
  { year: "2021", event: "incubação da forense.io." },
  { year: "2022", event: "forense.io como unidade de negócios." },
  { year: "2025", event: "estabelecida como uma plataforma modular para transformação digital confiável." },
];

export const metadata: Metadata = {
  title: "Sobre ness. - Invisíveis quando tudo funciona. Presentes quando mais importa.",
  description: "Operamos hoje. Melhoramos agora. Medimos sempre.",
  keywords: "ness, sobre, empresa, tecnologia, segurança, engenharia, missão, valores",
};

export default function SobrePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {renderBrandText("Sobre ness.")}
            </h1>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              Invisíveis quando tudo funciona. Presentes quando mais importa.
            </p>
            <p className="text-base text-slate-400 mb-8 leading-relaxed">
              Operamos hoje. Melhoramos agora. Medimos sempre.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-left">
              <h2 className="text-4xl font-bold text-white mb-6">
                {renderBrandText("Nossa Missão")}
              </h2>
              <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                Somos uma empresa de tecnologia especializada em segurança e
                engenharia, que opera e evolui ambientes de TI de ponta a ponta.
              </p>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                Nossa missão é ser o parceiro de confiança que garante que sua
                infraestrutura funcione perfeitamente, permitindo que você se
                concentre no que realmente importa: seu negócio.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/solucoes"
                  className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-ness to-ness-600 px-6 py-3 text-base font-medium text-white hover:opacity-90 transition-opacity"
                >
                  Conheça Nossos Serviços
                </Link>
                <Link
                  href="/contato"
                  className="inline-flex items-center justify-center rounded-md border border-slate-500 px-6 py-3 text-base font-medium text-slate-300 hover:bg-slate-700/50 transition-colors"
                >
                  Fale Conosco
                </Link>
              </div>
            </div>

            <div className="animate-fade-in-up relative">
              <div className="bg-gradient-to-r from-ness to-ness-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">
                  {renderBrandText("Por que escolher a ness.?")}
                </h3>
                <ul className="space-y-3">
                  {WHY_CHOOSE.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-3 text-white shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-white mb-6">
              {renderBrandText("Nossos Valores")}
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Os princípios que guiam cada decisão e cada projeto que realizamos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((value, index) => (
              <div
                key={index}
                className="h-full p-6 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-ness transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-ness to-ness-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-white mb-6">
              {renderBrandText("Nossa História")}
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Uma jornada de crescimento, inovação e parcerias duradouras.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-ness to-ness-600" />

            <div className="space-y-12">
              {TIMELINE.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                >
                  <div
                    className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}
                  >
                    <div className="p-6 rounded-xl bg-slate-700/50 border border-slate-600">
                      <div
                        className={`flex items-center mb-3 ${index % 2 === 0 ? "justify-end" : "justify-start"}`}
                      >
                        <Clock className="w-5 h-5 text-ness mr-2 shrink-0" />
                        <span className="text-ness font-semibold text-lg">
                          {item.year}
                        </span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        {renderBrandText(item.event)}
                      </p>
                    </div>
                  </div>

                  <div className="w-4 h-4 bg-ness rounded-full border-4 border-slate-800 z-10 shrink-0" />

                  <div className="w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-ness to-ness-600">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl font-bold text-white mb-6">
              Pronto para Trabalhar Conosco?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Vamos conversar sobre como podemos ajudar sua empresa a alcançar
              seus objetivos tecnológicos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contato"
                className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-medium text-ness hover:bg-white/90 transition-colors"
              >
                Solicitar Orçamento
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
