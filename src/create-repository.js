import { createProject } from "./factory.js";

const args = process.argv.slice(2);
const name = args[0];
const description = args.slice(1).filter(x => !x.startsWith("--")).join(" ");
const option = (key, fallback) => { const i = args.indexOf(key); return i >= 0 ? args[i + 1] : fallback; };

if (!name) {
  console.error("Pemakaian: npm run create -- agend-data \"Project Agend Data\" --template web --pages Beranda,Tentang,Data,Kontak");
  process.exit(1);
}

try {
  const result = await createProject({
    name, description,
    template: option("--template", "web"),
    visibility: option("--visibility", "public"),
    pages: option("--pages", "Beranda,Tentang,Kontak").split(",").map(x => x.trim()).filter(Boolean)
  });
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
