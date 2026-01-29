export type Product = {
  id: string;
  name: string;
  price: number; // in IDR
  image: string;
  rating: number; // 0..5
  skinType: string;
  keyIngredients: string[];
  benefits: string[];
  size: string; // e.g. "100 ml"
  category: string;
};

export type category = {
  id: string;
  name: string;
};
