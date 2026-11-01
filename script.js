/* ---------- COURSE DATA ---------- */
const courseCat = {
  'ENC1101':'Composition','ENC1102':'Composition','ENC2210':'Composition',
  'ENC2256':'Composition','ENC2305':'Composition',
  'ARH2000':'Humanities','MUL2010':'Humanities','THE2000':'Humanities',
  'PHI2010':'Humanities','LIT2000':'Humanities',
  'AMH2010':'Social and Behavioral Sciences','AMH2020':'Social and Behavioral Sciences',
  'ECO2013':'Social and Behavioral Sciences','PSY2012':'Social and Behavioral Sciences',
  'ANT2000':'Social and Behavioral Sciences','POS2041':'Social and Behavioral Sciences'
};
const courses = Object.keys(courseCat);

/* ---------- SHUFFLE FUNCTION ---------- */
function shuffle(arr){
  for (let i=arr.length-1; i>0; i--){
    const j = Math.floor(Math.random() * (i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ---------- RENDER COURSE LIST ---------- */
const listEl = document.getElementById('course-list');
shuffle(courses).forEach(code=>{
  const div=document.createElement('div');
  div.className='course';
  div.draggable=true;
  div.dataset.code=code;
  div.textContent=code;
  listEl.appendChild(div);
});

/* ---------- DRAG‑AND‑DROP HANDLERS ---------- */
let dragging=null;

listEl.addEventListener('dragstart', e=>{
  if (e.target.classList.contains('course')){
    dragging=e.target;
    e.dataTransfer.effectAllowed='move';
    e.dataTransfer.setData('text/plain', e.target.dataset.code);
  }
});
listEl.addEventListener('dragend', e=>{ dragging=null; });

document.querySelectorAll('.category').forEach(cat=>{
  cat.addEventListener('dragover', e=>{ e.preventDefault(); cat.style.borderColor='#66f'; });
  cat.addEventListener('dragleave', e=>{ cat.style.borderColor='var(--orange)'; });
  cat.addEventListener('drop', e=>{
    e.preventDefault(); cat.style.borderColor='var(--orange)';
    if (dragging){
      dragging.parentNode.removeChild(dragging);
      cat.appendChild(dragging);
      const correct = courseCat[dragging.dataset.code]===cat.dataset.cat;
      if (correct){
        dragging.classList.add('correct');
        dragging.classList.remove('incorrect');
      }else{
        dragging.classList.add('incorrect');
        dragging.classList.remove('correct');
      }
      checkAllPlaced();
    }
  });
});

/* ---------- CHECK COMPLETION ---------- */
function checkAllPlaced(){
  if (listEl.children.length===0){
    const allGood=Array.from(document.querySelectorAll('.course'))
      .every(el=> courseCat[el.dataset.code]===el.parentElement.dataset.cat);
    if (allGood) showConfetti();
  }
}

/* ---------- CONFETTI EFFECT ---------- */
function showConfetti(){
  const conf=document.getElementById('confetti');
  conf.style.display='block';
  const canvas=document.createElement('canvas');
  canvas.width=window.innerWidth; canvas.height=window.innerHeight;
  conf.appendChild(canvas);
  const ctx=canvas.getContext('2d');

  const colors=['#0021A5','#FA4616','#22884C','#D32737',
                '#6A2A60','#002657','#F2A900'];
  const particles=[];
  const count=350;
  for(let i=0;i<count;i++){
    particles.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height-50,
      r: Math.random()*6+1,                     // larger pieces
      coef: Math.random()*5+0.5,                // varied fall speed
      color: colors[Math.floor(Math.random()*colors.length)]
    });
  }

  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{
      ctx.fillStyle=p.color;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,2*Math.PI);
      ctx.fill();
      p.y+=p.coef;
      if(p.y>canvas.height){ p.y=-10; p.x=Math.random()*canvas.width; }
    });
    requestAnimationFrame(draw);
  }
  draw();
  setTimeout(()=>{ conf.style.display='none'; canvas.remove(); }, 7000);
}
