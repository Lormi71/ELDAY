(function () {
  const cfg = window.ELDAY_CONFIG;
  const picks = {}; // categoryId -> nominee name
  const STORE_KEY = "elday_voted_v1";

  const $ = (s) => document.querySelector(s);
  const root = $("#categories");
  const errorEl = $("#error");
  const progressEl = $("#progress");
  const submitBtn = $("#submit");

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
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

      cat.nominees.forEach((n) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "card" + (cat.textOnly ? " text" : "");
        btn.setAttribute("aria-pressed", "false");
        if (cat.textOnly) {
          btn.textContent = n.name;
        } else {
          btn.innerHTML = `<div class="ph"></div><div class="name">${esc(n.name)}</div>`;
          const ph = btn.querySelector(".ph");
          const img = new Image();
          img.alt = n.name;
          img.onload = () => ph.appendChild(img);
          img.onerror = () => {
            ph.innerHTML = `<span class="initial">${esc(n.name.charAt(0))}</span>`;
          };
          img.src = n.img;
        }
        btn.addEventListener("click", () => select(cat.id, n.name, box, btn));
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

  function showThanks() {
    $("#who").hidden = true;
    root.hidden = true;
    document.querySelector(".submit-panel").hidden = true;
    $("#thanks").hidden = false;
    $("#thanks").scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function submit() {
    errorEl.textContent = "";
    const nick = $("#nick").value.trim();
    if (!nick) { errorEl.textContent = "Впиши свой ник в Discord."; $("#nick").focus(); return; }
    if (!Object.keys(picks).length) { errorEl.textContent = "Выбери хотя бы одну номинацию."; return; }
    if (localStorage.getItem(STORE_KEY)) { errorEl.textContent = "С этого браузера уже голосовали."; return; }

    const fields = cfg.categories
      .filter((c) => picks[c.id])
      .map((c) => ({ name: c.title, value: picks[c.id], inline: false }));

    submitBtn.disabled = true;
    submitBtn.textContent = "Отправляю...";

    try {
      if (cfg.webhookUrl) {
        const res = await fetch(cfg.webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: "ELDAY",
            embeds: [{
              title: "Новый голос",
              description: "Голосующий: **" + nick + "**",
              color: 0xff3b1d,
              fields,
              timestamp: new Date().toISOString()
            }]
          })
        });
        if (!res.ok) throw new Error("webhook " + res.status);
      } else {
        console.log("Вебхук не задан (демо). Голос:", { nick, picks });
      }
      try { localStorage.setItem(STORE_KEY, "1"); } catch (e) {}
      showThanks();
    } catch (e) {
      errorEl.textContent = "Не получилось отправить. Попробуй ещё раз.";
      submitBtn.disabled = false;
      submitBtn.textContent = "Отправить голос";
    }
  }

  submitBtn.addEventListener("click", submit);
  render();

  try { if (localStorage.getItem(STORE_KEY)) showThanks(); } catch (e) {}
})();
