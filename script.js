const memories = [
  { file: "微信图片_20251224211230_144_40.jpg" },
  { file: "微信图片_20251224211232_145_40.jpg" },
  { file: "微信图片_20251224211235_146_40.jpg" },
  { file: "微信图片_20251224211236_147_40.jpg" },
  { file: "微信图片_20251224211245_148_40.jpg" },
  { file: "微信图片_20251224211253_149_40.jpg" },
  { file: "微信图片_20251224211301_150_40.jpg" },
  { file: "微信图片_20251224211306_151_40.jpg" },
  { file: "微信图片_20251224211314_152_40.jpg" },
  {
    file: "微信图片_20251224211326_153_40.jpg",
    title: "向海",
    note: "牵着手往海面与落日里走，是这一册最自然的开场。",
    alt: "海边落日下牵手向前的瞬间",
  },
  { file: "微信图片_20251224211329_154_40.jpg" },
  { file: "微信图片_20251224211332_155_40.jpg" },
  {
    file: "微信图片_20251224211341_157_40.jpg",
    title: "灯影",
    note: "金色灯光把人物留下来，也把当时的安静一起留下来。",
    alt: "金色灯影中的女生肖像",
  },
  {
    file: "微信图片_20251224211342_158_40.jpg",
    title: "插页",
    note: "像一张写给未来的附页，让整册多了一层情绪上的留白。",
    alt: "面对海面与落日的双人剪影画作",
  },
  { file: "微信图片_20251224231025_159_40.jpg" },
  { file: "微信图片_20251224231026_160_40.jpg" },
  { file: "微信图片_20251224231027_161_40.jpg" },
  { file: "微信图片_20251224231028_162_40.jpg" },
  { file: "微信图片_20251224231030_163_40.jpg" },
  { file: "微信图片_20251224231030_164_40.jpg" },
  { file: "微信图片_20251224231032_165_40.jpg" },
  { file: "微信图片_20251224231033_166_40.jpg" },
  { file: "微信图片_20251224231035_167_40.jpg" },
  { file: "微信图片_20251224231036_168_40.jpg" },
  { file: "微信图片_20251224231037_169_40.jpg" },
  { file: "微信图片_20251224231038_170_40.jpg" },
  { file: "微信图片_20251224231040_171_40.jpg" },
  { file: "微信图片_20251224231053_172_40.jpg" },
  {
    file: "微信图片_20251224231056_174_40.jpg",
    title: "相伴",
    note: "花房和镜面把这次合照放大成封面，也保留了现场的真实感。",
    alt: "情侣在红色花房与镜面空间中的合照",
  },
  {
    file: "微信图片_20251224231210_177_40.jpg",
    title: "落雪",
    note: "雪夜像最后一章，把整本影像册安静地收住。",
    alt: "落雪中的男生自拍",
  },
];

const fallbackTitles = [
  "页边记",
  "回看",
  "沿途",
  "停顿处",
  "余温",
  "慢镜头",
  "光线",
  "私藏页",
];

const fallbackNotes = [
  "这一帧适合留在页边，让当天的光继续停一会儿。",
  "不是每张照片都要讲故事，有些只负责把情绪留下来。",
  "它更像生活里的一个片段，而不是需要解释的情节。",
  "翻回这一页的时候，先被记住的会是当天的空气感。",
  "普通的一天如果被认真保存，也会慢慢长出纪念感。",
  "它不需要被放大声，只要被妥帖地留在顺序里。",
];

const indexContainer = document.getElementById("frame-index");
const galleryGrid = document.getElementById("gallery-grid");
const photoCount = document.getElementById("photo-count");
const galleryTotal = document.getElementById("gallery-total");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxNote = document.getElementById("lightbox-note");
const lightboxCount = document.getElementById("lightbox-count");
const lightboxClose = document.getElementById("lightbox-close");
const lightboxPrev = document.getElementById("lightbox-prev");
const lightboxNext = document.getElementById("lightbox-next");

let currentIndex = 0;
let lastTrigger = null;

