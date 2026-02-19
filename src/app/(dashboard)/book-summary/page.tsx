'use client';

import { useCallback, useEffect, useState } from "react";
import { generateObsidianURI } from "@/lib/obsidian";
import { BookOpen, Feather, Loader2 } from "lucide-react";

type HomeBook = {
  title: string;
  author: string;
  year?: number;
  movement: string[];
  genre: string[];
  theme: string[];
  dynamic_tags: {
    category: string;
    origin: string;
  };
  plot_summary: string;
  quotes: string[];
};

const defaultBook: HomeBook = {
  title: "The Count of Monte Cristo",
  author: "Alexandre Dumas",
  year: 1844,
  movement: ["Romanticism"],
  genre: ["Adventure", "Historical Fiction"],
  theme: ["Justice", "Revenge", "Providence"],
  dynamic_tags: { category: "Literature", origin: "Western" },
  plot_summary: "A tale of betrayal, imprisonment, and a meticulously planned vengeance...",
  quotes: ["All human wisdom is contained in these two words - Wait and Hope."],
};

export default function BookSummaryPage() {
  const [book, setBook] = useState<HomeBook>(defaultBook);
  const [queryTitle, setQueryTitle] = useState(defaultBook.title);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchSummary = useCallback(async (title: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/book-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, language: "zh" }),
      });
      if (!response.ok) return;
      const data = (await response.json()) as Partial<HomeBook> & {
        dynamic_tags?: Partial<HomeBook["dynamic_tags"]>;
      };
      setBook({
        title: data.title || title,
        author: data.author || defaultBook.author,
        year: data.year,
        movement: data.movement || [],
        genre: data.genre || [],
        theme: data.theme || [],
        dynamic_tags: {
          category: data.dynamic_tags?.category || "Literature",
          origin: data.dynamic_tags?.origin || "Western",
        },
        plot_summary: data.plot_summary || "",
        quotes: data.quotes || [],
      });
    } catch {
      return;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary(defaultBook.title);
  }, [fetchSummary]);

  const handleGenerate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = queryTitle.trim();
    if (!trimmedTitle) return;
    await fetchSummary(trimmedTitle);
  };

  const handleObsidianExport = () => {
    window.location.assign(generateObsidianURI(book));
  };

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-12 py-10">
      {/* Page title */}
      <div className="mb-10">
        <p className="section-label mb-1">Scholium · Book Summary</p>
        <div className="ornament-divider mt-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Left column */}
        <div className="md:col-span-4 space-y-8">
          {/* Search form */}
          <form onSubmit={handleGenerate} className="space-y-2">
            <input
              value={queryTitle}
              onChange={(event) => setQueryTitle(event.target.value)}
              placeholder="Enter a book title…"
              className="w-full bg-white border border-stone-200 focus:border-[#A67C52]/50 focus:outline-none px-4 py-2.5 rounded-sm text-[#1C1917] placeholder:text-stone-400 text-base transition"
            />
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#12100E] text-[#FAF9F6] rounded-sm hover:bg-[#1C1917] transition-colors disabled:opacity-60 tracking-wide text-sm"
            >
              {isGenerating ? (
                <><Loader2 size={14} className="animate-spin" /> Consulting the archive…</>
              ) : (
                "Generate Summary"
              )}
            </button>
          </form>

          {/* Book identity */}
          <div className="pt-2">
            <h2 className="text-3xl md:text-4xl font-light text-[#1C1917] leading-snug tracking-tight mb-1">
              {book.title}
            </h2>
            <p className="text-base text-[#A67C52] italic">{book.author}</p>
          </div>

          {/* Metadata */}
          <div className="border-t border-b border-stone-200 py-5 space-y-2.5 text-sm">
            {[
              { label: "Year", value: book.year?.toString() ?? "—" },
              { label: "Movement", value: book.movement.join(", ") || "—" },
              { label: "Genre", value: book.genre.join(", ") || "—" },
              { label: "Category", value: book.dynamic_tags.category },
              { label: "Origin", value: book.dynamic_tags.origin },
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-3">
                <span className="w-24 text-[#A67C52]/70 shrink-0 tracking-wide text-xs uppercase pt-0.5">{label}</span>
                <span className="text-[#1C1917]/80">{value}</span>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={handleObsidianExport}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 border border-[#A67C52]/40 text-[#A67C52] hover:bg-[#A67C52]/8 rounded-sm transition-all text-sm tracking-wide"
            >
              <Feather size={15} /> Export to Obsidian
            </button>
            <button className="flex items-center justify-center gap-2 w-full py-2.5 px-4 border border-stone-200 text-stone-600 hover:bg-stone-100/50 rounded-sm transition-all text-sm tracking-wide">
              <BookOpen size={15} /> Save to Library
            </button>
          </div>
        </div>

        {/* Right column */}
        <div className="md:col-span-8 space-y-10 md:pl-10 md:border-l md:border-stone-200/60">
          {/* Plot summary */}
          <section>
            <p className="section-label mb-3">Plot Summary</p>
            <p className="text-[#1C1917]/80 leading-relaxed text-lg font-light">{book.plot_summary}</p>
          </section>

          {/* Themes */}
          {book.theme.length > 0 && (
            <section>
              <p className="section-label mb-3">Themes</p>
              <div className="flex flex-wrap gap-2">
                {book.theme.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 border border-[#A67C52]/20 text-[#A67C52] text-xs tracking-widest uppercase rounded-sm bg-[#A67C52]/5"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Quotes */}
          {book.quotes.length > 0 && (
            <section>
              <p className="section-label mb-3">Quotations</p>
              {book.quotes.map((quote, i) => (
                <blockquote
                  key={i}
                  className="pl-5 border-l border-[#A67C52]/40 text-[#1C1917]/70 italic text-xl leading-relaxed my-6 font-light"
                >
                  &ldquo;{quote}&rdquo;
                </blockquote>
              ))}
            </section>
          )}

          {/* Bottom ornament */}
          <div className="ornament-divider pt-4">
            <span className="text-[#A67C52]/40 text-xs">✦</span>
          </div>
        </div>
      </div>
    </div>
  );
}
