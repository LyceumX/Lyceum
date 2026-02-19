'use client';

import { useCallback, useEffect, useState } from "react";
import { generateObsidianURI } from "@/lib/obsidian";
import { BookOpen, Feather } from "lucide-react";

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, language: "zh" }),
      });

      if (!response.ok) {
        return;
      }

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
    if (!trimmedTitle) {
      return;
    }
    await fetchSummary(trimmedTitle);
  };

  const handleObsidianExport = () => {
    window.location.assign(generateObsidianURI(book));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4 space-y-8">
          <form onSubmit={handleGenerate} className="space-y-3">
            <input
              value={queryTitle}
              onChange={(event) => setQueryTitle(event.target.value)}
              placeholder="Enter a book title"
              className="w-full bg-white/40 border border-stone-300 px-3 py-2 rounded-sm text-stone-800 placeholder:text-stone-400"
            />
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-2 px-3 bg-stone-800 text-[#FAF9F6] rounded-sm hover:bg-stone-700 transition-colors disabled:opacity-60"
            >
              {isGenerating ? "Generating..." : "Generate"}
            </button>
          </form>

          <div>
            <h2 className="text-4xl font-normal mb-2 text-stone-800 leading-tight">{book.title}</h2>
            <p className="text-lg text-stone-500 italic">{book.author}</p>
          </div>

          <div className="space-y-3 text-sm text-stone-700 border-t border-b border-stone-200 py-6">
            <div className="flex"><span className="w-24 text-stone-400">Year</span><span>{book.year}</span></div>
            <div className="flex"><span className="w-24 text-stone-400">Movement</span><span>{book.movement.join(", ")}</span></div>
            <div className="flex"><span className="w-24 text-stone-400">Genre</span><span>{book.genre.join(", ")}</span></div>
            <div className="flex"><span className="w-24 text-stone-400">Tags</span><span>Study, {book.dynamic_tags.category}, {book.dynamic_tags.origin}</span></div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleObsidianExport}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white/40 backdrop-blur-md border border-white/50 shadow-sm rounded-sm text-[#7c3aed] hover:bg-[#7c3aed]/10 transition-all"
            >
              <Feather size={18} /> Save to Obsidian
            </button>
            <button className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white/40 backdrop-blur-md border border-white/50 shadow-sm rounded-sm text-stone-700 hover:bg-stone-200/50 transition-all">
              <BookOpen size={18} /> Save to Library
            </button>
          </div>
        </div>

        <div className="md:col-span-8 space-y-10 md:pl-8 md:border-l md:border-stone-200/60">
          <section>
            <h3 className="text-xl text-stone-400 mb-4 tracking-wider uppercase text-sm">Plot Summary</h3>
            <p className="text-stone-800 leading-relaxed text-lg">{book.plot_summary}</p>
          </section>

          <section>
            <h3 className="text-xl text-stone-400 mb-4 tracking-wider uppercase text-sm">Quotes</h3>
            {book.quotes.map((quote, i) => (
              <blockquote key={i} className="pl-6 border-l-2 border-stone-300 text-stone-600 italic text-xl leading-relaxed my-6">
                &ldquo;{quote}&rdquo;
              </blockquote>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
