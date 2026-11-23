const teams = [
  { name:"New York", mascot:"Comets", abbr:"NY", color:"#183e73", accent:"#d0a85b", record:"95-67" },
  { name:"Boston", mascot:"Harbors", abbr:"BOS", color:"#a51d32", accent:"#12396f", record:"91-71" },
  { name:"Chicago", mascot:"Lions", abbr:"CHI", color:"#2554a4", accent:"#d9b34b", record:"88-74" },
  { name:"Atlanta", mascot:"Eagles", abbr:"ATL", color:"#a91e32", accent:"#183153", record:"92-70" },
  { name:"Los Angeles", mascot:"Stars", abbr:"LA", color:"#3152a4", accent:"#d0b461", record:"98-64" },
  { name:"Houston", mascot:"Astros", abbr:"HOU", color:"#ef6c35", accent:"#16324f", record:"90-72" },
  { name:"Philadelphia", mascot:"Founders", abbr:"PHI", color:"#b52a31", accent:"#d7dbe0", record:"89-73" },
  { name:"Seattle", mascot:"Sails", abbr:"SEA", color:"#0d6d69", accent:"#d0b04a", record:"87-75" }
];

let state = {
  home: teams[4], away: teams[0], innings: 9,
  stadium: "Modern", difficulty: "Pro", ai: "Balanced"
};

const app = document.getElementById("app");

function topbar() {
  return `<header class="topbar">
    <div class="brand"><div class="brand-mark">D</div><div class="brand-name">DIAMOND <span>BASEBALL</span></div></div>
    <button class="secondary-btn" data-action="home">Main Menu</button>
  </header>`;
}

function renderMain() {
  app.innerHTML = `<section class="screen"><header class="topbar">
    <div class="brand"><div class="brand-mark">D</div><div class="brand-name">DIAMOND <span>BASEBALL</span></div></div>
  </header><div class="menu-wrap">
    <div class="menu-hero"><div class="eyebrow">Welcome to the diamond</div><h1 class="hero-title">Own the <em>Moment</em></h1><p class="hero-copy">Build your legacy one pitch, one swing, and one game at a time.</p></div>
    <div class="mode-grid">
      <button class="mode-card quick" data-action="quick"><div class="eyebrow">Play now</div><h2>Quick Match</h2><p>Choose teams. Set the rules. Play ball.</p><div class="number">01</div></button>
      <button class="mode-card franchise"><div class="eyebrow">Build a club</div><h2>Franchise</h2><p>Manager and owner decisions</p><div class="number">02</div></button>
      <button class="mode-card career"><div class="eyebrow">Become legendary</div><h2>Career</h2><p>Rise from prospect to star</p><div class="number">03</div></button>
      <button class="mode-card owner"><div class="eyebrow">Run the business</div><h2>Owner</h2><p>Payroll, stadium and success</p><div class="number">04</div></button>
      <button class="mode-card fantasy"><div class="eyebrow">Collect the legends</div><h2>Fantasy</h2><p>All-time greats and prime stars</p><div class="number">05</div></button>
    </div>
  </div></section>`;
}

function renderTeamSelect() {
  app.innerHTML = `<section class="screen select-screen">${topbar()}<div class="select-layout">
    <div class="section-header"><div><div class="eyebrow">Quick match</div><h1>Choose Your Teams</h1></div><button class="primary-btn" data-action="settings">Continue</button></div>
    <div class="team-grid">
      ${teams.map((team,i)=>`<button class="team-card ${team===state.away?'selected':''}" data-team="${i}" style="--team:${team.color}"><div class="team-logo">${team.abbr}</div><h3>${team.name} ${team.mascot}</h3><span>${team.record}</span></button>`).join("")}
    </div>
  </div></section>`;
}

