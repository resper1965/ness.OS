import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ChatWidget } from "@/components/site/chat-widget";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col">
      <SiteHeader />
      <main id="main-content" className="flex-1 pt-16">
        {children}
      </main>
      <SiteFooter />
      <ChatWidget />
    </div>
  );
}
