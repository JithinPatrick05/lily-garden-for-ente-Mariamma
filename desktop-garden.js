/* Each lily is its OWN artwork: isolate a different photographed blossom
   from the original bouquet and morph the petals independently at canvas level.
   Pink texture, veins and markings remain from the original source image. */
(()=>{
 'use strict';
 if(window.__uniqueLiliesReady)return;
 window.__uniqueLiliesReady=true;
 const photo=new Image();
 const noise=n=>{const v=Math.sin(n*117.345+97.917)*45758.823;return v-Math.floor(v)};
 const range=(n,a,b)=>a+(b-a)*noise(n);
 const sizes=[
  // Original flower centres/crops in the 838×495 photograph.
  {x:180,y:0,w:265,h:302,cx:.48,cy:.46},
  {x:368,y:52,w:315,h:340,cx:.48,cy:.47},
  {x:107,y:212,w:327,h:283,cx:.52,cy:.51},
  {x:403,y:286,w:259,h:208,cx:.50,cy:.54},
  {x:178,y:67,w:244,h:272,cx:.54,cy:.48},
  {x:400,y:90,w:268,h:290,cx:.46,cy:.50},
  {x:143,y:249,w:301,h:237,cx:.51,cy:.54}
 ];
 let lastTier='';
 function formLily(seed,source){
   const N=208,canvas=document.createElement('canvas');
   canvas.width=N;canvas.height=N;
   const ctx=canvas.getContext('2d',{alpha:true,willReadFrequently:false});
   if(!ctx)return canvas;
   const src=sizes[source];
   const r=range(seed+1,-.11,.11);
   const bulge=range(seed+3,-.14,.14);
   const twist=range(seed+4,-.13,.13);
   const shape=range(seed+5,.86,1.13);
   const direction=noise(seed+6)>.5?-1:1;
   // Draw independent organic distortions. This changes every silhouette,
   // rather than merely rotating a duplicated PNG.
   const slices=104;
   for(let row=0;row<slices;row++){
     const fy=(row+.5)/slices;
     const yy=(fy-.5)*2;
     const sway=Math.sin((fy*.85+twist)*Math.PI*2.3)*bulge;
     const flow=r*yy+sway*.45;
     const stretch=1+shape*.09+Math.cos(yy*Math.PI)*bulge*.32;
     const sy=src.y+fy*src.h;
     const center=N/2+flow*N*.32;
     const dw=N*stretch;
     ctx.drawImage(photo,src.x,sy,src.w,src.h/slices+1,
       center-dw/2,fy*N-1,dw,N/slices+2);
   }
   // Feathered oval removes neighboring blooms at the edges of each crop,
   // keeping the original blossom's highly detailed textured petals.
   ctx.globalCompositeOperation='destination-in';
   const radius=N*.56;
   ctx.save();
   ctx.translate(N*src.cx,N*src.cy);
   ctx.scale(1,range(seed+9,.88,1.04));
   const g=ctx.createRadialGradient(0,0,radius*.24,0,0,radius);
   g.addColorStop(0,'rgba(0,0,0,1)');
   g.addColorStop(.62,'rgba(0,0,0,1)');
   g.addColorStop(.81,'rgba(0,0,0,.96)');
   g.addColorStop(1,'rgba(0,0,0,0)');
   ctx.fillStyle=g;ctx.fillRect(-N,-N,2*N,2*N);
   ctx.restore();
   ctx.globalCompositeOperation='source-over';
   return canvas;
 }
 function createElement(seed,x,y,rank){
   const el=document.createElement('div');el.className='individual-lily';
   const count=sizes.length;
   // Avoid nearby identical source photographs.
   const source=Math.floor(noise(seed+20)*count);
   const props={
     x:x.toFixed(2)+'%',y:y.toFixed(2)+'%',
     w:range(seed+21,rank===0?158:109,rank===0?224:167).toFixed(1)+'px',
     opacity:range(seed+22,rank===0?.68:.49,rank===0?.98:.79).toFixed(3),
     rot:range(seed+23,-64,64).toFixed(1)+'deg',
     flip:noise(seed+24)>.5?'1':'-1',
     stretch:range(seed+25,.86,1.15).toFixed(3),
     duration:range(seed+26,9,17).toFixed(2)+'s',
     delay:(-range(seed+27,0,16)).toFixed(2)+'s'
   };
   for(const [name,value] of Object.entries(props))el.style.setProperty('--'+name,value);
   el.setAttribute('aria-hidden','true');
   el.appendChild(formLily(seed,source));
   return el;
 }
 function render(){
   let layer=document.getElementById('individual-lily-garden');
   if(!layer){
     layer=document.createElement('div');layer.id='individual-lily-garden';
     layer.setAttribute('aria-hidden','true');
     const scene=document.getElementById('scene');
     if(scene){
       const vignette=scene.querySelector('.vignette');
       scene.insertBefore(layer,vignette||null);
     }else document.body.prepend(layer);
   }
   const tier=innerWidth>=1620?'wide':innerWidth>=1080?'laptop':'compact';
   if(layer.children.length && tier===lastTier)return;
   lastTier=tier;layer.replaceChildren();
   const frag=document.createDocumentFragment();
   const rows=tier==='wide'?13:tier==='laptop'?11:9;
   const bands=tier==='wide'?4:tier==='laptop'?3:2;
   for(let side=0;side<2;side++){
    for(let band=0;band<bands;band++){
     for(let row=0;row<rows;row++){
       const seed=900+side*711+band*163+row*29;
       const offset=[0.8,10.8,19.6,27.2][band]+range(seed+1,-2.8,2.8);
       const x=side===0?offset:100-offset;
       const y=5+(row+.37)/rows*90+range(seed+2,-3.4,3.4);
       frag.appendChild(createElement(seed,x,y,band===0?0:1));
     }
    }
   }
   // Full lower flower bed, individual flower heads rather than cloned bouquets.
   const rim=tier==='wide'?26:tier==='laptop'?19:12;
   for(let i=0;i<rim;i++){
      const seed=7200+i*37;
      const x=1+(i+.4)/rim*98+range(seed+1,-1.2,1.2);
      const y=i%5===0?range(seed+2,-3,4):range(seed+3,96,107);
      frag.appendChild(createElement(seed,x,y,1));
   }
   layer.appendChild(frag);
   document.body.classList.add('unique-lilies-ready');
   document.documentElement.dataset.uniqueLilyCount=String(layer.children.length);
 }
 photo.onload=()=>{
   render();
   let task=0;
   window.addEventListener('resize',()=>{
     if(task)cancelAnimationFrame(task);
     task=requestAnimationFrame(()=>{task=0;render()});
   },{passive:true});
 };
 photo.onerror=()=>{
   // The original lilies stay visible if loading individual petal artwork fails.
   console.warn('Individual lily artwork unavailable; preserving original garden.');
 };
 photo.src='./assets/original-stargazer.png?v=original-lily-1';
})();
