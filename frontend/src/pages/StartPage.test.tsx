import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { StartPage } from "./StartPage";

function renderStartPage() {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => root.render(<MemoryRouter><StartPage /></MemoryRouter>));
  return {
    container,
    cleanup() {
      act(() => root.unmount());
      container.remove();
    }
  };
}

afterEach(() => vi.unstubAllGlobals());

describe("start page steps", () => {
  it("preserves the Draw, Guess and Win cards", () => {
    const view = renderStartPage();
    try {
      const cards = Array.from(view.container.querySelectorAll(".hero__grid > .card")).slice(0, 3);
      expect(cards.map((card) => ({
        badge: card.querySelector(".card__badge")?.textContent,
        title: card.querySelector("h2")?.textContent,
        text: card.querySelector(".card__body p")?.textContent
      }))).toEqual([
        { badge: "Step 1", title: "Draw", text: "Get a word and sketch it out on the canvas. No artistic skills required!" },
        { badge: "Step 2", title: "Guess", text: "Type your guesses as fast as you can when other players are drawing." },
        { badge: "Step 3", title: "Win", text: "Score the most points across all rounds to be crowned the winner." }
      ]);
    } finally {
      view.cleanup();
    }
  });

  it("explains that players can start another round with the same friends", () => {
    const view = renderStartPage();
    try {
      const card = view.container.querySelectorAll(".hero__grid > .card")[3];
      expect(card?.querySelector(".card__body p")?.textContent)
        .toBe("Start a new round with the same friends whenever you like.");
    } finally {
      view.cleanup();
    }
  });

  it("shows Play again as Step 4 after Win", () => {
    const view = renderStartPage();
    try {
      const cards = view.container.querySelectorAll(".hero__grid > .card");
      expect(cards).toHaveLength(4);
      expect(cards[2].querySelector("h2")?.textContent).toBe("Win");
      expect(cards[3].querySelector("h2")?.textContent).toBe("Play again");
      expect(cards[3].querySelector(".card__badge")?.textContent).toBe("Step 4");
    } finally {
      view.cleanup();
    }
  });
});
