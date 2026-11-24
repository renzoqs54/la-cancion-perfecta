import { AnimatePresence, motion } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { Sparkles } from "./Ambient";

export function Keepsake({ open, onClose, children, label, variant = "card" }: { open: boolean; onClose: () => void; children: ReactNode; label: string; variant?: "card" | "polaroid" | "note" }) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);
  const shape = variant === "polaroid" ? "rounded-sm p-4 pb-10 rotate-[-2deg]" : variant === "note" ? "rounded-sm rotate-[1.5deg] p-7" : "rounded-xl p-8";
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-ink/25 p-5 backdrop-blur-[3px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={label}
            onClick={(e) => e.stopPropagation()}
            initial={{ scaleY: 0.1, scaleX: 0.6, opacity: 0, y: 30 }}
            animate={{ scaleY: 1, scaleX: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 160, damping: 18 }}
            className={`paper relative w-full max-w-md ${shape}`}
          >
            <Sparkles count={6} />
            <div className="washi absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-3 opacity-90" aria-hidden />
            {children}
            <button onClick={onClose} autoFocus className="mt-6 block w-full text-center font-hand text-xl text-rose-deep hover:underline">
              guardar este momento ♡
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
