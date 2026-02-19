'use client';

import { BookOpen, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const tools = [
  {
    label: "Book Summary",
    icon: BookOpen,
    href: "/book-summary",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    desc: "Generate structured book summaries with AI",
  },
];

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="mb-8 space-y-4">
      <h2 className="text-2xl md:text-4xl font-bold text-center">
        Explore Lyceum Applications
      </h2>
      <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
        Select a tool to get started.
      </p>
      <div className="px-4 md:px-20 lg:px-32 space-y-4">
        {tools.map((tool) => (
          <div
            onClick={() => router.push(tool.href)}
            key={tool.href}
            className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer bg-white rounded-xl shadow-sm border"
          >
            <div className="flex items-center gap-x-4">
              <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                <tool.icon className={cn("w-8 h-8", tool.color)} />
              </div>
              <div className="font-semibold">
                {tool.label}
                <p className="text-xs text-muted-foreground font-normal">
                    {tool.desc}
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5" />
          </div>
        ))}
      </div>
    </div>
  );
}
