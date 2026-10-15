/* problems.js - problem definitions (variables, domains, constraints)
   N-Queens, Sudoku and Graph Coloring all plug into the same solver. */
const EASY="530070000600195000098000060800060003400803001700020006060000280000419005000080079";
const HARD="800000000003600000070090200050007000000045700000100030001000068008500010090000400";
// ---------- CSP builders (variables, domains, binary constraints) ----------
function queens(n){const d=[...Array(n).keys()];return{kind:'q',n,dom:Array.from({length:n},()=>d),
 nb:Array.from({length:n},(_,i)=>d.filter(j=>j!==i)),conf:(i,a,j,b)=>a===b||Math.abs(a-b)===Math.abs(i-j)};}
function coloring(g,k){const nb=g.names.map(()=>[]);g.edges.forEach(([a,b])=>{nb[a].push(b);nb[b].push(a)});
 return{kind:'g',n:g.names.length,g,k,dom:g.names.map(()=>[...Array(k).keys()]),nb,conf:(i,a,j,b)=>a===b};}
function sudoku(s){const nb=[],dom=[],given=[];for(let i=0;i<81;i++){const r=i/9|0,c=i%9,x=[];
 for(let j=0;j<81;j++){if(j===i)continue;const r2=j/9|0,c2=j%9;if(r===r2||c===c2||((r/3|0)===(r2/3|0)&&(c/3|0)===(c2/3|0)))x.push(j)}
 nb.push(x);const v=+s[i];given.push(v);dom.push(v?[v-1]:[0,1,2,3,4,5,6,7,8])}
 return{kind:'s',n:81,dom,nb,given,conf:(i,a,j,b)=>a===b};}
const GR={aus:{names:['WA','NT','SA','Q','NSW','V','T'],edges:[[0,1],[0,2],[1,2],[1,3],[2,3],[2,4],[2,5],[3,4],[4,5]],
 pos:[[.12,.5],[.38,.18],[.45,.55],[.78,.22],[.82,.58],[.66,.82],[.82,.93]]}};
(()=>{const names='ABCDEFGHIJ'.split(''),edges=[],pos=[];for(let i=0;i<5;i++){edges.push([i,(i+1)%5],[i+5,(i+2)%5+5],[i,i+5]);
 const t=-Math.PI/2+i*2*Math.PI/5;pos[i]=[.5+.4*Math.cos(t),.5+.4*Math.sin(t)];pos[i+5]=[.5+.2*Math.cos(t),.5+.2*Math.sin(t)]}
 GR.pet={names,edges,pos}})();
