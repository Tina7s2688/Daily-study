/* 每日學習燈：多益聽力＋SQL
   第一階段：進度存在瀏覽器的 localStorage。第二階段會改存到 Supabase。 */
(function () {
  "use strict";

  const SETS = window.LISTENING_SETS || [];
  const LEVELS = window.SQL_LEVELS || [];
  const STORE_KEY = "daily-study-v1";
  const SETS_PER_DAY = 2;
  const SQLJS_BASE = "https://cdn.jsdelivr.net/npm/sql.js@1.8.0/dist/";
  const TYPES = ["主旨", "細節", "推論", "下一步", "說話者意圖"];

  /* ---------- 工具 ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");
  const keyOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const todayKey = () => keyOf(new Date());
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

  /* ---------- 進度（狀態） ---------- */
  function defaultState() {
    return { examDate: "2027-01-17", days: {}, sets: {}, types: {}, sqlPassed: {}, queue: { date: "", ids: [] } };
  }
  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) return Object.assign(defaultState(), JSON.parse(raw));
    } catch (e) { /* 讀不到就用預設值 */ }
    return defaultState();
  }
  let state = load();
  function save() {
    if (window.onProgressSaved) window.onProgressSaved(state); // 登入時同步到雲端（sync.js）
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
    catch (e) { $("#storage-note").textContent = "這個瀏覽器無法儲存進度（可能是無痕模式），關掉頁面後進度會消失。"; }
  }

  function ensureQueue() {
    const today = todayKey();
    if (state.queue.date === today) return;
    const fresh = SETS.filter((s) => !state.sets[s.id]).map((s) => s.id);
    const ids = fresh.slice(0, SETS_PER_DAY);
    if (ids.length < SETS_PER_DAY) {
      // 新題目做完了：挑錯最多、最久沒做的來複習
      const review = SETS.filter((s) => state.sets[s.id] && !ids.includes(s.id))
        .sort((a, b) => {
          const ra = state.sets[a.id], rb = state.sets[b.id];
          return (ra.lastCorrect - rb.lastCorrect) || (ra.lastDate < rb.lastDate ? -1 : 1);
        })
        .map((s) => s.id);
      ids.push(...review.slice(0, SETS_PER_DAY - ids.length));
    }
    state.queue = { date: today, ids };
    save();
  }
  const setDoneToday = (id) => state.sets[id] && state.sets[id].lastDate === todayKey();
  const listeningDoneToday = () => state.queue.ids.length > 0 && state.queue.ids.every(setDoneToday);
  const allSqlPassed = () => LEVELS.every((l) => state.sqlPassed[l.n]);
  const sqlDoneToday = () => allSqlPassed() || Object.values(state.sqlPassed).includes(todayKey());
  const currentLevel = () => { const l = LEVELS.find((x) => !state.sqlPassed[x.n]); return l ? l.n : null; };

  function updateToday() {
    state.days[todayKey()] = { l: listeningDoneToday(), s: sqlDoneToday() };
    save();
  }
  function streak() {
    let d = new Date();
    const full = (k) => state.days[k] && state.days[k].l && state.days[k].s;
    if (!full(keyOf(d))) d = addDays(d, -1);
    let n = 0;
    while (full(keyOf(d))) { n++; d = addDays(d, -1); }
    return n;
  }
  function daysToExam() {
    if (!state.examDate) return null;
    const exam = new Date(state.examDate + "T00:00:00");
    const t = new Date(); t.setHours(0, 0, 0, 0);
    return Math.round((exam - t) / 86400000);
  }

  /* ---------- 頂部 ---------- */
  function renderChips() {
    const d = daysToExam();
    $("#chip-exam").innerHTML = d === null ? "到進度頁設定多益日期"
      : d >= 0 ? `距離多益 <strong>${d}</strong> 天` : "多益日期已過，到進度頁更新";
    $("#chip-streak").innerHTML = `連續 <strong>${streak()}</strong> 天`;
  }

  /* ---------- 今天 ---------- */
  function renderToday() {
    ensureQueue();
    const lDone = listeningDoneToday();
    const sDone = sqlDoneToday();
    const lv = currentLevel();
    const doneCount = state.queue.ids.filter(setDoneToday).length;
    const reviewing = state.queue.ids.some((id) => state.sets[id] && !setDoneToday(id)) || state.queue.ids.every((id) => state.sets[id]);
    const d = daysToExam();
    const now = new Date();
    $("#view-today").innerHTML = `
      <div class="hero">
        <span class="eyebrow">${now.getMonth() + 1} 月 ${now.getDate()} 日</span>
        <h2>今天的 15 分鐘</h2>
        <p class="muted">${d !== null && d >= 0 ? `離多益還有 ${d} 天。` : ""}先做聽力，做完就解鎖今天的 SQL。</p>
      </div>
      <div class="steps">
        <div class="panel step ${lDone ? "done" : "current"}">
          <div class="step-num">${lDone ? "✓" : "1"}</div>
          <div>
            <h3>多益聽力 ${SETS_PER_DAY} 組（${SETS_PER_DAY * 3} 題）</h3>
            <p class="muted small">${lDone ? "今天的聽力完成了。" : `已完成 ${doneCount}／${state.queue.ids.length} 組${reviewing && !lDone ? "，今天有複習題" : ""}。約 10 分鐘。`}</p>
          </div>
          <a class="btn ${lDone ? "" : "btn-primary"}" href="#listening">${lDone ? "再練一組" : doneCount ? "繼續" : "開始"}</a>
        </div>
        <div class="panel step ${sDone ? "done" : lDone ? "current" : "locked"}">
          <div class="step-num">${sDone ? "✓" : "2"}</div>
          <div>
            <h3>${allSqlPassed() ? "SQL 全部 12 關完成" : `SQL 第 ${lv} 關：${esc(LEVELS[lv - 1].title)}`}</h3>
            <p class="muted small">${sDone ? (allSqlPassed() ? "可以回去複習，或請 Claude 加新關卡。" : "今天的 SQL 完成了，想多做也可以。") : lDone ? "已解鎖。約 5 分鐘。" : "完成聽力後解鎖。"}</p>
          </div>
          <a class="btn ${!sDone && lDone ? "btn-primary" : ""}" href="#sql">${sDone ? "看看" : lDone ? "開始" : "預覽"}</a>
        </div>
      </div>
      ${lDone && sDone ? `<div class="done-banner">今天完成了，連續 ${streak()} 天。明天見。</div>` : ""}
    `;
  }

  /* ---------- 聽力 ---------- */
  let activeSetId = null;
  let picked = {};       // 題號 → 選的選項
  let submitted = false;
  let showScript = false;
  let speed = 1;

  function pickActiveSet() {
    ensureQueue();
    if (activeSetId && SETS.some((s) => s.id === activeSetId)) return;
    activeSetId = state.queue.ids.find((id) => !setDoneToday(id)) || null;
  }
  function openSet(id) {
    activeSetId = id; picked = {}; submitted = false; showScript = false;
    stopSpeech(); renderListening(); window.scrollTo(0, 0);
  }

  // 每題選項用固定的亂數順序排列，讓正確答案平均分散在 A～D
  function optionOrder(setId, qi) {
    let h = 2166136261;
    for (const ch of setId + ":" + qi) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
    const order = [0, 1, 2, 3];
    for (let i = 3; i > 0; i--) {
      h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
      const j = h % (i + 1);
      [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
  }

  function renderListening() {
    pickActiveSet();
    const set = SETS.find((s) => s.id === activeSetId);
    const listHtml = SETS.map((s) => {
      const r = state.sets[s.id];
      const inQueue = state.queue.ids.includes(s.id) && !setDoneToday(s.id);
      const status = r ? `<span class="pill ${r.lastCorrect === 3 ? "pill-ok" : "pill-bad"}">上次 ${r.lastCorrect}/3</span>` : `<span class="pill">還沒做</span>`;
      return `<button class="set-item" data-action="open-set" data-id="${s.id}">
        <span class="eyebrow">Part ${s.part}${inQueue ? " · 今天" : ""}</span>
        <strong>${esc(s.title)}</strong>${status}</button>`;
    }).join("");

    let main = "";
    if (!set) {
      main = `<div class="panel"><h2>今天的聽力完成了</h2><p class="muted">想多練的話，從下面挑一組再做一次。</p></div>`;
    } else {
      const canSpeak = "speechSynthesis" in window;
      const qs = set.qs.map((q, i) => {
        const opts = optionOrder(set.id, i).map((j, pos) => {
          const o = q.o[j];
          let cls = "";
          if (submitted) cls = j === q.a ? "correct" : picked[i] === j ? "wrong" : "";
          return `<label class="option ${cls}">
            <input type="radio" name="q${i}" value="${j}" ${picked[i] === j ? "checked" : ""} ${submitted ? "disabled" : ""} data-action="pick" data-q="${i}">
            <span><b>(${"ABCD"[pos]})</b> ${esc(o)}</span></label>`;
        }).join("");
        const verdict = submitted ? (picked[i] === q.a ? `<span class="pill pill-ok">答對</span>` : `<span class="pill pill-bad">答錯</span>`) : "";
        return `<div class="question">
          ${submitted ? `<div class="row"><span class="pill">${q.type}</span>${verdict}</div>` : ""}
          <div class="qtext">${i + 1}. ${esc(q.q)}</div>
          <div class="options">${opts}</div>
          ${submitted ? `<div class="explain">解析：${esc(q.ex)}</div>` : ""}
        </div>`;
      }).join("");
      const score = submitted ? set.qs.filter((q, i) => picked[i] === q.a).length : 0;
      const allPicked = set.qs.every((q, i) => picked[i] !== undefined);
      const nextId = state.queue.ids.find((id) => !setDoneToday(id) && id !== set.id);
      const script = set.lines.map((l) => `<div>${set.part === 3 ? `<b>${l.sp === "W" ? "Woman" : "Man"}:</b> ` : ""}${esc(l.t)}</div>`).join("");
      main = `
      <div class="panel">
        <div class="row"><span class="eyebrow">Part ${set.part} · ${set.part === 3 ? "對話" : "獨白"}</span>${state.queue.ids.includes(set.id) ? `<span class="pill pill-amber">今天的題目</span>` : ""}</div>
        <h2>${esc(set.title)}</h2>
        ${canSpeak ? `<div class="player">
            <button class="btn btn-amber" data-action="play" id="btn-play">▶ 播放</button>
            <button class="btn" data-action="stop">■ 停止</button>
            <label class="speed small muted">語速
              <select id="speed" data-action="speed">
                <option value="0.85" ${speed === 0.85 ? "selected" : ""}>慢</option>
                <option value="1" ${speed === 1 ? "selected" : ""}>正常</option>
                <option value="1.15" ${speed === 1.15 ? "selected" : ""}>快（比考試難）</option>
              </select></label>
          </div>
          <p class="small muted">跟正式考試一樣，題目已經印在下面，可以先看題目再聽。</p>`
          : `<p class="small muted">這個瀏覽器沒辦法朗讀英文，請直接看逐字稿作答（建議用電腦版 Chrome 或 Edge）。</p>`}
        ${qs}
        <div class="row">
          ${submitted
            ? `<strong>${score} / ${set.qs.length} 題答對</strong>
               ${nextId ? `<button class="btn btn-primary" data-action="open-set" data-id="${nextId}">下一組</button>` : `<a class="btn btn-primary" href="#today">回到今天</a>`}`
            : `<button class="btn btn-primary" data-action="submit" ${allPicked ? "" : "disabled"}>對答案</button>
               <span class="small muted">${allPicked ? "" : "三題都選好才能對答案"}</span>`}
          <button class="btn" data-action="toggle-script">${showScript ? "收起逐字稿" : submitted || !canSpeak ? "看逐字稿" : "偷看逐字稿"}</button>
        </div>
        ${showScript ? `<div class="transcript">${script}</div>` : ""}
      </div>`;
    }
    $("#view-listening").innerHTML = `${main}
      <div class="panel"><h3>全部題組</h3><div class="set-list">${listHtml}</div></div>`;
  }

  function submitSet() {
    const set = SETS.find((s) => s.id === activeSetId);
    if (!set) return;
    submitted = true;
    stopSpeech();
    const wrong = [];
    set.qs.forEach((q, i) => {
      const ok = picked[i] === q.a;
      if (!ok) wrong.push(i);
      const t = state.types[q.type] || { c: 0, t: 0 };
      t.t += 1; if (ok) t.c += 1;
      state.types[q.type] = t;
    });
    const prev = state.sets[set.id] || { attempts: 0 };
    state.sets[set.id] = { attempts: prev.attempts + 1, lastCorrect: set.qs.length - wrong.length, lastDate: todayKey(), wrong };
    updateToday();
    renderListening();
    renderChips();
  }

  /* 朗讀：用瀏覽器內建的英文語音 */
  function englishVoices() {
    const vs = window.speechSynthesis.getVoices().filter((v) => /^en[-_]/i.test(v.lang));
    const us = vs.filter((v) => /en[-_]US/i.test(v.lang));
    const gb = vs.filter((v) => /en[-_]GB/i.test(v.lang));
    const a = us[0] || vs[0] || null;
    const b = gb[0] || us[1] || vs.find((v) => v !== a) || a;
    return { a, b };
  }
  function play() {
    const set = SETS.find((s) => s.id === activeSetId);
    if (!set || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const { a, b } = englishVoices();
    const btn = $("#btn-play");
    set.lines.forEach((l, idx) => {
      const u = new SpeechSynthesisUtterance(l.t);
      u.lang = "en-US";
      u.rate = speed;
      if (l.sp === "M") { u.voice = b; u.pitch = 0.85; } else { u.voice = a; u.pitch = l.sp === "W" ? 1.15 : 1; }
      if (idx === set.lines.length - 1) u.onend = () => { if (btn) btn.textContent = "▶ 再聽一次"; };
      synth.speak(u);
    });
    if (btn) btn.textContent = "播放中…";
  }
  function stopSpeech() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    const btn = $("#btn-play"); if (btn) btn.textContent = "▶ 播放";
  }
  if ("speechSynthesis" in window) window.speechSynthesis.onvoiceschanged = () => {};

  /* ---------- SQL ---------- */
  let sqlPromise = null;
  let SQL = null;
  let activeLevel = null;
  const drafts = {};
  let sqlOutput = "";

  function loadSql() {
    if (sqlPromise) return sqlPromise;
    sqlPromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = SQLJS_BASE + "sql-wasm.js";
      s.onload = () => window.initSqlJs({ locateFile: (f) => SQLJS_BASE + f }).then(resolve, reject);
      s.onerror = () => reject(new Error("load"));
      document.head.appendChild(s);
    }).then((lib) => { SQL = lib; return lib; });
    sqlPromise.catch(() => { sqlPromise = null; });
    return sqlPromise;
  }
  function runQuery(sql) {
    const db = new SQL.Database();
    try {
      db.run(window.SQL_SCHEMA);
      const res = db.exec(sql);
      return res.length ? res[res.length - 1] : { columns: [], values: [] };
    } finally { db.close(); }
  }
  const norm = (v) => (typeof v === "number" ? String(Math.round(v * 100) / 100) : v === null ? "NULL" : String(v));
  function sameResult(got, want, ordered) {
    if (got.columns.length !== want.columns.length || got.values.length !== want.values.length) return false;
    const g = got.values.map((r) => JSON.stringify(r.map(norm)));
    const w = want.values.map((r) => JSON.stringify(r.map(norm)));
    if (!ordered) { g.sort(); w.sort(); }
    return g.every((x, i) => x === w[i]);
  }
  function tableHtml(res, max = 50) {
    if (!res.columns.length) return `<p class="small muted">沒有結果（0 筆）。</p>`;
    const rows = res.values.slice(0, max).map((r) => `<tr>${r.map((v) => `<td>${esc(norm(v))}</td>`).join("")}</tr>`).join("");
    return `<div class="result-wrap"><table class="result"><thead><tr>${res.columns.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table></div>
      <p class="small muted">${res.values.length} 筆${res.values.length > max ? `（只顯示前 ${max} 筆）` : ""}</p>`;
  }
  function errorTip(msg) {
    if (/no such table/i.test(msg)) return "資料表名稱可能打錯了，看看右邊的資料表一覽。";
    if (/no such column/i.test(msg)) return "欄位名稱可能打錯了，或忘了寫「表名.欄位」。";
    if (/syntax error/i.test(msg)) return "語法有錯：檢查逗號、單引號、關鍵字順序（SELECT → FROM → WHERE → GROUP BY → ORDER BY → LIMIT）。";
    if (/ambiguous/i.test(msg)) return "這個欄位在兩張表都有，要寫成「表名.欄位」。";
    return "看看錯誤訊息，跟範例比對一下。";
  }

  function renderSql() {
    const cur = currentLevel();
    if (activeLevel === null) activeLevel = cur || LEVELS.length;
    const lv = LEVELS[activeLevel - 1];
    const passed = !!state.sqlPassed[lv.n];
    const locked = !passed && !listeningDoneToday();
    const levelsHtml = LEVELS.map((l) => {
      const p = state.sqlPassed[l.n];
      const future = !p && cur !== null && l.n > cur;
      return `<button class="lv ${p ? "passed" : ""} ${l.n === activeLevel ? "current" : ""}" data-action="level" data-n="${l.n}" ${future ? "disabled" : ""} aria-label="第 ${l.n} 關">${l.n}</button>`;
    }).join("");
    const tablesHtml = window.SQL_TABLES.map((t) => `
      <details class="table-ref"><summary>${t.name}（${t.zh}）</summary>
        <p class="small muted">${esc(t.cols)}</p>
        <div data-preview="${t.name}"><p class="small muted">載入中…</p></div>
      </details>`).join("");

    $("#view-sql").innerHTML = `
      <div class="panel">
        <span class="eyebrow">Formosa Leaf 台灣茶飲出口公司 · 國際業務實習</span>
        <p class="small muted">公司把茶葉、珍珠、糖漿賣給歐洲客戶。每一關主管會問你一個問題，用 SQL 從公司資料庫查出答案。</p>
        <div class="levels">${levelsHtml}</div>
      </div>
      <div class="sql-layout">
        <div class="panel">
          <div class="row"><span class="eyebrow">第 ${lv.n} 關／${LEVELS.length}</span>${passed ? `<span class="pill pill-ok">已通過</span>` : ""}</div>
          <h2>${esc(lv.title)}</h2>
          <div class="boss"><b>主管：</b>${esc(lv.boss)}</div>
          <p><strong>觀念</strong>　${esc(lv.concept)}</p>
          <div><p class="small muted">範例</p><pre>${esc(lv.example)}</pre></div>
          ${locked ? `<div class="feedback bad">先完成今天的多益聽力，才能挑戰新的一關。<a href="#listening">去做聽力</a></div>` : `
          <label for="editor" class="small muted">你的 SQL（Ctrl＋Enter 執行）</label>
          <textarea id="editor" class="editor" spellcheck="false" placeholder="在這裡寫 SQL…">${esc(drafts[lv.n] || "")}</textarea>
          <div class="row">
            <button class="btn btn-primary" data-action="run">▶ 執行</button>
            <button class="btn" data-action="hint">提示</button>
            <button class="btn" data-action="answer">看答案</button>
          </div>
          <div id="sql-out">${sqlOutput}</div>`}
        </div>
        <aside class="panel">
          <h3>資料表一覽</h3>
          <p class="small muted">點開可以看欄位和前 5 筆資料。</p>
          ${tablesHtml}
        </aside>
      </div>`;
    loadSql().then(fillPreviews).catch(() => {
      document.querySelectorAll("[data-preview]").forEach((el) => { el.innerHTML = `<p class="small muted">SQL 工具載入失敗，請確認網路後重新整理。</p>`; });
    });
  }
  function fillPreviews() {
    document.querySelectorAll("[data-preview]").forEach((el) => {
      el.innerHTML = tableHtml(runQuery(`SELECT * FROM ${el.dataset.preview} LIMIT 5;`), 5);
    });
  }
  async function runSql() {
    const lv = LEVELS[activeLevel - 1];
    const code = ($("#editor") || {}).value || "";
    drafts[lv.n] = code;
    const out = $("#sql-out");
    if (!code.trim()) { out.innerHTML = `<div class="feedback bad">先寫一點 SQL 再執行。</div>`; return; }
    out.innerHTML = `<p class="small muted">執行中…</p>`;
    try { await loadSql(); } catch (e) { out.innerHTML = `<div class="feedback bad">SQL 工具載入失敗，請確認網路後重新整理頁面。</div>`; return; }
    let got;
    try { got = runQuery(code); }
    catch (e) {
      sqlOutput = `<div class="feedback bad">SQL 錯誤：${esc(e.message)}<br><span class="small">${errorTip(e.message)}</span></div>`;
      out.innerHTML = sqlOutput; return;
    }
    const want = runQuery(lv.answer);
    let msg;
    if (sameResult(got, want, lv.ordered)) {
      const first = !state.sqlPassed[lv.n];
      if (first) state.sqlPassed[lv.n] = todayKey();
      updateToday(); renderChips();
      const next = LEVELS[lv.n] ? lv.n + 1 : null;
      msg = `<div class="feedback ok">答對了！${first ? "這一關通過。" : ""}${next ? ` <button class="btn btn-primary" data-action="level" data-n="${next}">下一關</button>` : " 12 關全部完成！"}</div>`;
    } else {
      const diff = got.columns.length !== want.columns.length
        ? `你選了 ${got.columns.length} 個欄位，主管要的是 ${want.columns.length} 個。`
        : got.values.length !== want.values.length
          ? `你查到 ${got.values.length} 筆，主管要的是 ${want.values.length} 筆。`
          : lv.ordered ? "資料對了，但順序或數值不一樣，檢查排序。" : "筆數對了，但內容不一樣。";
      msg = `<div class="feedback bad">還差一點：${diff}</div>`;
    }
    sqlOutput = msg + tableHtml(got);
    // 第一次通過時重畫整頁，讓上方關卡列解鎖下一關
    if (/feedback ok/.test(msg)) renderSql(); else out.innerHTML = sqlOutput;
  }

  /* ---------- 進度 ---------- */
  let confirmReset = false;
  function renderProgress() {
    const doneSets = SETS.filter((s) => state.sets[s.id]).length;
    let c = 0, t = 0;
    Object.values(state.types).forEach((x) => { c += x.c; t += x.t; });
    const sqlCount = Object.keys(state.sqlPassed).length;
    const today = new Date();
    const cells = [];
    for (let i = 27; i >= 0; i--) {
      const k = keyOf(addDays(today, -i));
      const r = state.days[k];
      const cls = r && r.l && r.s ? "both" : r && (r.l || r.s) ? "half" : "";
      cells.push(`<span class="${cls} ${i === 0 ? "today" : ""}" title="${k}"></span>`);
    }
    const typeRows = TYPES.map((ty) => {
      const x = state.types[ty];
      const rate = x && x.t ? x.c / x.t : null;
      return { ty, rate, x };
    }).sort((a, b) => (a.rate === null) - (b.rate === null) || (a.rate || 0) - (b.rate || 0));
    const weakest = typeRows.find((r) => r.rate !== null && r.x.t >= 2);
    const bars = typeRows.map(({ ty, rate, x }) => `
      <div class="bar"><span>${ty}</span>
        <div class="bar-track"><div class="bar-fill ${rate !== null && rate < 0.6 ? "low" : ""}" style="width:${rate === null ? 0 : Math.round(rate * 100)}%"></div></div>
        <span>${rate === null ? "—" : `${x.c}/${x.t}`}</span></div>`).join("");

    $("#view-progress").innerHTML = `
      <div class="panel">
        <h2>我的進度</h2>
        <div class="stats">
          <div class="stat"><span class="num">${streak()}</span><span class="muted small">連續天數</span></div>
          <div class="stat"><span class="num">${doneSets}/${SETS.length}</span><span class="muted small">聽力題組做過</span></div>
          <div class="stat"><span class="num">${t ? Math.round((c / t) * 100) + "%" : "—"}</span><span class="muted small">聽力總答對率</span></div>
          <div class="stat"><span class="num">${sqlCount}/${LEVELS.length}</span><span class="muted small">SQL 關卡</span></div>
        </div>
      </div>
      <div class="panel">
        <h3>最近 4 週</h3>
        <div class="cal">${cells.join("")}</div>
        <p class="small muted">綠色：聽力和 SQL 都完成。橘色：只完成一項。外框：今天。</p>
      </div>
      <div class="panel">
        <h3>聽力題型答對率</h3>
        <div class="bars">${bars}</div>
        <p class="small muted">${weakest ? `目前最需要加強：<strong>${weakest.ty}</strong>題。` : "多做幾組之後，這裡會顯示你最常錯的題型。"}</p>
      </div>
      <div class="panel">
        <h3>設定</h3>
        <label class="row" for="exam-date">多益考試日期 <input type="date" id="exam-date" value="${esc(state.examDate || "")}"></label>
        <p class="small muted">報名後記得改成正式日期。</p>
        <div class="row">
          <button class="btn" data-action="reset">${confirmReset ? "確定要清除所有進度？再按一次" : "清除所有進度"}</button>
          ${confirmReset ? `<button class="btn" data-action="cancel-reset">取消</button>` : ""}
        </div>
      </div>`;
  }

  /* ---------- 路由與事件 ---------- */
  const VIEWS = ["today", "listening", "sql", "progress"];
  function route() {
    const tab = VIEWS.includes(location.hash.slice(1)) ? location.hash.slice(1) : "today";
    VIEWS.forEach((v) => { $(`#view-${v}`).hidden = v !== tab; });
    document.querySelectorAll(".tabs a").forEach((a) => a.classList.toggle("active", a.dataset.tab === tab));
    if (tab !== "listening") stopSpeech();
    if (tab === "today") renderToday();
    if (tab === "listening") renderListening();
    if (tab === "sql") { sqlOutput = ""; renderSql(); }
    if (tab === "progress") { confirmReset = false; renderProgress(); }
    renderChips();
  }
  window.addEventListener("hashchange", route);

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-action]");
    if (!el || el.tagName === "SELECT" || el.tagName === "INPUT") return;
    const act = el.dataset.action;
    if (act === "open-set") openSet(el.dataset.id);
    if (act === "submit") submitSet();
    if (act === "play") play();
    if (act === "stop") stopSpeech();
    if (act === "toggle-script") { showScript = !showScript; renderListening(); }
    if (act === "level") { activeLevel = Number(el.dataset.n); sqlOutput = ""; renderSql(); window.scrollTo(0, 0); }
    if (act === "run") runSql();
    if (act === "hint" || act === "answer") {
      const lv = LEVELS[activeLevel - 1];
      if (act === "answer") {
        const ed = $("#editor"); ed.value = lv.answer; drafts[lv.n] = lv.answer;
        sqlOutput = `<div class="feedback ok" style="font-weight:400">答案已經放進編輯區，按「執行」看看結果，再試著自己打一次。</div>`;
      } else {
        sqlOutput = `<div class="feedback ok" style="font-weight:400">提示：${esc(lv.hint)}</div>`;
      }
      $("#sql-out").innerHTML = sqlOutput;
    }
    if (act === "reset") {
      if (!confirmReset) { confirmReset = true; renderProgress(); return; }
      state = defaultState(); save(); confirmReset = false; activeSetId = null; activeLevel = null;
      renderProgress(); renderChips();
    }
    if (act === "cancel-reset") { confirmReset = false; renderProgress(); }
  });
  document.addEventListener("change", (e) => {
    const el = e.target;
    if (el.dataset.action === "pick") { picked[Number(el.dataset.q)] = Number(el.value); renderListening(); }
    if (el.id === "speed") speed = Number(el.value);
    if (el.id === "exam-date") { state.examDate = el.value; save(); renderChips(); }
  });
  document.addEventListener("input", (e) => {
    if (e.target.id === "editor") drafts[activeLevel] = e.target.value;
  });
  document.addEventListener("keydown", (e) => {
    if (e.target.id === "editor" && (e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); runSql(); }
  });

  // 給 sync.js 用：讀目前進度、換成合併後的進度並重畫畫面
  window.studyApp = {
    get: () => state,
    replace(next) { state = Object.assign(defaultState(), next); save(); renderChips(); route(); },
  };
  $("#storage-note").textContent += " 題目來源：" + (window.QUESTION_SOURCE || "本機檔案") + "。";
  route();
})();
