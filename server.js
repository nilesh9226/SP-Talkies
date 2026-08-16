const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const session = require("express-session");

// ===============================
// Middleware
// ===============================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// Static website files
// ===============================
const publicPath = path.join(__dirname, "public");

app.use(express.static(publicPath));

// ===============================
// Health check
// ===============================
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "SP Talkies server is running",
        node: process.version
    });
});

// ===============================
// Website API example
// ===============================
app.get("/api/status", (req, res) => {
    res.json({
        success: true,
        website: "SP Talkies",
        status: "online"
    });
});

// ===============================
// SPA / Frontend fallback
// IMPORTANT:
// Express 5 does NOT support app.get("*")
// ===============================
app.use((req, res, next) => {
    if (req.method !== "GET") {
        return next();
    }

    // Don't redirect API requests to index.html
    if (req.path.startsWith("/api/")) {
        return res.status(404).json({
            success: false,
            message: "API endpoint not found"
        });
    }

    res.sendFile(path.join(publicPath, "index.html"));
});

// ===============================
// Error handler
// ===============================
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});

// ===============================
// Render PORT
// ===============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`SP Talkies server running on port ${PORT}`);
});






const multer=require("multer");
const fs=require("fs");



const DATA=path.join(__dirname,"data");
const FILE=path.join(DATA,"movies.json");
const UPLOAD=path.join(__dirname,"public","uploads");
fs.mkdirSync(DATA,{recursive:true});fs.mkdirSync(UPLOAD,{recursive:true});
const seeds=[
{id:1,title:"Monsoon Letters",year:2026,genre:"Drama",category:"Films",description:"A heartfelt story of memories, family and second chances.",poster:"https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1400&q=85",trailer:"",featured:true},
{id:2,title:"After the Rain",year:2025,genre:"Romance",category:"Films",description:"Two lives cross paths when a city waits for the rain to end.",poster:"https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1400&q=85",trailer:"",featured:true},
{id:3,title:"Midnight Run",year:2025,genre:"Thriller",category:"Films",description:"One night. One secret. One impossible choice.",poster:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=85",trailer:"",featured:false},
{id:4,title:"The Last Melody",year:2024,genre:"Music",category:"Music",description:"A musician returns to the stage to finish a song left unfinished.",poster:"https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1400&q=85",trailer:"",featured:false}
];
if(!fs.existsSync(FILE))fs.writeFileSync(FILE,JSON.stringify(seeds,null,2));
const read=()=>{try{return JSON.parse(fs.readFileSync(FILE,"utf8"))}catch{return[]}};
const write=x=>fs.writeFileSync(FILE,JSON.stringify(x,null,2));
app.use(express.json({limit:"3mb"}));app.use(express.urlencoded({extended:true}));
app.use(session({secret:process.env.SESSION_SECRET||"sp-talkies-demo-secret",resave:false,saveUninitialized:false,cookie:{httpOnly:true,sameSite:"lax"}}));
const storage=multer.diskStorage({destination:(r,f,c)=>c(null,UPLOAD),filename:(r,f,c)=>c(null,Date.now()+"-"+Math.random().toString(36).slice(2,8)+path.extname(f.originalname).toLowerCase())});
const upload=multer({storage});
app.use(express.static(path.join(__dirname,"public")));
const auth=(req,res,next)=>req.session.admin?next():res.status(401).json({error:"Unauthorized"});
app.get("/api/movies",(req,res)=>res.json(read()));
app.get("/api/movies/:id",(req,res)=>{const m=read().find(x=>x.id===Number(req.params.id));m?res.json(m):res.status(404).json({error:"Not found"})});
app.get("/api/me",(req,res)=>res.json({admin:!!req.session.admin}));
app.post("/api/login",(req,res)=>{const u=process.env.ADMIN_USER||"admin",p=process.env.ADMIN_PASSWORD||"SPTalkies@123";if(req.body.username===u&&req.body.password===p){req.session.admin=true;return res.json({ok:true})}res.status(401).json({error:"Invalid credentials"})});
app.post("/api/logout",auth,(req,res)=>req.session.destroy(()=>res.json({ok:true})));
app.post("/api/movies",auth,upload.single("poster"),(req,res)=>{const a=read();const m={id:a.length?Math.max(...a.map(x=>x.id))+1:1,title:req.body.title,year:req.body.year?+req.body.year:null,genre:req.body.genre||"",category:req.body.category||"Films",description:req.body.description||"",poster:req.file?"/uploads/"+req.file.filename:(req.body.poster||""),trailer:req.body.trailer||"",featured:req.body.featured==="true"};if(!m.title)return res.status(400).json({error:"Title required"});a.push(m);write(a);res.json(m)});
app.put("/api/movies/:id",auth,upload.single("poster"),(req,res)=>{const a=read(),i=a.findIndex(x=>x.id===Number(req.params.id));if(i<0)return res.status(404).json({error:"Not found"});a[i]={...a[i],title:req.body.title||a[i].title,year:req.body.year?+req.body.year:null,genre:req.body.genre||"",category:req.body.category||"Films",description:req.body.description||"",poster:req.file?"/uploads/"+req.file.filename:(req.body.poster||a[i].poster),trailer:req.body.trailer||"",featured:req.body.featured==="true"};write(a);res.json(a[i])});
app.delete("/api/movies/:id",auth,(req,res)=>{write(read().filter(x=>x.id!==Number(req.params.id)));res.json({ok:true})});
app.get("/{*splat}",(req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));
app.listen(PORT,()=>console.log(`SP Talkies running at http://localhost:${PORT}`));
