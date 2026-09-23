"use client";

import { Pencil, X } from "lucide-react";
import { useState } from "react";
import ProductForm from "./product-form";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discount_price: number | null;
  image_url: string | null;
  is_featured: boolean;
  category_id: string | null;
};
type Category = { id: string; name: string };

export default function ProductEditButton({
  product,
  categories,
  slug,
}: {
  product: Product;
  categories: Category[];
  slug: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border-line inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-2 text-[10px] font-bold"
      >
        <Pencil size={13} /> Edit
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-0 sm:items-center sm:p-5"
          onClick={() => setOpen(false)}
        >
          <article
            className="max-h-[94dvh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 sm:max-w-xl sm:rounded-3xl sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-brand text-[10px] font-black tracking-[.12em] uppercase">Menu</p>
                <h2 className="display-font text-2xl font-black">Edit menu</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-muted grid size-10 place-items-center rounded-full bg-[#f4f0eb]"
                aria-label="Tutup edit menu"
              >
                <X size={18} />
              </button>
            </header>
            <ProductForm
              product={product}
              categories={categories}
              slug={slug}
              onCancel={() => setOpen(false)}
            />
          </article>
        </div>
      )}
    </>
  );
}
