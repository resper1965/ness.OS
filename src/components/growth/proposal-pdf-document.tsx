'use client';

import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Registrar fontes se necessário, mas usarei as padrão para rapidez.
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 5,
  },
  section: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: 'bold',
    marginBottom: 10,
    backgroundColor: '#f1f5f9',
    padding: 5,
  },
  text: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 1.6,
    textAlign: 'justify',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 9,
    textAlign: 'center',
    color: '#94a3b8',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
  },
});

export function ProposalPDFDocument({ 
  serviceName, 
  content 
}: { 
  serviceName: string; 
  content: string 
}) {
  // Parsing bem básico do markdown gerado pela IA (apenas para remover os # e formatar)
  const lines = content.split('\n');
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Proposta Técnica</Text>
          <Text style={styles.subtitle}>Serviço: {serviceName} | nessOS Growth</Text>
        </View>

        {lines.map((line, i) => {
          if (line.startsWith('# ')) {
            return null; // Título principal já está no cabeçalho
          }
          if (line.startsWith('## ')) {
            return (
              <View key={i} style={styles.section}>
                <Text style={styles.sectionTitle}>{line.replace('## ', '')}</Text>
              </View>
            );
          }
          if (line.trim() === '') return <View key={i} style={{ height: 10 }} />;
          
          return (
            <Text key={i} style={styles.text}>
              {line.replace(/[*_~`]/g, '')}
            </Text>
          );
        })}

        <Text style={styles.footer}>
          nessOS — Systems of Quality & Security. Proposta gerada via ness.GROWTH AI.
        </Text>
      </Page>
    </Document>
  );
}
