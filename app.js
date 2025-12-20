/* Forgotten Tracks – Core Values Assessment (v1.3)
   Static, client-side only. No backend.

   ✅ Interpretation: Rank-based bands (explicit)
   #1 Core Driver • #2 Strong • #3–4 Supporting • #5–6 Lower Pull

   ✅ Print reliability (Chrome PDF):
   - Print radar uses canvas -> PNG <img id="radarChartPrintImg">
   - Avoid duplicate radar / removed executive grid
*/

const FT_VALUES = [
  "Clarity & Synthesis",
  "Protection & Preservation",
  "Equity & Access",
  "Utility & Efficiency",
  "Creation & Innovation",
  "Aesthetics & Experience",
];

// --- Likert questions (24): 4 per value, in order
const LIKERT_QUESTIONS = [
  // Clarity & Synthesis (1–4)
  { id: 1, value: FT_VALUES[0], text: "I enjoy turning confusing information into something clear and understandable." },
  { id: 2, value: FT_VALUES[0], text: "I feel satisfied when I connect different ideas into one explanation." },
  { id: 3, value: FT_VALUES[0], text: "I like explaining complex topics in simple ways." },
  { id: 4, value: FT_VALUES[0], text: "I naturally organize or summarize information for others." },

  // Protection & Preservation (5–8)
  { id: 5, value: FT_VALUES[1], text: "I feel responsible for protecting people, systems, or environments from harm." },
  { id: 6, value: FT_VALUES[1], text: "I think carefully about long-term consequences, not just short-term results." },
  { id: 7, value: FT_VALUES[1], text: "It bothers me when something important is neglected or damaged." },
  { id: 8, value: FT_VALUES[1], text: "I prefer roles where stability and safety matter." },

  // Equity & Access (9–12)
  { id: 9, value: FT_VALUES[2], text: "I notice when systems or rules treat people unfairly." },
  { id: 10, value: FT_VALUES[2], text: "I care about making sure everyone has a fair chance to succeed." },
  { id: 11, value: FT_VALUES[2], text: "I feel motivated to stand up for people who are excluded." },
  { id: 12, value: FT_VALUES[2], text: "I believe opportunities and knowledge should be widely accessible." },

  // Utility & Efficiency (13–16)
  { id: 13, value: FT_VALUES[3], text: "I enjoy improving how things work." },
  { id: 14, value: FT_VALUES[3], text: "I quickly notice waste or inefficiency." },
  { id: 15, value: FT_VALUES[3], text: "I prefer practical solutions that can be used by many people." },
  { id: 16, value: FT_VALUES[3], text: "I like building systems that save time, effort, or resources." },

  // Creation & Innovation (17–20)
  { id: 17, value: FT_VALUES[4], text: "I enjoy creating something new rather than improving something existing." },
  { id: 18, value: FT_VALUES[4], text: "I like experimenting with ideas, even if they might fail." },
  { id: 19, value: FT_VALUES[4], text: "I feel energized when I invent or design new solutions." },
  { id: 20, value: FT_VALUES[4], text: "I am drawn to projects where I can try something original." },

  // Aesthetics & Experience (21–24)
  { id: 21, value: FT_VALUES[5], text: "I care deeply about how things look, feel, or sound." },
  { id: 22, value: FT_VALUES[5], text: "I notice design details that others often miss." },
  { id: 23, value: FT_VALUES[5], text: "I enjoy creating experiences that make people feel something." },
  { id: 24, value: FT_VALUES[5], text: "I believe beauty and experience matter, not just function." },
];

