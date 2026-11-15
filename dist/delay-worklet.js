class RadioDelay extends AudioWorkletProcessor {
 constructor(){super();this.capacity=Math.ceil(sampleRate*181);this.rings=[new Float32Array(this.capacity),new Float32Array(this.capacity)];this.write=0;this.frames=0;this.delay=30;this.hold=false;this.lastReport=0;this.port.onmessage=({data})=>{if(data.delay!==undefined)this.delay=data.delay;if(data.hold!==undefined)this.hold=data.hold;};}
 process(inputs,outputs){const input=inputs[0],out=outputs[0];if(!input?.[0])return true;
 for(let i=0;i<out[0].length;i++){
  if(this.hold)this.delay=Math.min(180,this.delay+1/sampleRate);
  const offset=Math.round(this.delay*sampleRate),ready=this.frames>=offset;
  const read=(this.write-offset+this.capacity)%this.capacity;
  for(let ch=0;ch<2;ch++){this.rings[ch][this.write]=input[Math.min(ch,input.length-1)][i];if(out[ch])out[ch][i]=ready&&!this.hold?this.rings[ch][read]:0;}
  this.write=(this.write+1)%this.capacity;this.frames++;
 }
 if(this.frames-this.lastReport>sampleRate/5){this.lastReport=this.frames;this.port.postMessage({delay:this.delay,buffered:this.frames/sampleRate,hold:this.hold});}return true;
 }
}registerProcessor('radio-delay',RadioDelay);
