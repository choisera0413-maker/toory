const fs=require('fs'),vm=require('vm'),assert=require('assert');
const nodes=new Map();function node(id){if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',style:{},dataset:{},append(){},setAttribute(){},classList:{toggle(){}},getBoundingClientRect(){return{width:500,left:0,top:0}},getContext(){return{scale(){},clearRect(){}}},showModal(){}});return nodes.get(id)}
const sandbox={console,Date,Math,Set,JSON,localStorage:{getItem(){return null},setItem(){}},document:{querySelector:node,querySelectorAll(){return[]},createElement:()=>node('created')},window:{},devicePixelRatio:1,setInterval(){return 1},clearInterval(){}};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync('dist/voices.js','utf8'),sandbox);
sandbox.window.ToriMagic={cancel(){},mount(){},react(){},play(text){assert(sandbox.window.TORI_VOICES[text],`Missing voice: ${text}`)}};
for(const file of Object.values(sandbox.window.TORI_VOICES)){assert(fs.statSync('dist/'+file).size>1000,`Invalid clip: ${file}`)}
vm.runInContext(fs.readFileSync('dist/app.js','utf8'),sandbox);
vm.runInContext(`
for(let level=0;level<units.length;level++){
 data.unit=level;
 for(let activity=0;activity<5;activity++){
  start(activity,false);
  if(!$('#app').innerHTML.includes('panel'))throw Error('Missing activity screen');
  if(!session.items.length)throw Error('No learning content');
  session.items.forEach((item,index)=>{session.index=index;question();speak(item);if(activity===1){if(!session.initial||!session.vowel)throw Error('Invalid Hangul decomposition');speak(session.initial+'과 '+session.vowel+'가 만나면 '+item+'. '+item+' 하고 읽어요.');}});
  session.index=0;question();
  if(activity!==3){const target=activity===4?current().answer:session.items[0];check('incorrect',target);if(session.checked)throw Error('Incorrect answer accepted');check(target,target);if(!session.checked)throw Error('Correct answer rejected');}
  finish();
 }
}
const earned=data.stars;start(0,false);finish();if(data.stars!==earned)throw Error('Duplicate reward');
state.page='map';render();state.page='collection';render();diagnose();
`,sandbox);
assert(nodes.get('#app').innerHTML.includes('출발점'));console.log('PASS: 30 activity screens, all voice files, learning/feedback voice coverage, Hangul decomposition, answer handling, reward deduplication and navigation.');
