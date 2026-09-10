(() => {
  const links = document.querySelectorAll('a[href^="http"]');
  links.forEach((link) => {
    link.addEventListener("click", () => {
      link.setAttribute("aria-label", `${link.textContent.trim()} (opens in a new tab)`);
    });
  });
})();
