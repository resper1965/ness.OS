'use client';

import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40 },
  title: { fontSize: 24, marginBottom: 20 },
  section: { marginBottom: 16 },
  label: { fontSize: 10, color: '#64748b', marginBottom: 4 },
  value: { fontSize: 12 },
  footer: { position: 'absolute', bottom: 40, left: 40, right: 40, fontSize: 9, color: '#94a3b8' },
});

function PropostaDocument({
  cliente,
  servico,
  valor,
  escopo,
  termos,
}: {
  cliente: string;
  servico: string;
  valor: string;
  escopo?: string;
  termos?: string;
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Proposta Comercial — ness.</Text>
        <View style={styles.section}>
          <Text style={styles.label}>Cliente</Text>
          <Text style={styles.value}>{cliente}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Serviço</Text>
          <Text style={styles.value}>{servico}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Valor mensal (MRR)</Text>
          <Text style={styles.value}>R$ {valor}</Text>
        </View>
        {escopo && (
          <View style={styles.section}>
            <Text style={styles.label}>Escopo técnico</Text>
            <Text style={styles.value}>{escopo}</Text>
          </View>
        )}
        {termos && (
          <View style={styles.section}>
            <Text style={styles.label}>Termos comerciais</Text>
            <Text style={styles.value}>{termos}</Text>
          </View>
        )}
        <Text style={styles.footer}>
          ness. — Ecossistema de gestão e site institucional. Este documento é uma proposta e não constitui contrato.
        </Text>
      </Page>
    </Document>
  );
}

export async function gerarPropostaPDF(
  cliente: string,
  servico: string,
  valor: string,
  escopo?: string,
  termos?: string
) {
  const doc = (
    <PropostaDocument
      cliente={cliente}
      servico={servico}
      valor={valor}
      escopo={escopo}
      termos={termos}
    />
  );
  const blob = await pdf(doc).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `proposta-${cliente.replace(/\s+/g, '-')}-${Date.now()}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}
