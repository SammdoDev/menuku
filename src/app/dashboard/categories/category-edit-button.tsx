"use client";

import { Pencil, X } from "lucide-react";
import { useState } from "react";
import { GlobalInput, GlobalTextarea, SubmitButton } from "../../../components/ui/form-controls";
import { updateCategoryAction } from "../actions";
import PersistentForm from "../../../components/ui/persistent-form";

export default function CategoryEditButton({
  category,
}: {
  category: { id: string; name: string; description: string | null };
}) {
  const [open, setOpen] = useState(false);
  if (!open)
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border-line inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[10px] font-bold"
      >
        <Pencil size={13} /> Edit
      </button>
    );
  return (
    <div className="border-brand/20 w-full rounded-xl border bg-orange-50/50 p-3 sm:w-80">
      <div className="mb-3 flex items-center justify-between">
        <b className="text-xs">Edit kategori</b>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-muted grid size-7 place-items-center rounded-lg"
          aria-label="Tutup edit kategori"
        >
          <X size={15} />
        </button>
      </div>
      <PersistentForm
        storageKey={`menuku-category-edit-${category.id}`}
        action={updateCategoryAction}
        className="grid gap-3"
      >
        <GlobalInput type="hidden" name="id" value={category.id} />
        <GlobalInput name="name" defaultValue={category.name} required maxLength={80} />
        <GlobalTextarea
          name="description"
          defaultValue={category.description || ""}
          placeholder="Deskripsi (opsional)"
          maxLength={200}
        />
        <SubmitButton pendingLabel="Menyimpan...">Simpan perubahan</SubmitButton>
      </PersistentForm>
    </div>
  );
}
