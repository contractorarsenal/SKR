// Remove the no-transition blocker after first paint, then mark js as loaded
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.querySelectorAll("style").forEach(s => {
      if (s.textContent.includes("transition:none!important")) s.remove();
    });
    document.body.classList.add("js-loaded");
  });
});

(function initTicker() {
  const ticks = document.querySelectorAll("#tickerWrap .tick");
  if (!ticks.length) return;

  let i = 0;
  setInterval(() => {
    ticks[i].classList.remove("active");
    i = (i + 1) % ticks.length;
    ticks[i].classList.add("active");
  }, 2600);
})();

const burger = document.getElementById("hamburger");
const drawer = document.getElementById("drawer");
const drawerClose = document.getElementById("drawerClose");

function openDrawer() {
  if (!drawer) return;
  drawer.classList.add("open");
  if (burger) burger.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function _closeDrawer() {
  if (!drawer) return;
  drawer.classList.remove("open");
  if (burger) burger.classList.remove("is-open");
  document.body.style.overflow = "";
}

if (burger && drawer) {
  burger.addEventListener("click", openDrawer);
}

if (drawerClose && drawer) {
  drawerClose.addEventListener("click", _closeDrawer);
}

// Close on Escape key
document.addEventListener("keydown", e => {
  if (e.key === "Escape") _closeDrawer();
});

window.closeDrawer = _closeDrawer;

let floatDismissed = false;
const floatCta = document.getElementById("floatCta");

if (floatCta) {
  window.addEventListener(
    "scroll",
    () => {
      if (!floatDismissed && window.scrollY > 400) {
        floatCta.classList.add("vis");
      }
    },
    { passive: true }
  );
}

window.dismissFloat = function dismissFloat() {
  floatDismissed = true;
  if (floatCta) floatCta.classList.remove("vis");
};

window.openLightbox = function openLightbox(tile) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const img = tile ? tile.querySelector("img") : null;
  if (!lightbox || !lightboxImg || !img) return;

  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt || "";
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
};

window.closeLightbox = function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  lightbox.classList.remove("open");
  document.body.style.overflow = "";
};

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    window.closeLightbox();
  }
});

document.querySelectorAll(".proj-tile[role='button']").forEach((tile) => {
  tile.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      window.openLightbox(tile);
    }
  });
});

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach((item) => item.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;
    document.querySelectorAll(".proj-tile").forEach((tile) => {
      tile.style.display = filter === "all" || tile.dataset.cat === filter ? "block" : "none";
    });
  });
});

window.toggleFAQ = function toggleFAQ(el) {
  const item = el.closest(".faq-item");
  if (!item) return;

  const isOpen = item.classList.contains("open");
  document.querySelectorAll(".faq-item").forEach((faq) => faq.classList.remove("open"));
  if (!isOpen) item.classList.add("open");
};

window.handleForm = async function handleForm(event, form, successId) {
  event.preventDefault();

  const button = form.querySelector("button[type=submit]");
  const success = document.getElementById(successId);
  if (!button) return;

  const defaultLabel = button.dataset.label || button.textContent;
  button.dataset.label = defaultLabel;
  button.textContent = "Sending...";
  button.disabled = true;

  if (success) {
    success.style.display = "none";
    success.classList.remove("is-error");
  }

  const formData = new FormData(form);
  const firstName = (formData.get("first_name") || "").toString().trim();
  const lastName = (formData.get("last_name") || "").toString().trim();
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  const existingMessage = (formData.get("message") || "").toString().trim();
  const formName = form.dataset.formName || "Website Form";

  formData.set("name", fullName || "Website Visitor");
  formData.set("message", existingMessage || `${formName} submission from ${fullName || "Website Visitor"}.`);

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Submission failed.");
    }

    form.reset();

    if (success) {
      success.textContent = "Thank you! Your request has been submitted successfully.";
      success.style.display = "block";
    }

    window.alert(form.dataset.successMessage || "Thank you! Your form has been submitted successfully.");

    if (success) {
      setTimeout(() => {
        success.style.display = "none";
      }, 5000);
    }
  } catch (error) {
    if (success) {
      success.textContent = error.message || "Something went wrong. Please try again.";
      success.classList.add("is-error");
      success.style.display = "block";
    }
  } finally {
    button.textContent = defaultLabel;
    button.disabled = false;
  }
};

const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && revealEls.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  revealEls.forEach((el) => observer.observe(el));
}

const mainNav = document.getElementById("mainNav");
if (mainNav) {
  window.addEventListener(
    "scroll",
    () => {
      mainNav.style.boxShadow = window.scrollY > 20 ? "0 2px 24px rgba(0,0,0,.5)" : "";
    },
    { passive: true }
  );
}
