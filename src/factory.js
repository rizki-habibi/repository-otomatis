const API = "https://api.github.com";
const token = process.env.GITHUB_TOKEN;
const owner = process.env.GITHUB_OWNER || "rizki-habibi";
if (!token) throw new Error("GITHUB_TOKEN belum diatur.");
const headers = { Accept:"application/vnd.github+json", Authorization:"Bearer "+token, "X-GitHub-Api-Version":"2022-11-28", "Content-Type":"application/json" };

export async function createProject(input) {
  validate(input);
  const r = await fetch(API + "/user/repos", { method:"POST", headers, body:JSON.stringify({name:input.name,description:input.description || "",private:input.visibility==="private",auto_init:true}) });
  const repo = await r.json();
  if (!r.ok) throw new Error(repo.message || "Gagal membuat repository GitHub.");
  const files = buildFiles(input);
  const created = [];
  for (const file of files) {
    const x = await fetch(API + "/repos/" + owner + "/" + input.name + "/contents/" + file.path, { method:"PUT", headers, body:JSON.stringify({message:"chore: generate "+file.path,content:Buffer.from(file.content).toString("base64"),branch:"main"}) });
    const data = await x.json();
    if (!x.ok) throw new Error(data.message || "Gagal membuat "+file.path);
    created.push(file.path);
  }
  return {success:true,repository:repo.full_name,url:repo.html_url,template:input.template,pages:input.pages,files:created};
}

function validate(i) {
  if (!/^[A-Za-z0-9._-]+$/.test(i.name)) throw new Error("Nama repository tidak valid.");
  if (!["public","private"].includes(i.visibility)) throw new Error("Visibility harus public atau private.");
  if (!["web","node","api"].includes(i.template)) throw new Error("Template harus web, node, atau api.");
  if (!Array.isArray(i.pages) || i.pages.length > 20) throw new Error("Maksimal 20 halaman.");
}

function buildFiles(i) {
  const title = titleCase(i.name);
  const files = [{path:"README.md",content:readme(i,title)}];
  if (i.template === "web") {
    files.push({path:"index.html",content:html(title,"Beranda","Selamat datang di project yang dibuat otomatis.","assets/style.css","index.html")});
    files.push({path:"assets/style.css",content:css()});
    for (const page of i.pages) if (page.toLowerCase() !== "beranda") files.push({path:"pages/"+slug(page)+".html",content:html(title,page,"Halaman "+page+" dibuat otomatis oleh Repository Factory.","../assets/style.css","../index.html")});
  } else if (i.template === "node") {
    files.push({path:"src/index.js",content:"console.log(\"Project "+title+" siap digunakan.\");\n"});
  } else {
    files.push({path:"src/server.js",content:"import { createServer } from \"node:http\";\ncreateServer((req,res)=>{res.setHeader(\"content-type\",\"application/json\");res.end(JSON.stringify({ok:true,name:\""+title+"\"}));}).listen(process.env.PORT||3000);\n"});
  }
  return files;
}

function html(title,page,body,cssPath,homePath) {
  const links = ["Beranda","Tentang","Data","Kontak"].map(p => "<a href=\"" + (p==="Beranda" ? homePath : p.toLowerCase()+".html") + "\">"+p+"</a>").join(" ");
  return "<!doctype html><html lang=\"id\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>"+page+" — "+title+"</title><link rel=\"stylesheet\" href=\""+cssPath+"\"></head><body><header><strong>"+title+"</strong></header><main><nav>"+links+"</nav><section class=\"hero\"><h1>"+page+"</h1><p>"+body+"</p></section></main></body></html>\n";
}
function css(){return "*{box-sizing:border-box}body{margin:0;font-family:Inter,Arial,sans-serif;background:#f5f7fb;color:#172033}header{padding:20px 7%;background:#fff;border-bottom:1px solid #e7eaf0}main{max-width:1100px;margin:auto;padding:24px 7%}nav{display:flex;gap:18px;flex-wrap:wrap;margin-bottom:60px}nav a{color:#40506b;text-decoration:none}.hero{background:#fff;border:1px solid #e7eaf0;border-radius:24px;padding:60px 8%;box-shadow:0 12px 35px rgba(20,30,50,.06)}h1{font-size:clamp(2rem,6vw,4rem)}";}
function readme(i,title){return "# "+title+"\n\nDibuat otomatis oleh Repository Otomatis.\n\n- Template: "+i.template+"\n- Visibility: "+i.visibility+"\n- Halaman: "+i.pages.join(", ")+"\n";}
function slug(v){return v.toLowerCase().normalize("NFKD").replace(/[^a-z0-9\s-]/g,"").trim().replace(/\s+/g,"-");}
function titleCase(v){return v.replace(/[-_]+/g," ").replace(/\b\w/g,m=>m.toUpperCase());}