
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT8yHpEmpNIWvi6FIo1ntB-tG_xjze0EE297G94Hp37vIsCH3QntRiUOo39_B5Ocg/pub?gid=1610754135&single=true&output=csv";

const memberEmoji = {
  "timelesz":"🕰️",
  "佐藤勝利":"❤️",
  "菊池風磨":"💜",
  "松島聡":"💚",
  "寺西拓人":"🩵",
  "原嘉孝":"🎽",
  "橋本将生":"🩷",
  "猪俣周杜":"💛",
  "篠塚大輝":"🤍"
};

const memberOrder = ["timelesz","佐藤勝利","菊池風磨","松島聡","寺西拓人","原嘉孝","橋本将生","猪俣周杜","篠塚大輝"];

const categories = {
  TV:{label:"TV",icon:"monitor"},
  RADIO:{label:"RADIO",icon:"radio"},
  MAGAZINE:{label:"MAGAZINE",icon:"book"},
  CONCERT:{label:"CONCERT",icon:"mic"},
  EVENT:{label:"EVENT",icon:"ticket"},
  RELEASE:{label:"RELEASE",icon:"disc"},
  MOVIE:{label:"MOVIE",icon:"movie"},
  BIRTHDAY:{label:"BIRTHDAY",icon:"cake"},
  YOUTUBE:{label:"YOUTUBE",icon:"play"}
};

const iconPaths = {
  search:'<circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path>',
  monitor:'<rect x="3" y="5" width="18" height="13" rx="2"></rect><path d="M8 21h8"></path>',
  radio:'<rect x="3" y="7" width="18" height="12" rx="2"></rect><path d="m7 7 10-4"></path><circle cx="8" cy="13" r="2"></circle><path d="M13 12h5M13 15h5"></path>',
  book:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5z"></path><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5A2.5 2.5 0 0 1 20 21.5z"></path>',
  mic:'<rect x="9" y="2" width="6" height="12" rx="3"></rect><path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8"></path>',
  ticket:'<path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v8a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2z"></path><path d="M13 6v12"></path>',
  disc:'<circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="2"></circle>',
  movie:'<rect x="3" y="6" width="18" height="14" rx="2"></rect><path d="m7 6 2-3M12 6l2-3M17 6l2-3"></path>',
  cake:'<path d="M4 10h16v10H4z"></path><path d="M8 10V7M12 10V6M16 10V7"></path><path d="M6 14c1.5 1 2.5 1 4 0 1.5 1 2.5 1 4 0 1.5 1 2.5 1 4 0"></path>',
  play:'<path d="m8 5 11 7-11 7z"></path>',
  clock:'<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path>',
  pin:'<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0z"></path><circle cx="12" cy="10" r="2"></circle>',
  link:'<path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"></path><path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1"></path>',
  "chevron-left":'<path d="m15 18-6-6 6-6"></path>',
  "chevron-right":'<path d="m9 18 6-6-6-6"></path>',
  x:'<path d="M18 6 6 18M6 6l12 12"></path>',
  layers:'<path d="m12 2 9 5-9 5-9-5z"></path><path d="m3 12 9 5 9-5M3 17l9 5 9-5"></path>'
};

