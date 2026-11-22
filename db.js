// 第二階段：先試著從 Supabase 讀題目；讀不到就用 data/listening.js 的題目。
(async function () {
  const url = window.SUPABASE_URL, key = window.SUPABASE_KEY;
  // 建立 Supabase 連線（登入要用）。登入信的連結點回來時，網址裡會帶著登入資訊，
  // getSession() 會把它讀出來存好，並把網址清乾淨，之後 app.js 的換頁才不會被干擾。
  if (window.supabase && url && key && key.startsWith("sb_")) {
    window.sb = window.supabase.createClient(url, key);
    try { await window.sb.auth.getSession(); } catch (e) { console.warn("登入狀態讀取失敗", e); }
  }
  try {
    if (!url || !key || !key.startsWith("sb_")) throw new Error("還沒設定 key");
    // 一次讀出所有題組，並把每組的題目一起帶出來（Supabase 幫你做 JOIN）
    const res = await fetch(
      url + "/rest/v1/listening_sets?select=id,part,title,lines,listening_questions(position,question,options,answer,type,explanation)&order=id",
      { headers: { apikey: key, Authorization: "Bearer " + key } }
    );
    if (!res.ok) throw new Error("HTTP " + res.status);
    const rows = await res.json();
    if (!rows.length) throw new Error("資料庫沒有題目");
    const order = (window.LISTENING_SETS || []).map((s) => s.id);
    const rank = (id) => (order.indexOf(id) === -1 ? 999 : order.indexOf(id));
    window.LISTENING_SETS = rows
      .sort((a, b) => rank(a.id) - rank(b.id))
      .map((s) => ({
        id: s.id, part: s.part, title: s.title, lines: s.lines,
        qs: s.listening_questions
          .sort((a, b) => a.position - b.position)
          .map((q) => ({ q: q.question, o: q.options, a: q.answer, type: q.type, ex: q.explanation })),
      }));
    window.QUESTION_SOURCE = "Supabase 雲端資料庫";
  } catch (err) {
    console.warn("改用本機題目：", err.message);
    window.QUESTION_SOURCE = "本機檔案";
  }
  for (const file of ["app.js", "auth.js", "sync.js"]) {
    const s = document.createElement("script");
    s.src = file; s.async = false;
    document.body.appendChild(s);
  }
})();
