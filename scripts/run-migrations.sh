#!/bin/bash
# Script de referência: executa migrations no Supabase via CLI (se configurado)
# Ou copie/cole cada arquivo no SQL Editor do Supabase Dashboard

set -e
MIGRATIONS_DIR="supabase/migrations"
SEED_DIR="supabase/seed"

echo "=== ness.OS — Migrations ==="
echo "Execute no Supabase SQL Editor (Dashboard) na ordem:"
echo ""
for f in "$MIGRATIONS_DIR"/*.sql; do
  [ -f "$f" ] && echo "  1. $f"
done
echo ""
echo "Seed (após migrations) — executar no SQL Editor nesta ordem:"
for f in "$SEED_DIR"/000_*.sql "$SEED_DIR"/002_*.sql "$SEED_DIR"/003_*.sql; do
  [ -f "$f" ] && echo "  - $f"
done
echo ""
echo "Ou: copie o conteúdo de cada arquivo .sql e execute no Dashboard."
echo ""
echo "Depois: Storage > New bucket > os-assets (privado)"