function renderSettings() {
  app.innerHTML = `<section class="screen select-screen">${topbar()}<div class="settings-panel">
    <div class="eyebrow">Quick match</div><h1>Game Settings</h1>
    <div class="setting-row"><div><strong>Opponent</strong><br><small>${state.home.name} ${state.home.mascot}</small></div><button class="secondary-btn" data-action="teams">Change Teams</button></div>
    <label class="setting-row"><strong>Innings</strong><select id="innings"><option value="9">9 Innings</option><option value="7">7 Innings</option><option value="3">3 Innings</option></select></label>
    <label class="setting-row"><strong>Difficulty</strong><select id="difficulty"><option>Rookie</option><option selected>Pro</option><option>All-Star</option><option>Legend</option></select></label>
    <label class="setting-row"><strong>Stadium</strong><select id="stadium"><option>Modern</option><option>Classic</option><option>Night</option></select></label>
    <div class="actions"><button class="secondary-btn" data-action="teams">Back</button><button class="primary-btn" data-action="play">Play Ball</button></div>
  </div></section>`;
}

let game = null;

function startGame() {
  const inningsEl = document.getElementById("innings");
  if (inningsEl) state.innings = Number(inningsEl.value);
  state.difficulty = document.getElementById("difficulty")?.value || state.difficulty;
  state.stadium = document.getElementById("stadium")?.value || state.stadium;
  game = { inning:1, top:true, outs:0, balls:0, strikes:0, awayRuns:0, homeRuns:0, pitch:0, plays:[], score:[[],[]] };
  renderGame();
}

function renderGame() {
  app.innerHTML = `<section class="screen game-screen">
    <div class="scorebug">
      <div class="score-team">${state.away.abbr}<strong>${state.away.name}</strong></div>
      <div class="inning-score">
        <div></div>${Array.from({length:9},(_,i)=>`<div class="score-cell ${i===game.inning-1?'active':''}">${i+1}</div>`).join("")}<div class="score-cell">R</div><div class="score-cell">H</div>
        <div>${state.away.abbr}</div>${Array.from({length:9},(_,i)=>`<div class="score-cell">${game.score[0][i] ?? ''}</div>`).join("")}<div class="score-cell">${game.awayRuns}</div><div class="score-cell">${game.awayRuns?game.awayRuns:0}</div>
        <div>${state.home.abbr}</div>${Array.from({length:9},(_,i)=>`<div class="score-cell">${game.score[1][i] ?? ''}</div>`).join("")}<div class="score-cell">${game.homeRuns}</div><div class="score-cell">${game.homeRuns?game.homeRuns:0}</div>
      </div>
    </div>
    <div class="ballpark"><div class="field"><div class="diamond"><i class="base first"></i><i class="base second"></i><i class="base third"></i><i class="base home"></i></div></div>
      <div class="player pitcher" style="--jersey:${state.home.color}"></div><div class="player batter" style="--jersey:${state.away.color}"></div>
      <div class="game-controls">
        <div class="pitch-panel"><div style="display:flex;justify-content:space-between"><strong>PITCH</strong><span>B ${game.balls} · S ${game.strikes} · OUT ${game.outs}</span></div>
          <div class="target" id="target"><div class="reticle" id="reticle"></div></div>
          <div class="pitch-types"><button class="active" data-pitch="Fastball">FB</button><button data-pitch="Slider">SL</button><button data-pitch="Changeup">CH</button></div>
        </div>
        <div class="swing-panel"><strong>BATTLE AT THE PLATE</strong><br><button id="swingBtn">SWING</button></div>
      </div>
    </div>
  </section>`;
  bindGame();
}

function bindGame() {
  document.querySelectorAll(".pitch-types button").forEach(btn=>btn.onclick=()=>{
    document.querySelectorAll(".pitch-types button").forEach(b=>b.classList.remove("active")); btn.classList.add("active");
  });
  const target=document.getElementById("target"), reticle=document.getElementById("reticle");
  target.onmousemove=e=>{ const r=target.getBoundingClientRect(); reticle.style.left=`${e.clientX-r.left}px`; reticle.style.top=`${e.clientY-r.top}px`; };
  document.queryWith = null;
  document.getElementById("swingBtn").onclick=()=>resolvePitch(false);
  target.onclick=()=>resolvePitch(true);
}

