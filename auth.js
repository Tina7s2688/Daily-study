// 第二階段第 5 步：登入（Supabase Auth，用 email 登入連結，不用密碼）
(function () {
  const sb = window.sb;
  const btn = document.getElementById("auth-btn");
  const panel = document.getElementById("auth-panel");
  if (!sb || !btn) return;
  btn.hidden = false;
  let user = null;

  function show() {
    btn.textContent = user ? "已登入" : "登入";
    if (panel.hidden) return;
    panel.innerHTML = user
      ? `<div class="auth-box">
           <p>目前登入：<strong>${user.email}</strong></p>
           <p class="muted">下一步會把作答進度存到這個帳號，換裝置也看得到。</p>
           <button class="btn" type="button" id="auth-logout">登出</button>
         </div>`
      : `<form class="auth-box" id="auth-form">
           <label for="auth-email">輸入 email，我們會寄一封登入信給你</label>
           <div class="auth-row">
             <input id="auth-email" type="email" required autocomplete="email" placeholder="you@example.com">
             <button class="btn" type="submit">寄登入信</button>
           </div>
           <p class="muted" id="auth-msg">不用設密碼：點信裡的連結就會登入。</p>
         </form>`;
  }

  btn.addEventListener("click", () => { panel.hidden = !panel.hidden; show(); });

  panel.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = document.getElementById("auth-msg");
    const email = document.getElementById("auth-email").value.trim();
    msg.textContent = "寄送中…";
    const { error } = await sb.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: location.origin + location.pathname },
    });
    msg.textContent = error
      ? "寄送失敗：" + error.message + "（太頻繁的話等一小時再試）"
      : "寄出了！去信箱點「Log In」連結（可能在垃圾郵件）。";
  });

  panel.addEventListener("click", async (e) => {
    if (e.target.id === "auth-logout") { await sb.auth.signOut(); panel.hidden = true; }
  });

  sb.auth.onAuthStateChange((_event, session) => { user = session ? session.user : null; show(); });
})();
