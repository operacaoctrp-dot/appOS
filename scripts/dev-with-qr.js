import qrcode from "qrcode-terminal";
import { networkInterfaces } from "os";
import { spawn } from "child_process";

// Pega o IP local
function getLocalIP() {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "localhost";
}

const ip = getLocalIP();
const port = 3000;
const url = `http://${ip}:${port}`;

console.log("\n🚀 Servidor iniciando...\n");
console.log(`📱 Acesse no smartphone:\n`);
console.log(`   ${url}\n`);
console.log("📲 QR Code:\n");

qrcode.generate(url, { small: true }, (qr) => {
  console.log(qr);
  console.log("\n");
});

// Inicia o Nuxt
const nuxt = spawn("npm", ["run", "dev", "--", "--host"], {
  shell: true,
  stdio: "inherit",
});

nuxt.on("close", (code) => {
  process.exit(code);
});
