export const profileTabs = ["about", "systems", "product", "archive", "notebook"] as const;
export type ProfileTab = (typeof profileTabs)[number];
export type NotebookView = "notes" | "reading";
export type QueryValue = string | string[] | undefined;

export const profileLabels: Record<ProfileTab, string> = {
  about: "About",
  systems: "Systems",
  product: "Product & Design",
  archive: "Archive",
  notebook: "Notebook",
};

export function getProfileLocation(tab: QueryValue, view: QueryValue) {
  const requested = Array.isArray(tab) ? tab[0] : tab;
  const requestedView = Array.isArray(view) ? view[0] : view;
  const canonical = requested === "documents" ? "systems"
    : requested === "notes" || requested === "reading" ? "notebook" : requested;

  return {
    tab: profileTabs.includes(canonical as ProfileTab) ? canonical as ProfileTab : "about" as const,
    view: (requested === "reading" || (requested !== "notes" && requestedView === "reading")
      ? "reading" : "notes") as NotebookView,
  };
}

export function legacyProfileDestination(tab: QueryValue, hash: string) {
  const requested = Array.isArray(tab) ? tab[0] : tab;
  if (requested === "documents") {
    const productSection = ["#product-design", "#complete-designs", "#product-demo"].includes(hash);
    return `/?tab=${productSection ? "product" : "systems"}${hash}`;
  }
  if (requested === "notes" || requested === "reading") {
    return `/?tab=notebook&view=${requested}${hash}`;
  }
  if (requested === "archive" && hash === "#product-demo") {
    return "/?tab=product#product-demo";
  }
  return null;
}
