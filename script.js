import{FilesetResolver,HandLandmarker}from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/vision_bundle.mjs";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import { OBJLoader } from "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/OBJLoader.js";
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
let handDetector;
async function handtrack() { //well done if u noticed we're making it hand controlled
    stats.textContent="gettin media pipe";
    //actually gettting media pipe now
    const vision=await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm");
    //model 
    handDetector=await HandLandmarker.createFromOptions(vision,{
        baseOptions:{
            modelAssetPath:"https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
        },
        runningMode:"VIDEO",
        numHands:2}
    );
    //getting acess bc we legal
    const stream= await navigator.mediaDevices.getUserMedia({
        video:true
    });
    video.srcObject=stream;
    await video.play();
    stats.textContent="hand tracking active";
    detectHands();
}
function detectHands(){
    if(video.readyState>=2){
        const results=handDetector.detectForVideo(
            video,performance.now()
        );
        if(results.landmarks.length>0){
            stats.textContent=`detected ${results.landmarks.length} hands`;
            console.log(results.landmarks);
        }else{
            stats.textContent="no hands detected";
    
        }
        //indexxx finger 
        if(results.landmarks.length>0){
            const hand= results.landmarks[0];
            const x=1-hand[8].x;
            const y=hand[8].y;
            const cursor=document.getElementById("curse");
            const rect=document.getElementById("screen").getBoundingClientRect();
            cursor.style.left=`${rect.left+x*rect.width}px`;
            cursor.style.top=`${rect.top+y*rect.height}px`;
            cursor.style.display="block";
            console.log("cursor:",x,y);
            stats.textContent=`detected ${results.landmarks.length} hands`;
        }else{
            stats.textContent="no hands detected";
        }
        
    }
    requestAnimationFrame(detectHands);
}
button.addEventListener("click",async()=>{
    button.disabled=true;
    try{
        await handtrack();
    }catch(error){
        console.error(error);
        stats.textContent="check console";
        button.disabled=false;
    }
});
//3d model timee
const scene= new THREE.Scene();
const camera=new THREE.PerspectiveCamera(45,window.innerWidth/450,0.1,1000);
camera.position.z=5;
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth,450);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById("main").appendChild(renderer.domElement);
//prelims most done lightign timee
const light=new THREE.DirectionalLight(0xffffff,3);
light.position.set(2,3,5);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff,1));