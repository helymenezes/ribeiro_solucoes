import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD_4F2TyECIrT_rvKaKkgn5MDNfaEgmvrk",
  authDomain: "my-ladingpage.firebaseapp.com",
  databaseURL: "https://my-ladingpage-default-rtdb.firebaseio.com",
  projectId: "my-ladingpage",
  storageBucket: "my-ladingpage.firebasestorage.app",
  messagingSenderId: "511615222539",
  appId: "1:511615222539:web:6d0b6597f96c1b6db4180e"
};

const SAFE_IMAGE_DATA_URL_PATTERN = /^data:image\/(?:jpeg|jpg|png|webp|gif);base64,[A-Za-z0-9+/=]+$/;
const MAX_SERVICE_IMAGES = 60;
const GALLERY_EMPTY_MESSAGE = "Nenhuma imagem disponivel nesta galeria.";
const GALLERY_ERROR_MESSAGE = "Erro ao carregar imagens.";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const closeLightboxButton = document.getElementById("btnCloseLightbox");
const galleryTitle = document.body.dataset.galleryTitle || "";

function normalizeKey(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function isSafeImageDataUrl(value) {
  return SAFE_IMAGE_DATA_URL_PATTERN.test(String(value ?? ""));
}

function normalizeServicesData(input) {
  const source = Array.isArray(input)
    ? input
    : input && typeof input === "object"
      ? Object.values(input)
      : [];

  return source
    .filter(item => item && typeof item === "object")
    .map(item => ({
      title: String(item.title ?? "").replace(/\s+/g, " ").trim().slice(0, 80),
      images: Array.isArray(item.images)
        ? item.images.filter(isSafeImageDataUrl).slice(0, MAX_SERVICE_IMAGES)
        : []
    }));
}

function clearElement(element) {
  if (!element) return;
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function setGalleryMessage(message, className = "empty") {
  clearElement(gallery);
  const messageElement = document.createElement("div");
  messageElement.className = className;
  messageElement.textContent = message;
  gallery.appendChild(messageElement);
}

function closeLightbox() {
  lightbox.classList.remove("show");
  lbImg.src = "";
}

function openLightboxForImage(dataURL) {
  if (!isSafeImageDataUrl(dataURL)) return;
  lbImg.src = dataURL;
  lightbox.classList.add("show");
}

function createGalleryCard(dataURL, index) {
  const card = document.createElement("div");
  card.className = "card";

  const image = document.createElement("img");
  image.src = dataURL;
  image.alt = `${galleryTitle || "Galeria"} ${index + 1}`;
  image.addEventListener("click", () => openLightboxForImage(dataURL));

  card.appendChild(image);
  return card;
}

function renderGallery(images) {
  const safeImages = Array.isArray(images) ? images.filter(isSafeImageDataUrl) : [];
  if (!safeImages.length) {
    setGalleryMessage(GALLERY_EMPTY_MESSAGE);
    return;
  }

  clearElement(gallery);
  safeImages.forEach((dataURL, index) => {
    gallery.appendChild(createGalleryCard(dataURL, index));
  });
}

function loadGalleryFromLocalStorage() {
  try {
    const data = JSON.parse(localStorage.getItem("servicesData") || "null");
    const services = normalizeServicesData(data);
    const service = services.find(item => normalizeKey(item.title) === normalizeKey(galleryTitle));
    renderGallery(service?.images || []);
  } catch (error) {
    setGalleryMessage(GALLERY_ERROR_MESSAGE);
  }
}

async function loadGallery() {
  try {
    const snapshot = await get(ref(db, "portfolio/services"));
    if (!snapshot.exists()) {
      setGalleryMessage(GALLERY_EMPTY_MESSAGE);
      return;
    }

    const services = normalizeServicesData(snapshot.val());
    const service = services.find(item => normalizeKey(item.title) === normalizeKey(galleryTitle));
    renderGallery(service?.images || []);
  } catch (error) {
    console.error("Erro ao carregar galeria:", error);
    loadGalleryFromLocalStorage();
  }
}

if (closeLightboxButton) {
  closeLightboxButton.addEventListener("click", closeLightbox);
}

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});

void loadGallery();
