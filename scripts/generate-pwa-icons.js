/**
 * Script para gerar ícones PWA a partir do logo SVG
 *
 * Como usar:
 * 1. Instalar dependência: npm install sharp
 * 2. Executar: node scripts/generate-pwa-icons.js
 *
 * Este script converterá o logo SVG em ícones PNG nos tamanhos necessários
 */

import sharp from "sharp";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [
  { size: 192, name: "icon-192x192.png" },
  { size: 512, name: "icon-512x512.png" },
  { size: 180, name: "apple-touch-icon.png" },
];

async function generateIcons() {
  try {
    console.log("🎨 Gerando ícones PWA...\n");

    // Ler o SVG
    const svgPath = join(__dirname, "..", "public", "marquise-logo.svg");
    const svgBuffer = readFileSync(svgPath);

    for (const { size, name } of sizes) {
      const outputPath = join(__dirname, "..", "public", name);

      await sharp(svgBuffer)
        .resize(size, size, {
          fit: "contain",
          background: { r: 30, g: 41, b: 59, alpha: 1 }, // slate-800
        })
        .png()
        .toFile(outputPath);

      console.log(`✅ ${name} (${size}x${size})`);
    }

    console.log("\n✨ Ícones gerados com sucesso!");
    console.log("\n📝 Próximos passos:");
    console.log("1. Verifique os ícones na pasta /public/");
    console.log(
      "2. Se necessário, edite-os para adicionar bordas ou ajustar cores"
    );
    console.log("3. Teste a instalação do PWA no navegador");
  } catch (error) {
    console.error("❌ Erro ao gerar ícones:", error);
    console.log("\n💡 Dica: Certifique-se de que:");
    console.log("- O arquivo marquise-logo.svg existe em /public/");
    console.log("- A biblioteca sharp está instalada: npm install sharp");
  }
}

generateIcons();
