import process from "node:process";

const token = process.env.GITHUB_TOKEN;
const owner = process.env.GITHUB_OWNER || "rizki-habibi";

if (!token) {
  console.error("GITHUB_TOKEN belum diatur.");
  process.exit(1);
}

const name = process.argv[2];
const description = process.argv.slice(3).join(" ") || "";

if (!name) {
  console.error("Pemakaian: npm run create -- nama-repo [deskripsi]");
  process.exit(1);
}

const response = await fetch("https://api.github.com/user/repos", {
  method: "POST",
  headers: {
    "Accept": "application/vnd.github+json",
    "Authorization": `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name,
    description,
    private: false,
    auto_init: true
  })
});

const data = await response.json();

if (!response.ok) {
  console.error(JSON.stringify(data, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  success: true,
  owner: data.owner?.login,
  name: data.name,
  url: data.html_url,
  clone_url: data.clone_url,
  default_branch: data.default_branch
}, null, 2));
