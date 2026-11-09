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
    handtracking = true;//this for the cursor
    stats.textContent="hand tracking active";
    detectHands();
}
let pinching=false;
let pivots=[];
let cameras=[];
let thumbsupactive=false;
let lastmiddley=null;
let hoverelement=null;
let handtracking = false;
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
            const pinkyt=hand[20];
            const pinkyb=hand[17];
            const pinkyup=pinkyt.y<pinkyb.y;//imagine me breaking into song
            const x=1-hand[8].x;
            const y=hand[8].y;
            const cursor=document.getElementById("curse");
            cursor.style.display = handtracking ? "block" : "none";            
            const rect=document.getElementById("screen").getBoundingClientRect();
            cursor.style.left=`${rect.left+x*rect.width}px`;
            cursor.style.top=`${rect.top+y*rect.height}px`;
            console.log("cursor:",x,y);
            stats.textContent=`detected ${results.landmarks.length} hands`;
            //pinchy pinch-thumb
            const thumb =hand[4];
            const index=hand[8];
            const distance=Math.hypot(
                thumb.x -index.x,
                thumb.y-index.y
            );
            //fing pos
            const indexup=hand[8].y<hand[6].y;
            const middleup=hand[12].y<hand[10].y;
            const ringup=hand[16].y<hand[14].y;
            const pinkyUp=hand[20].y<hand[18].y;
            const thumbup=hand[4].y<hand[3].y;
            const fingersfolded=!indexup && !middleup && !ringup && !pinkyUp;
            if(thumbup && fingersfolded){
                if(!thumbsupactive){
                    thumbsupactive=true;
                    const button=hoverelement?.closest("button");
                    button?.click();
                }
            }else{
                thumbsupactive=false;
            }
            // middle finger , it scrolls
            if(middleup && !indexup && !ringup && !pinkyUp){
                const currentx=hand[12].x;
                const currenty=hand[12].y;
                if(lastmiddley !==null){
                    const movementx=lastmiddley.x-currentx;
                    const movementy=lastmiddley.y-currenty;
                    document.querySelector(".cardcont").scrollBy(movementx*1500,0);
                    window.scrollBy(0,movementy*1500);
                }
                lastmiddley={x:currentx,y:currenty};
            }else{
                lastmiddley=null
            }
            stats.textContent=`pinch distance:${distance.toFixed(3)}`;
            console.log("pinch distance",distance);
            const zoom = THREE.MathUtils.clamp(
                THREE.MathUtils.mapLinear(distance, 0.03, 0.20, 2, 8),
                2, 8
            );
            cameras.forEach(camera => {
                camera.position.setLength(zoom);
            });
            if(distance<0.05 && !pinching && !thumbsupactive){
                pinching=true;
                const cursor=document.getElementById("curse");
                hoverelement?.click();
            }
            if(distance>0.08){
                pinching=false;
            }                
            const element =document.elementFromPoint(parseFloat(cursor.style.left),parseFloat(cursor.style.top));
            const target = element?.closest("button, a, .card");                
            if (hoverelement !== target) {
                hoverelement?.classList.remove("hand-hover");
                target?.classList.add("hand-hover");
                hoverelement = target;
            }
            //pinkyy
            if(pinkyup){
                const rotation=(0.5-pinkyt.x)*0.15;
                pivots.forEach(pivot=>{
                    pivot.rotation.y+=rotation;
                });

            }
        }else{
            stats.textContent="no hands detected";
            pinching=false;
            document.getElementById("curse").style.display="none";
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
    {id:"fkeys",file: "./models/FN_row.obj"},
    {id:"arrows",file:"./models/arrows.obj"},
    {id:"mkeys",file:"./models/macros.obj"}
];
models.forEach(model=>{
    const box=document.getElementById(model.id);
    if(!box) return;
    const sce=new THREE.Scene();
    const lca=new THREE.PerspectiveCamera(45,1,0.1,100);
    cameras.push(lca);
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
    pivots.push(pivot);
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
//downlolading files time
let selfiles=[];
function addtodown(card){
    const name=card.querySelector("h2").textContent;
    const model=models.find(item=>item.id===card.querySelector(".cardimg").id);
    if(!model) return;
    if(selfiles.some(item=>item.id===model.id)) return;
    selfiles.push({
        id:model.id,
        name:name,
        file:model.file

    });
    updatedowns();
}
function updatedowns(){
    const items=document.getElementById("cart");
    const count=document.getElementById("cardcount");
    items.innerHTML="";
    count.textContent=selfiles.length;
    if(selfiles.length===0){
        items.textContent="nothing selected yet...";
    }
    selfiles.forEach(item=>{
        const row=document.createElement("div");
        row.className="cartitem";
        const name=document.createElement("span");
        name.textContent=item.name;
        const remove=document.createElement("button");
        remove.textContent="remove";
        remove.addEventListener("click",()=>{
            selfiles=selfiles.filter(file=>file.id !==item.id);
            updatedowns();
        });
        row.append(name,remove);
        items.appendChild(row);
    });
}
document.querySelectorAll(".card").forEach(card => {
    const addbutton = card.querySelector("button");

    addbutton.addEventListener("click", () => {
        console.log("ADD CLICKED");
        addtodown(card);
    });
});
document.getElementById("alld").addEventListener("click",async()=>{
    for(const item of selfiles){
        const link =document.createElement("a");
        link.href=item.file;
        link.download=item.file.split("/").pop();
        document.body.appendChild(link);
        link.click();
        link.remove();
        await new Promise(resolve=>setTimeout(resolve,300));
    }
});
const guide=document.getElementById("guideo");
const guideb=document.getElementById("guideb");
const cguide=document.getElementById("cguide");
guideb.addEventListener("click",()=>{
    guide.style.display="flex";
});
cguide.addEventListener("click",()=>{
    guide.style.display="none";
});
guide.addEventListener("click",(event)=>{
    if(event.target===guide){
        guide.style.display="none";
    }
});