import { createServer } from "node:http";
import { createProject } from "./factory.js";
const port = Number(process.env.PORT || 3000);
const key = process.env.FACTORY_API_KEY;
createServer(async (req,res)=>{
  if(req.method==="GET" && req.url==="/") return send(res,200,{service:"Repository Otomatis",status:"ready"});
  if(req.method!=="POST" || req.url!=="/api/repositories") return send(res,404,{error:"Not found"});
  if(key && req.headers.authorization !== "Bearer "+key) return send(res,401,{error:"Unauthorized"});
  try { const body=await json(req); return send(res,201,await createProject(body)); }
  catch(e){ return send(res,400,{success:false,error:e.message}); }
}).listen(port,()=>console.log("Repository Factory API berjalan di port "+port));
function json(req){return new Promise((resolve,reject)=>{let s="";req.on("data",c=>{s+=c;if(s.length>1000000)req.destroy();});req.on("end",()=>{try{resolve(JSON.parse(s||"{}"))}catch{reject(new Error("JSON tidak valid."))}});req.on("error",reject)})}
function send(res,status,data){res.statusCode=status;res.setHeader("content-type","application/json; charset=utf-8");res.end(JSON.stringify(data,null,2));}