import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { GameButton } from "./GameButton";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  value: string;
  label?: string;
  copiedLabel?: string;
  variant?: "primary" | "accent" | "outline" | "ghost";
  className?: string;
  full?: boolean;
}

export function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied!",
  variant = "primary",
  className,
  full,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const area = document.createElement("textarea");
      area.value = value;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <GameButton variant={variant} full={full} onClick={copy} className={cn(className)}>
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {copied ? copiedLabel : label}
    </GameButton>
  );
}
