const $=id=>document.getElementById(id);let audio=$('audio');
let ctx,node,gain,source,running=false,starting=false,muted=false,wake;
let delay=30;try{const saved=Number(localStorage.getItem('jags-delay'));if(localStorage.getItem('jags-delay')!==null&&Number.isFinite(saved))delay=Math.max(0,Math.min(180,saved));}catch{}
function paint(){ $('delay').value=delay;$('delayValue').textContent=delay.toFixed(2); }
function save(){try{localStorage.setItem('jags-delay',String(delay));}catch{}}
function setDelay(value){delay=Math.max(0,Math.min(180,value));paint();save();node?.port.postMessage({delay});}
paint();$('delay').oninput=e=>setDelay(Number(e.target.value));document.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>setDelay(delay+Number(b.dataset.step)));
function status(text){$('status').textContent=text;}
async function stop(){starting=false;running=false;$('start').disabled=false;audio.pause();audio.removeAttribute('src');audio.load();node?.disconnect();node=null;await ctx?.close().catch(()=>{});ctx=null;await wake?.release().catch(()=>{});wake=null;$('start').textContent='▶  Start listening';$('hold').disabled=true;$('mute').disabled=true;$('light').classList.remove('on');$('hold').classList.remove('active');}
$('start').onclick=async()=>{
 if(running||starting){await stop();status('Stopped. Start again to build a fresh buffer.');return;}
 starting=true;$('start').disabled=true;$('start').textContent='■  Stop';status('Connecting to WHOG…');
 try{
 audio=new Audio();audio.crossOrigin='anonymous';attachAudioEvents();ctx=new AudioContext();await ctx.resume();await ctx.audioWorklet.addModule('./delay-worklet.js');
 node=new AudioWorkletNode(ctx,'radio-delay',{outputChannelCount:[2]});gain=ctx.createGain();gain.gain.value=muted?0:Number($('volume').value);source=ctx.createMediaElementSource(audio);source.connect(node).connect(gain).connect(ctx.destination);node.port.postMessage({delay});
 node.port.onmessage=({data})=>{if(!running)return;delay=data.delay;paint();if(data.hold){status('Holding audio — release when TV catches up.');}else if(data.buffered<delay){status(`Filling delay buffer · ${Math.ceil(delay-data.buffered)}s remaining`);}else{status(`Playing WHOG with ${delay.toFixed(2)}s of added delay`);}};
 audio.src='https://ssc.streamguys1.com/whog-icy';let connectTimer;try{await Promise.race([audio.play(),new Promise((_,reject)=>{connectTimer=setTimeout(()=>reject(new Error('Connection timed out')),20000);})]);}finally{clearTimeout(connectTimer);}running=true;starting=false;$('start').disabled=false;$('light').classList.add('on');$('hold').disabled=false;$('mute').disabled=false;
 try{wake=await navigator.wakeLock?.request('screen');}catch{}
 }catch(e){await stop();status('Could not play WHOG. Try again, or check the original player below.');console.error(e);}
};
function attachAudioEvents(){audio.addEventListener('waiting',()=>{if(running)status('Stream buffering — sync may need adjusting when playback resumes.');});
audio.addEventListener('error',()=>{if(running){stop();status('WHOG disconnected. Start again to reconnect and rebuild your delay.');}});
}
$('volume').oninput=()=>{if(gain)gain.gain.setTargetAtTime(muted?0:Number($('volume').value),ctx.currentTime,.02);};
$('mute').onclick=()=>{muted=!muted;$('mute').textContent=muted?'Unmute':'Mute';$('mute').setAttribute('aria-pressed',String(muted));$('volume').oninput();};
let holding=false;
function hold(){if(!running||holding)return;holding=true;node.port.postMessage({hold:true});$('hold').classList.add('active');}
function release(){if(!holding)return;holding=false;node?.port.postMessage({hold:false});$('hold').classList.remove('active');save();}
$('hold').onpointerdown=e=>{e.preventDefault();$('hold').setPointerCapture(e.pointerId);hold();};$('hold').onpointerup=release;$('hold').onpointercancel=release;$('hold').onlostpointercapture=release;
$('hold').onkeydown=e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();hold();}};$('hold').onkeyup=e=>{if(e.key===' '||e.key==='Enter')release();};window.addEventListener('blur',release);
document.addEventListener('visibilitychange',async()=>{release();if(document.visibilityState==='visible'&&running){try{await ctx.resume();if(!wake||wake.released)wake=await navigator.wakeLock?.request('screen');}catch{}}});
