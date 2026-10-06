type HeroPreviewUrlProps = {
  url: string;
};

function HeroPreviewUrl({ url }: HeroPreviewUrlProps) {
  const domain = url.replace(/^https?:\/\//, "").split("/")[0] || "digimenu.my.id";

  return (
    <div className="border-b border-[#eee5dd] bg-[#fffdfb] p-3">
      <span className="sr-only">{url}</span>

      <div
        aria-hidden="true"
        className="flex items-center gap-2 rounded-full border border-[#e8ddd2] bg-[#f4eee7] py-1.5 pr-3 pl-1.5 shadow-[inset_0_1px_2px_rgba(41,37,31,0.03)]"
      >
        <span className="grid size-7 shrink-0 place-items-center rounded-full border border-[#ece5dc] bg-white text-[#477047] shadow-sm">
          <LockKeyhole aria-hidden="true" size={12} strokeWidth={1.8} />
        </span>

        <div className="min-w-0 flex-1 overflow-hidden font-mono text-[9px] tracking-tight whitespace-nowrap sm:text-[10px]">
          <span className="text-[#62564b]">{domain}/</span>
          <span className="font-semibold text-[#a03417]">kopi-kenangan</span>
        </div>

        <ArrowUpRight aria-hidden="true" size={13} className="shrink-0 text-[#a99a8d]" strokeWidth={1.5} />
      </div>
    </div>
  );
}

export default HeroPreviewUrl;
import { ArrowUpRight, LockKeyhole } from "lucide-react";
