/* Restore the original rich photo-textured lilies, just more of them.
   This addon does not modify any of the original 43 flower elements. */
(()=>{
  'use strict';
  if(window.__lilyOriginalFillReady)return;
  const layer=document.getElementById('desktop-lily-garden');
  const originals=document.querySelector('#bouquets > .bouquet');
  if(!layer||!originals)return;
  window.__lilyOriginalFillReady=true;
  window.__lilyPhotoGardenReady=true; // compatibility with existing page loader
  const media=matchMedia('(min-width:900px)');
  const noise=n=>{const x=Math.sin(n*127.123+31.774)*43758.5453;return x-Math.floor(x)};
  const between=(n,low,high)=>low+(high-low)*noise(n);
  let mode='';
  function addOriginal(frag,seed,x,y,row=0){
    const el=document.createElement('div');
    el.className='bouquet original-extra-lily';
    el.setAttribute('aria-hidden','true');
    const width=between(seed+2,row===0?158:140,row===0?220:190);
    const zoom=between(seed+4,.74,1.04);
    const opacity=between(seed+6,row===0?.49:.32,row===0?.76:.58);
    const options={
      x:x.toFixed(2)+'%',y:y.toFixed(2)+'%',
      w:width.toFixed(0)+'px',
      r:between(seed+8,-27,27).toFixed(1)+'deg',
      s:zoom.toFixed(3),o:opacity.toFixed(3),
      d:between(seed+10,8.1,15.8).toFixed(2)+'s',
      delay:(-between(seed+12,0,12)).toFixed(2)+'s'
    };
    for(const [key,value]of Object.entries(options))el.style.setProperty('--'+key,value);
    frag.appendChild(el);
  }
  function fill(){
    // Build the additional original lily elements on all viewports;
    // CSS hides them below laptop width without loading extra decoration.
    const next=innerWidth>=1600?'wide':innerWidth>=1120?'laptop':'compact';
    if(next===mode&&layer.querySelector('.original-extra-lily'))return;
    mode=next;
    layer.querySelectorAll('.original-extra-lily,.desktop-photo-bloom').forEach(el=>el.remove());
    const frag=document.createDocumentFragment();
    const rows=next==='wide'?11:next==='laptop'?10:8;
    const bands=next==='wide'?3:2;
    for(let side=0;side<2;side++){
      for(let band=0;band<bands;band++){
        for(let row=0;row<rows;row++){
          const seed=1000+side*900+band*113+row*19;
          const inset=[1.8,15.0,25.5][band]+between(seed+1,-3,3);
          const x=side===0?inset:100-inset;
          const y=5+(row+.28)*91/rows+between(seed+3,-3,3);
          addOriginal(frag,seed,x,y,band===0?0:1);
        }
      }
    }
    // Low, layered flower bed + smaller blossoms along the upper rim.
    const rim=next==='wide'?22:next==='laptop'?16:10;
    for(let i=0;i<rim;i++){
      const seed=4300+i*31;
      const x=1+(i+.45)*98/rim+between(seed+1,-1.7,1.7);
      const atTop=i%4===0;
      const y=atTop?between(seed+3,-2,8):between(seed+4,96,106);
      addOriginal(frag,seed,x,y,atTop?1:0);
    }
    layer.appendChild(frag);
  }
  let pending=0;
  const resize=()=>{
    if(pending)cancelAnimationFrame(pending);
    pending=requestAnimationFrame(()=>{pending=0;fill()});
  };
  fill();
  media.addEventListener('change',resize);
  addEventListener('resize',resize,{passive:true});
})();
