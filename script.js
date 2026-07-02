/* ============ DATA ============ */
const MENU_ITEMS = [
  {
    id: "dendeng-balado",
    name: "Dendeng Balado",
    price: 28000,
    img: "./img/dendeng.jpg",
  },
  {
    id: "ayam-pop",
    name: "Ayam Pop",
    price: 25000,
    img: "./img/ayampop.jpg",
  },
  {
    id: "tumis-kangkung",
    name: "Tumis Kangkung",
    price: 15000,
    img: "./img/tumiskangkung.jpg",
  },
  {
    id: "rendang",
    name: "Rendang",
    price: 32000,
    img: "./img/rendang.jpg",
  },
  {
    id: "ayam-gulai",
    name: "Ayam Gulai",
    price: 26000,
    img: "./img/ayamgulai.jpg",
  },
  {
    id: "gulai-tambusu",
    name: "Gulai Tambusu",
    price: 24000,
    img: "./img/gulaitambusu.jpg",
  },
  {
    id: "gulai-kikil",
    name: "Gulai Kikil",
    price: 23000,
    img: "./img/gulaikikil.jpg",
  },
  {
    id: "ayam-rendang",
    name: "Ayam Rendang",
    price: 27000,
    img: "./img/ayamrendang.jpg",
  },
  {
    id: "sayur-sayuran",
    name: "Sayur-Sayuran",
    price: 14000,
    img: "./img/sayuran.jpg",
  },
];

const WHATSAPP_NUMBER = "6285102332894"; // ganti dengan nomor WA pemilik

/* ============ STATE (localStorage) ============ */
const STORAGE_USER = "sr_user";
const STORAGE_CART = "sr_cart";

function getUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_USER));
  } catch {
    return null;
  }
}
function setUser(user) {
  localStorage.setItem(STORAGE_USER, JSON.stringify(user));
}
function clearUser() {
  localStorage.removeItem(STORAGE_USER);
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_CART)) || {};
  } catch {
    return {};
  }
}
function setCart(cart) {
  localStorage.setItem(STORAGE_CART, JSON.stringify(cart));
}

/* ============ NAVIGATION ============ */
const pages = ["home", "login", "pesanan"];

function showPage(pageId, clickedEl) {
  if (pageId === "pesanan" && !getUser()) {
    pageId = "login";
  }
  if (pageId === "login" && getUser()) {
    pageId = "pesanan";
  }
  pages.forEach((p) => {
    const el = document.getElementById(`page-${p}`);
    if (el) el.style.display = p === pageId ? "" : "none";
  });
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle(
      "active",
      clickedEl ? link === clickedEl : link.dataset.page === pageId,
    );
  });
  window.scrollTo({ top: 0, behavior: "auto" });
  closeMobileNav();
}

document.addEventListener("click", (e) => {
  const target = e.target.closest("[data-page]");
  if (target) {
    e.preventDefault();
    const isNavLink = target.classList.contains("nav-link");
    showPage(target.dataset.page, isNavLink ? target : null);
    const scrollTarget = target.dataset.scroll;
    if (scrollTarget && scrollTarget !== "top") {
      setTimeout(() => {
        const el = document.getElementById(scrollTarget);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  }
});

function closeMobileNav() {
  document.getElementById("navLinks").classList.remove("open");
}

document.getElementById("hamburger").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("open");
});

/* ============ AUTH UI ============ */
function refreshAuthUI() {
  const user = getUser();
  const navUser = document.getElementById("navUser");
  const navPesanan = document.getElementById("navPesanan");
  const heroPesanBtn = document.querySelector(".btn-outline-gold"); // cari by class saja, bukan by data-page

  if (user) {
    navUser.style.display = "flex";
    navPesanan.style.display = "flex";
    document.getElementById("userNameLabel").textContent =
      user.name.split(" ")[0];
    if (heroPesanBtn) {
      heroPesanBtn.setAttribute("data-page", "pesanan");
      heroPesanBtn.removeAttribute("data-scroll");
    }
  } else {
    navUser.style.display = "none";
    navPesanan.style.display = "none";
    if (heroPesanBtn) {
      heroPesanBtn.setAttribute("data-page", "login"); // sekarang selalu ditemukan
    }
  }
  updateOrderBadge();
}

document.getElementById("logoutBtn").addEventListener("click", (e) => {
  e.preventDefault();
  clearUser();
  refreshAuthUI();
  showPage("home");
  showToast("Anda telah keluar.");
});

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("loginName").value.trim();
  const phone = document.getElementById("loginPhone").value.trim();
  if (!name || !phone) return;
  setUser({ name, phone, address: "" });
  refreshAuthUI();
  showToast(`Selamat datang, ${name}!`);
  showPage("home", document.querySelector('.nav-link[data-scroll="menu"]'));
  setTimeout(() => {
    const el = document.getElementById("menu");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 50);
  e.target.reset();
});

