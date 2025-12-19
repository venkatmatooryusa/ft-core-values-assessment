/* Forgotten Tracks – Core Values Assessment
   Static, client-side only. No backend.
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
const LIKERT_MAX_PER_VALUE = 20 * LIKERT_WEIGHT;

// Local storage key
const STORAGE_KEY = "ft_core_values_assessment_v1";

let state = {
  meta: { name: "", grade: "" },
  likert: {},  // { qid: 1..24 => 1..5 }
  forced: {},  // { qid: 25..40 => "A" or "B" }
  theme: "dark",
};

let radarChart = null;
let radarChartPrint = null;

// --- DOM helper
const el = (id) => document.getElementById(id);

// --- DOM refs
const themeToggle = el("themeToggle");
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
const downloadJsonBtn = el("downloadJsonBtn");
const downloadPngBtn = el("downloadPngBtn");
const clearSavedBtn = el("clearSavedBtn");

const topValues = el("topValues");
const summaryText = el("summaryText");

// Print view refs (IMPORTANT: index.html must contain these IDs)
const printBtn = el("printBtn"); // add this button in index.html results actions
const printMeta = el("printMeta");
const printDate = el("printDate");
const topValuesPrint = el("topValuesPrint");
const summaryTextPrint = el("summaryTextPrint");
const scoresTablePrint = el("scoresTablePrint");

// ----------------- utilities -----------------
function applyTheme(theme){
  state.theme = theme;
  document.documentElement.setAttribute("data-theme", theme === "light" ? "light" : "dark");
}

function toggleTheme(){
  applyTheme(state.theme === "light" ? "dark" : "light");
  persist();

  // If results are visible, re-render charts with correct theme colors
  const resultsVisible = resultsSection && !resultsSection.classList.contains("hidden");
  if (resultsVisible) {
    const { results, topSorted } = computeScores();
    renderRadar(results);
    populatePrintView(results, topSorted);
    renderRadarPrint(results);
  }
}

function persist(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

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

function clearSaved(){
  localStorage.removeItem(STORAGE_KEY);
}

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

function band(score){
  if(score >= 80) return "Core Driver";
  if(score >= 60) return "Strong Preference";
  if(score >= 40) return "Supporting Value";
  return "Low Pull";
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

// ----------------- rendering -----------------
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

// ----------------- validation & scoring -----------------
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

  LIKERT_QUESTIONS.forEach(q=>{
    likertTotals[q.value] += Number(state.likert[q.id] || 0);
  });

  FORCED_QUESTIONS.forEach(q=>{
    forcedAppearCounts[q.a.value] += 1;
    forcedAppearCounts[q.b.value] += 1;

    const pick = state.forced[q.id];
    if(pick === "A") forcedTotals[q.a.value] += 1;
    if(pick === "B") forcedTotals[q.b.value] += 1;
  });

  const results = FT_VALUES.map(value=>{
    const weighted = (likertTotals[value]*LIKERT_WEIGHT) + (forcedTotals[value]*FORCED_WEIGHT);
    const maxPossible = LIKERT_MAX_PER_VALUE + (forcedAppearCounts[value] * FORCED_WEIGHT);
    const normalized = maxPossible > 0 ? Math.round((weighted / maxPossible) * 100) : 0;

    return {
      value,
      likertRaw: likertTotals[value],
      forcedRaw: forcedTotals[value],
      weighted,
      maxPossible,
      score100: clamp(normalized, 0, 100),
    };
  });

  const topSorted = [...results].sort((a,b)=> b.score100 - a.score100);
  return { results, topSorted };
}

// ----------------- charts -----------------
function wrappedLabelsOptionB(scores){
  return scores.map(s =>
    s.value.includes(" & ")
      ? s.value.split(" & ").map((part, i, arr) => (i < arr.length - 1 ? part + " &" : part))
      : [s.value]
  );
}

function renderRadar(scores){
  const canvas = el("radarChart");
  if(!canvas) return;

  const labels = wrappedLabelsOptionB(scores);
  const data = scores.map(s=>s.score100);

  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  const grid = isLight ? "rgba(10,20,40,.14)" : "rgba(255,255,255,.14)";
  const ticks = isLight ? "rgba(10,20,40,.70)" : "rgba(255,255,255,.75)";
  const labelColor = isLight ? "#10162a" : "#e9eefc";

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
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (ctx) => `${ctx.formattedValue} / 100` } }
      },
      scales: {
        r: {
          suggestedMin: 0,
          suggestedMax: 100,
          grid: { color: grid },
          angleLines: { color: grid },
          pointLabels: { color: labelColor, font: { size: 11, weight: "600", lineHeight: 1.2 } },
          ticks: { color: ticks, backdropColor: "transparent", stepSize: 20 }
        }
      }
    }
  });
}

function renderRadarPrint(scores){
  const canvas = el("radarChartPrint");
  if(!canvas) return;

  const labels = wrappedLabelsOptionB(scores);
  const data = scores.map(s=>s.score100);

  const isLight = document.documentElement.getAttribute("data-theme") === "light";

  // Screen theme-aware colors:
  // - Light theme: black/gray
  // - Dark theme: white/gray (so it doesn't disappear)
  const axis = isLight ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.28)";
  const angle = isLight ? "rgba(0,0,0,0.30)" : "rgba(255,255,255,0.18)";
  const tick = isLight ? "#000000" : "rgba(255,255,255,0.85)";
  const label = isLight ? "#000000" : "rgba(255,255,255,0.92)";
  const stroke = isLight ? "#111111" : "rgba(255,255,255,0.92)";
  const fill = isLight ? "rgba(0,0,0,0.20)" : "rgba(255,255,255,0.12)";

  if(radarChartPrint) radarChartPrint.destroy();

  radarChartPrint = new Chart(canvas, {
    type: "radar",
    data: {
      labels,
      datasets: [{
        data,
        borderWidth: 3,
        backgroundColor: fill,
        borderColor: stroke,
        pointBackgroundColor: stroke,
        pointBorderColor: stroke,
        pointRadius: 4
      }]
    },
    options: {
      responsive: false,
      plugins: { legend: { display:false } },
      scales: {
        r: {
          suggestedMin: 0,
          suggestedMax: 100,
          grid: { color: axis, lineWidth: 1.5 },
          angleLines: { color: angle, lineWidth: 1.25 },
          pointLabels: {
            color: label,
            font: { size: 12, weight: "700", lineHeight: 1.25 }
          },
          ticks: {
            color: tick,
            backdropColor: "transparent",
            stepSize: 20,
            showLabelBackdrop: false,
            font: { size: 11, weight: "600" }
          }
        }
      }
    }
  });
}

// ----------------- print view population -----------------
function populatePrintView(results, topSorted){
  if(!printMeta || !printDate || !topValuesPrint || !summaryTextPrint || !scoresTablePrint) return;

  const now = new Date();
  const metaParts = [];
  if(state.meta.name) metaParts.push(`Student: ${state.meta.name}`);
  if(state.meta.grade) metaParts.push(`Grade: ${state.meta.grade}`);
  printMeta.textContent = metaParts.join(" • ") || "Student: ____________ • Grade: ____";
  printDate.textContent = now.toLocaleDateString();

  topValuesPrint.innerHTML = "";
  topSorted.forEach(item=>{
    const li = document.createElement("li");
    li.innerHTML = `${escapeHtml(item.value)} — <strong>${item.score100}</strong>
      <span class="badge">${band(item.score100)}</span>`;
    topValuesPrint.appendChild(li);
  });

  summaryTextPrint.textContent = buildSummary(topSorted.slice(0,2));

  const tbody = scoresTablePrint.querySelector("tbody");
  if(!tbody) return;
  tbody.innerHTML = "";
  results
    .slice()
    .sort((a,b)=> b.score100 - a.score100)
    .forEach(row=>{
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(row.value)}</td>
        <td><strong>${row.score100}</strong></td>
        <td>${escapeHtml(band(row.score100))}</td>
        <td>${escapeHtml(signalLine(row.value))}</td>
      `;
      tbody.appendChild(tr);
    });
// NEW: build the executive 2-column print version
renderExecutiveScoresGrid(results);
}

function renderExecutiveScoresGrid(results){
  const host = el("scoresTablePrintExec");
  if(!host) return;

  const sorted = results.slice().sort((a,b)=> b.score100 - a.score100);

  const colA = sorted.slice(0,3);
  const colB = sorted.slice(3,6);

  const makeCol = (rows) => {
    const col = document.createElement("div");
    col.className = "exec-col";

    rows.forEach(r=>{
      const row = document.createElement("div");
      row.className = "exec-row";
      row.innerHTML = `
        <div class="exec-left">
          <div class="exec-value">${escapeHtml(r.value)}</div>
          <div class="exec-signal">${escapeHtml(signalLine(r.value))}</div>
        </div>
        <div class="exec-right">
          <div class="exec-score">${r.score100}</div>
          <div class="exec-band">${escapeHtml(band(r.score100))}</div>
        </div>
      `;
      col.appendChild(row);
    });

    return col;
  };

  host.innerHTML = "";
  host.appendChild(makeCol(colA));
  host.appendChild(makeCol(colB));
}

// ----------------- downloads -----------------
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

// ----------------- UI wiring -----------------
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

// ----------------- init -----------------
(function init(){
  const hasSaved = loadSaved();
  applyTheme(state.theme || "dark");

  if(hasSaved){
    studentName.value = state.meta?.name || "";
    studentGrade.value = state.meta?.grade || "";
  }

  renderLikert();
  renderForced();
  updateProgress();

  themeToggle?.addEventListener("click", toggleTheme);

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

    const { results, topSorted } = computeScores();
    const topTwo = topSorted.slice(0,2);

    // IMPORTANT: show results first so print canvases are not in a hidden tree
    showResults();

    // Fill student UI
    topValues.innerHTML = "";
    topSorted.forEach(item=>{
      const li = document.createElement("li");
      li.innerHTML = `${escapeHtml(item.value)} — <strong>${item.score100}</strong>
        <span class="badge">${band(item.score100)}</span>`;
      topValues.appendChild(li);
    });
    summaryText.textContent = buildSummary(topTwo);

    // Render charts + populate counselor print view
    renderRadar(results);
    populatePrintView(results, topSorted);
    renderRadarPrint(results);
  });

  backBtn?.addEventListener("click", showAssessment);

  downloadJsonBtn?.addEventListener("click", ()=>{
    const { results } = computeScores();
    const payload = {
      title: "Forgotten Tracks – Core Values Assessment",
      version: "v1",
      timestamp: new Date().toISOString(),
      student: { name: state.meta.name || "", grade: state.meta.grade || "" },
      answers: { likert: state.likert, forced: state.forced },
      scores: results
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

  // Print counselor copy (requires printBtn in index.html)
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      const { results, topSorted } = computeScores();

      // Ensure results are visible, content filled, and chart drawn before print
      showResults();
      populatePrintView(results, topSorted);
      renderRadarPrint(results);

      requestAnimationFrame(() => window.print());
    });
  }
})();