const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name] || ""}</svg>`;
document.querySelectorAll("[data-icon]").forEach(el => el.innerHTML = icon(el.dataset.icon));

let events = [];
let shownMonth = new Date(2026, 6, 1);
let selectedMember = "ALL";
let selectedCategory = "ALL";
let searchText = "";
const $ = id => document.getElementById(id);

function parseCSV(text){
  const rows = [];
  let row = [], value = "", quoted = false;
  for(let i=0; i<text.length; i++){
    const char = text[i];
    if(char === '"'){
      if(quoted && text[i+1] === '"'){ value += '"'; i++; }
      else quoted = !quoted;
    } else if(char === ',' && !quoted){
      row.push(value); value = "";
    } else if((char === '\n' || char === '\r') && !quoted){
      if(char === '\r' && text[i+1] === '\n') i++;
      row.push(value); value = "";
      if(row.some(cell => cell !== "")) rows.push(row);
      row = [];
    } else {
      value += char;
    }
  }
  if(value.length || row.length){ row.push(value); rows.push(row); }
  return rows;
}

function normalizeRows(rows){
  if(!rows.length) return [];
  const headers = rows[0].map(h => h.trim().toLowerCase());
  return rows.slice(1).map((row, index) => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = (row[i] || "").trim());
    const members = (obj.members || "")
      .split(/[、,，]/)
      .map(v => v.trim())
      .filter(v => memberOrder.includes(v));
    return {
      id: obj.id || `row-${index+2}`,
      date: obj.date || "",
      time: obj.time || "",
      category: (obj.category || "").toUpperCase(),
      title: obj.title || "",
      venue: obj.venue || "",
      members,
      note: obj.note || "",
      url: obj.url || "",
      status: obj.status || "公開",
      addedAt: obj.added_at || obj.addedat || ""
    };
  }).filter(e => e.status !== "非公開" && e.date && e.title);
}

function validateData(list){
  const warnings = [];
  const seen = new Set();
  list.forEach((e, i) => {
    if(!/^\d{4}-\d{2}-\d{2}$/.test(e.date)) warnings.push(`${i+2}行目：日付形式を確認`);
    if(!categories[e.category]) warnings.push(`${i+2}行目：カテゴリー「${e.category}」を確認`);
    if(!e.members.length) warnings.push(`${i+2}行目：対象メンバーがありません`);
    if(e.url && !/^https?:\/\//i.test(e.url)) warnings.push(`${i+2}行目：URL形式を確認`);
    const key = `${e.date}|${e.time}|${e.title}`;
    if(seen.has(key)) warnings.push(`${i+2}行目：重複の可能性`);
    seen.add(key);
  });
  return warnings;
}

function isNew(event){
  if(!event.addedAt) return false;
  const added = new Date(event.addedAt);
  if(Number.isNaN(added.getTime())) return false;
  return Date.now() - added.getTime() <= 7 * 24 * 60 * 60 * 1000;
}

function getFilteredEvents(){
  return events.filter(e => {
    const memberOk = selectedMember === "ALL" || e.members.includes(selectedMember);
    const categoryOk = selectedCategory === "ALL" || e.category === selectedCategory;
    const haystack = `${e.title} ${e.venue} ${e.members.join(" ")} ${e.note}`.toLowerCase();
    return memberOk && categoryOk && haystack.includes(searchText.toLowerCase());
  });
}

function renderFilters(){
  $("memberFilters").innerHTML = [
    {key:"ALL",label:"すべて",emoji:""},
    ...memberOrder.map(m => ({key:m,label:m,emoji:memberEmoji[m]}))
  ].map(item => `
    <button class="chip ${selectedMember===item.key?"active":""}" data-member="${item.key}">
      ${item.emoji ? `<span>${item.emoji}</span>` : ""}<span>${item.label}</span>
    </button>`).join("");

  document.querySelectorAll("[data-member]").forEach(btn => {
    btn.onclick = () => {
      selectedMember = btn.dataset.member;
      renderFilters();
      renderCalendar();
    };
  });

  $("categoryFilters").innerHTML = [
    {key:"ALL",label:"すべて",icon:"layers"},
    ...Object.entries(categories).map(([key,v]) => ({key,label:v.label,icon:v.icon}))
  ].map(item => `
    <button class="chip ${selectedCategory===item.key?"active":""}" data-category="${item.key}">
      ${icon(item.icon)}<span>${item.label}</span>
    </button>`).join("");

  document.querySelectorAll("[data-category]").forEach(btn => {
    btn.onclick = () => {
      selectedCategory = btn.dataset.category;
      renderFilters();
      renderCalendar();
    };
  });
}

function renderCalendar(){
  const year = shownMonth.getFullYear();
  const month = shownMonth.getMonth();
  const monthEvents = getFilteredEvents().filter(e => {
    const d = new Date(`${e.date}T00:00:00`);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  $("monthLabel").textContent = `${year}.${String(month+1).padStart(2,"0")}`;
  $("countLabel").textContent = `${monthEvents.length} schedules`;

  const firstWeekday = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month+1, 0).getDate();
  const today = new Date();
  let html = "";

  for(let i=0; i<firstWeekday; i++) html += '<div class="day blank"></div>';

  for(let day=1; day<=lastDate; day++){
    const date = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    const dayEvents = monthEvents.filter(e => e.date === date);
    const uniqueMembers = memberOrder.filter(m => dayEvents.some(e => e.members.includes(m)));
    const isToday = today.getFullYear()===year && today.getMonth()===month && today.getDate()===day;

    html += `
      <div class="day ${dayEvents.length?"has-events":""} ${isToday?"today":""}" data-date="${date}">
        <div class="day-number">${day}</div>
        <div class="member-icons">
          ${uniqueMembers.map(m => `<span class="member-emoji">${memberEmoji[m]}</span>`).join("")}
        </div>
      </div>`;
  }

  $("calendarGrid").innerHTML = html;
  document.querySelectorAll(".day.has-events").forEach(cell => {
    cell.onclick = () => openDay(cell.dataset.date);
  });
}

function openDay(date){
  const list = getFilteredEvents()
    .filter(e => e.date === date)
    .sort((a,b) => (a.time || "99:99").localeCompare(b.time || "99:99"));
  const d = new Date(`${date}T00:00:00`);
  $("dialogDate").textContent = `${d.getMonth()+1}月${d.getDate()}日`;
  $("dialogEvents").innerHTML = list.map(e => `
    <article class="event-card">
      <div class="event-top">
        <div class="event-icon">${icon(categories[e.category]?.icon || "layers")}</div>
        <div>
          <h3 class="event-title">${e.title}${isNew(e) ? '<span class="new-badge">NEW</span>' : ""}</h3>
          <div class="event-meta">
            ${e.time ? `<span>${icon("clock")}${e.time}〜</span>` : ""}
            ${e.venue ? `<span>${icon("pin")}${e.venue}</span>` : ""}
            <span>${e.category}</span>
          </div>
          <div class="event-members">${e.members.map(m => `${memberEmoji[m]} ${m}`).join("　")}</div>
          ${e.note ? `<p class="event-note">${e.note}</p>` : ""}
          ${e.url ? `<a class="link-button" href="${e.url}" target="_blank" rel="noopener">${icon(e.category==="YOUTUBE"?"play":"link")}${e.category==="YOUTUBE"?"動画を見る":"公式ページを見る"}</a>` : ""}
        </div>
      </div>
    </article>`).join("");
  $("eventDialog").showModal();
}

async function loadEvents(){
  try {
    const response = await fetch(`${SHEET_CSV_URL}&t=${Date.now()}`, {cache:"no-store"});
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    const csv = await response.text();
    events = normalizeRows(parseCSV(csv));

    const warnings = validateData(events);
    $("dataWarnings").textContent = warnings.length
      ? `データ確認：${warnings.length}件（管理用）`
      : "";
    $("totalEvents").textContent = `全${events.length}件`;
    $("lastUpdated").textContent = `最終更新：${new Date().toLocaleString("ja-JP", {
      year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"
    })}`;

    if(events.length){
      const latest = [...events].sort((a,b) => a.date.localeCompare(b.date))[0];
      const d = new Date(`${latest.date}T00:00:00`);
      shownMonth = new Date(d.getFullYear(), d.getMonth(), 1);
    }

    $("loadingState").classList.add("hidden");
    renderFilters();
    renderCalendar();
  } catch(error) {
    console.error(error);
    if (Array.isArray(window.FALLBACK_EVENTS) && window.FALLBACK_EVENTS.length) {
      events = window.FALLBACK_EVENTS;
      $("loadingState").classList.add("hidden");
      $("totalEvents").textContent = `全${events.length}件`;
      $("lastUpdated").textContent = "最終更新：2026.07.13";
      $("dataWarnings").textContent = "現在は保存済みデータを表示しています。";
      renderFilters();
      renderCalendar();
    } else {
      $("loadingState").textContent = "予定を読み込めませんでした。";
      $("dataWarnings").textContent = "スプレッドシートの公開設定を確認してください。";
    }
  }
}

$("prevMonth").onclick = () => {
  shownMonth = new Date(shownMonth.getFullYear(), shownMonth.getMonth()-1, 1);
  renderCalendar();
};
$("nextMonth").onclick = () => {
  shownMonth = new Date(shownMonth.getFullYear(), shownMonth.getMonth()+1, 1);
  renderCalendar();
};
$("todayBtn").onclick = () => {
  const d = new Date();
  shownMonth = new Date(d.getFullYear(), d.getMonth(), 1);
  renderCalendar();
};
$("searchInput").oninput = e => {
  searchText = e.target.value;
  renderCalendar();
};
$("closeDialog").onclick = () => $("eventDialog").close();
$("eventDialog").onclick = e => {
  if(e.target === $("eventDialog")) $("eventDialog").close();
};

loadEvents();
