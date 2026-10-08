export type Lang = "en" | "fr";

/** Only the owner-approved label table is translated. Everything else stays in English. */
export const labels = {
  notify_me: { en: "Notify me", fr: "Prévenez-moi" },
  sold_out: { en: "Sold out", fr: "Épuisé" },
  coming_soon: { en: "Coming soon", fr: "Bientôt disponible" },
  in_stock: { en: "In stock", fr: "En stock" },
  best_sellers: { en: "Best sellers", fr: "Meilleures ventes" },
  new_drop: { en: "New drop", fr: "Nouvelle collection" },
  size_guide: { en: "Size guide", fr: "Guide des tailles" },
  shipping: { en: "Shipping", fr: "Livraison" },
  returns: { en: "Returns", fr: "Retours" },
  fabric_weight: { en: "Fabric weight", fr: "Grammage" },
  made_in_ludhiana: { en: "Made in Ludhiana", fr: "Fabriqué à Ludhiana" },
  add_to_cart: { en: "Add to cart", fr: "Ajouter au panier" },
} as const;

export type LabelKey = keyof typeof labels;

export function t(key: LabelKey, lang: Lang): string {
  return labels[key][lang];
}
