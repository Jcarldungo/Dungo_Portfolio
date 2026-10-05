"use strict";

const projects = {
  fold: {
    kicker: "01 / Residential · 2024",
    title: "House in the Fold",
    image: "assets/house.jpg",
    imageAlt: "A restrained modern house set into a green landscape",
    description: "A compact family home imagined for a sloping site. Its plan follows the ground instead of flattening it, keeping the shared rooms open to the garden and the changing light.",
    materials: "Board-formed concrete, pale timber, planted roof, filtered daylight."
  },
  quiet: {
    kicker: "02 / Interiors · 2023",
    title: "A Quiet Interior",
    image: "assets/interior.jpg",
    imageAlt: "A calm interior study in warm wood and soft daylight",
    description: "An interior concept built around a small palette and an unhurried sequence of rooms. Timber, plaster and soft daylight carry the character; storage is integrated into the architecture.",
    materials: "Oiled oak, mineral plaster, linen, warm indirect light."
  }
};

const filterButtons = [...document.querySelectorAll("[data-filter]")];
const projectCards = [...document.querySelectorAll(".project[data-category]")];
const projectCount = document.querySelector("#project-count");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.filter;
    let visible = 0;
    projectCards.forEach((card) => {
      const show = category === "all" || card.dataset.category === category;
      card.hidden = !show;
      if (show) visible += 1;
    });
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    projectCount.textContent = String(visible).padStart(2, "0");
  });
});

const dialog = document.querySelector("#project-dialog");
const closeDialog = dialog.querySelector(".dialog-close");
document.querySelectorAll("[data-project]").forEach((button) => {
  button.addEventListener("click", () => {
    const project = projects[button.dataset.project];
    if (!project) return;
    document.querySelector("#dialog-kicker").textContent = project.kicker;
    document.querySelector("#dialog-title").textContent = project.title;
    const dialogImage = document.querySelector("#dialog-image");
    dialogImage.src = project.image;
    dialogImage.alt = project.imageAlt;
    document.querySelector("#dialog-description").textContent = project.description;
    document.querySelector("#dialog-materials").textContent = project.materials;
    dialog.showModal();
  });
});
closeDialog.addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  siteNav.classList.toggle("is-open", !isOpen);
});
siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    siteNav.classList.remove("is-open");
  });
});

const enquiryForm = document.querySelector("#enquiry-form");
const feedback = document.querySelector("#form-feedback");
enquiryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!enquiryForm.reportValidity()) return;
  feedback.textContent = "Your details are ready. This local demo does not send enquiries.";
  enquiryForm.reset();
});
