import{FilesetResolver,HandLandmarker}from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/vision_bundle.mjs";
//miss me much, anyways gonna make it type it bc keyboard yk yk
const text="Keyboard & Co";
let i=0;
function typtit(){ //dont think of it that way it stands for type title 
    if(i<text.length){
        document.getElementById("tit").textContent+=text[i];
        i++;
        setTimeout(typtit,120)
    }
}
typtit();
const button=document.getElementById("handc");
const video=document.getElementById("webc");
const stats =document.getElementById("handstats");
let HandLandmarker;
async function handtrack() { //well done if u noticed we're making it hand controlled
    stats.textContent="gettin media pipe";
    //actually gettting media pipe now
    const vision=await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm");
    //model 
    handtrack=await HandLandmarker.createFromOptions(vision,
        baseOptions
    )
    
}