// --- Forced-choice (16): each option maps to a value
const FORCED_QUESTIONS = [
  { id: 25, a: { text: "Explaining complex ideas clearly", value: FT_VALUES[0] }, b: { text: "Making systems work better", value: FT_VALUES[3] } },
  { id: 26, a: { text: "Protecting something important from harm", value: FT_VALUES[1] }, b: { text: "Making opportunities fairer", value: FT_VALUES[2] } },
  { id: 27, a: { text: "Creating something new", value: FT_VALUES[4] }, b: { text: "Improving how something feels or looks", value: FT_VALUES[5] } },
  { id: 28, a: { text: "Designing practical solutions", value: FT_VALUES[3] }, b: { text: "Inventing new approaches", value: FT_VALUES[4] } },
  { id: 29, a: { text: "Preserving stability for the future", value: FT_VALUES[1] }, b: { text: "Experimenting with new ideas", value: FT_VALUES[4] } },
  { id: 30, a: { text: "Explaining ideas simply", value: FT_VALUES[0] }, b: { text: "Designing meaningful experiences", value: FT_VALUES[5] } },
  { id: 31, a: { text: "Making systems more efficient", value: FT_VALUES[3] }, b: { text: "Expanding access for more people", value: FT_VALUES[2] } },
  { id: 32, a: { text: "Preventing long-term harm", value: FT_VALUES[1] }, b: { text: "Creating something original", value: FT_VALUES[4] } },
  { id: 33, a: { text: "Making sense of complexity", value: FT_VALUES[0] }, b: { text: "Shaping how people experience something", value: FT_VALUES[5] } },
  { id: 34, a: { text: "Making systems fairer", value: FT_VALUES[2] }, b: { text: "Making systems work better", value: FT_VALUES[3] } },
  { id: 35, a: { text: "Preserving knowledge or culture", value: FT_VALUES[1] }, b: { text: "Clarifying ideas for others", value: FT_VALUES[0] } },
  { id: 36, a: { text: "Improving how something functions", value: FT_VALUES[3] }, b: { text: "Improving how something feels", value: FT_VALUES[5] } },
  { id: 37, a: { text: "Ensuring equal opportunity", value: FT_VALUES[2] }, b: { text: "Creating something entirely new", value: FT_VALUES[4] } },
  { id: 38, a: { text: "Making information understandable", value: FT_VALUES[0] }, b: { text: "Making experiences engaging or beautiful", value: FT_VALUES[5] } },
  { id: 39, a: { text: "Protecting what exists", value: FT_VALUES[1] }, b: { text: "Reimagining what could exist", value: FT_VALUES[4] } },
  { id: 40, a: { text: "Making access more equitable", value: FT_VALUES[2] }, b: { text: "Designing elegant experiences", value: FT_VALUES[5] } },
];

// Scoring constants
const LIKERT_WEIGHT = 1.5;
const FORCED_WEIGHT = 1.0;

// Local storage key
const STORAGE_KEY = "ft_core_values_assessment_v1";

let state = {
  meta: { name: "", grade: "" },
  likert: {},  // { qid: 1..24 => 1..5 }
  forced: {},  // { qid: 25..40 => "A" or "B" }
};

let radarChart = null;
let radarChartPrint = null;

// DOM helper
const el = (id) => document.getElementById(id);

// DOM refs
const startBtn = el("startBtn");
const resumeBtn = el("resumeBtn");
const resetBtn = el("resetBtn");
const assessmentSection = el("assessment");
const resultsSection = el("results");
const likertContainer = el("likertContainer");
const forcedContainer = el("forcedContainer");
const tabLikert = el("tabLikert");
const tabForced = el("tabForced");
const saveBtn = el("saveBtn");
const submitBtn = el("submitBtn");
const validationMsg = el("validationMsg");
const progressText = el("progressText");
const progressBar = el("progressBar");

const studentName = el("studentName");
const studentGrade = el("studentGrade");

const backBtn = el("backBtn");
const printBtn = el("printBtn");
const printView = el("printView");

const downloadJsonBtn = el("downloadJsonBtn");
const downloadPngBtn = el("downloadPngBtn");
const clearSavedBtn = el("clearSavedBtn");

const topValues = el("topValues");
const summaryText = el("summaryText");

const printMeta = el("printMeta");
const printDate = el("printDate");
const topValuesPrint = el("topValuesPrint");
const summaryTextPrint = el("summaryTextPrint");
const scoresTablePrint = el("scoresTablePrint");

