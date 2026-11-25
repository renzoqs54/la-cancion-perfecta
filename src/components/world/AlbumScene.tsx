import { useState, type ChangeEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronDown, ChevronUp, ImagePlus, NotebookPen } from "lucide-react";
import lilyPink from "@/assets/lily-pink.webp";
import lilyBouquet from "@/assets/lily-bouquet.webp";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWorld } from "./world";

const NOTES = [
  "Mereces sentirte tranquila.",
  "Tus sentimientos también importan.",
  "No tienes que fingir estar bien.",
  "Mereces ser escuchada y comprendida.",
  "Tu felicidad importa.",
];

export function AlbumScene() {
  const { albumPhotos, setAlbumPhoto } = useWorld();
  const reducedMotion = useReducedMotion();
  const [admirationOpen, setAdmirationOpen] = useState(false);
  const [reflectionOpen, setReflectionOpen] = useState(false);
  const [revealedNotes, setRevealedNotes] = useState<Set<number>>(() => new Set());
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<number | null>(null);
  const previewPhoto = previewIndex === null ? null : albumPhotos[previewIndex] ?? null;

  function addPhoto(index: number, event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = "";
    if (!file || !file.type.startsWith("image/")) return;
    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setAlbumPhoto(index, { src: reader.result, name: file.name });
      else setUploadError(index);
    };
    reader.onerror = () => setUploadError(index);
    reader.readAsDataURL(file);
  }

  function toggleNote(index: number) {
    setRevealedNotes((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <section className="relative min-h-dvh overflow-hidden bg-[image:var(--gradient-dawn)] px-4 pb-32 pt-20 sm:px-8 sm:pt-24">
      <div className="grain pointer-events-none absolute inset-0 opacity-30" aria-hidden />
      <div className="relative z-10 mx-auto max-w-6xl">
        <header className="mx-auto mb-10 max-w-2xl text-center">
          <p className="font-hand text-2xl text-rose-deep">Páginas para guardar</p>
          <h1 className="mt-2 font-serif text-4xl text-ink sm:text-5xl">Nuestro pequeño álbum</h1>
          <p className="mt-3 font-serif text-xl italic text-ink/70">Un puñado de cosas bonitas que merecen quedarse cerca.</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          <motion.article initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 0.5 }} className="paper relative border border-rose-antique/25 p-6 shadow-[var(--paper-shadow)] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-hand text-lg text-rose-deep">01 · Un retrato en palabras</p>
                <h2 className="mt-1 font-serif text-2xl text-ink">Lo que admiro de ti</h2>
              </div>
              <img src={lilyPink} alt="" aria-hidden className="sticker w-16 rotate-6" />
            </div>
            <Button variant="ghost" onClick={() => setAdmirationOpen((open) => !open)} aria-expanded={admirationOpen} className="mt-4 px-0 text-rose-deep hover:bg-transparent hover:text-rose-deep">
              {admirationOpen ? "Cerrar recuerdo" : "Abrir recuerdo"}
              {admirationOpen ? <ChevronUp aria-hidden /> : <ChevronDown aria-hidden />}
            </Button>
            {admirationOpen && (
              <p className="mt-3 border-l-2 border-rose-antique/50 pl-4 font-serif text-lg leading-relaxed text-ink/80">
                Tu manera de ser, tus ocurrencias, tu sonrisa y esos pequeños detalles que podían volver extraordinario un día cualquiera.
              </p>
            )}
          </motion.article>

          <motion.article initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reducedMotion ? 0 : 0.08, duration: reducedMotion ? 0 : 0.5 }} className="paper relative border border-rose-antique/25 p-6 shadow-[var(--paper-shadow)] sm:p-8">
            <p className="font-hand text-lg text-rose-deep">02 · Notas para guardar</p>
            <h2 className="mt-1 font-serif text-2xl text-ink">Cosas que nunca quisiera que olvidaras</h2>
            <div className="mt-5 grid gap-2">
              {NOTES.map((note, index) => {
                const revealed = revealedNotes.has(index);
                return (
                  <Button
                    key={note}
                    variant={revealed ? "secondary" : "outline"}
                    onClick={() => toggleNote(index)}
                    aria-expanded={revealed}
                    className="h-auto min-h-11 justify-between whitespace-normal px-4 py-2 text-left font-hand text-xl"
                  >
                    <span>{revealed ? note : `Una nota pequeña · ${index + 1}`}</span>
                    <NotebookPen aria-hidden className="shrink-0" />
                  </Button>
                );
              })}
            </div>
          </motion.article>

          <motion.article initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reducedMotion ? 0 : 0.16, duration: reducedMotion ? 0 : 0.5 }} className="paper relative border border-rose-antique/25 p-6 shadow-[var(--paper-shadow)] sm:p-8">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-hand text-lg text-rose-deep">03 · Fotografías sin inventar</p>
                <h2 className="mt-1 font-serif text-2xl text-ink">Momentos que guardo con cariño</h2>
              </div>
              <img src={lilyBouquet} alt="" aria-hidden className="sticker hidden w-14 -rotate-6 sm:block" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {Array.from({ length: 3 }, (_, index) => {
                const photo = albumPhotos[index] ?? null;
                return (
                  <div key={index} className="polaroid rotate-[-1deg] border border-rose-antique/25 bg-card p-2 pb-4 shadow-sm even:rotate-2">
                    {photo ? (
                      <Button variant="ghost" onClick={() => setPreviewIndex(index)} aria-label={`Ampliar fotografía ${index + 1}`} className="h-auto w-full p-0 hover:bg-transparent">
                        <img src={photo.src} alt={`Fotografía elegida: ${photo.name}`} className="aspect-square w-full object-cover" />
                      </Button>
                    ) : (
                      <div className="grid aspect-square place-items-center border border-dashed border-rose-antique/40 bg-blush/35 p-3 text-center">
                        <div>
                          <ImagePlus aria-hidden className="mx-auto mb-2 size-7 text-rose-deep" />
                          <p className="font-hand text-lg leading-snug text-ink/70">Un espacio para un recuerdo real</p>
                        </div>
                      </div>
                    )}
                    <p className="mt-2 truncate text-center font-hand text-lg text-ink/75">{photo ? photo.name : "Sin fecha, sin inventar"}</p>
                    <label className="mt-2 block">
                      <input type="file" accept="image/*" className="peer sr-only" aria-label={photo ? `Cambiar fotografía ${index + 1}` : `Añadir fotografía ${index + 1}`} onChange={(event) => addPhoto(index, event)} />
                      <span className="inline-flex min-h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-center text-xs font-medium text-foreground transition-colors hover:bg-accent peer-focus-visible:outline-2 peer-focus-visible:outline-ring">
                        <ImagePlus aria-hidden className="size-4" /> {photo ? "Cambiar fotografía" : "Añadir fotografía"}
                      </span>
                    </label>
                    {photo && <Button variant="link" size="sm" onClick={() => setAlbumPhoto(index, null)} className="mt-1 h-8 w-full text-xs text-muted-foreground">Quitar</Button>}
                    {uploadError === index && <p role="alert" className="mt-1 text-center text-xs text-destructive">No se pudo abrir esta imagen.</p>}
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-center font-sans text-xs text-muted-foreground">Las imágenes elegidas se mantienen mientras esta página está abierta.</p>
          </motion.article>

          <motion.article initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reducedMotion ? 0 : 0.24, duration: reducedMotion ? 0 : 0.5 }} className="paper relative border border-rose-antique/25 p-6 shadow-[var(--paper-shadow)] sm:p-8">
            <p className="font-hand text-lg text-rose-deep">04 · Una página para pensar</p>
            <h2 className="mt-1 font-serif text-2xl text-ink">Lo que aprendí de nosotros</h2>
            <Button variant="ghost" onClick={() => setReflectionOpen((open) => !open)} aria-expanded={reflectionOpen} className="mt-4 px-0 text-rose-deep hover:bg-transparent hover:text-rose-deep">
              {reflectionOpen ? "Cerrar reflexión" : "Leer reflexión"}
              {reflectionOpen ? <ChevronUp aria-hidden /> : <ChevronDown aria-hidden />}
            </Button>
            {reflectionOpen && (
              <p className="mt-3 border-l-2 border-sage/70 pl-4 font-serif text-lg leading-relaxed text-ink/80">
                Querer también es aprender a escuchar con paciencia, respetar los tiempos, cuidar la confianza, hablar con honestidad y reconocer los errores para hacer las cosas mejor.
              </p>
            )}
          </motion.article>
        </div>
      </div>

      <Dialog open={previewPhoto !== null} onOpenChange={(open) => { if (!open) setPreviewIndex(null); }}>
        <DialogContent className="paper max-h-[90dvh] overflow-y-auto border-rose-antique/30 sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-ink">Un momento guardado con cariño</DialogTitle>
            <DialogDescription className="text-muted-foreground">Fotografía elegida para este álbum.</DialogDescription>
          </DialogHeader>
          {previewPhoto && <img src={previewPhoto.src} alt={`Fotografía elegida: ${previewPhoto.name}`} className="max-h-[68dvh] w-full object-contain" />}
        </DialogContent>
      </Dialog>
    </section>
  );
}