import { QrCode } from "lucide-react";
import { useMemo } from "react";

/**
 * Placeholder QR component: renders a deterministic pattern from the link so the
 * layout is final. Swap the grid for a real QR renderer later.
 */
export function QRCodeCard({ value }: { value: string }) {
  const cells = useMemo(() => {
    let seed = 0;
    for (const char of value) seed = (seed * 31 + char.charCodeAt(0)) % 100000;
    return Array.from({ length: 121 }, (_, index) => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return (seed >> (index % 7)) % 3 === 0;
    });
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-background/60 p-5">
      <div className="grid grid-cols-11 gap-[3px] rounded-xl bg-foreground/95 p-3">
        {cells.map((filled, index) => (
          <span
            key={index}
            className={filled ? "size-2 rounded-[2px] bg-background" : "size-2 rounded-[2px]"}
          />
        ))}
      </div>
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <QrCode className="size-3.5" /> Scan preview (link is the source of truth)
      </p>
    </div>
  );
}
