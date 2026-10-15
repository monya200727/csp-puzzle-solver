/* solver.js - generic CSP solver: backtracking + forward checking + MRV.
   Written as a generator so every step can be animated. */
// ---------- generic solver (generator, so every step can be animated) ----------
function newStats(csp,noTree){return{tried:0,nodes:0,pruned:0,back:0,sol:0,depth:0,steps:0,limit:5e6,limited:false,done:false,last:null,flash:null,cur:-1,noTree,
 asg:new Array(csp.n).fill(-1),dom:null,tree:{par:[],dp:[],st:[]}}}
function addNode(S,par,st){if(S.noTree)return -1;const T=S.tree;if(T.par.length>=4000)return -1;
 T.par.push(par);T.dp.push(par>=0?T.dp[par]+1:0);T.st.push(st);return T.par.length-1}
function* search(csp,o,S){
 const n=csp.n,asg=S.asg,dom=csp.dom.map(d=>d.slice());S.dom=dom;
 function pick(){let b=-1,bs=1e9;for(let i=0;i<n;i++)if(asg[i]<0){if(!o.mrv)return i;if(dom[i].length<bs){bs=dom[i].length;b=i}}return b}
 function* rec(depth,par){
  if(depth===n){S.sol++;S.last=asg.slice();yield 0;return !o.all}
  const v=pick();
  for(const a of dom[v].slice()){
   if(++S.steps>S.limit){S.limited=true;return true}
   S.tried++;let bad=false;
   if(!o.fc)for(const u of csp.nb[v])if(asg[u]>=0&&csp.conf(v,a,u,asg[u])){bad=true;break}
   const id=addNode(S,par,bad?'x':'ok');S.cur=id;S.flash=null;
   if(bad){S.pruned++;S.flash={v,a};yield 0;continue}
   asg[v]=a;S.nodes++;if(depth+1>S.depth)S.depth=depth+1;
   const rem=[];let wipe=false;
   if(o.fc)for(const u of csp.nb[v])if(asg[u]<0){const keep=[];let gone=0;
    for(const b of dom[u])if(csp.conf(v,a,u,b))gone++;else keep.push(b);
    if(gone){rem.push([u,dom[u]]);dom[u]=keep;S.pruned+=gone}
    if(!keep.length){wipe=true;break}}
   yield 0;
   if(wipe){if(id>=0)S.tree.st[id]='x'}
   else if(yield* rec(depth+1,id)){return true}
   for(const[u,d]of rem)dom[u]=d;
   asg[v]=-1;S.back++;yield 0;
  }
  return false}
 yield* rec(0,-1)}