function resolvePitch(pitched) {
  if (!game || document.querySelector(".ball")) return;
  const target=document.getElementById("target"), reticle=document.getElementById("reticle");
  const tr=target.getBoundingRect?.();
  const ball=document.createElement("div"); ball.className="ball"; document.querySelector(".ballpark").appendChild(ball);
  const start={left:window.innerWidth*.5,top:window.innerHeight*.48};
  const end={left:window.innerWidth*.5+(Math.random()*180-90),top:window.innerHeight*.62+(Math.random()*70-35)};
  let x=start.left,y=start.top,t=0;
  const timer=setInterval(()=>{
    t+=.035; x=start.left+(end.left-start.left)*t; y=start.top+(end.top-start.top)*t; ball.style.left=`${x}px`; ball.style.top=`${y}px`;
    if(t>=1){ clearInterval(timer); ball.remove(); completePlateAppearance(pitched); }
  },16);
}

function completePlateAppearance(pitchTarget) {
  const roll=Math.random();
  if (!pitchTarget) { 
    if (roll<.28) { game.strikes++; game.plays.push("Swinging strike."); }
    else if (roll<.55) { game.balls++; game.plays.push("Ball outside the zone."); }
    else { game.balls++; game.plays.push("Ball low and away."); }
  } else {
    if (roll<.18) { game.outs++; game.plays.push("Ground ball to short — 6-3 out."); }
    else if (roll<.34) { game.outs++; game.plays.push("Lineout caught by the center fielder."); }
    else if (roll<.47) { 
      game.awayRuns++; game.plays.push("Home run to the left-center gap!");
    } else if (roll<.68) { game.outs++; game.plays.push("Called strike three."); }
    else { game.balls++; game.plays.push("Pitch taken for a ball."); }
  }
  if(game.strikes>=3 || game.outs>=3 || game.balls>=4){
    if(game.strikes>=3){ game.outs++; game.plays.push("Strikeout."); }
    if(game.balls>=4){ game.awayRuns++; game.plays.push("Walk advances the runner and scores."); }
    game.balls=0; game.strikes=0;
  }
  if(game.outs>=3){
    game.score[game.top?0:1][game.inning-1]=game.top?game.awayRuns:game.homeRuns;
    game.outs=0; game.balls=0; game.strikes=0;
    if(game.top){ game.top=false; }
    else { game.top=true; game.inning++; }
  }
  if(game.inning>state.innings){ renderSummary(); } else renderGame();
}

function renderSummary() {
  app.innerHTML = `<section class="screen summary-screen">${topbar()}<div class="summary-wrap">
    <div class="eyebrow">Final</div><h1>Game Summary</h1>
    <div class="scoreboard"><div><strong>Team</strong></div>${Array.from({length:9},(_,i)=>`<div>${i+1}</div>`).join("")}<div>R</div>
      <div><strong>${state.away.abbr}</strong></div>${Array.from({length:9},(_,i)=>`<div>${game.score[0][i] ?? 0}</div>`).join("")}<div>${game.awayRuns}</div>
      <div><strong>${state.home.abbr}</strong></div>${Array.from({length:9},(_,i)=>`<div>${game.score[1][i] ?? 0}</div>`).join("")}<div>${game.homeRuns}</div>
    </div>
    <div class="summary-columns"><div class="summary-card"><h3>Box Score</h3><div class="play"><strong>${state.away.name}</strong><br>Runs ${game.awayRuns} · Hits ${game.awayRuns}</div><div class="play"><strong>${state.home.name}</strong><br>Runs ${game.homeRuns} · Hits ${game.homeRuns}</div></div>
      <div class="summary-card"><h3>Important Plays</h3>${game.plays.slice(-6).map(p=>`<div class="play">${p}</div>`).join("")}</div></div>
    <div class="actions"><button class="secondary-btn" data-action="quick">Rematch</button><button class="primary-btn" data-action="home">Main Menu</button></div>
  </div></section>`;
}

app.addEventListener("click",e=>{
  const action=e.target.closest("[data-action]")?.dataset.action;
  if(action){ if(action==="quick"||action==="teams")renderTeamSelect(); if(action==="settings")renderSettings(); if(action==="play")startGame(); if(action==="home")renderMain(); }
  const team=e.target.closest("[data-team]");
  if(team){ state.away=teams[Number(team.dataset.team)]; renderTeamSelect(); }
});

renderMain();
