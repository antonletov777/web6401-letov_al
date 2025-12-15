const API_BASE = "http://localhost:3000";
const ENDPOINT_FEEDBACK = `${API_BASE}/feedback`;
const ENDPOINT_STANDINGS = `${API_BASE}/standings`;
const POLL_MS = 60 * 1000; 

function $(id) {
  return document.getElementById(id);
}

function setHint(id, text, isError) {
  const hint = $(`hint-${id}`);
  const input = $(id);

  if (hint) {
    hint.textContent = text || "";
    hint.classList.toggle("hint--error", Boolean(isError));
  }
  if (input) {
    input.classList.toggle("input--error", Boolean(isError));
    input.classList.toggle("input--ok", !isError && input.value.trim() !== "");
  }
}

function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function withTimeout(ms) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), ms);
  return { controller, cancel: () => clearTimeout(t) };
}

class FeedbackData {
  constructor(name, email, team, agree) {
    this.name = name;
    this.email = email;
    this.team = team;
    this.agree = agree;
    this.createdAt = new Date().toISOString();
  }

  printToConsole() {
    console.log("=== Новый отклик от пользователя ===");
    console.log(`Имя: ${this.name}`);
    console.log(`Email: ${this.email}`);
    console.log(`Любимая команда: ${this.team}`);
    console.log(`Согласие: ${this.agree ? "Да" : "Нет"}`);
    console.log("====================================");
  }
}

function validateName() {
  const v = $("name")?.value.trim() ?? "";
  if (v.length === 0) return (setHint("name", "Введите имя.", true), false);
  if (v.length < 2) return (setHint("name", "Минимум 2 символа.", true), false);
  setHint("name", "", false);
  return true;
}

function validateEmail() {
  const v = $("email")?.value.trim() ?? "";
  if (v.length === 0) return (setHint("email", "Введите email.", true), false);
  if (!isEmailValid(v)) return (setHint("email", "Неверный email (пример: user@mail.com).", true), false);
  setHint("email", "", false);
  return true;
}

function validateTeam() {
  const v = $("team")?.value.trim() ?? "";
  if (v.length === 0) return (setHint("team", "Выберите команду.", true), false);
  setHint("team", "", false);
  return true;
}

function validateAgree() {
  const ok = $("agree")?.checked ?? false;
  const hint = $("hint-agree");
  if (!ok) {
    if (hint) {
      hint.textContent = "Нужно согласие для отправки.";
      hint.classList.add("hint--error");
    }
    return false;
  }
  if (hint) {
    hint.textContent = "";
    hint.classList.remove("hint--error");
  }
  return true;
}

function validateFormAll() {
  const a = validateName();
  const b = validateEmail();
  const c = validateTeam();
  const d = validateAgree();
  return a && b && c && d;
}

function wireForm() {
  const form = $("feedbackForm");
  if (!form) return;

  $("name")?.addEventListener("input", validateName);
  $("name")?.addEventListener("blur", validateName);

  $("email")?.addEventListener("input", validateEmail);
  $("email")?.addEventListener("blur", validateEmail);

  $("team")?.addEventListener("change", validateTeam);

  $("agree")?.addEventListener("change", validateAgree);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const status = $("formStatus");
    if (status) status.textContent = "";

    if (!validateFormAll()) {
      if (status) status.textContent = "Исправьте ошибки в форме.";
      return;
    }

    const data = new FeedbackData(
      $("name").value.trim(),
      $("email").value.trim(),
      $("team").value.trim(),
      $("agree").checked
    );

    data.printToConsole();

    try {
      if (status) status.textContent = "Отправка…";

      const { controller, cancel } = withTimeout(8000);
      const res = await fetch(ENDPOINT_FEEDBACK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: controller.signal
      }).finally(cancel);

      if (!res.ok) throw new Error(`POST failed: ${res.status}`);

      if (status) status.textContent = "Успешно отправлено";
      form.reset();

      setHint("name", "", false);
      setHint("email", "", false);
      setHint("team", "", false);
      validateAgree();
    } catch (e) {
      console.error(e);
      if (status) status.textContent = "Ошибка отправки (сервер недоступен/таймаут)";
    }
  });
}

let standingsInFlight = false;

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? String(n) : "—";
}

function renderStandings(rows) {
  const tbody = $("standingsBody");
  if (!tbody) return;

  tbody.innerHTML = "";
  for (const r of rows) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="team-name">${escapeHtml(r.team ?? "")}</td>
      <td>${num(r.played)}</td>
      <td class="wins">${num(r.wins)}</td>
      <td class="draws">${num(r.draws)}</td>
      <td class="losses">${num(r.losses)}</td>
      <td class="goals">${num(r.gf)}</td>
      <td class="goals">${num(r.ga)}</td>
      <td><strong>${num(r.points)}</strong></td>
    `;
    tbody.appendChild(tr);
  }
}

async function loadStandings() {
  const tbody = $("standingsBody");
  if (!tbody) return;

  const status = $("tableStatus");
  if (standingsInFlight) return;
  standingsInFlight = true;

  try {
    if (status) {
      status.textContent = "Загрузка таблицы…";
      status.classList.remove("table-status--error");
    }

    const { controller, cancel } = withTimeout(8000);
    const res = await fetch(ENDPOINT_STANDINGS, { signal: controller.signal }).finally(cancel);
    if (!res.ok) throw new Error(`Ошибка GET запроса: ${res.status}`);

    const json = await res.json();
    if (!json || !Array.isArray(json.data)) throw new Error("Неверный формат данных");

    renderStandings(json.data);
    if (status) status.textContent = `Обновлено: ${new Date().toLocaleString("ru-RU")}`;
  } catch (e) {
    console.error(e);
    if (status) {
      status.textContent = "Ошибка загрузки таблицы (сервер/таймаут).";
      status.classList.add("table-status--error");
    }
  } finally {
    standingsInFlight = false;
  }
}

function startStandingsPolling() {
  if (!$("standingsBody")) return;
  loadStandings();
  setInterval(loadStandings, POLL_MS);
}

document.addEventListener("DOMContentLoaded", () => {
  wireForm();
  startStandingsPolling();
});
