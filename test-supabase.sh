#!/bin/bash
# Script para testar o Supabase localmente

# Variáveis de configuração
SUPABASE_URL="https://seu-projeto.supabase.co"
SUPABASE_KEY="sua-chave-anon"

echo "=== TESTE DE CONEXÃO COM SUPABASE ==="
echo "URL: $SUPABASE_URL"
echo ""

# Testar conexão
echo "1. Testando conexão..."
curl -s -X GET \
  "$SUPABASE_URL/rest/v1/familias" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY" \
  -w "\nHTTP Status: %{http_code}\n" | head -50

echo ""
echo "2. Testando acesso a ativos..."
curl -s -X GET \
  "$SUPABASE_URL/rest/v1/ativos" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY" \
  -w "\nHTTP Status: %{http_code}\n" | head -50

echo ""
echo "=== FIM DO TESTE ==="
echo "Se vê erros acima, abra o DIAGNOSTICO_ATIVOS.md para mais informações"
