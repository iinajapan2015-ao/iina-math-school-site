const CONTACT_API_URL = "https://script.google.com/macros/s/AKfycbyxf1iTu1qwW6YUKmMaJ3W5UqzMsobVhG7QNC3WLldG-Y_wy_689tmw1uTspNeAUj07/exec";

const loadingScreen = document.querySelector("[data-loading-screen]");
const titleScreen = document.querySelector("[data-title-screen]");
const startButton = document.querySelector("[data-start-button]");
const startMenu = document.querySelector("[data-start-menu]");
const dungeonButton = document.querySelector("[data-dungeon-button]");
const dungeonMenu = document.querySelector("[data-dungeon-menu]");
const startNotice = document.querySelector("[data-start-notice]");
const startNoticeMessage = document.querySelector("[data-start-notice-message]");
const startNoticeTriggers = [...document.querySelectorAll("[data-start-notice-trigger]")];

if (loadingScreen && titleScreen && startButton && startMenu) {
  const startMenuLinks = [...startMenu.querySelectorAll("a")];
  const menuCloseButtons = [...startMenu.querySelectorAll("[data-menu-close]")];
  let lastMenuTrigger = startButton;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const loadingDelay = prefersReducedMotion ? 0 : 1200;

  window.setTimeout(() => {
    loadingScreen.classList.add("is-hidden");
    loadingScreen.setAttribute("aria-hidden", "true");
    titleScreen.classList.add("is-visible");
    titleScreen.removeAttribute("aria-hidden");
    document.body.classList.add("is-loaded");
  }, loadingDelay);

  const closeStartMenu = (restoreFocus = true) => {
    startMenu.hidden = true;
    startMenu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-menu-open");

    if (restoreFocus) {
      lastMenuTrigger.focus();
    }
  };

  const openStartMenu = (trigger) => {
    lastMenuTrigger = trigger;
    startMenu.hidden = false;
    startMenu.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-menu-open");
    window.requestAnimationFrame(() => startMenuLinks[0]?.focus());
  };

  startButton.addEventListener("click", () => openStartMenu(startButton));

  menuCloseButtons.forEach((button) => {
    button.addEventListener("click", () => closeStartMenu());
  });

  startMenuLinks.forEach((link) => {
    link.addEventListener("click", () => closeStartMenu(false));
  });

  startMenu.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeStartMenu();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusableElements = [
      startMenu.querySelector(".start-menu__close"),
      ...startMenuLinks,
    ].filter(Boolean);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });
}

if (dungeonButton && dungeonMenu) {
  const dungeonLinks = [...dungeonMenu.querySelectorAll("a")];
  const dungeonCloseButtons = [...dungeonMenu.querySelectorAll("[data-dungeon-close]")];
  const dungeonCloseButton = dungeonMenu.querySelector(".start-menu__close");
  const dungeonReturnButton = dungeonMenu.querySelector(".dungeon-menu__return");

  const closeDungeonMenu = (restoreFocus = true) => {
    dungeonMenu.hidden = true;
    dungeonMenu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-menu-open");

    if (restoreFocus) {
      dungeonButton.focus();
    }
  };

  const openDungeonMenu = () => {
    dungeonMenu.hidden = false;
    dungeonMenu.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-menu-open");
    window.requestAnimationFrame(() => dungeonLinks[0]?.focus());
  };

  dungeonButton.addEventListener("click", openDungeonMenu);

  dungeonCloseButtons.forEach((button) => {
    button.addEventListener("click", () => closeDungeonMenu());
  });

  dungeonLinks.forEach((link) => {
    link.addEventListener("click", () => closeDungeonMenu(false));
  });

  dungeonMenu.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDungeonMenu();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusableElements = [
      dungeonCloseButton,
      ...dungeonLinks,
      dungeonReturnButton,
    ].filter(Boolean);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });
}

if (startNotice && startNoticeMessage && startNoticeTriggers.length) {
  const noticeCloseButtons = [...startNotice.querySelectorAll("[data-notice-close]")];
  const noticeReturnButton = startNotice.querySelector(".start-notice__return");
  let lastNoticeTrigger = startNoticeTriggers[0];

  const closeStartNotice = () => {
    startNotice.hidden = true;
    startNotice.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-menu-open");
    lastNoticeTrigger.focus();
  };

  const openStartNotice = (trigger) => {
    lastNoticeTrigger = trigger;
    startNoticeMessage.textContent = trigger.dataset.notice;
    startNotice.hidden = false;
    startNotice.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-menu-open");
    window.requestAnimationFrame(() => noticeReturnButton?.focus());
  };

  startNoticeTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => openStartNotice(trigger));
  });

  noticeCloseButtons.forEach((button) => {
    button.addEventListener("click", closeStartNotice);
  });

  startNotice.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeStartNotice();
    }
  });
}

const contactForm = document.querySelector("[data-contact-form]");

if (contactForm) {
  const contactSubmitButton = contactForm.querySelector('button[type="submit"]');
  const contactSubmitLabel = contactForm.querySelector("[data-submit-label]");
  const formStatus = contactForm.querySelector("[data-form-status]");
  const formStatusTitle = contactForm.querySelector("[data-form-status-title]");
  const formStatusMessage = contactForm.querySelector("[data-form-status-message]");

  const showFormStatus = (type, title, message) => {
    formStatus.hidden = false;
    formStatus.dataset.status = type;
    formStatusTitle.textContent = title;
    formStatusMessage.textContent = message;
  };

  const hideFormStatus = () => {
    formStatus.hidden = true;
    formStatus.removeAttribute("data-status");
    formStatusTitle.textContent = "";
    formStatusMessage.textContent = "";
  };

  const validateContactForm = () => {
    const emailInput = contactForm.elements.email;
    const courseInput = contactForm.elements.course;
    const messageInput = contactForm.elements.message;
    const email = emailInput.value.trim();
    const course = courseInput.value.trim();
    const message = messageInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      showFormStatus("error", "入力内容を確認してください。", "メールアドレスを入力してください。");
      emailInput.focus();
      return null;
    }

    if (!emailPattern.test(email)) {
      showFormStatus("error", "入力内容を確認してください。", "正しい形式のメールアドレスを入力してください。");
      emailInput.focus();
      return null;
    }

    if (!course) {
      showFormStatus("error", "入力内容を確認してください。", "ご希望のコースを選択してください。");
      courseInput.focus();
      return null;
    }

    if (!message) {
      showFormStatus("error", "入力内容を確認してください。", "ご相談内容を入力してください。");
      messageInput.focus();
      return null;
    }

    return { email, course, message };
  };

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (contactSubmitButton.disabled) {
      return;
    }

    hideFormStatus();
    const payload = validateContactForm();

    if (!payload) {
      return;
    }

    contactSubmitButton.disabled = true;
    contactSubmitLabel.textContent = "そうしんちゅう...";

    try {
      const response = await fetch(CONTACT_API_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Contact request failed: ${response.status}`);
      }

      contactForm.reset();
      showFormStatus(
        "success",
        "メッセージを IINA算数教室へ 届けました！",
        "お問い合わせありがとうございます。内容を確認後、ご連絡いたします。",
      );
    } catch (error) {
      console.error("Contact form submission failed.", error);
      showFormStatus(
        "error",
        "メッセージを 送信できませんでした。",
        "時間をおいて、もう一度お試しください。",
      );
    } finally {
      contactSubmitButton.disabled = false;
      contactSubmitLabel.textContent = "メールで送信する";
    }
  });
}
