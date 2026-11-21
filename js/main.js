const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const CATS = {
  all: ["All", "Todo"], sport: ["Sport", "Sport"], dama: ["Women", "Dama"], nino: ["Kids", "Niño/a"],
  hombre: ["Men", "Hombre"], "3d": ["3D", "3D"], tooling: ["Outsoles", "Matricería"],
  tech: ["Tech packs", "Fichas"], sys: ["Systems", "Sistemas"]
};
let L = (() => { try { return localStorage.getItem("lang"); } catch (e) { return null; } })()
  || (navigator.language.startsWith("es") ? "es" : "en");
let D = null, cat = "all";
const i = L2 => (L2 === "es" ? 1 : 0);

function paint() {
  document.documentElement.lang = L;
  $$("[data-en]").forEach(e => { e.innerHTML = e.dataset[L]; });
  $("#lang").textContent = L === "es" ? "EN" : "ES";
  if (!D) return;
  $("#steps").innerHTML = D.steps.map(s =>
    `<li><h3>${s[i(L)]}</h3><p>${s[i(L) + 2]}</p></li>`).join("");
  $("#filters").innerHTML = Object.keys(CATS).map(k =>
    `<button type="button" data-k="${k}" aria-pressed="${k === cat}">${CATS[k][i(L)]}</button>`).join("");
  $("#grid").innerHTML = D.work.map((w, n) => {
    if (cat !== "all" && w[1] !== cat) return "";
    const t = w[3 + i(L)];
    return `<button type="button" class="it${w[2] ? " feat" : ""}" data-n="${n}"><img loading="lazy" src="assets/img/${w[0]}" alt="${t}"><span>${t}</span></button>`;
  }).join("");
}

document.addEventListener("click", e => {
  if (e.target.closest("#lang")) {
    L = L === "es" ? "en" : "es";
    try { localStorage.setItem("lang", L); } catch (err) {}
    return paint();
  }
  const f = e.target.closest("#filters button");
  if (f) { cat = f.dataset.k; return paint(); }
  const it = e.target.closest(".it");
  if (it) {
    const w = D.work[it.dataset.n], lb = $("#lb"), a = lb.querySelector("a");
    lb.querySelector("img").src = "assets/img/" + w[0];
    lb.querySelector("img").alt = w[3 + i(L)];
    lb.querySelector("p").textContent = w[3 + i(L)];
    a.hidden = !w[5];
    if (w[5]) { a.href = "assets/img/" + w[5]; a.textContent = L === "es" ? "Ver plano PDF completo" : "Open full PDF plan"; }
    return lb.showModal();
  }
  if (e.target.closest(".x") || e.target === $("#lb")) $("#lb").close();
});

paint();
fetch("data/projects.json").then(r => r.json()).then(d => { D = d; paint(); })
  .catch(() => { $("#grid").textContent = "Run a local server (python -m http.server) or publish on GitHub Pages."; });

/* ola del hero: el gradiente ondula con un desplazamiento animado */
const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (still) { const v = $(".hero video"); if (v) v.pause(); }
else {
  const tb = $("#turb"); let t = 0;
  (function wave() {
    t += 0.004;
    tb.setAttribute("baseFrequency", `${(0.011 + 0.004 * Math.sin(t)).toFixed(4)} ${(0.028 + 0.01 * Math.cos(t * 1.3)).toFixed(4)}`);
    requestAnimationFrame(wave);
  })();
}
