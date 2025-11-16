const fs = require('fs');
const s = fs.readFileSync('app/simulation/page.tsx','utf8');
let stack = [];
let i=0;
while(i<s.length){
  if(s[i]==='<'){
    if(s.substr(i,4)==='<!--'){
      const end=s.indexOf('-->',i+4);
      i = end===-1?s.length:end+3; continue;
    }
    const close = s.slice(i).match(/^<\s*\/\s*([A-Za-z0-9_:\-]+)\s*>/);
    if(close){ stack.push({type:'close',tag:close[1],pos:i}); i+=close[0].length; continue;}
    const open = s.slice(i).match(/^<\s*([A-Za-z0-9_:\-]+)([^>]*)>/);
    if(open){
      const tag=open[1];
      const rest=open[2];
      if(/\/\s*>$/.test(open[0]) || /\/\s*>/.test(rest)){
      } else {
        const voids=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
        if(!voids.has(tag.toLowerCase())) stack.push({type:'open',tag,pos:i});
      }
      i+=open[0].length; continue;
    }
  }
  i++;
}
let opens=[];
for(const item of stack){
  if(item.type==='open') opens.push(item);
  else if(item.type==='close'){
    if(opens.length>0 && opens[opens.length-1].tag.toLowerCase()===item.tag.toLowerCase()) opens.pop();
    else{
      let found=false;
      for(let k=opens.length-1;k>=0;k--){
        if(opens[k].tag.toLowerCase()===item.tag.toLowerCase()){ opens.splice(k,1); found=true; break; }
      }
      if(!found){ console.log('Unmatched closing tag',item.tag,'at',item.pos); }
    }
  }
}
if(opens.length){
  console.log('Unclosed tags at end:');
  opens.forEach(o=>console.log(o.tag,'pos',o.pos));
} else console.log('All tags matched (naive)');
