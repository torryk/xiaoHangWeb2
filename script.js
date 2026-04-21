const memoryFiles = [
  "微信图片_20251224231056_174_40.jpg",
  "微信图片_20251224211326_153_40.jpg",
  "微信图片_20251224211341_157_40.jpg",
  "微信图片_20251224231210_177_40.jpg",
  "微信图片_20251224211232_145_40.jpg",
  "微信图片_20251224211342_158_40.jpg",
  "微信图片_20251224211230_144_40.jpg",
  "微信图片_20251224211235_146_40.jpg",
  "微信图片_20251224211236_147_40.jpg",
  "微信图片_20251224211245_148_40.jpg",
  "微信图片_20251224211253_149_40.jpg",
  "微信图片_20251224211301_150_40.jpg",
  "微信图片_20251224211306_151_40.jpg",
  "微信图片_20251224211314_152_40.jpg",
  "微信图片_20251224211329_154_40.jpg",
  "微信图片_20251224211332_155_40.jpg",
  "微信图片_20251224231025_159_40.jpg",
  "微信图片_20251224231026_160_40.jpg",
  "微信图片_20251224231027_161_40.jpg",
  "微信图片_20251224231028_162_40.jpg",
  "微信图片_20251224231030_163_40.jpg",
  "微信图片_20251224231030_164_40.jpg",
  "微信图片_20251224231032_165_40.jpg",
  "微信图片_20251224231033_166_40.jpg",
  "微信图片_20251224231035_167_40.jpg",
  "微信图片_20251224231036_168_40.jpg",
  "微信图片_20251224231037_169_40.jpg",
  "微信图片_20251224231038_170_40.jpg",
  "微信图片_20251224231040_171_40.jpg",
  "微信图片_20251224231053_172_40.jpg",
];

const featuredMeta = {
  "微信图片_20251224231056_174_40.jpg": {
    title: "相伴",
    note: "被镜子和玫瑰同时收藏的一次合照，很适合作为整页的封面。",
    alt: "情侣在红色花海和镜面空间里合照",
  },
  "微信图片_20251224211326_153_40.jpg": {
    title: "向海",
    note: "牵着手往落日里走的那个瞬间，把故事一下子拉长了。",
    alt: "海边夕阳下牵手前行的照片",
  },
  "微信图片_20251224211341_157_40.jpg": {
    title: "灯影",
    note: "在金色反射里被认真看见的一秒，适合放进页面的情绪中心。",
    alt: "金色灯光里的女生肖像",
  },
  "微信图片_20251224231210_177_40.jpg": {
    title: "雪夜",
    note: "冬天的明暗对比很强，能给整页故事收一个安静但有力的尾声。",
    alt: "男生在雪夜里自拍",
  },
  "微信图片_20251224211232_145_40.jpg": {
    title: "晚餐时刻",
    note: "一顿饭也能被记成温柔的一页，适合留住日常感。",
    alt: "女生在餐桌前手持筷子的照片",
  },
  "微信图片_20251224211342_158_40.jpg": {
    title: "剪影",
    note: "像一张把未来也一起画进去的画，适合放进纪念册的情绪页。",
    alt: "情侣背影面对夕阳海面的画作",
  },
};

const genericTitles = [
  "心动切片",
  "温柔存档",
  "日常光斑",
  "片刻收藏",
  "慢镜头",
  "留白一页",
];

const genericNotes = [
  "把普通一天过成值得反复翻看的样子。",
  "镜头把心动保存得比记忆还慢一些。",
  "留给未来某天重新打开的一帧。",
  "连空气里的光都像被认真收藏了起来。",
  "适合放进这本线上纪念册的一次停留。",
  "不用解释太多，画面已经把情绪说完了。",
];

// Gallery data stays in one place so future edits only need to touch this file.
const memories = memoryFiles.map((file, index) => {
  const fallback = {
    title: `${genericTitles[index % genericTitles.length]} ${String(index + 1).padStart(2, "0")}`,
    note: genericNotes[index % genericNotes.length],
    alt: `情侣记录照片 ${String(index + 1).padStart(2, "0")}`,
  };

  return {
    id: index + 1,
    file,
    ...fallback,
    ...featuredMeta[file],
  };
});

const galleryGrid = document.getElementById("gallery-grid");
const photoCount = document.getElementById("photo-count");
const storyCount = document.getElementById("story-count");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxNote = document.getElementById("lightbox-note");
const lightboxClose = document.getElementById("lightbox-close");

function buildGallery() {
  if (!galleryGrid) return;

  const fragment = document.createDocumentFragment();

  memories.forEach((memory) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "memory-card";
    card.setAttribute("aria-label", `查看照片：${memory.title}`);

    const order = document.createElement("span");
    order.className = "memory-order";
    order.textContent = `Frame ${String(memory.id).padStart(2, "0")}`;

    const image = document.createElement("img");
    image.src = `photo/${encodeURI(memory.file)}`;
    image.alt = memory.alt;
    image.loading = "lazy";
    image.decoding = "async";

    const text = document.createElement("span");
    text.className = "memory-text";

    const title = document.createElement("strong");
    title.textContent = memory.title;

    const note = document.createElement("span");
    note.textContent = memory.note;

    text.append(title, note);
    card.append(order, image, text);
    card.addEventListener("click", () => openLightbox(memory));
    fragment.appendChild(card);
  });

  galleryGrid.appendChild(fragment);
}

function openLightbox(memory) {
  if (!lightbox) return;

  lightbox.hidden = false;
  document.body.classList.add("no-scroll");
  lightboxImage.src = `photo/${encodeURI(memory.file)}`;
  lightboxImage.alt = memory.alt;
  lightboxTitle.textContent = memory.title;
  lightboxNote.textContent = memory.note;
  lightboxClose.focus();
}

function closeLightbox() {
  if (!lightbox || lightbox.hidden) return;

  lightbox.hidden = true;
  lightboxImage.src = "";
  lightboxImage.alt = "";
  document.body.classList.remove("no-scroll");
}

function bindLightbox() {
  if (!lightbox || !lightboxClose) return;

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.close === "true") closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
  });
}

function bindReveal() {
  const revealItems = document.querySelectorAll("[data-reveal]");
  if (!revealItems.length) return;

  revealItems.forEach((item) => item.classList.add("is-visible"));
}

function applyPageStats() {
  if (photoCount) {
    photoCount.textContent = `${memories.length}+`;
  }

  if (storyCount) {
    storyCount.textContent = "4";
  }
}

buildGallery();
bindLightbox();
bindReveal();
applyPageStats();
