(function () {
  const cfg = window.ELDAY_CONFIG;
  const picks = {}; // categoryId -> выбранный вариант
  const STORE_KEY = "elday_voted_v1";

  const $ = (s) => document.querySelector(s);
  const root = $("#categories");
  const errorEl = $("#error");
  const progressEl = $("#progress");
  const submitBtn = $("#submit");
  const nickInput = $("#nick");

  const useSb = !!(cfg.supabaseUrl && cfg.supabaseKey && window.supabase);
  let sb = null;
  let user = null;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  // Пробует загрузить картинку и с другими расширениями (.jpg/.png/.jpeg/.webp)
  const EXTS = [".jpg", ".png", ".jpeg", ".webp"];
  function tryLoad(src, ok, fail) {
    const base = src.replace(/\.[^./]+$/, "");
    const list = [src].concat(EXTS.map((e) => base + e).filter((s) => s !== src));
    let i = 0;
    (function next() {
      if (i >= list.length) { if (fail) fail(); return; }
      const im = new Image();
      im.onload = () => ok(im);
      im.onerror = next;
      im.src = list[i++];
    })();
  }

  function render() {
    cfg.categories.forEach((cat, i) => {
      const sec = document.createElement("section");
      sec.className = "category";
      sec.innerHTML = `
        <div class="cat-head">
          <div class="cat-num">НОМИНАЦИЯ ${i + 1}</div>
          <h2 class="cat-title">${esc(cat.title)}</h2>
          <p class="cat-desc">${esc(cat.desc || "")}</p>
        </div>
        <div class="${cat.textOnly ? "options" : "nominees"}"></div>`;
      const box = sec.querySelector(".options, .nominees");

      if (cat.icon) {
        tryLoad(cat.icon, (im) => {
          im.className = "cat-icon";
          im.alt = "";
          sec.querySelector(".cat-head").prepend(im);
        });
      }

      cat.nominees.forEach((n) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "card" + (cat.textOnly ? " text" : "");
        btn.setAttribute("aria-pressed", "false");
        if (cat.textOnly) {
          btn.textContent = n.name;
        } else {
          btn.innerHTML = `<div class="ph"></div><div class="name">${esc(n.name)}</div>` +
            (n.sub ? `<div class="sub">${esc(n.sub)}</div>` : "");
          const ph = btn.querySelector(".ph");
          tryLoad(
            n.img,
            (img) => { img.alt = n.name; ph.appendChild(img); },
            () => { ph.innerHTML = `<span class="initial">${esc(n.name.charAt(0))}</span>`; }
          );
        }
        const label = n.sub ? n.name + " (" + n.sub + ")" : n.name;
        btn.addEventListener("click", () => select(cat.id, label, box, btn));
        box.appendChild(btn);
      });
      root.appendChild(sec);
    });
    updateProgress();
  }

  function select(catId, name, box, btn) {
    const same = picks[catId] === name;
    box.querySelectorAll(".card").forEach((c) => {
      c.classList.remove("selected");
      c.setAttribute("aria-pressed", "false");
    });
    if (same) {
      delete picks[catId];
    } else {
      picks[catId] = name;
      btn.classList.add("selected");
      btn.setAttribute("aria-pressed", "true");
    }
    updateProgress();
  }

  function updateProgress() {
    const n = Object.keys(picks).length;
    progressEl.textContent = `Выбрано: ${n} из ${cfg.categories.length}`;
  }

  function showThanks(text) {
    $("#ballot").hidden = true;
    $("#login").hidden = true;
    if (text) $("#thanksText").textContent = text;
    $("#thanks").hidden = false;
    $("#thanks").scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function sendWebhook(nick, fields, discordId) {
    if (!cfg.webhookUrl) return;
    const res = await fetch(cfg.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "ELDAY",
        embeds: [{
          title: "Новый голос",
          description: "Голосующий: **" + nick + "**" + (discordId ? " (<@" + discordId + ">)" : ""),
          color: 0xff3b1d,
          fields,
          timestamp: new Date().toISOString()
        }]
      })
    });
    if (!res.ok) throw new Error("webhook " + res.status);
  }

  async function submit() {
    errorEl.textContent = "";
    const nick = nickInput.value.trim();
    if (!nick) { errorEl.textContent = "Впиши свой ник в Discord."; nickInput.focus(); return; }
    if (!Object.keys(picks).length) { errorEl.textContent = "Выбери хотя бы одну номинацию."; return; }
    if (!useSb) {
      try { if (localStorage.getItem(STORE_KEY)) { errorEl.textContent = "С этого браузера уже голосовали."; return; } } catch (e) {}
    }

    const fields = cfg.categories
      .filter((c) => picks[c.id])
      .map((c) => ({ name: c.title, value: picks[c.id], inline: false }));

    submitBtn.disabled = true;
    submitBtn.textContent = "Отправляю...";

    try {
      if (useSb) {
        // Главная защита: в базе у каждого аккаунта Discord может быть только одна запись
        const payload = {};
        cfg.categories.forEach((c) => { if (picks[c.id]) payload[c.title] = picks[c.id]; });
        const meta = user.user_metadata || {};
        const discordId = meta.provider_id || null;
        const { error } = await sb.from("votes").insert({ nick, discord_id: discordId, picks: payload });
        if (error) {
          if (error.code === "23505") { showThanks("Ты уже голосовал. Второй раз нельзя."); return; }
          throw error;
        }
        try { await sendWebhook(nick, fields, discordId); } catch (e) { console.warn(e); }
      } else if (cfg.webhookUrl) {
        await sendWebhook(nick, fields, null);
      } else {
        console.log("Демо-режим. Голос:", { nick, picks });
      }
      try { localStorage.setItem(STORE_KEY, "1"); } catch (e) {}
      showThanks();
    } catch (e) {
      console.error(e);
      errorEl.textContent = "Не получилось отправить. Попробуй ещё раз.";
      submitBtn.disabled = false;
      submitBtn.textContent = "Отправить голос";
    }
  }

  async function init() {
    render();
    submitBtn.addEventListener("click", submit);

    // обложка: ищем с любым расширением
    tryLoad("img/bg.jpg", (im) => {
      const hero = document.querySelector(".hero");
      if (hero) hero.style.backgroundImage = `url("${im.src}")`;
    });

    if (!useSb) {
      try { if (localStorage.getItem(STORE_KEY)) showThanks(); } catch (e) {}
      return;
    }

    // режим с входом через Discord
    sb = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseKey);
    $("#ballot").hidden = true;
    $("#login").hidden = false;
    $("#loginBtn").addEventListener("click", () => {
      sb.auth.signInWithOAuth({
        provider: "discord",
        options: { redirectTo: location.origin + location.pathname }
      });
    });

    const { data } = await sb.auth.getSession();
    user = data && data.session ? data.session.user : null;
    if (!user) return;

    $("#login").hidden = true;
    $("#ballot").hidden = false;

    const meta = user.user_metadata || {};
    const claims = meta.custom_claims || {};
    nickInput.value = claims.global_name || meta.full_name || meta.name || "";
    nickInput.readOnly = true;

    const { data: rows } = await sb.from("votes").select("user_id").limit(1);
    if (rows && rows.length) showThanks("Ты уже голосовал. Второй раз нельзя.");
  }

  init();
})();
