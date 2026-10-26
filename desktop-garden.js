/* Photographic desktop garden — the page's existing .bouquet image is the
   source for each cut-out. No second image download or flat SVG substitutes. */
(() => {
  'use strict';
  const media=matchMedia('(min-width:900px)');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const layer=document.getElementById('desktop-lily-garden');
  const particles=document.getElementById('particles');
  if(!layer||!particles)return;
  if(window.__lilyPhotoGardenReady)return;
  window.__lilyPhotoGardenReady=true;
  const colours=['255,179,227','231,207,255','255,230,174','172,224,255','255,249,251','235,168,247'];
  const crops=[
    [34,22,360],[68,35,345],[34,70,345],[65,78,365],
    [42,27,400],[59,48,400],[29,62,385],[70,58,400]
  ];
  function rand(seed){const x=Math.sin(seed*139.451+17.29)*43758.5453;return x-Math.floor(x)}
  const f=(seed,min,max)=>min+(max-min)*rand(seed);
  let mode='';
  function bloom(seed,x,y,major=false){
    const node=document.createElement('div');
    node.className='bouquet desktop-photo-bloom';
    node.setAttribute('aria-hidden','true');
    const crop=crops[Math.floor(rand(seed+3)*crops.length)];
    const hues=[-85,-53,-26,-9,0,18,35,48,88,132,178,221,263];
    const hue=hues[Math.floor(rand(seed+5)*hues.length)]+f(seed+8,-13,13);
    const scale=f(seed+10,.81,1.18);
    const width=f(seed+16,major?140:110,major?229:189);
    const cfg={
      x:x.toFixed(3)+'%',y:y.toFixed(3)+'%',
      w:'clamp('+(width*.70).toFixed(0)+'px,'+(width/13.66).toFixed(2)+'vw,'+(width*1.12).toFixed(0)+'px)',
      r:f(seed+21,-36,36).toFixed(2)+'deg',
      scale:scale.toFixed(3),
      o:f(seed+24,major?.53:.38,major?.94:.72).toFixed(3),
      'crop-size':(crop[2]+f(seed+29,-22,25)).toFixed(1)+'%',
      'crop-x':(crop[0]+f(seed+32,-6,6)).toFixed(1)+'%',
      'crop-y':(crop[1]+f(seed+35,-8,8)).toFixed(1)+'%',
      hue:hue.toFixed(1)+'deg',sat:f(seed+38,1.13,1.63).toFixed(2),
      bright:f(seed+41,.84,1.22).toFixed(2),
      duration:f(seed+47,9.3,17.7).toFixed(2)+'s',
      delay:(-f(seed+50,0,13)).toFixed(2)+'s'
    };
    for(const [key,val]of Object.entries(cfg))node.style.setProperty('--'+key,val);
    return node;
  }
  function sparkle(seed){
    const node=document.createElement('span');
    node.className='photo-twinkle'+(rand(seed+2)>.87?' star-cross':'');
    node.setAttribute('aria-hidden','true');
    const near=rand(seed+3)<.89;
    const x=near?f(seed+5,23,77):f(seed+5,5,95);
    const y=near?f(seed+7,17,82):f(seed+7,5,96);
    const cfg={x:x.toFixed(2)+'%',y:y.toFixed(2)+'%',
      size:f(seed+9,.75,2.55).toFixed(2)+'px',
      light:colours[Math.floor(rand(seed+13)*colours.length)],
      duration:f(seed+17,2.2,6.8).toFixed(2)+'s',
      delay:(-f(seed+19,0,8)).toFixed(2)+'s'};
    for(const [key,val]of Object.entries(cfg))node.style.setProperty('--'+key,val);
    return node;
  }
  function render(){
    if(!media.matches)return;
    const nextMode=innerWidth>=1680?'wide':innerWidth>=1120?'laptop':'compact';
    if(nextMode===mode)return;
    mode=nextMode;
    layer.querySelectorAll('.desktop-photo-bloom').forEach(n=>n.remove());
    particles.querySelectorAll('.photo-twinkle').forEach(n=>n.remove());
    const frag=document.createDocumentFragment();
    const rows=mode==='wide'?11:mode==='laptop'?9:7;
    const bands=mode==='wide'?4:3;
    for(let side=0;side<2;side++){
      for(let band=0;band<bands;band++){
        for(let row=0;row<rows;row++){
          const seed=2000+side*1200+band*97+row*17;
          const inset=[1.4,9.5,18.8,26][band]+f(seed+1,-3,3);
          const x=side===0?inset:100-inset;
          const y=4+(row+.42)/rows*91+f(seed+2,-3.3,3.3);
          frag.appendChild(bloom(seed,x,y,band<2));
        }
      }
    }
    const rim=mode==='wide'?23:mode==='laptop'?16:11;
    for(let col=0;col<rim;col++){
      const seed=5600+col*19;
      const x=2+(col+.5)/rim*96+f(seed,-2.5,2.5);
      const top=col%3===0;
      const y=top?f(seed+2,-4,6):f(seed+3,94,106);
      frag.appendChild(bloom(seed,x,y,false));
    }
    layer.appendChild(frag);
    const dust=document.createDocumentFragment();
    const count=mode==='wide'?135:mode==='laptop'?100:68;
    for(let i=0;i<count;i++)dust.appendChild(sparkle(7500+i*31));
    particles.appendChild(dust);
  }
  let resizeFrame=0;
  function schedule(){
    if(resizeFrame)cancelAnimationFrame(resizeFrame);
    resizeFrame=requestAnimationFrame(()=>{resizeFrame=0;render()});
  }
  render();media.addEventListener('change',schedule);
  window.addEventListener('resize',schedule,{passive:true});
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)return;
    if(media.matches&&!layer.querySelector('.desktop-photo-bloom'))render();
  });
})();
