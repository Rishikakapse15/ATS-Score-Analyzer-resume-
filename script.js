const keywords = [
"java","python","c++","sql","html","css","javascript",
"react","node","data structures","algorithms","git"
];

const actionVerbs = [
"developed","designed","implemented",
"optimized","created","built","analyzed"
];

async function analyzeResume(){

let file = document.getElementById("resumeUpload").files[0];
let jobDesc = document.getElementById("jobDesc").value.toLowerCase();

if(!file){
alert("Upload resume");
return;
}

let text = "";

if(file.type === "application/pdf"){
text = await extractPDF(file);
}
else{
text = await file.text();
}

text = text.toLowerCase();

let score = 0;

keywordAnalysis(text,jobDesc);
skillGap(text,jobDesc);
sectionCheck(text);
bulletCheck(text);
lengthCheck(text);
formatWarnings(text);
mentorAdvice(text);

score = calculateScore(text,jobDesc);

document.getElementById("score").innerText = score;

saveScore(score);
drawChart();
}

async function extractPDF(file){

let reader = new FileReader();

return new Promise((resolve)=>{

reader.onload = async function(){

let typedarray = new Uint8Array(this.result);

let pdf = await pdfjsLib.getDocument(typedarray).promise;

let text="";

for(let i=1;i<=pdf.numPages;i++){

let page = await pdf.getPage(i);

let content = await page.getTextContent();

content.items.forEach(item=>{
text += item.str + " ";
});
}

resolve(text);

};

reader.readAsArrayBuffer(file);

});
}

function keywordAnalysis(text,job){

let match=0;

keywords.forEach(word=>{

if(text.includes(word)){
match++;
}

});

document.getElementById("keywordResult").innerHTML =
"Matched keywords: "+match+"/"+keywords.length;
}

function skillGap(text,job){

let missing=[];

keywords.forEach(skill=>{

if(job.includes(skill) && !text.includes(skill)){
missing.push(skill);
}

});

document.getElementById("skillGap").innerHTML =
missing.join(", ");
}

function sectionCheck(text){

let sections=["education","skills","projects","experience"];

let found=[];
let missing=[];

sections.forEach(sec=>{

if(text.includes(sec)){
found.push(sec);
}else{
missing.push(sec);
}

});

document.getElementById("sections").innerHTML =
"Found: "+found.join(", ")+"<br>Missing: "+missing.join(", ");
}

function bulletCheck(text){

let good=0;

actionVerbs.forEach(v=>{

if(text.includes(v)){
good++;
}

});

document.getElementById("bullets").innerHTML =
"Strong action verbs used: "+good;
}

function lengthCheck(text){

let words=text.split(" ").length;

if(words<400){
document.getElementById("warnings").innerHTML +=
"Resume too short<br>";
}
}

function formatWarnings(text){

if(text.includes("table")){
document.getElementById("warnings").innerHTML +=
"Tables detected (ATS issue)<br>";
}
}

function mentorAdvice(text){

let advice="";

if(!text.includes("project")){
advice+="Add more projects.<br>";
}

if(!text.match(/\d+/)){
advice+="Add quantified achievements (numbers).<br>";
}

document.getElementById("mentor").innerHTML = advice;
}

function calculateScore(text,job){

let score=0;

keywords.forEach(word=>{
if(text.includes(word)) score+=5;
});

if(text.includes("experience")) score+=10;
if(text.includes("projects")) score+=10;
if(text.match(/\d+/)) score+=10;

return Math.min(score,100);
}

function saveScore(score){

let scores = JSON.parse(localStorage.getItem("scores")) || [];

scores.push(score);

localStorage.setItem("scores",JSON.stringify(scores));
}

function drawChart(){

let scores = JSON.parse(localStorage.getItem("scores")) || [];

new Chart(document.getElementById("scoreChart"),{

type:"line",

data:{
labels:scores.map((_,i)=>"Attempt "+(i+1)),
datasets:[{
label:"ATS Score Progress",
data:scores
}]
}

});
}