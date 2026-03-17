"use strict";(()=>{var V=Object.defineProperty;var Z=(r,e,t)=>e in r?V(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var y=(r,e,t)=>Z(r,typeof e!="symbol"?e+"":e,t);function I(){let r=document.querySelector(".nav-toggle"),e=document.querySelector(".site-nav");r&&e&&(r.addEventListener("click",()=>{let s=e.classList.toggle("site-nav--open");r.setAttribute("aria-expanded",String(s))}),document.addEventListener("click",s=>{!e.contains(s.target)&&!r.contains(s.target)&&(e.classList.remove("site-nav--open"),r.setAttribute("aria-expanded","false"))}),document.addEventListener("keydown",s=>{s.key==="Escape"&&e.classList.contains("site-nav--open")&&(e.classList.remove("site-nav--open"),r.setAttribute("aria-expanded","false"),r.focus())}));let t=window.location.pathname.replace(/\/$/,"/");document.querySelectorAll(".site-nav__link").forEach(s=>{let i=s.getAttribute("href")?.replace(/\/$/,"/");i&&t===i&&s.classList.add("site-nav__link--active")})}function _(){document.querySelectorAll(".accordion").forEach(e=>{let t=e.querySelector(".accordion__trigger"),n=e.querySelector(".accordion__content");if(!t||!n)return;let s=n.id||`accordion-${Math.random().toString(36).slice(2,9)}`;n.id=s,t.setAttribute("aria-controls",s),t.setAttribute("aria-expanded",e.classList.contains("accordion--open")?"true":"false"),n.setAttribute("role","region"),n.setAttribute("aria-labelledby",t.id||""),t.addEventListener("click",()=>{let i=e.classList.toggle("accordion--open");t.setAttribute("aria-expanded",String(i))}),t.addEventListener("keydown",i=>{(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),t.click())})})}function H(){let r=document.querySelector(".matrix-table");if(!r)return;r.querySelectorAll("tbody tr[data-dimension]").forEach(t=>{let n=t.querySelectorAll(".matrix-cell"),s=t.querySelector(".matrix-dimension-header");if(!s)return;t.style.cursor="pointer",s.setAttribute("role","button"),s.setAttribute("aria-expanded","false"),s.setAttribute("tabindex","0");let i=()=>{let a=t.classList.toggle("matrix-row--expanded");s.setAttribute("aria-expanded",String(a)),n.forEach(l=>{l.classList.toggle("matrix-cell--expanded",a)})};t.addEventListener("click",i),s.addEventListener("keydown",a=>{(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),i())})})}function q(){document.querySelectorAll(".citation-list").forEach(e=>{let t=e.querySelector(".citation-list__title"),n=e.querySelector("ul");if(!t||!n)return;n.style.display="none",t.style.cursor="pointer",t.setAttribute("role","button"),t.setAttribute("aria-expanded","false"),t.setAttribute("tabindex","0");let s=()=>{let i=n.style.display==="none";n.style.display=i?"":"none",t.setAttribute("aria-expanded",String(i))};t.addEventListener("click",s),t.addEventListener("keydown",i=>{(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),s())})})}function B(){document.querySelectorAll("[data-filterable]").forEach(e=>{let t=e.querySelectorAll("[data-filter-text]");if(t.length<5)return;let n=document.createElement("input");n.type="text",n.placeholder="Filter...",n.className="filter-input",n.setAttribute("aria-label","Filter items"),n.addEventListener("input",()=>{let s=n.value.toLowerCase().trim();t.forEach(i=>{let a=i.getAttribute("data-filter-text")?.toLowerCase()||"";i.style.display=!s||a.includes(s)?"":"none"})}),e.parentElement?.insertBefore(n,e)})}function R(){ee()}function ee(){let r=document.querySelector(".matrix-table");if(!r)return;let e="matrix-expanded-cells";r.addEventListener("click",t=>{t.target.closest(".matrix-cell__summary")&&requestAnimationFrame(()=>{let s=[];r.querySelectorAll(".matrix-cell--expanded").forEach((i,a)=>{s.push(String(a))});try{localStorage.setItem(e,JSON.stringify(s))}catch{}})});try{let t=localStorage.getItem(e);if(t){let n=JSON.parse(t),s=r.querySelectorAll(".matrix-cell");n.forEach(i=>{let a=s[Number(i)];if(a){a.classList.add("matrix-cell--expanded");let l=a.querySelector(".matrix-cell__summary");l&&l.setAttribute("aria-expanded","true")}})}}catch{}}function N(r,e,t=320){let n=t/2,s=t/2,i=t*.38,a=t*.47,l=r.length,u=2*Math.PI/l,m=-Math.PI/2,c=[1,2,3,4],h="rgba(255,255,255,0.08)",o="rgba(255,255,255,0.12)",v="#6dacf0",d="rgba(109,172,240,0.2)",g=`<svg viewBox="0 0 ${t} ${t}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Competence radar chart showing scores across ${l} dimensions">`;for(let p of c){let f=p/4*i,b=[];for(let x=0;x<l;x++){let S=m+x*u;b.push(`${n+f*Math.cos(S)},${s+f*Math.sin(S)}`)}g+=`<polygon points="${b.join(" ")}" fill="none" stroke="${h}" stroke-width="1"/>`}for(let p=0;p<l;p++){let f=m+p*u,b=n+i*Math.cos(f),x=s+i*Math.sin(f);g+=`<line x1="${n}" y1="${s}" x2="${b}" y2="${x}" stroke="${o}" stroke-width="1"/>`}let E=[];for(let p=0;p<l;p++){let f=m+p*u,b=r[p].score/4*i;E.push(`${n+b*Math.cos(f)},${s+b*Math.sin(f)}`)}g+=`<polygon points="${E.join(" ")}" fill="${d}" stroke="${v}" stroke-width="2"/>`;for(let p=0;p<l;p++){let f=m+p*u,b=r[p].score/4*i,x=n+b*Math.cos(f),S=s+b*Math.sin(f);g+=`<circle cx="${x}" cy="${S}" r="4" fill="${v}"/>`}for(let p=0;p<l;p++){let f=m+p*u,b=n+a*Math.cos(f),x=s+a*Math.sin(f),S="middle";Math.cos(f)<-.1?S="end":Math.cos(f)>.1&&(S="start");let X=Math.sin(f)>.1?"1em":Math.sin(f)<-.1?"-0.3em":"0.35em";g+=`<text x="${b}" y="${x}" text-anchor="${S}" dy="${X}" fill="#8891a5" font-size="11" font-family="'DM Sans',sans-serif">${r[p].shortLabel}</text>`}let L=r.reduce((p,f)=>p+f.score,0)/l;g+=`<text x="${n}" y="${n-8}" text-anchor="middle" fill="#e4e6ed" font-size="24" font-weight="600" font-family="'DM Sans',sans-serif">${L.toFixed(1)}</text>`,g+=`<text x="${n}" y="${n+12}" text-anchor="middle" fill="#8891a5" font-size="11" font-family="'DM Sans',sans-serif">avg score</text>`,g+="</svg>",e.innerHTML=g}var w="ccc-assessment";function te(){try{let r=localStorage.getItem(w);return r?JSON.parse(r):null}catch{return null}}function se(r){try{localStorage.setItem(w,JSON.stringify(r))}catch{}}function ne(r){return r<1.5?1:r<2.25?2:r<3?3:r<3.5?4:5}var Q={1:{title:"Operator",slug:"operator"},2:{title:"Structured Collaborator",slug:"structured-collaborator"},3:{title:"Environment Builder",slug:"environment-builder"},4:{title:"Workflow Engineer",slug:"workflow-engineer"},5:{title:"Agentic Systems Expert",slug:"agentic-systems-expert"}};function D(){let r=document.getElementById("assessment-app");if(!r)return;let e=document.getElementById("assessment-data"),t=document.getElementById("dimensions-meta");if(!e||!t)return;let n,s;try{n=JSON.parse(e.textContent||"[]"),s=JSON.parse(t.textContent||"[]")}catch{return}if(n.length===0||s.length===0)return;let i=new Map;for(let l of n){let u=i.get(l.dimensionId)||[];u.push(l),i.set(l.dimensionId,u)}let a=te();if(a){re(r,a,s,i,n);return}z(r,s,i)}function z(r,e,t){k(r,{answers:{},currentDimIndex:0},e,t)}function k(r,e,t,n){let s=t[e.currentDimIndex],i=n.get(s.id)||[],a=t.length,l=e.currentDimIndex+1,u=l/a*100;r.innerHTML=`
    <div class="assess-progress">
      <div class="assess-progress__bar" style="width: ${u}%"></div>
    </div>
    <p class="assess-progress__label">Dimension ${l} of ${a}</p>
    <div class="assess-dimension">
      <h2 class="assess-dimension__name">${s.name}</h2>
      <p class="assess-dimension__summary">${s.summary}</p>
    </div>
    <div class="assess-questions">
      ${i.map((o,v)=>`
        <div class="assess-question" data-qid="${o.id}">
          <p class="assess-question__text">${o.text}</p>
          <div class="assess-choices">
            ${o.choices.map(d=>`
              <button class="assess-choice${e.answers[o.id]===d.value?" assess-choice--selected":""}"
                      data-qid="${o.id}" data-value="${d.value}">
                <span class="assess-choice__value">${d.value}</span>
                <span class="assess-choice__label">${d.label}</span>
              </button>
            `).join("")}
          </div>
        </div>
      `).join("")}
    </div>
    <div class="assess-nav">
      ${e.currentDimIndex>0?'<button class="assess-nav__btn assess-nav__prev">Back</button>':"<span></span>"}
      <button class="assess-nav__btn assess-nav__next" disabled>
        ${e.currentDimIndex===a-1?"See Results":"Next Dimension"}
      </button>
    </div>
  `,r.querySelectorAll(".assess-choice").forEach(o=>{o.addEventListener("click",()=>{let v=o.getAttribute("data-qid"),d=Number(o.getAttribute("data-value"));e.answers[v]=d,o.closest(".assess-question").querySelectorAll(".assess-choice").forEach(p=>p.classList.remove("assess-choice--selected")),o.classList.add("assess-choice--selected");let E=i.every(p=>e.answers[p.id]!==void 0),L=r.querySelector(".assess-nav__next");L&&E&&(L.disabled=!1)})});let m=r.querySelector(".assess-nav__next");m&&m.addEventListener("click",()=>{e.currentDimIndex<t.length-1?(e.currentDimIndex++,k(r,e,t,n)):ie(r,e,t,n)});let c=r.querySelector(".assess-nav__prev");if(c&&c.addEventListener("click",()=>{e.currentDimIndex--,k(r,e,t,n)}),i.every(o=>e.answers[o.id]!==void 0)){let o=r.querySelector(".assess-nav__next");o&&(o.disabled=!1)}}function ie(r,e,t,n){let s={};for(let m of t){let h=(n.get(m.id)||[]).map(o=>e.answers[o.id]||1);s[m.id]=h.reduce((o,v)=>o+v,0)/h.length}let i=Object.values(s).reduce((m,c)=>m+c,0)/t.length,a=ne(i),l=Q[a],u={completedAt:new Date().toISOString(),answers:e.answers,dimensionScores:s,estimatedLevel:a,version:1};se(u),O(r,u,t,n)}function re(r,e,t,n,s){let i=new Date(e.completedAt).toLocaleDateString();r.innerHTML=`
    <div class="assess-previous">
      <p class="text-muted">You completed an assessment on ${i}.</p>
      <div class="flex gap-md mt-md">
        <button class="assess-nav__btn" id="view-results">View Results</button>
        <button class="assess-nav__btn assess-nav__btn--secondary" id="retake">Retake Assessment</button>
      </div>
    </div>
  `,document.getElementById("view-results")?.addEventListener("click",()=>{O(r,e,t,n)}),document.getElementById("retake")?.addEventListener("click",()=>{localStorage.removeItem(w),z(r,t,n)})}function O(r,e,t,n){let s=e.estimatedLevel,i=Q[s],a=Object.values(e.dimensionScores).reduce((o,v)=>o+v,0)/t.length,l=document.querySelector('link[rel="canonical"]')?.getAttribute("href")?.replace(/assess\/$/,"")||"/ai-coding/claude-code-competence/",u=t.filter(o=>e.dimensionScores[o.id]<2.5),m=t.filter(o=>e.dimensionScores[o.id]>=2.5&&e.dimensionScores[o.id]<3),c=t.filter(o=>e.dimensionScores[o.id]>=3);r.innerHTML=`
    <div class="assess-results">
      <div class="assess-results__header">
        <div id="radar-chart" class="assess-results__chart"></div>
        <div class="assess-results__summary">
          <h2>Your Estimated Level</h2>
          <div class="assess-results__level">
            <span class="badge badge--level-${s}">Level ${s}</span>
            <span class="assess-results__level-name">${i.title}</span>
          </div>
          <p class="text-muted mt-md">Average score: ${a.toFixed(1)} / 4.0</p>
          <a href="${l}levels/${i.slug}/" class="assess-nav__btn mt-lg" style="display:inline-block;text-decoration:none;">View Level ${s} Details &rarr;</a>
        </div>
      </div>

      <section class="section">
        <h2>Dimension Breakdown</h2>
        <div class="assess-dim-grid">
          ${t.map(o=>{let v=e.dimensionScores[o.id],d=v/4*100;return`
              <div class="assess-dim-card assess-dim-card--${v<2.5?"weak":v<3?"developing":"strong"}">
                <div class="assess-dim-card__header">
                  <span class="assess-dim-card__name">${o.shortName}</span>
                  <span class="assess-dim-card__score">${v.toFixed(1)}</span>
                </div>
                <div class="assess-dim-card__bar">
                  <div class="assess-dim-card__fill" style="width: ${d}%"></div>
                </div>
              </div>
            `}).join("")}
        </div>
      </section>

      ${u.length>0?`
      <section class="section">
        <h2>Priority: Focus Areas</h2>
        <p class="text-muted mb-md">These dimensions scored below 2.5. Focused study here will have the most impact.</p>
        <ul>
          ${u.map(o=>`<li><a href="${l}dimensions/">${o.name}</a> \u2014 score: ${e.dimensionScores[o.id].toFixed(1)}</li>`).join("")}
        </ul>
      </section>
      `:""}

      ${m.length>0?`
      <section class="section">
        <h2>Developing: Good Progress</h2>
        <ul>
          ${m.map(o=>`<li><a href="${l}dimensions/">${o.name}</a> \u2014 score: ${e.dimensionScores[o.id].toFixed(1)}</li>`).join("")}
        </ul>
      </section>
      `:""}

      ${c.length>0?`
      <section class="section">
        <h2>Strong: Keep It Up</h2>
        <ul>
          ${c.map(o=>`<li><a href="${l}dimensions/">${o.name}</a> \u2014 score: ${e.dimensionScores[o.id].toFixed(1)}</li>`).join("")}
        </ul>
      </section>
      `:""}

      <div class="assess-actions mt-xl">
        <button class="assess-nav__btn assess-nav__btn--secondary" id="retake-from-results">Retake Assessment</button>
      </div>
    </div>
  `;let h=document.getElementById("radar-chart");h&&N(t.map(o=>({label:o.name,shortLabel:o.shortName,score:e.dimensionScores[o.id]||1})),h),document.getElementById("retake-from-results")?.addEventListener("click",()=>{localStorage.removeItem(w),location.reload()})}var j="ccc-quiz-seen",F="ccc-quiz-history";function J(){try{return JSON.parse(localStorage.getItem(j)||"[]")}catch{return[]}}function ae(r){try{let e=J(),t=[...new Set([...e,...r])];localStorage.setItem(j,JSON.stringify(t.slice(-200)))}catch{}}function oe(r){try{let e=JSON.parse(localStorage.getItem(F)||"[]");e.push(r),localStorage.setItem(F,JSON.stringify(e.slice(-50)))}catch{}}function P(r){let e=[...r];for(let t=e.length-1;t>0;t--){let n=Math.floor(Math.random()*(t+1));[e[t],e[n]]=[e[n],e[t]]}return e}function le(r,e,t,n){let s=r;e!=="all"&&(s=s.filter(m=>m.levelId===e)),t!=="all"&&(s=s.filter(m=>m.dimensionId===t));let i=new Set(J()),a=s.filter(m=>!i.has(m.id)),l=s.filter(m=>i.has(m.id));return[...P(a),...P(l)].slice(0,n)}function K(){let r=document.getElementById("quiz-app");if(!r)return;let e,t,n;try{e=JSON.parse(document.getElementById("quiz-data")?.textContent||"[]"),t=JSON.parse(document.getElementById("quiz-dimensions")?.textContent||"[]"),n=JSON.parse(document.getElementById("quiz-levels")?.textContent||"[]")}catch{return}e.length!==0&&G(r,e,t,n)}function G(r,e,t,n){r.innerHTML=`
    <div class="quiz-config">
      <h2>Configure Your Quiz</h2>
      <div class="quiz-config__grid">
        <div class="quiz-config__field">
          <label for="qcount">Questions</label>
          <select id="qcount" class="quiz-select">
            <option value="5">5 questions</option>
            <option value="10" selected>10 questions</option>
            <option value="15">15 questions</option>
            <option value="50">All questions</option>
          </select>
        </div>
        <div class="quiz-config__field">
          <label for="qlevel">Level</label>
          <select id="qlevel" class="quiz-select">
            <option value="all">All levels</option>
            ${n.sort((s,i)=>s.levelNumber-i.levelNumber).map(s=>`<option value="${s.id}">L${s.levelNumber}: ${s.shortLabel}</option>`).join("")}
          </select>
        </div>
        <div class="quiz-config__field">
          <label for="qdim">Dimension</label>
          <select id="qdim" class="quiz-select">
            <option value="all">All dimensions</option>
            ${t.map(s=>`<option value="${s.id}">${s.shortName}</option>`).join("")}
          </select>
        </div>
      </div>
      <button class="assess-nav__btn" id="start-quiz">Start Quiz</button>
    </div>
  `,document.getElementById("start-quiz").addEventListener("click",()=>{let s=Number(document.getElementById("qcount").value),i=document.getElementById("qlevel").value,a=document.getElementById("qdim").value,l=le(e,i,a,s);if(l.length===0){r.innerHTML='<p class="text-muted">No questions match your filters. Try different settings.</p><button class="assess-nav__btn mt-md" id="back-config">Back</button>',document.getElementById("back-config").addEventListener("click",()=>G(r,e,t,n));return}ce(r,l,e,t,n)})}function ce(r,e,t,n,s){let i=[],a=0;function l(){let u=e[a],m=a+1,c=e.length,h=m/c*100;r.innerHTML=`
      <div class="assess-progress"><div class="assess-progress__bar" style="width:${h}%"></div></div>
      <p class="assess-progress__label">Question ${m} of ${c}</p>
      <div class="quiz-question">
        <p class="quiz-question__text">${u.text}</p>
        <div class="quiz-question__type"><span class="badge">${u.type}</span></div>
        <div class="assess-choices">
          ${u.choices.map(o=>`
            <button class="assess-choice" data-value="${o.value}">
              <span class="assess-choice__value">${o.value}</span>
              <span class="assess-choice__label">${o.label}</span>
            </button>
          `).join("")}
        </div>
        <div id="quiz-feedback" class="hidden"></div>
      </div>
    `,r.querySelectorAll(".assess-choice").forEach(o=>{o.addEventListener("click",()=>{let v=Number(o.getAttribute("data-value"));i.push({questionId:u.id,value:v,question:u}),r.querySelectorAll(".assess-choice").forEach(g=>{g.classList.remove("assess-choice--selected"),g.disabled=!0}),o.classList.add("assess-choice--selected");let d=document.getElementById("quiz-feedback");d.classList.remove("hidden"),d.innerHTML=`
          <div class="quiz-feedback">
            <p class="quiz-feedback__explanation">${u.explanation}</p>
            ${u.studyLinks.length>0?`
              <div class="quiz-feedback__links">
                <strong>Study:</strong>
                ${u.studyLinks.map(g=>`<a href="${g.href}">${g.label}</a>`).join(" \xB7 ")}
              </div>
            `:""}
            <button class="assess-nav__btn mt-md" id="quiz-next">
              ${a<e.length-1?"Next Question":"See Results"}
            </button>
          </div>
        `,document.getElementById("quiz-next").addEventListener("click",()=>{a++,a<e.length?l():de(r,i,t,n,s)})})})}l()}function de(r,e,t,n,s){ae(e.map(c=>c.questionId));let i=new Map;for(let c of e){let h=c.question.dimensionId,o=i.get(h)||{total:0,count:0};o.total+=c.value,o.count++,i.set(h,o)}let a=e.reduce((c,h)=>c+h.value,0)/e.length,l=new Map;for(let c of e)if(c.value<=2)for(let h of c.question.studyLinks){let o=h.href,v=l.get(o)||{link:h,count:0};v.count++,l.set(o,v)}let u=[...l.values()].sort((c,h)=>h.count-c.count).slice(0,8),m=[...i.entries()].map(([c,{total:h,count:o}])=>{let v=n.find(d=>d.id===c);return{id:c,name:v?.shortName||c,avg:h/o}}).sort((c,h)=>c.avg-h.avg);oe({completedAt:new Date().toISOString(),questionCount:e.length,averageScore:Math.round(a*100)/100,dimensionScores:Object.fromEntries(m.map(c=>[c.id,Math.round(c.avg*100)/100]))}),r.innerHTML=`
    <div class="quiz-results">
      <h2>Quiz Results</h2>
      <p class="text-lg mb-lg">Average score: <strong>${a.toFixed(1)}</strong> / 4.0 across ${e.length} questions</p>

      ${m.length>0?`
      <section class="section">
        <h3>Dimension Scores</h3>
        <div class="assess-dim-grid">
          ${m.map(c=>{let h=c.avg/4*100;return`
              <div class="assess-dim-card assess-dim-card--${c.avg<2.5?"weak":c.avg<3?"developing":"strong"}">
                <div class="assess-dim-card__header">
                  <span class="assess-dim-card__name">${c.name}</span>
                  <span class="assess-dim-card__score">${c.avg.toFixed(1)}</span>
                </div>
                <div class="assess-dim-card__bar"><div class="assess-dim-card__fill" style="width:${h}%"></div></div>
              </div>
            `}).join("")}
        </div>
      </section>
      `:""}

      ${u.length>0?`
      <section class="section">
        <h3>Recommended Study</h3>
        <p class="text-muted mb-md">Based on your lower-scoring answers:</p>
        <ul>
          ${u.map(c=>`<li><a href="${c.link.href}">${c.link.label}</a></li>`).join("")}
        </ul>
      </section>
      `:`
      <section class="section">
        <p class="text-muted">Great work \u2014 no weak areas identified!</p>
      </section>
      `}

      <div class="flex gap-md mt-xl">
        <button class="assess-nav__btn" id="quiz-restart">Take Another Quiz</button>
      </div>
    </div>
  `,document.getElementById("quiz-restart").addEventListener("click",()=>{location.reload()})}var ue="ccc-assessment",me="ccc-quiz-history";function he(){try{return JSON.parse(localStorage.getItem(ue)||"null")}catch{return null}}function ge(){try{return JSON.parse(localStorage.getItem(me)||"[]")}catch{return[]}}function W(){let r=document.getElementById("study-guide-app");if(!r)return;let e,t;try{e=JSON.parse(document.getElementById("study-dimensions")?.textContent||"[]"),t=JSON.parse(document.getElementById("study-levels")?.textContent||"[]")}catch{return}let n=he(),s=ge();if(!n&&s.length===0){ve(r);return}pe(r,n,s,e,t)}function ve(r){let e=Y();r.innerHTML=`
    <div class="study-empty">
      <h2>No Data Yet</h2>
      <p class="text-muted mb-lg">Take an assessment or quiz to get personalized study recommendations.</p>
      <div class="flex gap-md">
        <a href="${e}assess/" class="assess-nav__btn" style="text-decoration:none;">Take Assessment</a>
        <a href="${e}quiz/" class="assess-nav__btn assess-nav__btn--secondary" style="text-decoration:none;">Practice Quiz</a>
      </div>
    </div>
  `}function Y(){let e=(document.querySelector('link[rel="canonical"]')?.getAttribute("href")||"").match(/\/ai-coding\/claude-code-competence\//);return"/ai-coding/claude-code-competence/"}function pe(r,e,t,n,s){let i=Y(),a={};if(e)for(let[d,g]of Object.entries(e.dimensionScores))a[d]=a[d]||[],a[d].push(g);if(t.length>0){let d=t[t.length-1];for(let[g,E]of Object.entries(d.dimensionScores))a[g]=a[g]||[],a[g].push(E)}let l=[];for(let d of n){let g=a[d.id];g&&g.length>0&&l.push({dim:d,avg:g.reduce((E,L)=>E+L,0)/g.length})}l.sort((d,g)=>d.avg-g.avg);let u=l.filter(d=>d.avg<2.5),m=l.filter(d=>d.avg>=2.5&&d.avg<3),c=l.filter(d=>d.avg>=3),h=e?.estimatedLevel||Math.round((t.length>0?t[t.length-1].averageScore:2)*1.25),o=s.find(d=>d.levelNumber===h)||s[0],v=s.find(d=>d.levelNumber===h+1);r.innerHTML=`
    <section class="section">
      <h2>Your Position</h2>
      <div class="study-position">
        <span class="badge badge--level-${h}">Level ${h}</span>
        <span class="study-position__name">${o.title}</span>
      </div>
      <p class="text-muted mt-sm">
        <a href="${i}levels/${o.slug}/">Review Level ${h} details</a>
        ${v?` \xB7 <a href="${i}levels/${v.slug}/">See what Level ${h+1} requires</a>`:""}
      </p>
    </section>

    ${u.length>0?`
    <section class="section">
      <h2>Priority: Focus Here</h2>
      <p class="text-muted mb-md">These dimensions scored below 2.5 \u2014 focused study will have the most impact.</p>
      ${u.map(d=>$(d,i)).join("")}
    </section>
    `:""}

    ${m.length>0?`
    <section class="section">
      <h2>Developing: Good Progress</h2>
      ${m.map(d=>$(d,i)).join("")}
    </section>
    `:""}

    ${c.length>0?`
    <section class="section">
      <h2>Strong: Keep It Up</h2>
      ${c.map(d=>$(d,i)).join("")}
    </section>
    `:""}

    <section class="section">
      <h2>Recommended Next Steps</h2>
      <ul>
        ${u.length>0?`<li>Focus on <strong>${u[0].dim.name}</strong> \u2014 your weakest dimension. <a href="${i}dimensions/">Study dimensions</a></li>`:""}
        ${v?`<li>Review <a href="${i}levels/${v.slug}/">Level ${v.levelNumber}: ${v.title}</a> graduation criteria</li>`:""}
        <li><a href="${i}quiz/">Take another quiz</a> to track improvement</li>
        <li><a href="${i}projects/">Try an example project</a> at your level</li>
      </ul>
    </section>

    <div class="flex gap-md mt-xl">
      <a href="${i}assess/" class="assess-nav__btn assess-nav__btn--secondary" style="text-decoration:none;">Retake Assessment</a>
      <a href="${i}quiz/" class="assess-nav__btn assess-nav__btn--secondary" style="text-decoration:none;">Practice Quiz</a>
    </div>
  `}function $(r,e){let t=r.avg/4*100;return`
    <div class="assess-dim-card assess-dim-card--${r.avg<2.5?"weak":r.avg<3?"developing":"strong"} mb-sm">
      <div class="assess-dim-card__header">
        <a href="${e}dimensions/" class="assess-dim-card__name">${r.dim.name}</a>
        <span class="assess-dim-card__score">${r.avg.toFixed(1)}</span>
      </div>
      <div class="assess-dim-card__bar"><div class="assess-dim-card__fill" style="width:${t}%"></div></div>
    </div>
  `}var M=class{constructor(){y(this,"parser");this.parser=new DOMParser}async loadExam(e){try{let t=await this.fetchXML(e);return this.parseExam(t)}catch(t){if(window.location.protocol==="file:")try{let n=await this.loadXMLHttpRequest(e);return this.parseExam(n)}catch{throw new Error("Cannot load exam files with file:// protocol. Please use a local server.")}throw t}}async fetchXML(e){let t=await fetch(e);if(!t.ok)throw new Error(`Failed to load exam: ${t.status} ${t.statusText}`);return t.text()}loadXMLHttpRequest(e){return new Promise((t,n)=>{let s=new XMLHttpRequest;s.open("GET",e,!0),s.onload=()=>{s.status===200||s.status===0?t(s.responseText):n(new Error(`XHR failed: ${s.status}`))},s.onerror=()=>n(new Error("XHR network error")),s.send()})}parseExam(e){let t=this.parser.parseFromString(e,"application/xml"),n=t.querySelector("parsererror");if(n)throw new Error("XML parsing error: "+n.textContent);return{metadata:this.parseMetadata(t),questions:this.parseQuestions(t),glossary:this.parseGlossary(t)}}parseMetadata(e){let t=e.querySelector("metadata");if(!t)throw new Error("No metadata found in exam XML");return{examCode:this.getText(t,"exam-code"),examTitle:this.getText(t,"exam-title"),provider:this.getText(t,"provider"),description:this.getText(t,"description"),totalQuestions:parseInt(this.getText(t,"total-questions"))||0,createdDate:this.getText(t,"created-date"),lastModified:this.getText(t,"last-modified"),categories:this.parseCategories(t)}}parseCategories(e){let t={};return e.querySelectorAll("categories > category").forEach(s=>{let i=s.getAttribute("id");i&&(t[i]=(s.textContent||"").trim())}),t}parseQuestions(e){let t=[];return e.querySelectorAll("questions > question").forEach(s=>{let i=s.getAttribute("category-ref")||this.getText(s,"category-ref")||"",a=s.getAttribute("difficulty")||this.getText(s,"difficulty")||"intermediate";t.push({id:parseInt(s.getAttribute("id")||"")||t.length+1,categoryRef:i,difficulty:a,title:this.getText(s,"title"),scenario:this.getInnerHTML(s,"scenario"),questionText:this.getInnerHTML(s,"question-text"),choices:this.parseChoices(s),correctAnswer:this.getText(s,"correct-answer"),hints:this.parseHints(s),tags:this.parseTags(s)})}),t}parseChoices(e){let t=[];return e.querySelectorAll("choices > choice").forEach(s=>{let i=s.getAttribute("letter")||s.getAttribute("id")||"";t.push({letter:i,text:(s.textContent||"").trim()})}),t.sort((s,i)=>s.letter.localeCompare(i.letter)),t}parseHints(e){let t=[];return e.querySelectorAll("hints > hint").forEach(s=>{let i=this.getInnerHTML(s,"content");i||(i=(s.textContent||"").trim()),t.push({level:parseInt(s.getAttribute("level")||"1")||1,label:s.getAttribute("label")||`Level ${s.getAttribute("level")}`,content:i})}),t.sort((s,i)=>s.level-i.level),t}parseTags(e){let t=[];return e.querySelectorAll("tags > tag").forEach(s=>t.push((s.textContent||"").trim())),t}parseGlossary(e){let t={};return e.querySelectorAll("glossary > term").forEach(s=>{let i=s.getAttribute("id");i&&(t[i]={id:i,category:s.getAttribute("category")||"",name:this.getText(s,"name"),definition:this.getInnerHTML(s,"definition"),examNote:this.getText(s,"exam-note"),relatedTerms:this.parseRelatedTerms(s)})}),t}parseRelatedTerms(e){let t=[];return e.querySelectorAll("related-terms > term-ref").forEach(s=>t.push((s.textContent||"").trim())),t}getText(e,t){let n=e.querySelector(t);return n?(n.textContent||"").trim():""}getInnerHTML(e,t){let n=e.querySelector(t);if(!n)return"";let s="";return n.childNodes.forEach(i=>{i.nodeType===Node.TEXT_NODE?s+=i.textContent:i.nodeType===Node.ELEMENT_NODE&&(s+=this.elementToHTML(i))}),s.trim()}elementToHTML(e){let t=e.tagName.toLowerCase();if(["p","strong","em","code","ul","ol","li"].includes(t)){let s="";return e.childNodes.forEach(i=>{i.nodeType===Node.TEXT_NODE?s+=i.textContent:i.nodeType===Node.ELEMENT_NODE&&(s+=this.elementToHTML(i))}),`<${t}>${s}</${t}>`}return e.textContent||""}};var C=class{constructor(e){y(this,"exam");y(this,"currentIndex");y(this,"answers");y(this,"hintsRevealed");this.exam=e,this.currentIndex=0,this.answers=new Map,this.hintsRevealed=new Map}get currentQuestion(){return this.exam.questions[this.currentIndex]}get totalQuestions(){return this.exam.questions.length}get currentQuestionNumber(){return this.currentIndex+1}get score(){let e=0;return this.answers.forEach(t=>{t.isCorrect&&e++}),e}get attemptedCount(){return this.answers.size}navigateTo(e){return e>=0&&e<this.totalQuestions?(this.currentIndex=e,!0):!1}next(){return this.navigateTo(this.currentIndex+1)}previous(){return this.navigateTo(this.currentIndex-1)}submitAnswer(e){let t=this.currentQuestion,n=e===t.correctAnswer;return this.answers.set(t.id,{selected:e,isCorrect:n,hintsUsed:this.getRevealedHintLevels(t.id),timestamp:new Date().toISOString()}),{isCorrect:n,correctAnswer:t.correctAnswer,selectedAnswer:e}}hasAnswered(e){return this.answers.has(e)}getAnswer(e){return this.answers.get(e)}revealHint(e,t){this.hintsRevealed.has(e)||this.hintsRevealed.set(e,new Set),this.hintsRevealed.get(e).add(t)}hideHint(e,t){let n=this.hintsRevealed.get(e);if(n){n.delete(t);for(let s=t+1;s<=3;s++)n.delete(s)}}toggleHint(e,t){return this.isHintRevealed(e,t)?(this.hideHint(e,t),!1):(this.revealHint(e,t),!0)}isHintRevealed(e,t){let n=this.hintsRevealed.get(e);return n?n.has(t):!1}getRevealedHintLevels(e){let t=this.hintsRevealed.get(e);return t?Array.from(t):[]}canRevealHint(e,t){return t===1?!0:this.isHintRevealed(e,t-1)}getProgress(){return this.exam.questions.map(e=>({id:e.id,answered:this.hasAnswered(e.id),isCorrect:this.answers.get(e.id)?.isCorrect??null}))}exportResults(){let e=this.attemptedCount>0?Math.round(this.score/this.attemptedCount*100):0;return{examCode:this.exam.metadata.examCode,examTitle:this.exam.metadata.examTitle,totalQuestions:this.totalQuestions,attempted:this.attemptedCount,score:this.score,percentage:e,timestamp:new Date().toISOString(),details:Array.from(this.answers.entries()).map(([t,n])=>({questionId:t,selected:n.selected,isCorrect:n.isCorrect,hintsUsed:n.hintsUsed}))}}getState(){return{currentIndex:this.currentIndex,answers:Array.from(this.answers.entries()),hintsRevealed:Array.from(this.hintsRevealed.entries()).map(([e,t])=>[e,Array.from(t)])}}restoreState(e){e.currentIndex!==void 0&&(this.currentIndex=e.currentIndex),e.answers instanceof Map&&(this.answers=e.answers),e.hintsRevealed instanceof Map&&(this.hintsRevealed=e.hintsRevealed)}};var T=class{constructor(e){y(this,"storageKey");this.storageKey=`cert-quiz-${e}`}save(e){let t={...e.getState(),lastSaved:new Date().toISOString()};try{localStorage.setItem(this.storageKey,JSON.stringify(t))}catch(n){console.error("Failed to save progress:",n)}}load(){try{let e=localStorage.getItem(this.storageKey);if(!e)return null;let t=JSON.parse(e);if(!t||typeof t!="object")return null;let n=new Map;if(Array.isArray(t.hintsRevealed))try{n=new Map(t.hintsRevealed.filter(i=>Array.isArray(i)&&i.length===2).map(([i,a])=>[i,new Set(Array.isArray(a)?a:[])]))}catch{n=new Map}let s=new Map;if(Array.isArray(t.answers))try{s=new Map(t.answers.filter(i=>Array.isArray(i)&&i.length===2))}catch{s=new Map}return{currentIndex:typeof t.currentIndex=="number"?t.currentIndex:0,answers:s,hintsRevealed:n,lastSaved:t.lastSaved}}catch(e){return console.error("Failed to load saved progress:",e),null}}clear(){try{localStorage.removeItem(this.storageKey)}catch(e){console.error("Failed to clear progress:",e)}}saveResults(e){let t=`${this.storageKey}-history`;try{let n=JSON.parse(localStorage.getItem(t)||"[]");for(n.push(e);n.length>10;)n.shift();localStorage.setItem(t,JSON.stringify(n))}catch(n){console.error("Failed to save results:",n)}}getHistory(){let e=`${this.storageKey}-history`;try{return JSON.parse(localStorage.getItem(e)||"[]")}catch(t){return console.error("Failed to get history:",t),[]}}};var A=class{constructor(){y(this,"parser");y(this,"engine",null);y(this,"tracker",null);y(this,"categories",{});y(this,"elements");y(this,"selectedAnswer",null);y(this,"manifest",null);y(this,"certBasePath");y(this,"backHref");this.parser=new M;let e=document.getElementById("cert-main");this.certBasePath=e?.dataset.certBase||"",this.backHref=e?.dataset.backHref||"";let t=document.getElementById("cert-manifest");if(t)try{this.manifest=JSON.parse(t.textContent||"")}catch{this.manifest=null}this.elements={loading:document.getElementById("cert-loading"),error:document.getElementById("cert-error"),errorText:document.getElementById("cert-error-text"),errorBackLink:document.getElementById("cert-error-back-link"),questionCard:document.getElementById("cert-question-card"),navigation:document.getElementById("cert-navigation"),backLink:document.getElementById("cert-back-link"),examCode:document.getElementById("cert-exam-code"),examTitle:document.getElementById("cert-exam-title"),currentNum:document.getElementById("cert-current-num"),totalNum:document.getElementById("cert-total-num"),score:document.getElementById("cert-score"),attempted:document.getElementById("cert-attempted"),percentComplete:document.getElementById("cert-percent-complete"),percentSuccess:document.getElementById("cert-percent-success"),qNum:document.getElementById("cert-q-num"),questionTitle:document.getElementById("cert-question-title"),questionCategory:document.getElementById("cert-question-category"),scenarioSection:document.getElementById("cert-scenario-section"),scenarioText:document.getElementById("cert-scenario-text"),questionContent:document.getElementById("cert-question-content"),choicesFieldset:document.getElementById("cert-choices-fieldset"),submitAnswer:document.getElementById("cert-submit-answer"),feedbackSection:document.getElementById("cert-feedback-section"),feedbackResult:document.getElementById("cert-feedback-result"),hintsSection:document.getElementById("cert-hints-section"),hintsContent:document.getElementById("cert-hints-content"),hintBtn1:document.getElementById("cert-hint-btn-1"),hintBtn2:document.getElementById("cert-hint-btn-2"),hintBtn3:document.getElementById("cert-hint-btn-3"),prevQuestion:document.getElementById("cert-prev-question"),nextQuestion:document.getElementById("cert-next-question")},this.init()}async init(){let e=this.getExamIdFromUrl();if(this.setBackLinks(e),!e){this.showError("No exam specified. Please select an exam from the certifications page.");return}try{let t=this.manifest?.exams.find(a=>a.slug===e),n;if(t)n=this.certBasePath+t.dataFile;else{let a=this.getProviderFromExamId(e);n=`${this.certBasePath}${a}/${e}.xml`}let s=await this.parser.loadExam(n);this.categories=s.metadata.categories||{},this.engine=new C(s),this.tracker=new T(s.metadata.examCode);let i=null;try{i=this.tracker.load()}catch{this.tracker.clear()}if(i&&i.answers&&i.answers.size>0){this.showContinuePrompt(i);return}this.startQuiz()}catch(t){console.error("Failed to load exam:",t),this.showError(`Failed to load exam: ${t.message}`)}}getExamIdFromUrl(){return new URLSearchParams(window.location.search).get("exam")}getProviderFromExamId(e){if(this.manifest){let n=this.manifest.exams.find(s=>s.slug===e);if(n){let s=this.manifest.providers.find(i=>i.id===n.providerId);if(s)return s.slug}}let t=e.toLowerCase();return t.startsWith("az-")||t.startsWith("dp-")||t.startsWith("ai-")?"azure":t.startsWith("clf-")||t.startsWith("saa-")||t.startsWith("dva-")||t.startsWith("soa-")||t.startsWith("dea-")||t.startsWith("mla-")||t.startsWith("aif-")?"aws":t.startsWith("gcp-")?"gcp":"azure"}setBackLinks(e){let t=this.backHref;if(e&&this.manifest){let n=this.manifest.exams.find(s=>s.slug===e);if(n){let s=this.manifest.providers.find(i=>i.id===n.providerId);s&&(t=this.backHref.replace(/[^/]+\/$/,s.slug+"/"))}}this.elements.backLink&&(this.elements.backLink.href=t||"#"),this.elements.errorBackLink&&(this.elements.errorBackLink.href=t||"#")}showError(e){this.elements.loading&&(this.elements.loading.hidden=!0),this.elements.error&&(this.elements.error.hidden=!1),this.elements.errorText&&(this.elements.errorText.textContent=e)}showQuiz(){this.elements.loading&&(this.elements.loading.hidden=!0),this.elements.questionCard&&(this.elements.questionCard.hidden=!1),this.elements.navigation&&(this.elements.navigation.hidden=!1),this.elements.hintsSection&&(this.elements.hintsSection.hidden=!1)}showContinuePrompt(e){this.elements.loading&&(this.elements.loading.hidden=!0);let t=e.answers.size,n=this.engine.totalQuestions,s=0;e.answers.forEach(a=>{a.isCorrect&&s++});let i=document.createElement("div");i.id="cert-continue-prompt",i.innerHTML=`
      <div class="cert-continue-prompt">
        <h2>Continue Previous Session?</h2>
        <p>You have a saved session for this exam:</p>
        <div class="cert-saved-stats">
          <div class="cert-stat">
            <span class="cert-stat-value">${t}/${n}</span>
            <span class="cert-stat-label">Questions Answered</span>
          </div>
          <div class="cert-stat">
            <span class="cert-stat-value">${s}/${t}</span>
            <span class="cert-stat-label">Correct</span>
          </div>
          <div class="cert-stat">
            <span class="cert-stat-value">${t>0?Math.round(s/t*100):0}%</span>
            <span class="cert-stat-label">Success Rate</span>
          </div>
        </div>
        <div class="cert-prompt-buttons">
          <button id="cert-continue-yes" class="btn btn--primary">Continue Session</button>
          <button id="cert-continue-no" class="btn btn--secondary">Start Fresh</button>
        </div>
      </div>
    `,this.elements.questionCard?.parentElement?.appendChild(i),document.getElementById("cert-continue-yes")?.addEventListener("click",()=>{this.engine.restoreState(e),i.remove(),this.startQuiz()}),document.getElementById("cert-continue-no")?.addEventListener("click",()=>{this.tracker.clear(),i.remove(),this.startQuiz()})}startQuiz(){this.setupEventListeners(),this.updateHeader(),this.renderQuestion(),this.showQuiz()}updateHeader(){let e=this.engine.exam.metadata;this.elements.examCode&&(this.elements.examCode.textContent=e.examCode),this.elements.examTitle&&(this.elements.examTitle.textContent=e.examTitle),this.elements.totalNum&&(this.elements.totalNum.textContent=String(this.engine.totalQuestions));let t=this.getExamIdFromUrl(),n=this.getProviderFromExamId(t||""),s={azure:"Azure",aws:"AWS",gcp:"Google Cloud"};document.title=`${e.examCode} Quiz \u2014 ${s[n]||"Cloud"} Certification Study`}setupEventListeners(){this.elements.submitAnswer?.addEventListener("click",()=>this.submitAnswer()),this.elements.prevQuestion?.addEventListener("click",()=>this.navigatePrevious()),this.elements.nextQuestion?.addEventListener("click",()=>this.navigateNext()),this.elements.hintBtn1?.addEventListener("click",()=>this.toggleHint(1)),this.elements.hintBtn2?.addEventListener("click",()=>this.toggleHint(2)),this.elements.hintBtn3?.addEventListener("click",()=>this.toggleHint(3)),document.addEventListener("keydown",e=>{this.engine&&(e.key==="ArrowLeft"&&this.navigatePrevious(),e.key==="ArrowRight"&&this.navigateNext())})}renderQuestion(){let e=this.engine.currentQuestion,t=this.engine.getAnswer(e.id),n=this.engine.hasAnswered(e.id);this.elements.currentNum&&(this.elements.currentNum.textContent=String(this.engine.currentQuestionNumber)),this.elements.qNum&&(this.elements.qNum.textContent=String(this.engine.currentQuestionNumber)),this.elements.questionTitle&&(this.elements.questionTitle.textContent=e.title);let s=this.categories[e.categoryRef]||e.categoryRef||"";this.elements.questionCategory&&(this.elements.questionCategory.textContent=s),e.scenario?(this.elements.scenarioSection&&(this.elements.scenarioSection.hidden=!1),this.elements.scenarioText&&(this.elements.scenarioText.innerHTML=e.scenario)):this.elements.scenarioSection&&(this.elements.scenarioSection.hidden=!0),this.elements.questionContent&&(this.elements.questionContent.innerHTML=e.questionText),this.renderChoices(e,t,n),this.elements.submitAnswer&&(this.elements.submitAnswer.disabled=!0,this.elements.submitAnswer.hidden=n),n&&t?this.showFeedback(t):this.elements.feedbackSection&&(this.elements.feedbackSection.hidden=!0),this.renderHintButtons(e.id),this.renderHintContent(e),this.updateNavigationButtons(),this.updateScoreDisplay(),this.selectedAnswer=null}renderChoices(e,t,n){this.elements.choicesFieldset&&(this.elements.choicesFieldset.innerHTML="",e.choices.forEach(s=>{let i=document.createElement("label");i.className="cert-choice-option",n&&(i.classList.add("disabled"),s.letter===e.correctAnswer?i.classList.add("correct"):s.letter===t?.selected&&i.classList.add("incorrect"));let a=document.createElement("input");a.type="radio",a.name="cert-answer",a.value=s.letter,a.disabled=n,t?.selected===s.letter&&(a.checked=!0,i.classList.add("selected"),this.selectedAnswer=s.letter),i.addEventListener("click",m=>{n||(m.preventDefault(),this.selectedAnswer===s.letter?(a.checked=!1,i.classList.remove("selected"),this.selectedAnswer=null,this.elements.submitAnswer&&(this.elements.submitAnswer.disabled=!0)):(this.elements.choicesFieldset.querySelectorAll('input[type="radio"]').forEach(c=>{c.checked=!1}),this.elements.choicesFieldset.querySelectorAll(".cert-choice-option").forEach(c=>{c.classList.remove("selected")}),a.checked=!0,i.classList.add("selected"),this.selectedAnswer=s.letter,this.elements.submitAnswer&&(this.elements.submitAnswer.disabled=!1)))});let l=document.createElement("span");l.className="cert-choice-letter",l.textContent=s.letter;let u=document.createElement("span");u.className="cert-choice-text",u.textContent=s.text,i.appendChild(a),i.appendChild(l),i.appendChild(u),this.elements.choicesFieldset.appendChild(i)}))}submitAnswer(){if(!this.elements.choicesFieldset)return;let e=this.elements.choicesFieldset.querySelector("input:checked");if(!e)return;this.engine.submitAnswer(e.value),this.tracker.save(this.engine);let t=this.engine.getAnswer(this.engine.currentQuestion.id);this.renderChoices(this.engine.currentQuestion,t,!0),this.elements.submitAnswer&&(this.elements.submitAnswer.hidden=!0),t&&this.showFeedback(t),this.updateScoreDisplay()}showFeedback(e){if(!this.elements.feedbackSection||!this.elements.feedbackResult)return;this.elements.feedbackSection.hidden=!1,this.elements.feedbackSection.className="cert-feedback "+(e.isCorrect?"correct":"incorrect");let t=e.isCorrect?"\u2713":"\u2717",n=e.isCorrect?"Correct!":`Incorrect. The correct answer is ${this.engine.currentQuestion.correctAnswer}.`;this.elements.feedbackResult.innerHTML=`
      <span class="cert-feedback-icon">${t}</span>
      <span class="cert-feedback-text">${n}</span>
    `}renderHintButtons(e){[1,2,3].forEach(t=>{let n=this.elements[`hintBtn${t}`];if(!n)return;let s=this.engine.isHintRevealed(e,t),i=this.engine.canRevealHint(e,t);n.classList.toggle("revealed",s),n.disabled=!s&&!i})}renderHintContent(e){this.elements.hintsContent&&(this.elements.hintsContent.innerHTML="",e.hints.forEach(t=>{if(this.engine.isHintRevealed(e.id,t.level)){let n=document.createElement("div");n.className="cert-hint",n.dataset.level=String(t.level),n.innerHTML=`
          <div class="cert-hint-label">${t.label}</div>
          <div class="cert-hint-content">${t.content}</div>
        `,this.elements.hintsContent.appendChild(n)}}))}toggleHint(e){let t=this.engine.currentQuestion.id;!this.engine.isHintRevealed(t,e)&&!this.engine.canRevealHint(t,e)||(this.engine.toggleHint(t,e),this.tracker.save(this.engine),this.renderHintButtons(t),this.renderHintContent(this.engine.currentQuestion))}navigatePrevious(){this.engine?.previous()&&this.renderQuestion()}navigateNext(){this.engine?.next()&&this.renderQuestion()}updateNavigationButtons(){this.elements.prevQuestion&&(this.elements.prevQuestion.disabled=this.engine.currentIndex===0),this.elements.nextQuestion&&(this.elements.nextQuestion.disabled=this.engine.currentIndex===this.engine.totalQuestions-1)}updateScoreDisplay(){let e=this.engine.totalQuestions,t=this.engine.attemptedCount,n=this.engine.score;this.elements.score&&(this.elements.score.textContent=String(n)),this.elements.attempted&&(this.elements.attempted.textContent=String(t));let s=e>0?Math.round(t/e*100):0,i=t>0?Math.round(n/t*100):0;this.elements.percentComplete&&(this.elements.percentComplete.textContent=`${s}%`),this.elements.percentSuccess&&(this.elements.percentSuccess.textContent=`${i}%`)}};function U(){document.getElementById("cert-main")&&new A}document.addEventListener("DOMContentLoaded",()=>{I(),_(),H(),q(),B(),R(),D(),K(),W(),U(),fe()});function fe(){let r=document.getElementById("your-level-indicator"),e=document.getElementById("your-level-text");if(!(!r||!e))try{let t=localStorage.getItem("ccc-assessment");if(!t)return;let n=JSON.parse(t),s=Object.values(n.dimensionScores||{});if(s.length===0)return;let i=s.reduce((l,u)=>l+u,0)/s.length,a;i<1.5?a="Level 1: Operator":i<2.25?a="Level 2: Structured Collaborator":i<3?a="Level 3: Environment Builder":i<3.5?a="Level 4: Workflow Engineer":a="Level 5: Agentic Systems Expert",e.textContent=a,r.style.display=""}catch{}}})();
