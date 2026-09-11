(() => {
  const input = document.querySelector("#note-search");
  const cards = [...document.querySelectorAll(".content-card")];
  const empty = document.querySelector("#no-results");
  if (!input || !cards.length || !empty) return;
  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    let visible = 0;
    cards.forEach((card) => {
      const match = !query || card.dataset.search.toLowerCase().includes(query);
      card.hidden = !match;
      if (match) visible += 1;
    });
    empty.hidden = visible !== 0;
  });
})();
