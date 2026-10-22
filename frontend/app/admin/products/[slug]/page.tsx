"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  RefreshCw,
  Trash2,
  AlertCircle,
  Eye,
} from "lucide-react";
import { adminFetch } from "@/lib/admin-api";

export default function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const currentSlug = resolvedParams.slug;

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    short_description: "",
    price: "",
    regular_price: "",
    sale_price: "",
    on_sale: false,
    stock_status: "instock",
    stock_quantity: 50,
    featured: false,
    image_url: "",
    category_ids: [] as number[],
  });

  useEffect(() => {
    Promise.all([
      adminFetch(`/api/products/${currentSlug}`),
      adminFetch("/api/categories"),
    ])
      .then(async ([prodRes, catRes]) => {
        if (catRes.ok) {
          const catData = await catRes.json();
          if (catData.success) setCategories(catData.categories || []);
        }

        if (prodRes.ok) {
          const prodData = await prodRes.json();
          if (prodData.success && prodData.product) {
            const p = prodData.product;
            setForm({
              name: p.name || "",
              slug: p.slug || "",
              description: p.description || "",
              short_description: p.short_description || "",
              price: p.price !== undefined ? p.price.toString() : "",
              regular_price: p.regular_price !== undefined ? p.regular_price.toString() : "",
              sale_price: p.sale_price !== undefined && p.sale_price !== null ? p.sale_price.toString() : "",
              on_sale: Boolean(p.on_sale),
              stock_status: p.stock_status || "instock",
              stock_quantity: p.stock_quantity ?? 50,
              featured: Boolean(p.featured),
              image_url: p.images?.[0]?.src || "",
              category_ids: p.categories?.map((c: any) => c.id) || [],
            });
          }
        }
      })
      .catch((err) => setError("Failed to load product details: " + err.message))
      .finally(() => setLoading(false));
  }, [currentSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.price) {
      setError("Name and price are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        name: form.name.trim(),
        description: form.description.trim(),
        short_description: form.short_description?.trim() || null,
        price: parseFloat(form.price),
        regular_price: parseFloat(form.regular_price || form.price),
        sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
        on_sale: form.on_sale,
        stock_status: form.stock_status,
        stock_quantity: parseInt(form.stock_quantity.toString(), 10) || 0,
        featured: form.featured,
        category_ids: form.category_ids,
      };

      if (form.image_url) {
        payload.images = [
          {
            src: form.image_url.trim(),
            alt: form.name,
            name: form.name,
          },
        ];
      }

      const res = await adminFetch(`/api/products/${currentSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update arrangement");
      }

      router.push("/admin/products");
    } catch (err: any) {
      setError(err.message || "Failed to update arrangement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await adminFetch(`/api/products/${currentSlug}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/admin/products");
      } else {
        alert("Failed to delete product.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-dark/40">
        <RefreshCw className="h-8 w-8 mx-auto animate-spin text-coral mb-2" />
        <p className="font-serif text-sm">Loading arrangement data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="h-9 w-9 rounded-xl border border-dark/15 bg-white flex items-center justify-center text-dark/70 hover:bg-cream transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-dark">
              Edit Arrangement: {form.name}
            </h1>
            <p className="text-xs text-dark/50 font-mono">slug: /{currentSlug}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/collection/${currentSlug}`}
            target="_blank"
            className="flex items-center gap-1.5 rounded-xl border border-dark/15 bg-white px-3.5 py-2 text-xs font-semibold text-dark hover:bg-cream transition"
          >
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Preview on Store</span>
          </Link>

          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 text-red-700 px-3.5 py-2 text-xs font-semibold hover:bg-red-100 transition"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Basic Details Card */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-dark/5 space-y-4">
          <h2 className="font-serif text-lg font-bold text-dark border-b border-dark/10 pb-3">
            1. Title & Descriptions
          </h2>

          <div>
            <label className="block font-bold uppercase tracking-wider text-dark/60 mb-1.5">
              Arrangement Name *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full h-11 rounded-xl border border-dark/20 bg-cream/20 px-4 outline-none focus:border-coral focus:bg-white transition text-xs font-medium"
            />
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-dark/60 mb-1.5">
              Short Tagline / Catchphrase
            </label>
            <input
              type="text"
              value={form.short_description}
              onChange={(e) => setForm({ ...form, short_description: e.target.value })}
              className="w-full h-11 rounded-xl border border-dark/20 bg-cream/20 px-4 outline-none focus:border-coral focus:bg-white transition text-xs"
            />
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-dark/60 mb-1.5">
              Detailed Story & Floral Composition
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-xl border border-dark/20 bg-cream/20 p-4 outline-none focus:border-coral focus:bg-white transition text-xs leading-relaxed"
            />
          </div>
        </div>

        {/* Pricing & Stock Card */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-dark/5 space-y-4">
          <h2 className="font-serif text-lg font-bold text-dark border-b border-dark/10 pb-3">
            2. Pricing & Inventory Controls
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block font-bold uppercase tracking-wider text-dark/60 mb-1.5">
                Current Price (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full h-11 rounded-xl border border-dark/20 bg-cream/20 px-4 outline-none focus:border-coral focus:bg-white transition text-xs font-bold"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-dark/60 mb-1.5">
                Regular / MRP (₹)
              </label>
              <input
                type="number"
                step="0.01"
                value={form.regular_price}
                onChange={(e) => setForm({ ...form, regular_price: e.target.value })}
                className="w-full h-11 rounded-xl border border-dark/20 bg-cream/20 px-4 outline-none focus:border-coral focus:bg-white transition text-xs"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-dark/60 mb-1.5">
                Sale Price (₹)
              </label>
              <input
                type="number"
                step="0.01"
                value={form.sale_price}
                onChange={(e) => setForm({ ...form, sale_price: e.target.value })}
                className="w-full h-11 rounded-xl border border-dark/20 bg-cream/20 px-4 outline-none focus:border-coral focus:bg-white transition text-xs"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 pt-2">
            <div>
              <label className="block font-bold uppercase tracking-wider text-dark/60 mb-1.5">
                Stock Status
              </label>
              <select
                value={form.stock_status}
                onChange={(e) => setForm({ ...form, stock_status: e.target.value })}
                className="w-full h-11 rounded-xl border border-dark/20 bg-white px-4 outline-none cursor-pointer text-xs font-semibold"
              >
                <option value="instock">In Stock</option>
                <option value="outofstock">Out of Stock</option>
                <option value="onbackorder">On Backorder</option>
              </select>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-dark/60 mb-1.5">
                Quantity Count
              </label>
              <input
                type="number"
                value={form.stock_quantity}
                onChange={(e) =>
                  setForm({ ...form, stock_quantity: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full h-11 rounded-xl border border-dark/20 bg-cream/20 px-4 outline-none focus:border-coral focus:bg-white transition text-xs"
              />
            </div>
          </div>
        </div>

        {/* Media & Taxonomy Card */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-dark/5 space-y-4">
          <h2 className="font-serif text-lg font-bold text-dark border-b border-dark/10 pb-3">
            3. Photography & Collections
          </h2>

          <div>
            <label className="block font-bold uppercase tracking-wider text-dark/60 mb-1.5">
              Arrangement Image URL
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                className="flex-1 h-11 rounded-xl border border-dark/20 bg-cream/20 px-4 outline-none focus:border-coral focus:bg-white transition text-xs font-mono"
              />
              {form.image_url && (
                <div className="h-11 w-11 rounded-xl border border-dark/20 overflow-hidden bg-cream shrink-0">
                  <img
                    src={form.image_url}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=300";
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-dark/60 mb-2">
              Assigned Collections
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => {
                const isChecked = form.category_ids.includes(c.id);
                return (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => {
                      const next = isChecked
                        ? form.category_ids.filter((id) => id !== c.id)
                        : [...form.category_ids, c.id];
                      setForm({ ...form, category_ids: next });
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition border ${
                      isChecked
                        ? "bg-dark text-white border-dark shadow-xs"
                        : "bg-cream/40 text-dark/70 border-dark/15 hover:border-dark"
                    }`}
                  >
                    {isChecked && "✓ "}
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-8 pt-3 border-t border-dark/10">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="h-4 w-4 rounded accent-coral"
              />
              <span className="font-bold text-dark">Feature on Homepage</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.on_sale}
                onChange={(e) => setForm({ ...form, on_sale: e.target.checked })}
                className="h-4 w-4 rounded accent-coral"
              />
              <span className="font-bold text-dark">Highlight as On Sale</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/products"
            className="px-6 py-3 rounded-xl border border-dark/20 font-bold hover:bg-cream transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-7 py-3 rounded-xl bg-dark text-white font-bold uppercase tracking-widest hover:bg-coral transition shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-coral" /> Saving...
              </>
            ) : (
              "Save Arrangement Changes"
            )}
          </button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-xs animate-fade-in">
          <div className="rounded-3xl bg-white w-full max-w-sm p-6 shadow-2xl border border-dark/10 text-center">
            <div className="h-12 w-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-dark">Delete this arrangement?</h3>
            <p className="text-xs text-dark/60 mt-1 leading-relaxed">
              This will permanently delete &ldquo;{form.name}&rdquo; from the catalog.
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border border-dark/20 text-xs font-bold hover:bg-cream transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition shadow-md flex items-center gap-1.5"
              >
                {isDeleting && <RefreshCw className="h-3 w-3 animate-spin" />}
                <span>Delete Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
