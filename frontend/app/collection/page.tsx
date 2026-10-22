"use client";

import { Suspense, memo, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Flower2, Sparkles } from "lucide-react";
import { getProducts, getCategories } from "@/lib/api";
import ProductGridClient from "@/components/ProductGridClient";
import AuthModal from "@/components/AuthModal";
import type { Product, Category } from "@/types";
import { MAIN_GROUPS } from "@/lib/category-data";

export const dynamic = "force-dynamic";

function CollectionPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeGroup, setActiveGroup] = useState(searchParams.get("group") ?? "all");

  useEffect(() => {
    getProducts().then(setProducts);
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setActiveGroup(searchParams.get("group") ?? "all");
  }, [searchParams]);

  // Dynamically assemble filter tabs from MAIN_GROUPS + any custom categories added in Admin
  const filters = useMemo(() => {
    const list: Array<{ id: string; title: string }> = [
      { id: "all", title: "Everything" },
      ...MAIN_GROUPS.map((g) => ({ id: g.id, title: g.title })),
    ];

    const knownGroupSlugs = new Set<string>();
    MAIN_GROUPS.forEach((g) => {
      knownGroupSlugs.add(g.id);
      g.subSections.forEach((s) => knownGroupSlugs.add(s.slug));
    });

    categories.forEach((cat) => {
      if (!knownGroupSlugs.has(cat.slug) && !list.some((item) => item.id === cat.slug)) {
        list.push({
          id: cat.slug,
          title: cat.name.charAt(0).toUpperCase() + cat.name.slice(1),
        });
      }
    });

    return list;
  }, [categories]);

  const visibleProducts = useMemo(() => {
    if (activeGroup === "all") return products;

    // Check if it's one of the curated main groups (e.g. crochet, pipe-cleaner)
    const group = MAIN_GROUPS.find((item) => item.id === activeGroup);
    if (group && group.subSections.length > 0) {
      const slugs = group.subSections.map((item) => item.slug);
      return products.filter((product) =>
        product.categories?.some((category) => slugs.includes(category.slug))
      );
    }

    // Direct match against category slug, name, or id
    return products.filter((product) =>
      product.categories?.some(
        (category) =>
          category.slug === activeGroup ||
          category.slug?.toLowerCase() === activeGroup.toLowerCase() ||
          category.name?.toLowerCase() === activeGroup.toLowerCase() ||
          category.id?.toString() === activeGroup
      )
    );
  }, [activeGroup, products]);


  const handleAuthRequired = useCallback(() => setShowAuthModal(true), []);

  return (
    <>
      <div className="min-h-screen bg-cream">
        <section className="paper-noise border-b border-dark/10 py-12 md:py-20">
          <div className="site-container grid items-end gap-10 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <div className="mb-6 flex items-center gap-2 text-coral">
                <Flower2 className="h-4 w-4" />
                <p className="eyebrow">The full garden</p>
              </div>
              <h1 className="display-title text-[clamp(4rem,10vw,9rem)]">
                Find your
                <span className="block italic text-coral">forever flower.</span>
              </h1>
            </div>
            <div className="relative min-h-[230px] overflow-hidden rounded-[2rem] bg-sage md:min-h-[300px]">
              <Image
                src="/images/hero.png"
                alt="Exora handmade flower collection"
                fill
                priority
                className="object-cover object-[50%_42%]"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="h-3 w-3 text-coral" /> New pieces added
              </div>
            </div>
          </div>
        </section>

        <div className="sticky top-[72px] z-30 border-b border-dark/10 bg-cream/95 backdrop-blur-xl">
          <div className="site-container flex items-center gap-2 overflow-x-auto py-4 hide-scrollbar">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveGroup(filter.id)}
                className={`whitespace-nowrap rounded-full px-5 py-3 text-[10px] font-bold uppercase tracking-[0.13em] transition-colors ${
                  activeGroup === filter.id
                    ? "bg-dark text-white"
                    : "border border-dark/15 bg-white/40 hover:border-dark"
                }`}
              >
                {filter.title}
              </button>
            ))}
            <span className="ml-auto hidden whitespace-nowrap text-xs text-dark/45 md:block">
              {visibleProducts.length} handmade pieces
            </span>
          </div>
        </div>

        <section className="site-container py-12 md:py-20">
          {activeGroup === "mobile-case" ? (
            <div className="soft-card mx-auto max-w-3xl bg-sage p-10 text-center md:p-20">
              <p className="eyebrow mb-4 text-coral">Coming soon</p>
              <h2 className="display-title text-5xl md:text-7xl">Your phone is next.</h2>
              <p className="mx-auto mt-6 max-w-lg leading-7 text-dark/60">
                Custom crochet mobile covers are on the studio table. Join our newsletter
                and be the first to know when personal orders open.
              </p>
            </div>
          ) : (
            <ProductGridClient products={visibleProducts} onAuthRequired={handleAuthRequired} />
          )}
        </section>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}

const MemoCollectionPage = memo(CollectionPage);

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream" />}>
      <MemoCollectionPage />
    </Suspense>
  );
}
