import { getImageUrl } from "./storage";
import { PRODUCTS } from "./products-data";
import type { Product, Category } from "@/types";

/**
 * Resolves API endpoint URL:
 * - On client (browser): relative URL (e.g. "/api/categories") routed via Vercel's unified /api rewrite
 * - On server: uses BACKEND_URL injected by Vercel Services binding (or fallback to local dev port 3001)
 */
function getBackendUrl(endpoint: string): string {
  if (typeof window !== "undefined") {
    return endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  }
  const base = (
    process.env.BACKEND_URL ||
    process.env.INTERNAL_BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://localhost:3001"
  ).replace(/\/+$/, "");
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
}

/**
 * Fetch all categories from backend database
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(getBackendUrl("/api/categories"), { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        return data.categories;
      }
    }
  } catch (err) {
    console.warn("Falling back to static categories:", err);
  }
  return [
    { id: 1, name: "Crochet Flowers", slug: "crochet-flowers", count: 0 },
    { id: 2, name: "Crochet Bouquets", slug: "crochet-bouquets", count: 0 },
    { id: 3, name: "Pipe Cleaner Flowers", slug: "pipe-cleaner-flowers", count: 0 },
    { id: 5, name: "Pipe Cleaner Bouquets", slug: "pipe-cleaner-bouquets", count: 0 },
    { id: 4, name: "Mobile Case", slug: "mobile-case", count: 0 },
  ];
}

/**
 * Fetch all products from backend API with static fallback
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(getBackendUrl("/api/products"), { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.products) && data.products.length > 0) {
        return data.products.map((product: any) => ({
          ...product,
          images: (product.images || []).map((img: any) => ({
            ...img,
            src: getImageUrl(img.src),
          })),
        }));
      }
    }
  } catch (err) {
    console.warn("Falling back to static products:", err);
  }

  // Fallback to static products if backend is not responding
  return PRODUCTS.map((product) => ({
    ...product,
    images: product.images.map((img) => ({
      ...img,
      src: getImageUrl(img.src),
    })),
  }));
}

/**
 * Fetch a single product by slug from backend API
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(getBackendUrl(`/api/products/${slug}`), { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.product) {
        const product = data.product;
        return {
          ...product,
          images: (product.images || []).map((img: any) => ({
            ...img,
            src: getImageUrl(img.src),
          })),
        };
      }
    }
  } catch (err) {
    console.warn("Falling back to static product lookup:", err);
  }

  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) return null;

  return {
    ...product,
    images: product.images.map((img) => ({
      ...img,
      src: getImageUrl(img.src),
    })),
  };
}

/**
 * Fetch featured products
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const all = await getProducts();
    const featured = all.filter((p) => p.featured);
    if (featured.length > 0) return featured.slice(0, 6);
    return all.slice(0, 6);
  } catch {
    const featured = PRODUCTS.filter((product) => product.featured).slice(0, 6);
    return featured.map((product) => ({
      ...product,
      images: product.images.map((img) => ({
        ...img,
        src: getImageUrl(img.src),
      })),
    }));
  }
}


/**
 * Create a new order (localStorage based - no database)
 */
export async function createOrder(orderData: {
  customer_email: string;
  customer_name: string;
  customer_phone?: string;
  shipping_address: Record<string, unknown>;
  billing_address?: Record<string, unknown>;
  total: number;
  items: Array<{
    product_id: number;
    product_name: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
}) {
  // Create order object with ID
  const order = {
    id: Date.now(),
    ...orderData,
    status: "pending",
    payment_status: "pending",
    created_at: new Date().toISOString(),
  };

  // Save to localStorage (in production, send to API)
  if (typeof window !== "undefined") {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));
  }

  return order;
}
