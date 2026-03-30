const skills=["HTML","CSS","JavaScript","React","Node","Python","MongoDB","SQL"];
let resumeText="";

const uploadBox=document.getElementById("uploadBox");
const input=document.getElementById("resumeInput");

uploadBox.addEventListener("click",()=>input.click());

input.addEventListener("change",(e)=>{
handleFile(e.target.files[0]);
});

function handleFile(file){
const type=file.name.split(".").pop().toLowerCase();

if(type==="pdf"){extractPDFText(file);}
else if(type==="docx"){extractDOCXText(file);}
else{
const reader=new FileReader();
reader.onload=function(e){resumeText=e.target.result;}
reader.readAsText(file);
}

document.getElementById("uploadText").innerText="Resume Uploaded ✅";
}

async function extractPDFText(file){
const reader=new FileReader();
reader.onload=async function(){
const typedarray=new Uint8Array(this.result);
const pdf=await pdfjsLib.getDocument(typedarray).promise;

resumeText="";
for(let i=1;i<=pdf.numPages;i++){
const page=await pdf.getPage(i);
const content=await page.getTextContent();
const strings=content.items.map(item=>item.str);
resumeText+=strings.join(" ");
}
}
reader.readAsArrayBuffer(file);
}

function extractDOCXText(file){
const reader=new FileReader();
reader.onload=function(e){
mammoth.extractRawText({arrayBuffer:e.target.result})
.then(result=>resumeText=result.value);
}
reader.readAsArrayBuffer(file);
}

function analyzeResume(){

if(resumeText===""){
alert("Upload resume first!");
return;
}

document.getElementById("loading").style.display="block";
document.getElementById("results").style.display="none";

setTimeout(()=>{

let detected=[];
let missing=[];

skills.forEach(skill=>{
if(resumeText.toLowerCase().includes(skill.toLowerCase())){
detected.push(skill);
}else{
missing.push(skill);
}
});

let score=Math.round((detected.length/skills.length)*100);

document.getElementById("loading").style.display="none";
document.getElementById("results").style.display="block";

animateCircle(score);
showSkills("detected",detected);
showSkills("missing",missing);

},1500);
}

function animateCircle(score){
let circle=document.querySelector(".score-circle");
let text=document.getElementById("scoreText");
let count=0;

let interval=setInterval(()=>{
if(count>=score){
clearInterval(interval);
}else{
count++;
text.innerText=count+"%";
circle.style.background=`conic-gradient(#00f5ff ${count}%, #1e293b ${count}%)`;
}
},20);
}

function showSkills(id,array){
let container=document.getElementById(id);
container.innerHTML="";
array.forEach(skill=>{
let div=document.createElement("div");
div.classList.add("skill-card");
div.innerText=skill;
container.appendChild(div);
});
}