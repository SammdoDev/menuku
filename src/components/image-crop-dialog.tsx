"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Move, RotateCcw, X, ZoomIn } from "lucide-react";

type Props = {
  file: File | null;
  aspect: number;
  onCancel: () => void;
  onConfirm: (file: File) => void;
};

export default function ImageCropDialog({ file, aspect, onCancel, onConfirm }: Props) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [src, setSrc] = useState("");
  const [zoom, setZoom] = useState(1);
  const [imageReady, setImageReady] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const viewportWidth = 320;
  const viewportHeight = Math.round(viewportWidth / aspect);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSrc(url);
    setImageReady(false);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const display = useMemo(() => {
    const image = imageRef.current;
    if (!image?.naturalWidth || !image.naturalHeight) return null;
    const base = Math.max(viewportWidth / image.naturalWidth, viewportHeight / image.naturalHeight);
    return {
      width: image.naturalWidth * base * zoom,
      height: image.naturalHeight * base * zoom,
      scale: base * zoom,
    };
  }, [src, zoom, viewportHeight, imageReady]);

  if (!file) return null;

  function startDrag(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDrag({ x: event.clientX - offset.x, y: event.clientY - offset.y });
  }
  function moveDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (!drag) return;
    setOffset({ x: event.clientX - drag.x, y: event.clientY - drag.y });
  }
  function stopDrag() {
    setDrag(null);
  }
  async function confirm() {
    const image = imageRef.current;
    const sourceFile = file;
    if (!image || !display || !sourceFile) return;
    const sourceX = Math.max(0, -((viewportWidth - display.width) / 2 + offset.x) / display.scale);
    const sourceY = Math.max(
      0,
      -((viewportHeight - display.height) / 2 + offset.y) / display.scale,
    );
    const sourceWidth = Math.min(image.naturalWidth - sourceX, viewportWidth / display.scale);
    const sourceHeight = Math.min(image.naturalHeight - sourceY, viewportHeight / display.scale);
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = Math.round(canvas.width / aspect);
    canvas
      .getContext("2d")
      ?.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        canvas.width,
        canvas.height,
      );
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.86),
    );
    if (blob)
      onConfirm(
        new File([blob], `${sourceFile.name.replace(/\.[^.]+$/, "")}-cropped.jpg`, {
          type: "image/jpeg",
        }),
      );
  }

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black">Sesuaikan gambar</h2>
            <p className="text-muted text-xs">Geser gambar dan atur zoom sesuai kebutuhan.</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full p-2 hover:bg-black/5"
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </div>
        <div
          className="mx-auto overflow-hidden rounded-2xl bg-slate-100"
          style={{ width: viewportWidth, height: viewportHeight }}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
        >
          <img
            ref={imageRef}
            src={src}
            alt="Pratinjau crop"
            onLoad={() => {
              setImageReady(true);
              setOffset({ x: 0, y: 0 });
            }}
            draggable={false}
            className="pointer-events-none max-w-none select-none"
            style={{
              width: display?.width,
              height: display?.height,
              transform: `translate(${(viewportWidth - (display?.width || 0)) / 2 + offset.x}px, ${(viewportHeight - (display?.height || 0)) / 2 + offset.y}px)`,
            }}
          />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <ZoomIn size={17} className="text-muted" />
          <input
            aria-label="Zoom gambar"
            type="range"
            min="1"
            max="3"
            step="0.01"
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            className="accent-brand w-full"
          />
        </div>
        <p className="text-muted mt-2 flex items-center gap-2 text-xs">
          <Move size={14} /> Tarik gambar untuk memposisikan
        </p>
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={() => {
              setZoom(1);
              setOffset({ x: 0, y: 0 });
            }}
            className="border-line flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold"
          >
            <RotateCcw size={16} /> Reset
          </button>
          <button
            type="button"
            onClick={() => void confirm()}
            className="bg-brand text-surface ml-auto flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-black"
          >
            <Check size={16} /> Pakai gambar
          </button>
        </div>
      </div>
    </div>
  );
}
