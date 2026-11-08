import{FilesetResolver,HandLandmarker}from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/vision_bundle.mjs";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import { OBJLoader } from "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/OBJLoader.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/controls/OrbitControls.js";
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
const models=[
    {id:"main",file:"./models/main.obj"},
    {id:"numpad",file:"./models/numpad.obj"},
    {id:"fkeys",file:"./models/FN_row.obj"},
    {id:"arrows",file:"./models/arrows.obj"},
    {id:"mkeys",file:"./models/macros.obj"}
];
models.forEach(model=>{
    const box=document.getElementById(model.id);
    if(!box) return;
    const sce=new THREE.Scene();
    const lca=new THREE.PerspectiveCamera(45,1,0.1,100);
    const render= new THREE.WebGLRenderer({
        alpha:true,
        antialias:true
    });
    render.setPixelRatio(window.devicePixelRatio);
    render.setSize(box.clientWidth,box.clientHeight);
    box.appendChild(render.domElement);
    //lightinggg
    sce.add(new THREE.HemisphereLight(0xffffff,0x604020,3));
    const light =new THREE.DirectionalLight(0xffffff,2);
    light.position.set(3,5,5);
    sce.add(light);
    //adding model
    const load=new OBJLoader();
    const pivot=new THREE.Group();
    sce.add(pivot);
    load.load(model.file,obj=>{
        obj.traverse(part=>{
            if(part.isMesh){
                part.material=new THREE.MeshStandardMaterial({
                    color:0x72383d,
                    metalness:0.5,
                    roughness:0.4
                });
            }
        });
        const bounds=new THREE.Box3().setFromObject(obj);
        const size=bounds.getSize(new THREE.Vector3());
        const maxsize=Math.max(size.x,size.y,size.z);
        if(!maxsize||!Number.isFinite(maxsize)) return;
        obj.scale.setScalar(3/maxsize);
        const newbounds=new THREE.Box3().setFromObject(obj);
        const centre=newbounds.getCenter(new THREE.Vector3());
        obj.position.sub(centre);
        pivot.add(obj);
        //lights camera , no action yet
        lca.position.set(3,2,4);
        lca.lookAt(0,0,0);
    },undefined, error=>{
        console.error("model failed",error);
    });

    //action time
    const controls=new OrbitControls(lca,render.domElement);
    controls.target.set(0,0,0);
    controls.enableDamping=true;
    controls.autoRotate=false;
    //now we rotate
    function animate(){
        requestAnimationFrame(animate);
        const wid=box.clientWidth;
        const hei=box.clientHeight;
        if(wid>0 && hei>0){
            render.setSize(wid,hei,false);
            lca.aspect=wid/hei;
            lca.updateProjectionMatrix();
            pivot.rotation.y+=0.01;
            controls.update();
            render.render(sce,lca);
        }
    }
    animate();
});