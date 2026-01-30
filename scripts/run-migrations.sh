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
echo "Seed (após migrations):"
for f in "$SEED_DIR"/*.sql; do
  [ -f "$f" ] && echo "  2. $f"
done
echo ""
echo "Depois: Storage > New bucket > os-assets (privado)"
