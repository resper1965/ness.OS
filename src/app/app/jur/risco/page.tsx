import { RiskAnalyzer } from '@/components/jur/risk-analyzer';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';

export default function JurRiscoPage() {
  return (
    <PageContent>
      <AppPageHeader
        title="Análise de Risco Contratual"
        subtitle="Analise minutas com IA para identificar riscos."
      />
      <RiskAnalyzer />
    </PageContent>
  );
}
