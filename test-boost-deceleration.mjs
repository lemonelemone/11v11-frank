import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {setTimeout as wait} from "node:timers/promises";
const cwd=new URL(".",import.meta.url).pathname.replace(/^\/(.:)/,"$1"),child=spawn(process.execPath,["server.mjs"],{cwd,env:{...process.env,NC11_HOST:"127.0.0.1",NC11_PORT:"18116",NC11_TESTING:"1",NC11_INACTIVITY_KICK_MS:"999999"},stdio:"pipe"});let log="";child.stdout.on("data",b=>log+=b);child.stderr.on("data",b=>log+=b);
for(let i=0;i<80;i++){try{if((await fetch("http://127.0.0.1:18116/health",{signal:AbortSignal.timeout(100)})).ok)break;}catch{}if(i===79)throw Error(log);await wait(50);}
const messages=[],ws=new WebSocket("ws://127.0.0.1:18116/?name=Decel&clientId=decel");await new Promise((resolve,reject)=>{ws.onmessage=e=>{const m=JSON.parse(e.data);messages.push(m);if(m.t==="welcome")resolve();};ws.onerror=reject;});
async function state(predicate,timeout=7000){const start=Date.now(),seen=messages.length;while(Date.now()-start<timeout){const found=messages.slice(seen).find(m=>m.t==="state"&&predicate(m));if(found)return {found,elapsed:Date.now()-start};await wait(10);}throw Error("state timeout");}
try{
 await state(m=>m.phase==="playing");const slot=messages.find(m=>m.t==="welcome").slot;
 async function decel(multiplier){ws.send(JSON.stringify({t:"adminLogin",password:"Chicken999!"}));await wait(30);ws.send(JSON.stringify({t:"adminSet",rules:{boostDeceleration:multiplier}}));await wait(30);ws.send(JSON.stringify({t:"testVelocity",vx:24,vy:0}));ws.send(JSON.stringify({t:"input",x:1,y:0,boost:false,brake:false}));await state(m=>Math.hypot(m.p[slot][4],m.p[slot][5])>20);return (await state(m=>Math.hypot(m.p[slot][4],m.p[slot][5])<=12.5)).elapsed;}
 const normalMs=await decel(1),fastMs=await decel(4);assert.ok(normalMs>1500&&normalMs<5000,`default decay ${normalMs} ms`);assert.ok(fastMs<normalMs*.45,`4x decay ${fastMs} ms vs ${normalMs} ms`);console.log(JSON.stringify({defaultMs:normalMs,fourTimesMs:fastMs}));
}finally{ws.close();child.kill();}