const archive = memories.map((memory, index) => {
  const frame = String(index + 1).padStart(2, "0");
  return {
    id: index + 1,
    frame,
    title: memory.title ?? `${fallbackTitles[index % fallbackTitles.length]} ${frame}`,
    note: memory.note ?? fallbackNotes[index % fallbackNotes.length],
    alt: memory.alt ?? `纪念册照片第 ${frame} 帧`,
    file: memory.file,
  };
});

function encodedPath(file) {
  return `photo/${encodeURIComponent(file).replace(/%2F/g, "/")}`;
}

function buildIndex() {
  if (!indexContainer) return;

  const fragment = document.createDocumentFragment();

  archive.forEach((memory) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "frame-chip";
    chip.setAttribute("aria-label", `定位到第 ${memory.frame} 帧：${memory.title}`);

    const count = document.createElement("span");
    count.className = "frame-chip__count";
    count.textContent = memory.frame;

    const title = document.createElement("span");
    title.className = "frame-chip__title";
    title.textContent = memory.title;

    chip.append(count, title);
    chip.addEventListener("click", () => focusFrame(memory.id));
    fragment.appendChild(chip);
  });

  indexContainer.appendChild(fragment);
}

function buildGallery() {
  if (!galleryGrid) return;

  const fragment = document.createDocumentFragment();

  archive.forEach((memory, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "memory-card";
    card.id = `frame-${memory.frame}`;
    card.setAttribute("aria-label", `查看第 ${memory.frame} 帧：${memory.title}`);

    const image = document.createElement("img");
    image.src = encodedPath(memory.file);
    image.alt = memory.alt;
    image.loading = index < 10 ? "eager" : "lazy";
    image.fetchPriority = index < 6 ? "high" : "auto";
    image.decoding = "async";

    const text = document.createElement("span");
    text.className = "memory-text";

    const order = document.createElement("span");
    order.className = "memory-order";
    order.textContent = `Frame ${memory.frame}`;

    const title = document.createElement("strong");
    title.textContent = memory.title;

    const note = document.createElement("span");
    note.className = "memory-note";
    note.textContent = memory.note;

    text.append(order, title, note);
    card.append(image, text);
    card.addEventListener("click", () => openLightbox(index, card));
    fragment.appendChild(card);
  });

  galleryGrid.appendChild(fragment);
}

function focusFrame(id) {
  const target = document.getElementById(`frame-${String(id).padStart(2, "0")}`);
  if (!target) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "center",
  });
  target.classList.add("is-targeted");
  target.focus({ preventScroll: true });
  window.setTimeout(() => target.classList.remove("is-targeted"), 1800);
}

function renderLightbox(index) {
  currentIndex = (index + archive.length) % archive.length;
  const memory = archive[currentIndex];

  lightboxImage.src = encodedPath(memory.file);
  lightboxImage.alt = memory.alt;
  lightboxTitle.textContent = memory.title;
  lightboxNote.textContent = memory.note;
  lightboxCount.textContent = `Frame ${memory.frame}`;
}

function openLightbox(index, trigger) {
  if (!lightbox) return;

  lastTrigger = trigger ?? null;
  renderLightbox(index);
  lightbox.hidden = false;
  document.body.classList.add("no-scroll");
  lightboxClose.focus();
}

function closeLightbox() {
  if (!lightbox || lightbox.hidden) return;

  lightbox.hidden = true;
  lightboxImage.src = "";
  lightboxImage.alt = "";
  document.body.classList.remove("no-scroll");

  if (lastTrigger instanceof HTMLElement) {
    lastTrigger.focus();
  }
}

function bindLightbox() {
  if (!lightbox) return;

  lightboxClose?.addEventListener("click", closeLightbox);
  lightboxPrev?.addEventListener("click", () => renderLightbox(currentIndex - 1));
  lightboxNext?.addEventListener("click", () => renderLightbox(currentIndex + 1));

  lightbox.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.dataset.close === "true") {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") renderLightbox(currentIndex - 1);
    if (event.key === "ArrowRight") renderLightbox(currentIndex + 1);
  });
}

function applyCounts() {
  const count = String(archive.length);
  if (photoCount) photoCount.textContent = count;
  if (galleryTotal) galleryTotal.textContent = count;
}

function bindReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;

  items.forEach((item) => item.classList.add("is-visible"));
}

buildIndex();
buildGallery();
applyCounts();
bindLightbox();
bindReveal();
