/* render.js - canvas drawing for the board, search tree and statistics */
// ---------- rendering ----------
function render(){drawBoard();drawTree();stats()}
function stats(){const tot=S.nodes+S.pruned,pr=tot?S.pruned/tot*100:0;
 $('stats').innerHTML=[['Nodes explored',S.nodes],['Values pruned',S.pruned],['Backtracks',S.back],['Placements tried',S.tried],['Solutions',S.sol],['Max depth',S.depth]]
 .map(([l,v])=>`<div class="stat"><b>${v.toLocaleString()}</b><span>${l}</span></div>`).join('');
 $('split').innerHTML=`<i style="width:${100-pr}%;background:var(--ok)"></i><i style="width:${pr}%;background:var(--bad)"></i>`;
 const lg=csp.dom.reduce((s,d)=>s+Math.log10(d.length),0);
 $('space').textContent=`Raw search space is about 10^${lg.toFixed(1)} assignments. This run explored ${S.nodes.toLocaleString()} nodes and pruned ${pr.toFixed(0)}% of the values it considered.`}
function drawBoard(){const c=$('board'),d=window.devicePixelRatio||1;if(c.width!==520*d){c.width=c.height=520*d}
 const x=c.getContext('2d');x.setTransform(d,0,0,d,0,0);const W=520,n=csp.n;x.clearRect(0,0,W,W);
 const show=S.done&&S.last?S.last:S.asg,ink=css('--ink'),bad=css('--bad'),acc=css('--acc');x.textAlign='center';x.textBaseline='middle';
 if(csp.kind==='q'){const s=W/n;for(let r=0;r<n;r++)for(let k=0;k<n;k++){x.fillStyle=(r+k)%2?css('--sq2'):css('--sq1');x.fillRect(k*s,r*s,s,s);
  if(opts.fc&&!S.done&&S.dom&&show[r]<0&&!S.dom[r].includes(k)){x.fillStyle=bad;x.globalAlpha=.2;x.fillRect(k*s,r*s,s,s);x.globalAlpha=1}
  if(show[r]===k){x.fillStyle=acc;x.font=`${s*.78}px serif`;x.fillText('\u265B',k*s+s/2,r*s+s/2+s*.04)}}
  if(S.flash&&!S.done){const{v,a}=S.flash;x.strokeStyle=bad;x.lineWidth=3;x.strokeRect(a*s+3,v*s+3,s-6,s-6)}}
 else if(csp.kind==='s'){const s=W/9;if(S.flash&&!S.done){x.fillStyle=bad;x.globalAlpha=.25;x.fillRect(S.flash.v%9*s,(S.flash.v/9|0)*s,s,s);x.globalAlpha=1}
  for(let i=0;i<81;i++){const g=csp.given[i],v=g||(show[i]>=0?show[i]+1:0);if(!v)continue;x.font=`${g?'700':'400'} ${s*.55}px Sora,sans-serif`;x.fillStyle=g?ink:acc;x.fillText(v,i%9*s+s/2,(i/9|0)*s+s/2)}
  for(let i=0;i<=9;i++){x.strokeStyle=css('--line');x.lineWidth=i%3?1:3;if(i%3===0)x.strokeStyle=ink;x.beginPath();x.moveTo(i*s,0);x.lineTo(i*s,W);x.moveTo(0,i*s);x.lineTo(W,i*s);x.stroke()}}
 else{const g=csp.g,P=['#e4572e','#29a3a3','#f2b134','#7a5cff'],pt=g.pos.map(p=>[p[0]*W*.88+W*.06,p[1]*W*.88+W*.06]);
  x.strokeStyle=css('--mut');x.lineWidth=2;g.edges.forEach(([a,b])=>{x.beginPath();x.moveTo(...pt[a]);x.lineTo(...pt[b]);x.stroke()});
  pt.forEach((p,i)=>{x.beginPath();x.arc(p[0],p[1],26,0,7);x.fillStyle=show[i]>=0?P[show[i]]:css('--panel');x.fill();
   x.lineWidth=S.flash&&S.flash.v===i&&!S.done?5:2;x.strokeStyle=S.flash&&S.flash.v===i&&!S.done?bad:ink;x.stroke();
   x.fillStyle=show[i]>=0?'#111':ink;x.font='600 15px Sora,sans-serif';x.fillText(g.names[i],p[0],p[1])})}}
function drawTree(){const c=$('tree'),d=window.devicePixelRatio||1,W=c.clientWidth||1000,H=280;if(c.width!==Math.round(W*d)){c.width=Math.round(W*d);c.height=H*d}
 const x=c.getContext('2d');x.setTransform(d,0,0,d,0,0);x.clearRect(0,0,W,H);const T=S.tree,N=T.par.length;if(!N){x.fillStyle=css('--mut');x.font='13px Sora,sans-serif';x.fillText('The tree appears as the search runs.',12,24);return}
 const md=Math.max(1,...T.dp),dx=Math.min(30,(W-24)/(md+1)),dy=Math.min(14,(H-16)/N),r=N>1500?1.4:N>400?2:3;
 const X=i=>10+T.dp[i]*dx,Y=i=>8+i*dy;x.strokeStyle=css('--line');x.lineWidth=1;x.beginPath();
 for(let i=0;i<N;i++)if(T.par[i]>=0){x.moveTo(X(T.par[i]),Y(T.par[i]));x.lineTo(X(i),Y(i))}x.stroke();
 const col={ok:css('--ok'),x:css('--bad')};
 for(let i=0;i<N;i++){x.fillStyle=col[T.st[i]];x.beginPath();x.arc(X(i),Y(i),r,0,7);x.fill()}
 if(S.cur>=0&&!S.done){x.strokeStyle=css('--acc');x.lineWidth=2;x.beginPath();x.arc(X(S.cur),Y(S.cur),r+3,0,7);x.stroke()}}
