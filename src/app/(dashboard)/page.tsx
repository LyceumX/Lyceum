'use client';

import { BookOpen, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const tools = [
  {
    label: "Book Summary",
    icon: BookOpen,
    href: "/book-summary",
    desc: "Generate structured literary summaries with AI — themes, quotes, movements, and more.",
    tag: "Scholarship",
  },
];

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Page heading */}
      <div className="text-center mb-14">
        <p className="section-label mb-3">Scholium</p>
        <h2 className="text-4xl md:text-5xl font-light text-[#1C1917] tracking-tight leading-tight">
          The Collection
        </h2>
        <p className="mt-4 text-stone-500 text-lg font-light leading-relaxed max-w-md mx-auto">
          Tools for the pursuit of knowledge, in the tradition of the ancient Lyceum.
        </p>
      </div>

      {/* Ornamental divider */}
      <div className="ornament-divider mb-10">
        <span className="text-[#A67C52]/50 text-xs">✦</span>
      </div>

      {/* Tool cards */}
      <div className="space-y-4">
        {tools.map((tool) => (
          <button
            onClick={() => router.push(tool.href)}
            key={tool.href}
            className="w-full text-left group p-6 bg-white/60 border border-stone-200 hover:border-[#A67C52]/40 hover:bg-white hover:shadow-md transition-all duration-200 rounded-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 p-2 border border-[#A67C52]/20 bg-[#A67C52]/5 rounded-sm">
                  <tool.icon className="w-5 h-5 text-[#A67C52]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs tracking-widest uppercase text-[#A67C52]/70 font-medium">{tool.tag}</span>
                  </div>
                  <h3 className="text-xl font-medium text-[#1C1917] group-hover:text-[#12100E] transition-colors">
                    {tool.label}
                  </h3>
                  <p className="text-stone-500 text-sm mt-1 leading-relaxed font-light">
                    {tool.desc}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#A67C52] transition-colors mt-1 shrink-0" />
            </div>
          </button>
        ))}
      </div>

      {/* Bottom ornament */}
      <div className="ornament-divider mt-14">
        <span className="text-[#A67C52]/50 text-xs">✦</span>
      </div>
    </div>
  );
}