/* ============ MENU RENDER ============ */
function renderMenu() {
  const grid = document.getElementById("menuGrid");
  grid.innerHTML = MENU_ITEMS.map(
    (item) => `
    <div class="menu-card">
      <div class="menu-card-image">
        <img src="${item.img}" alt="${item.name}" loading="lazy">
        <span class="halal-mini" title="Bersertifikat Halal">
          <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="30" fill="#264653"/>
            <circle cx="32" cy="32" r="30" fill="none" stroke="#C48A5A" stroke-width="2"/>
            <path d="M18 24 C18 20 21 17 25 17 C28 17 30 19 31 21 C32 19 34 17 37 17 C41 17 44 20 44 24 C44 30 36 36 31 41 C26 36 18 30 18 24 Z" fill="none" stroke="#FAF6F0" stroke-width="2.2" stroke-linejoin="round"/>
            <text x="32" y="50" text-anchor="middle" font-family="Georgia, serif" font-size="9" font-weight="700" fill="#FAF6F0">HALAL</text>
          </svg>
        </span>
      </div>
      <div class="menu-card-body">
        <div>
          <p class="menu-card-name">${item.name}</p>
          <p class="menu-card-price">Rp ${item.price.toLocaleString("id-ID")}</p>
        </div>
        <button class="order-btn" data-id="${item.id}" aria-label="Pesan ${item.name}">+</button>
      </div>
    </div>
  `,
  ).join("");

  grid.querySelectorAll(".order-btn").forEach((btn) => {
    btn.addEventListener("click", () => handleOrderClick(btn.dataset.id, btn));
  });
}

function handleOrderClick(itemId, btnEl) {
  const user = getUser();
  if (!user) {
    showToast("Silakan login terlebih dahulu untuk memesan.");
    showPage("login");
    return;
  }
  const cart = getCart();
  cart[itemId] = (cart[itemId] || 0) + 1;
  setCart(cart);
  updateOrderBadge();

  if (btnEl) {
    btnEl.classList.add("added");
    btnEl.textContent = "✓";
    setTimeout(() => {
      btnEl.classList.remove("added");
      btnEl.textContent = "+";
    }, 700);
  }
  const item = MENU_ITEMS.find((i) => i.id === itemId);
  showToast(`${item.name} ditambahkan ke Pesanan Saya.`);
}

/* ============ ORDER BADGE ============ */
function updateOrderBadge() {
  const cart = getCart();
  const total = Object.values(cart).reduce((a, b) => a + b, 0);
  document.getElementById("orderBadge").textContent = total;
}

/* ============ PESANAN SAYA RENDER ============ */
function renderOrders() {
  const cart = getCart();
  const list = document.getElementById("orderList");
  const entries = Object.entries(cart).filter(([, qty]) => qty > 0);

  if (entries.length === 0) {
    list.innerHTML = `<p class="empty-state">Belum ada pesanan. Yuk pilih menu favorit Anda.</p>`;
    document.getElementById("orderWhatsappBtn").disabled = true;
    return;
  }

  document.getElementById("orderWhatsappBtn").disabled = false;

  let totalPrice = 0;
  list.innerHTML =
    entries
      .map(([id, qty]) => {
        const item = MENU_ITEMS.find((i) => i.id === id);
        if (!item) return "";
        totalPrice += item.price * qty;
        return `
      <div class="order-item" data-id="${id}">
        <img src="${item.img}" alt="${item.name}">
        <div class="order-item-info">
          <h4>${item.name}</h4>
          <span>Rp ${item.price.toLocaleString("id-ID")}</span>
        </div>
        <div class="qty-control">
          <button class="qty-minus" data-id="${id}" aria-label="Kurangi">−</button>
          <span>${qty}</span>
          <button class="qty-plus" data-id="${id}" aria-label="Tambah">+</button>
        </div>
        <button class="remove-btn" data-id="${id}">Hapus</button>
      </div>
    `;
      })
      .join("") +
    `<div class="order-summary-line"><span>Total</span><span>Rp ${totalPrice.toLocaleString("id-ID")}</span></div>`;

  list
    .querySelectorAll(".qty-plus")
    .forEach((b) =>
      b.addEventListener("click", () => changeQty(b.dataset.id, 1)),
    );
  list
    .querySelectorAll(".qty-minus")
    .forEach((b) =>
      b.addEventListener("click", () => changeQty(b.dataset.id, -1)),
    );
  list
    .querySelectorAll(".remove-btn")
    .forEach((b) =>
      b.addEventListener("click", () => removeItem(b.dataset.id)),
    );
}

function changeQty(id, delta) {
  const cart = getCart();
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  setCart(cart);
  updateOrderBadge();
  renderOrders();
}

function removeItem(id) {
  const cart = getCart();
  delete cart[id];
  setCart(cart);
  updateOrderBadge();
  renderOrders();
}

/* ============ WHATSAPP ORDER ============ */
document.getElementById("orderWhatsappBtn").addEventListener("click", () => {
  const cart = getCart();
  const entries = Object.entries(cart).filter(([, qty]) => qty > 0);
  if (entries.length === 0) return;

  const address = document.getElementById("deliveryAddress").value.trim();
  const phone = document.getElementById("deliveryPhone").value.trim();
  const time = document.getElementById("deliveryTime").value.trim();

  const itemLines = entries
    .map(([id, qty]) => {
      const item = MENU_ITEMS.find((i) => i.id === id);
      return `- ${item.name} x${qty}`;
    })
    .join("\n");

  const message = `Assalamu'alaikum, saya ingin pesan makanan sebagai berikut :
${itemLines}

Alamat Pengiriman : ${address || "-"}
Nomor HP/WA yang bisa di hubungi : ${phone || "-"}
Waktu Pengantaran : ${time || "-"}`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
});

/* ============ TOAST ============ */
let toastTimer;
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

/* ============ INIT ============ */
function init() {
  renderMenu();
  refreshAuthUI();
  showPage("home", document.querySelector('.nav-link[data-scroll="top"]'));

  // re-render pesanan whenever that page becomes visible
  document.querySelectorAll("[data-page='pesanan']").forEach((el) => {
    el.addEventListener("click", renderOrders);
  });
}

document.addEventListener("DOMContentLoaded", init);