// utilities
function persist(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

function loadSaved(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(!raw) return false;
  try{
    const parsed = JSON.parse(raw);
    state = { ...state, ...parsed };
    return true;
  }catch{
    return false;
  }
}

function clearSaved(){ localStorage.removeItem(STORAGE_KEY); }

function showAssessment(){
  assessmentSection.classList.remove("hidden");
  resultsSection.classList.add("hidden");
  window.location.hash = "#assessment";
}

function showResults(){
  assessmentSection.classList.add("hidden");
  resultsSection.classList.remove("hidden");
  window.location.hash = "#results";
}

function answeredCount(){
  return Object.keys(state.likert).length + Object.keys(state.forced).length;
}

function updateProgress(){
  const answered = answeredCount();
  progressText.textContent = `${answered} / 40 answered`;
  progressBar.style.width = `${(answered/40)*100}%`;
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, (m)=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}

function clamp(n,min,max){ return Math.max(min, Math.min(max, n)); }

// ✅ rank-based bands (explicit)
function bandByRank(rankIndex){
  if(rankIndex === 0) return "Core Driver";
  if(rankIndex === 1) return "Strong";
  if(rankIndex === 2 || rankIndex === 3) return "Supporting";
  return "Lower Pull";
}

function signalLine(value){
  switch(value){
    case "Clarity & Synthesis": return "Enjoys organizing complexity into clear understanding.";
    case "Protection & Preservation": return "Motivated by safeguarding stability, safety, and continuity.";
    case "Equity & Access": return "Driven to reduce barriers and expand fair opportunity.";
    case "Utility & Efficiency": return "Prefers practical improvements that save time/resources.";
    case "Creation & Innovation": return "Energized by originality, invention, and experimentation.";
    case "Aesthetics & Experience": return "Values craft, design quality, and emotional resonance.";
    default: return "";
  }
}

function buildSummary(topTwo){
  const [a,b] = topTwo;
  const name = (state.meta.name || "You").trim();
  return `${name} is most energized by ${a.value} and ${b.value}. That usually means you feel most motivated when your projects let you lean into these two drivers—especially in team roles, school clubs, or problem-solving situations where these strengths show up naturally.`;
}

// rendering
function renderLikert(){
  likertContainer.innerHTML = "";
  const scaleLabels = [
    { v:1, label:"Strongly Disagree" },
    { v:2, label:"Disagree" },
    { v:3, label:"Neutral" },
    { v:4, label:"Agree" },
    { v:5, label:"Strongly Agree" },
  ];

  LIKERT_QUESTIONS.forEach(q=>{
    const wrap = document.createElement("div");
    wrap.className = "question";

    wrap.innerHTML = `
      <div class="qhead">
        <div>
          <div class="qnum">Q${q.id} • ${escapeHtml(q.value)}</div>
          <div class="qtext">${escapeHtml(q.text)}</div>
        </div>
      </div>
      <div class="choices" role="radiogroup" aria-label="Likert choices"></div>
    `;

    const choices = wrap.querySelector(".choices");
    scaleLabels.forEach(s=>{
      const id = `likert_${q.id}_${s.v}`;
      const choice = document.createElement("label");
      choice.className = "choice";
      choice.setAttribute("for", id);

      choice.innerHTML = `
        <input type="radio" name="likert_${q.id}" id="${id}" value="${s.v}" />
        <span>${escapeHtml(s.label)}</span>
      `;

      const input = choice.querySelector("input");
      input.checked = Number(state.likert[q.id]) === s.v;

      input.addEventListener("change", ()=>{
        state.likert[q.id] = Number(input.value);
        persist();
        updateProgress();
      });

      choices.appendChild(choice);
    });

    likertContainer.appendChild(wrap);
  });
}

function renderForced(){
  forcedContainer.innerHTML = "";

  FORCED_QUESTIONS.forEach(q=>{
    const wrap = document.createElement("div");
    wrap.className = "question";

    wrap.innerHTML = `
      <div class="qhead">
        <div>
          <div class="qnum">Q${q.id}</div>
          <div class="qtext">Choose the option that feels more like you.</div>
          <div class="hint" style="margin-top:6px;">
            A → <strong>${escapeHtml(q.a.value)}</strong> &nbsp;&nbsp;•&nbsp;&nbsp;
            B → <strong>${escapeHtml(q.b.value)}</strong>
          </div>
        </div>
      </div>
      <div class="choices" role="radiogroup" aria-label="Forced-choice options"></div>
    `;

    const choices = wrap.querySelector(".choices");
    const options = [
      { key:"A", text:q.a.text },
      { key:"B", text:q.b.text },
    ];

    options.forEach(opt=>{
      const id = `forced_${q.id}_${opt.key}`;
      const choice = document.createElement("label");
      choice.className = "choice";
      choice.setAttribute("for", id);

      choice.innerHTML = `
        <input type="radio" name="forced_${q.id}" id="${id}" value="${opt.key}" />
        <span><strong>${opt.key})</strong> ${escapeHtml(opt.text)}</span>
      `;

      const input = choice.querySelector("input");
      input.checked = state.forced[q.id] === opt.key;

      input.addEventListener("change", ()=>{
        state.forced[q.id] = opt.key;
        persist();
        updateProgress();
      });

      choices.appendChild(choice);
    });

    forcedContainer.appendChild(wrap);
  });
}

// validation & scoring
function validateAllAnswered(){
  const missingLikert = LIKERT_QUESTIONS.filter(q => state.likert[q.id] == null);
  const missingForced = FORCED_QUESTIONS.filter(q => state.forced[q.id] == null);

  if(missingLikert.length === 0 && missingForced.length === 0){
    validationMsg.classList.add("hidden");
    return { ok:true };
  }

  const parts = [];
  if(missingLikert.length) parts.push(`Likert missing: ${missingLikert.map(q=>q.id).join(", ")}`);
  if(missingForced.length) parts.push(`Forced-choice missing: ${missingForced.map(q=>q.id).join(", ")}`);

  validationMsg.textContent = `Please answer all questions. ${parts.join(" | ")}`;
  validationMsg.classList.remove("hidden");
  return { ok:false };
}

function computeScores(){
  const likertTotals = Object.fromEntries(FT_VALUES.map(v=>[v,0]));
  const forcedTotals = Object.fromEntries(FT_VALUES.map(v=>[v,0]));
  const forcedAppearCounts = Object.fromEntries(FT_VALUES.map(v=>[v,0]));

  // Likert totals
  LIKERT_QUESTIONS.forEach(q=>{
    likertTotals[q.value] += Number(state.likert[q.id] || 0);
  });

  // Forced totals + appearances
  FORCED_QUESTIONS.forEach(q=>{
    forcedAppearCounts[q.a.value] += 1;
    forcedAppearCounts[q.b.value] += 1;

    const pick = state.forced[q.id];
    if(pick === "A") forcedTotals[q.a.value] += 1;
    if(pick === "B") forcedTotals[q.b.value] += 1;
  });

  // 0–100 normalized
  const results = FT_VALUES.map((value, idx)=>{
    const weighted = (likertTotals[value]*LIKERT_WEIGHT) + (forcedTotals[value]*FORCED_WEIGHT);
    const maxPossible = (4*5*LIKERT_WEIGHT) + (forcedAppearCounts[value]*FORCED_WEIGHT);
    const normalized = maxPossible > 0 ? Math.round((weighted / maxPossible) * 100) : 0;

    return {
      value,
      _idx: idx,
      likertRaw: likertTotals[value],
      forcedRaw: forcedTotals[value],
      weighted,
      maxPossible,
      score100: clamp(normalized, 0, 100),
      band: "",
      rank: null
    };
  });

  // rank (stable ties)
  const ranked = [...results].sort((a,b)=>{
    if(b.score100 !== a.score100) return b.score100 - a.score100;
    return a._idx - b._idx;
  });

  ranked.forEach((item, i)=>{
    item.rank = i + 1;
    item.band = bandByRank(i);
  });

  // mirror back
  const byValue = Object.fromEntries(ranked.map(r=>[r.value, r]));
  results.forEach(r=>{
    r.rank = byValue[r.value].rank;
    r.band = byValue[r.value].band;
  });

  return { results, ranked };
}

// charts
function wrappedLabels(scores){
  return scores.map(s =>
    s.value.includes(" & ")
      ? s.value.split(" & ").map((part, i, arr) => (i < arr.length - 1 ? part + " &" : part))
      : [s.value]
  );
}

function renderRadar(scores){
  const canvas = el("radarChart");
  if(!canvas) return;

  const labels = wrappedLabels(scores);
  const data = scores.map(s=>s.score100);

  if(radarChart) radarChart.destroy();

  radarChart = new Chart(canvas, {
    type: "radar",
    data: {
      labels,
      datasets: [{
        label: "Core Values (0–100)",
        data,
        borderWidth: 2,
        backgroundColor: "rgba(34, 211, 238, 0.20)",
        borderColor: "rgba(251, 191, 36, 0.95)",
        pointBackgroundColor: "rgba(34, 211, 238, 0.95)",
        pointBorderColor: "rgba(251, 191, 36, 0.95)",
        pointRadius: 3
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          suggestedMin: 0,
          suggestedMax: 100,
          grid: { color: "rgba(10,20,40,.14)" },
          angleLines: { color: "rgba(10,20,40,.14)" },
          pointLabels: { color: "#10162a", font: { size: 11, weight: "600", lineHeight: 1.2 } },
          ticks: { color: "rgba(10,20,40,.70)", backdropColor: "transparent", stepSize: 20 }
        }
      }
    }
  });
}

function renderRadarPrint(scores){
  const canvas = el("radarChartPrint");
  const img = el("radarChartPrintImg");
  if(!canvas || !img) return;

  const labels = wrappedLabels(scores);
  const data = scores.map(s=>s.score100);

  if(radarChartPrint) radarChartPrint.destroy();

  radarChartPrint = new Chart(canvas, {
    type: "radar",
    data: {
      labels,
      datasets: [{
        data,
        borderWidth: 4,
        backgroundColor: "rgba(0,0,0,0.14)",
        borderColor: "#111111",
        pointBackgroundColor: "#111111",
        pointBorderColor: "#111111",
        pointRadius: 4
      }]
    },
    options: {
      responsive: false,
      animation: false,
      plugins: { legend: { display:false } },
      scales: {
        r: {
          suggestedMin: 0,
          suggestedMax: 100,
          grid: { color: "rgba(0,0,0,0.38)", lineWidth: 1.4 },
          angleLines: { color: "rgba(0,0,0,0.28)", lineWidth: 1.2 },
          pointLabels: { color: "#000000", font: { size: 12, weight: "700", lineHeight: 1.25 } },
          ticks: {
            color: "#000000",
            backdropColor: "transparent",
            stepSize: 20,
            showLabelBackdrop: false,
            font: { size: 11, weight: "600" }
          }
        }
      }
    }
  });

  radarChartPrint.resize();
  radarChartPrint.update("none");

  // Convert canvas to PNG (reliable for Chrome PDF)
  try{
    img.src = canvas.toDataURL("image/png");
  }catch{
    // If blocked, at least the canvas exists (but print CSS hides canvas).
  }
}

// print view population
function populatePrintView(results, ranked){
  if(!printMeta || !printDate || !topValuesPrint || !summaryTextPrint || !scoresTablePrint) return;

  const now = new Date();
  const metaParts = [];
  if(state.meta.name) metaParts.push(`Student: ${state.meta.name}`);
  if(state.meta.grade) metaParts.push(`Grade: ${state.meta.grade}`);
  printMeta.textContent = metaParts.join(" • ") || "Student: ____________ • Grade: ____";
  printDate.textContent = now.toLocaleDateString();

  // Top values (ranked)
  topValuesPrint.innerHTML = "";
  ranked.forEach(item=>{
    const li = document.createElement("li");
    li.innerHTML = `${escapeHtml(item.value)} — <strong>${item.score100}</strong>
      <span class="badge">${escapeHtml(item.band)}</span>`;
    topValuesPrint.appendChild(li);
  });

  summaryTextPrint.textContent = buildSummary(ranked.slice(0,2));

  // Table (ranked order)
  const tbody = scoresTablePrint.querySelector("tbody");
  if(!tbody) return;
  tbody.innerHTML = "";

  ranked.forEach(row=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(row.value)}</td>
      <td><strong>${row.score100}</strong></td>
      <td>${escapeHtml(row.band)}</td>
      <td>${escapeHtml(signalLine(row.value))}</td>
    `;
    tbody.appendChild(tr);
  });
}

// downloads
function downloadJson(payload){
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type:"application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `forgotten-tracks-core-values-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function downloadChartPng(){
  const canvas = el("radarChart");
  if(!canvas) return;
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = `forgotten-tracks-radar-${Date.now()}.png`;
  a.click();
}

// tabs
function setTab(which){
  if(which === "likert"){
    tabLikert.classList.add("active");
    tabForced.classList.remove("active");
    likertContainer.classList.remove("hidden");
    forcedContainer.classList.add("hidden");
  }else{
    tabForced.classList.add("active");
    tabLikert.classList.remove("active");
    forcedContainer.classList.remove("hidden");
    likertContainer.classList.add("hidden");
  }
}

function resetState(){
  state.likert = {};
  state.forced = {};
  state.meta = { name:"", grade:"" };
  persist();
  studentName.value = "";
  studentGrade.value = "";
  renderLikert();
  renderForced();
  updateProgress();
}

// init
(function init(){
  const hasSaved = loadSaved();

  if(hasSaved){
    studentName.value = state.meta?.name || "";
    studentGrade.value = state.meta?.grade || "";
  }

  renderLikert();
  renderForced();
  updateProgress();

  tabLikert?.addEventListener("click", ()=> setTab("likert"));
  tabForced?.addEventListener("click", ()=> setTab("forced"));

  startBtn?.addEventListener("click", ()=>{
    state.meta.name = studentName.value || "";
    state.meta.grade = studentGrade.value || "";
    persist();
    showAssessment();
  });

  resumeBtn?.addEventListener("click", ()=>{
    if(!localStorage.getItem(STORAGE_KEY)){
      alert("No saved attempt found.");
      return;
    }
    state.meta.name = studentName.value || state.meta.name || "";
    state.meta.grade = studentGrade.value || state.meta.grade || "";
    persist();
    showAssessment();
  });

  resetBtn?.addEventListener("click", ()=>{
    if(confirm("Reset all answers on this device?")){
      resetState();
      clearSaved();
      alert("Reset complete.");
    }
  });

  saveBtn?.addEventListener("click", ()=>{
    state.meta.name = studentName.value || "";
    state.meta.grade = studentGrade.value || "";
    persist();
    alert("Saved.");
  });

  submitBtn?.addEventListener("click", ()=>{
    state.meta.name = studentName.value || "";
    state.meta.grade = studentGrade.value || "";
    persist();

    const v = validateAllAnswered();
    if(!v.ok) return;

    const { results, ranked } = computeScores();
    showResults();

    // Student UI
    topValues.innerHTML = "";
    ranked.forEach(item=>{
      const li = document.createElement("li");
      li.innerHTML = `${escapeHtml(item.value)} — <strong>${item.score100}</strong>
        <span class="badge">${escapeHtml(item.band)}</span>`;
      topValues.appendChild(li);
    });
    summaryText.textContent = buildSummary(ranked.slice(0,2));

    // Charts + print content
    renderRadar(results);
    populatePrintView(results, ranked);

    // Prepare print radar image (even on screen)
    renderRadarPrint(results);
  });

  backBtn?.addEventListener("click", showAssessment);

  downloadJsonBtn?.addEventListener("click", ()=>{
    const { results, ranked } = computeScores();
    const payload = {
      title: "Forgotten Tracks – Core Values Assessment",
      version: "v1.3",
      timestamp: new Date().toISOString(),
      student: { name: state.meta.name || "", grade: state.meta.grade || "" },
      answers: { likert: state.likert, forced: state.forced },
      scores: results,
      ranked
    };
    downloadJson(payload);
  });

  downloadPngBtn?.addEventListener("click", downloadChartPng);

  clearSavedBtn?.addEventListener("click", ()=>{
    if(confirm("Clear saved attempt from this device?")){
      clearSaved();
      alert("Saved attempt cleared.");
    }
  });

  // Print counselor copy (Chrome: Save as PDF)
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      const { results, ranked } = computeScores();

      showResults();
      populatePrintView(results, ranked);

      // ensure print view exists and is visible for print
      if (printView) printView.classList.remove("hidden");

      // render radar to PNG right before print
      renderRadarPrint(results);

      // allow DOM to update then print
      setTimeout(() => window.print(), 140);
    });
  }

  // Ctrl+P support
  window.addEventListener("beforeprint", () => {
    const { results, ranked } = computeScores();
    showResults();
    populatePrintView(results, ranked);
    if (printView) printView.classList.remove("hidden");
    renderRadarPrint(results);
  });

  window.addEventListener("afterprint", () => {
    if (printView) printView.classList.add("hidden");
  });
})();
