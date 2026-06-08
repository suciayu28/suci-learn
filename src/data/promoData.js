// src/data/promoData.js

export const initialPromoProducts = [
  {
    id: 1,
    title: "Lumière Velvet Lip Matte",
    originalPrice: 180000,
    discountPrice: 126000,
    discountPercent: 30,
    img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 2,
    title: "Flawless Cushion Foundation SPF 35",
    originalPrice: 280000,
    discountPrice: 201600,
    discountPercent: 28,
    img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 3,
    title: "12-Color Luxury Eye Palette",
    originalPrice: 450000,
    discountPrice: 337500,
    discountPercent: 25,
    img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 4,
    title: "Waterproof HD Liquid Eyeliner",
    originalPrice: 150000,
    discountPrice: 127500,
    discountPercent: 15,
    img: "https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&w=500&q=80"
  }
];

// Nilai bawaan untuk form produk baru (biar state di komponen ikut bersih)
export const defaultNewProductState = {
  title: "",
  originalPrice: "",
  discountPrice: "",
  img: ""
};