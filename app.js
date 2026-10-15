/* app.js - state, controls, animation loop and algorithm comparison */
// ---------- app state ----------
let csp,S,gen,timer=null,running=false,opts;
function readOpts(){const a=$('alg').value;return{fc:a!=='bt',mrv:a==='fcmrv',all:$('all').checked&&$('prob').value==='q'}}
function build(){const p=$('prob').value,n=+$('n').value;
 if(p==='q')return queens(Math.min(20,Math.max(4,n||8)));
 if(p==='s')return sudoku($('ex').value==='hard'?HARD:EASY);
 return coloring(GR[$('ex').value],Math.min(4,Math.max(2,n||3)))}
function reset(){stop();csp=build();opts=readOpts();S=newStats(csp);gen=null;$('msg').textContent='Ready. Press Start, or Step through one move at a time.';render()}
function stop(){running=false;cancelAnimationFrame(timer);$('go').textContent='Start'}
function finish(){S.done=true;stop();$('msg').textContent=S.limited?'Stopped at the step limit. Try forward checking + MRV.':
 S.sol?(opts.all?S.sol+' solutions found.':'Solution found.'):'No solution exists for this instance.'}
function step(){if(S.done)return;if(!gen)gen=search(csp,opts,S);if(gen.next().done)finish();}
let lastT=0,acc=0;
function frame(t){if(!running)return;const sps=Math.pow(10,$('spd').value/100*3.5);acc+=Math.min(100,t-lastT)*sps/1000;lastT=t;
 let k=Math.min(2000,Math.floor(acc));acc-=k;while(k-->0&&!S.done)step();render();if(!S.done)timer=requestAnimationFrame(frame)}
$('go').onclick=()=>{if(S.done)reset();if(running){stop();return}running=true;$('go').textContent='Pause';lastT=performance.now();timer=requestAnimationFrame(frame)};
$('stp').onclick=()=>{if(S.done)reset();stop();step();render()};
$('inst').onclick=()=>{if(S.done)reset();stop();if(!gen)gen=search(csp,opts,S);for(const _ of gen);finish();render()};
$('rst').onclick=reset;
['prob','n','ex','alg','all'].forEach(i=>$(i).onchange=()=>{if(i==='prob')setupProb();reset()});
function setupProb(){const p=$('prob').value,ex=$('ex'),n=$('n');
 $('nlw').style.display=p==='s'?'none':'';$('exw').style.display=p==='q'?'none':'';$('allw').style.display=p==='q'?'':'none';
 if(p==='q'){$('nl').textContent='Board size N';n.min=4;n.max=20;n.value=8;$('alg').value='fc'}
 if(p==='s'){ex.innerHTML='<option value="easy">Easy puzzle</option><option value="hard">Hard puzzle (17 clues-class)</option>';$('alg').value='fcmrv'}
 if(p==='g'){$('nl').textContent='Colors';n.min=2;n.max=4;n.value=3;ex.innerHTML='<option value="aus">Australia map (7 regions)</option><option value="pet">Petersen graph (10 nodes)</option>';$('alg').value='fc'}}
// ---------- comparison ----------
$('cmp').onclick=()=>{const b=$('cmp');b.disabled=true;$('ct').innerHTML='<tr><td>Running...</td></tr>';
 setTimeout(()=>{const rows=[['Plain backtracking',{fc:0,mrv:0}],['Forward checking',{fc:1,mrv:0}],['Forward checking + MRV',{fc:1,mrv:1}]],base=readOpts(),cs=build();
  let h='<tr><th>Algorithm</th><th>Nodes</th><th>Pruned</th><th>Backtracks</th><th>ms</th></tr>';
  for(const[nm,o]of rows){const s=newStats(cs,true);s.limit=3e6;const t=performance.now();for(const _ of search(cs,{...o,all:base.all},s));
   h+=`<tr><td>${nm}</td><td>${s.nodes.toLocaleString()}${s.limited?'+':''}</td><td>${s.pruned.toLocaleString()}</td><td>${s.back.toLocaleString()}</td><td>${Math.round(performance.now()-t)}</td></tr>`}
  $('ct').innerHTML=h;b.disabled=false},30)};
window.addEventListener('resize',()=>drawTree());
matchMedia('(prefers-color-scheme:dark)').addEventListener('change',()=>render());
setupProb();$('alg').value='fc';reset();
