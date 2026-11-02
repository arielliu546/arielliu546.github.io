'use strict';
// This score compares a recognition transcript to a sentence. It does not assess phonetics.
function normalizeSpeech(text){
 const digits='零一二三四五六七八九';
 return String(text??'').normalize('NFKC').toLowerCase().replace(/\d+/g,n=>{
  const v=Number(n);if(v>99||n.length>2)return n;
  return v<10?digits[v]:(v>=20?digits[Math.floor(v/10)]:'')+'十'+(v%10?digits[v%10]:'');
 }).replace(/[^\p{L}\p{N}]/gu,'');
}
function compareSpeech(target,transcript){
 const a=Array.from(normalizeSpeech(target)),b=Array.from(normalizeSpeech(transcript));
 if(!a.length||!b.length)return null;
 const dp=Array.from({length:a.length+1},()=>Array(b.length+1).fill(0));
 for(let i=0;i<=a.length;i++)dp[i][0]=i;for(let j=0;j<=b.length;j++)dp[0][j]=j;
 for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)dp[i][j]=Math.min(dp[i-1][j]+1,dp[i][j-1]+1,dp[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
 const aligned=[];let i=a.length,j=b.length;
 while(i||j){if(i&&j&&dp[i][j]===dp[i-1][j-1]+(a[i-1]===b[j-1]?0:1)){aligned.push({type:a[i-1]===b[j-1]?'match':'replace',expected:a[--i],heard:b[--j]});}else if(i&&dp[i][j]===dp[i-1][j]+1){aligned.push({type:'missing',expected:a[--i],heard:''});}else{aligned.push({type:'extra',expected:'',heard:b[--j]});}}
 aligned.reverse();const distance=dp[a.length][b.length];
 return {score:Math.round(100*(1-distance/Math.max(a.length,b.length))),distance,aligned};
}
let speechId='0-1',speechRecognition=null,speechTimer=null;
function speechTarget(){return allPhrases().find(p=>p.id===speechId)||allPhrases()[1];}
function speechAvailability(){if(!(window.SpeechRecognition||window.webkitSpeechRecognition))return 'このブラウザには音声認識がありません。対応ブラウザ（Chromeなど）でお試しください。';if(location.protocol==='file:')return '音声認識はHTTPSのサイト、または localhost で開いてご利用ください。ファイルを直接開いた状態では使えません。';if(!window.isSecureContext)return '音声認識はHTTPS、または localhost の安全なページでご利用ください。';return '';}
function speechPage(id){speechId=allPhrases().some(p=>p.id===id)?id:'0-1';const p=speechTarget(),reason=speechAvailability();
 app.innerHTML=`<div class="eyebrow">SAY IT, ONE SENTENCE AT A TIME</div><h1>会話練習</h1><p class="muted">レッスンやフレーズ帳から1文選び、聞く → 声に出す → 認識結果を確認。</p><section class="panel"><label for="speech-select">練習するフレーズ</label><select id="speech-select">${allPhrases().map(p=>`<option value="${esc(p.id)}" ${p.id===speechId?'selected':''}>${p.custom?'フレーズ帳':'LESSON '+String(p.lesson+1).padStart(2,'0')} · ${esc(p.line[0])}</option>`).join('')}</select><div class="speech-target"><p lang="zh-CN">${esc(p.line[0])}</p><div class="pinyin">${esc(p.line[1])}</div><div class="muted">${esc(p.line[2])}</div></div><div class="toolbar"><button class="pill" data-action="speech-demo">▷ お手本を聞く</button><button class="primary" id="speech-start" data-action="speech-start" ${reason?'disabled':''}>● 話してチェック</button><button class="pill" id="speech-stop" data-action="speech-stop" disabled>■ 話し終わった</button></div><p class="muted" style="margin-top:18px;font-size:11px">「話してチェック」でマイクを使用します。音声はブラウザ提供元の認識サービスへ送信される場合があります。このサイトは音声や認識結果を保存しません。</p><div id="speech-status" role="status" aria-live="polite">${esc(reason||'お手本を聞いてから、ボタンを押して1文を話しましょう。最大30秒です。')}</div><div id="speech-result" aria-live="polite"></div></section><div class="tip"><b>このスコアについて</b>これは「認識された文章」と例文の一致度です（0〜100）。句読点・空白と、0〜99の算用数字／漢数字の表記差は無視します。声調・口の形・発音の正確さは採点しません。人名・地名は正しく話しても誤認識されることがあります。洋介（Yángjiè）、茨城（Cíchéng）は特に、お手本とも聞き比べてください。</div><p class="muted" style="margin-top:22px">うまく認識されないときは、静かな場所で、口元とマイクの距離を調整しましょう。点数は練習の目安です。</p><a class="text-link" href="#lesson/${p.lesson??0}">← レッスンに戻る</a>`;
 $('#speech-select').addEventListener('change',e=>{location.hash='#speech/'+e.target.value;});
}
function cancelSpeech(){clearTimeout(speechTimer);if(speechRecognition){const r=speechRecognition;speechRecognition=null;r.onresult=r.onerror=r.onend=null;try{r.abort();}catch{}resetSpeechControls();}}
function finishSpeech(){clearTimeout(speechTimer);if(speechRecognition){const r=speechRecognition;speechTimer=setTimeout(()=>{cancelSpeech();resetSpeechControls();speechMessage('認識が完了しませんでした。もう一度お試しください。');},5000);try{r.stop();}catch{cancelSpeech();}}}
function speechMessage(text){const e=$('#speech-status');if(e)e.textContent=text;}
function resetSpeechControls(){const start=$('#speech-start'),stop=$('#speech-stop');if(start){start.disabled=!!speechAvailability();start.textContent='● もう一度チェック';}if(stop)stop.disabled=true;}
function renderSpeechScore(target,transcript){const result=compareSpeech(target,transcript);if(!result){speechMessage('音声を聞き取れませんでした。もう一度お試しください。');return;}
 const labels={match:'一致',replace:'異なる字',missing:'認識されなかった字',extra:'余分に認識された字'};
 const chars=(key)=>result.aligned.map(x=>`<span class="speech-char ${x.type}" title="${labels[x.type]}" aria-label="${esc((x[key]||'空欄')+'：'+labels[x.type])}">${esc(x[key]||'·')}</span>`).join('');
 $('#speech-result').innerHTML=`<div class="speech-score"><strong>${result.score}<small>/ 100</small></strong><div><b>認識テキストの一致度</b><p>${result.score===100?'例文どおりに認識されました。':result.score>=80?'よく伝わっています。違う字を確認しましょう。':'お手本を聞いて、短く区切って練習しましょう。'}</p></div></div><p class="muted">認識された文：<span lang="zh-CN">${esc(transcript)}</span></p><div class="speech-comparison"><div><small>例文</small><span lang="zh-CN">${chars('expected')}</span></div><div><small>認識結果</small><span lang="zh-CN">${chars('heard')}</span></div></div><p class="muted" style="font-size:11px">緑＝一致 ／ 赤＝異なる字 ／ 黄＝認識されなかった字 ／ 紫＝余分な字。読み間違いとは限らず、音声認識の誤りも含みます。</p>`;
 speechMessage('チェックできました。声調も意識して、お手本と聞き比べましょう。');
}
function startSpeech(){const reason=speechAvailability();if(reason){speechMessage(reason);return;}
 cancelSpeech();stopRecording();if(window.speechSynthesis)speechSynthesis.cancel();$('#speech-result').innerHTML='';
 const target=speechTarget().line[0],Ctor=window.SpeechRecognition||window.webkitSpeechRecognition;let r,finalText='',failed=false;
 try{r=new Ctor();speechRecognition=r;r.lang='zh-CN';r.continuous=false;r.interimResults=true;r.maxAlternatives=1;
 $('#speech-start').disabled=true;$('#speech-stop').disabled=false;speechMessage('マイクに向かって、中国語で1文を話してください…');
 r.onresult=e=>{if(speechRecognition!==r)return;const finals=[],interims=[];for(let i=0;i<e.results.length;i++){const result=e.results[i];(result.isFinal?finals:interims).push(result[0].transcript);}finalText=finals.join('');speechMessage(finalText?'認識を確認しています…':interims.join('')?'聞き取り中：'+interims.join(''):'聞き取り中…');};
 r.onerror=e=>{if(speechRecognition!==r)return;failed=true;const errors={'not-allowed':'マイクが許可されていません。ブラウザのマイク設定を確認してください。','service-not-allowed':'この端末では音声認識サービスを利用できません。','network':'認識サービスに接続できません。ネット接続を確認して、もう一度お試しください。','no-speech':'声を聞き取れませんでした。マイクの近くで、もう一度話してみましょう。','audio-capture':'マイクを利用できません。他のアプリの使用状況を確認してください。','language-not-supported':'この環境では中国語の認識が利用できません。','aborted':'認識を中止しました。'};speechMessage(errors[e.error]||'音声認識が完了しませんでした。もう一度お試しください。');clearTimeout(speechTimer);speechRecognition=null;r.onend=null;try{r.abort();}catch{}resetSpeechControls();};
 r.onend=()=>{if(speechRecognition!==r)return;clearTimeout(speechTimer);speechRecognition=null;resetSpeechControls();if(!failed){if(finalText.trim())renderSpeechScore(target,finalText);else speechMessage('音声を聞き取れませんでした。点数は付けずに、もう一度試しましょう。');}};
 r.start();speechTimer=setTimeout(finishSpeech,30000);
 }catch{cancelSpeech();resetSpeechControls();speechMessage('音声認識を開始できませんでした。対応ブラウザとマイクの許可をご確認ください。');}}
