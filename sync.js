// 第二階段第 6 步：登入後，把進度存到 Supabase 的 progress 表
(function () {
  const sb = window.sb, app = window.studyApp;
  if (!sb || !app) return;
  const note = document.getElementById("storage-note");
  const baseNote = note.textContent;
  let user = null, timer = null;

  // 兩份進度合併：做過的都算，同一組題目取比較新的那次
  function merge(a, b) {
    const m = JSON.parse(JSON.stringify(a));
    for (const [k, v] of Object.entries(b.days || {})) {
      const x = m.days[k] || {};
      m.days[k] = { l: !!(x.l || v.l), s: !!(x.s || v.s) };
    }
    for (const [id, v] of Object.entries(b.sets || {})) {
      const x = m.sets[id];
      if (!x || v.lastDate > x.lastDate || (v.lastDate === x.lastDate && v.attempts > x.attempts)) m.sets[id] = v;
    }
    for (const [t, v] of Object.entries(b.types || {})) {
      if (!m.types[t] || v.t > m.types[t].t) m.types[t] = v;
    }
    for (const [n, d] of Object.entries(b.sqlPassed || {})) {
      if (!m.sqlPassed[n] || d < m.sqlPassed[n]) m.sqlPassed[n] = d;
    }
    if ((b.queue && b.queue.date) > (m.queue && m.queue.date)) m.queue = b.queue;
    return m;
  }

  async function upload(data) {
    const { error } = await sb.from("progress")
      .upsert({ user_id: user.id, data, updated_at: new Date().toISOString() });
    note.textContent = error
      ? "雲端同步失敗：" + error.message + "（進度仍存在這台裝置）"
      : `進度已同步到雲端（${user.email}），換裝置登入也看得到。`;
  }

  // app.js 每次存檔都會呼叫這裡；等 1 秒沒有新動作再上傳，避免一直傳
  window.onProgressSaved = (state) => {
    if (!user) return;
    clearTimeout(timer);
    timer = setTimeout(() => upload(state), 1000);
  };

  async function onLogin() {
    note.textContent = "正在讀取雲端進度…";
    const { data, error } = await sb.from("progress").select("data").eq("user_id", user.id).maybeSingle();
    if (error) { note.textContent = "讀取雲端進度失敗：" + error.message; return; }
    const merged = data ? merge(app.get(), data.data) : app.get();
    app.replace(merged); // 會觸發 save → 上傳
  }

  sb.auth.onAuthStateChange((event, session) => {
    const next = session ? session.user : null;
    const changed = (next && next.id) !== (user && user.id);
    user = next;
    if (!changed) return;
    if (user) setTimeout(onLogin, 0);
    else note.textContent = baseNote;
  });
})();
