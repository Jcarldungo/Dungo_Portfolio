(() => {
  const dialog = document.querySelector("#bag-dialog");
  const menu = document.querySelector("[data-menu-list]");
  const bagContent = document.querySelector("[data-bag-content]");
  const bagCount = document.querySelector("[data-bag-count]");
  const totalOutput = document.querySelector("[data-bag-total]");
  const clearButton = document.querySelector("[data-clear-selection]");
  const selection = new Map();

  const money = amount => `₱${amount.toLocaleString("en-PH")}`;
  const openBag = () => {
    if (!dialog.open) dialog.showModal();
  };
  const setQuantity = (item, quantity) => {
    if (quantity <= 0) selection.delete(item.id);
    else selection.set(item.id, { ...item, quantity });
    renderBag();
  };

  function renderBag() {
    const focusedControl = document.activeElement?.closest("[data-quantity-item]");
    const focusedItem = focusedControl?.dataset.quantityItem;
    const focusedAction = focusedControl?.dataset.quantityAction;
    const items = [...selection.values()];
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    bagCount.textContent = String(count);
    totalOutput.textContent = money(total);
    clearButton.disabled = items.length === 0;
    bagContent.replaceChildren();

    if (!items.length) {
      const empty = document.createElement("p");
      empty.className = "bag-empty";
      empty.textContent = "Nothing here yet. Start with a coffee or something warm from the kitchen.";
      bagContent.append(empty);
      return;
    }

    for (const item of items) {
      const row = document.createElement("article");
      row.className = "bag-row";
      const description = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = item.name;
      const price = document.createElement("p");
      price.textContent = `${money(item.price)} each · ${money(item.price * item.quantity)}`;
      description.append(title, price);

      const controls = document.createElement("div");
      controls.className = "quantity-control";
      controls.setAttribute("aria-label", `${item.name} quantity`);
      const decrease = document.createElement("button");
      decrease.type = "button";
      decrease.textContent = "−";
      decrease.dataset.quantityItem = item.id;
      decrease.dataset.quantityAction = "decrease";
      decrease.setAttribute("aria-label", `Remove one ${item.name}`);
      decrease.addEventListener("click", () => setQuantity(item, item.quantity - 1));
      const quantity = document.createElement("output");
      quantity.textContent = String(item.quantity);
      const increase = document.createElement("button");
      increase.type = "button";
      increase.textContent = "+";
      increase.dataset.quantityItem = item.id;
      increase.dataset.quantityAction = "increase";
      increase.setAttribute("aria-label", `Add one ${item.name}`);
      increase.addEventListener("click", () => setQuantity(item, item.quantity + 1));
      controls.append(decrease, quantity, increase);
      row.append(description, controls);
      bagContent.append(row);
    }

    if (focusedItem) {
      const sameControl = [...bagContent.querySelectorAll("[data-quantity-item]")].find(control =>
        control.dataset.quantityItem === focusedItem && control.dataset.quantityAction === focusedAction
      );
      const nextControl = bagContent.querySelector("[data-quantity-item]");
      (sameControl || nextControl || document.querySelector("[data-close-bag]")).focus();
    }
  }

  document.querySelectorAll("[data-open-bag]").forEach(button => button.addEventListener("click", openBag));
  document.querySelectorAll("[data-close-bag]").forEach(button => button.addEventListener("click", () => dialog.close()));
  clearButton.addEventListener("click", () => {
    selection.clear();
    renderBag();
    document.querySelector("[data-close-bag]").focus();
  });

  menu.addEventListener("click", event => {
    const button = event.target.closest("[data-add]");
    if (!button) return;
    const article = button.closest(".menu-item");
    const current = selection.get(article.dataset.id);
    setQuantity({ id: article.dataset.id, name: article.dataset.name, price: Number(article.dataset.price) }, (current?.quantity || 0) + 1);
    button.textContent = "✓";
    button.setAttribute("aria-label", `Added ${article.dataset.name}. Add another`);
    window.setTimeout(() => {
      button.textContent = "＋";
      button.setAttribute("aria-label", `Add ${article.dataset.name}, ${money(Number(article.dataset.price))}`);
    }, 900);
  });

  document.querySelectorAll("[data-filter]").forEach(button => button.addEventListener("click", () => {
    const category = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach(filter => {
      const active = filter === button;
      filter.classList.toggle("is-active", active);
      filter.setAttribute("aria-pressed", String(active));
    });
    menu.querySelectorAll(".menu-item").forEach(item => {
      item.hidden = category !== "all" && item.dataset.category !== category;
    });
  }));

  document.querySelectorAll(".mobile-nav a").forEach(link => link.addEventListener("click", () => {
    link.closest("details").open = false;
  }));

  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
})();
