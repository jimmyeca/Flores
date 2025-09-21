/* Stars + subtle parallax + UI interactions */
(() => {
  /* Canvas stars */
  const canvas = document.getElementById('stars-canvas');
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  let stars = [];
  let running = true;

  function resize() {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
  }
  window.addEventListener('resize', resize);

  function rand(min, max){ return Math.random()*(max-min)+min; }

  function createStars(count=160){
    stars = [];
    for(let i=0;i<count;i++){
      stars.push({
        x: Math.random()*w,
        y: Math.random()*h,
        r: Math.random()*1.6 + 0.3,
        a: Math.random(),
        twinkle: Math.random()*0.02 + 0.003,
        vx: (Math.random()-0.5)*0.02,
        vy: (Math.random()-0.5)*0.02
      });
    }
  }

  function drawStars(){
    ctx.clearRect(0,0,w,h);
    // soft vignette
    const g = ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(0, 'rgba(8,10,20,0.0)');
    g.addColorStop(1, 'rgba(2,3,7,0.45)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);

    for(const s of stars){
      s.a += Math.sin(Date.now()*s.twinkle*0.002)*s.twinkle;
      s.a = Math.min(1, Math.max(0.05, s.a));
      s.x += s.vx;
      s.y += s.vy;
      if (s.x < 0) s.x = w;
      if (s.x > w) s.x = 0;
      if (s.y < 0) s.y = h;
      if (s.y > h) s.y = 0;

      // glow
      const g2 = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r*6);
      g2.addColorStop(0, `rgba(255,245,200,${0.9*s.a})`);
      g2.addColorStop(0.3, `rgba(255,230,140,${0.45*s.a})`);
      g2.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.fillStyle = g2;
      ctx.arc(s.x, s.y, s.r*6, 0, Math.PI*2);
      ctx.fill();

      // core
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${0.95*s.a})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fill();
    }
  }

  function loop(){
    if (running) drawStars();
    requestAnimationFrame(loop);
  }

  // initial
  createStars(Math.floor(Math.max(80, (innerWidth*innerHeight)/9000)));
  loop();

  // UI interactions
  const showBtn = document.getElementById('show-note');
  const note = document.getElementById('note');
  const closeNote = document.getElementById('close-note');
  const toggleStars = document.getElementById('toggle-stars');

  if (showBtn && note) {
    showBtn.addEventListener('click', () => {
      note.classList.add('show');
      note.setAttribute('aria-hidden', 'false');
    });
  }
  if (closeNote && note) {
    closeNote.addEventListener('click', () => {
      note.classList.remove('show');
      note.setAttribute('aria-hidden', 'true');
    });
  }

  if (toggleStars) {
    toggleStars.addEventListener('click', () => {
      running = !running;
      toggleStars.textContent = running ? 'Pausar estrellas' : 'Reanudar estrellas';
    });
  }

  // Small heart particle effect when pressing "Enviar corazón"
  const sendHeart = document.getElementById('send-heart');
  function spawnHeart(x = innerWidth/2, y = innerHeight/2){
    // quick DOM heart
    const el = document.createElement('div');
    el.className = 'floating-heart';
    el.style.position = 'fixed';
    el.style.left = (x - 12) + 'px';
    el.style.top = (y - 12) + 'px';
    el.style.width = '24px';
    el.style.height = '24px';
    el.style.zIndex = 1200;
    el.style.pointerEvents = 'none';
    el.style.transition = 'transform 900ms cubic-bezier(.2,-0.3,.2,1), opacity 900ms';
    el.style.transform = 'translateY(0) scale(1)';
    el.style.opacity = '1';
    el.innerHTML = '❤';
    el.style.fontSize = '20px';
    el.style.color = '#ff6677';
    document.body.appendChild(el);

    requestAnimationFrame(()=> {
      el.style.transform = `translateY(-160px) scale(1.6)`;
      el.style.opacity = '0';
    });
    setTimeout(()=> el.remove(), 1000);
  }

  if (sendHeart) {
    sendHeart.addEventListener('click', (e) => {
      spawnHeart(window.innerWidth/2, window.innerHeight/2 + 40);
      // small flash on note
      sendHeart.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 360 });
    });
  }

  // accessibility: pause animation if prefers-reduced-motion
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq.matches) {
    running = false;
  }

})();
