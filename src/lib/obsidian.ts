import { format } from "date-fns";

type ObsidianBookData = {
  title: string;
  author: string;
  year?: number;
  movement?: string[];
  genre?: string[];
  theme?: string[];
  dynamic_tags?: {
    category?: string;
    origin?: string;
  };
  plot_summary?: string;
  quotes?: string[];
};

export function generateObsidianURI(bookData: ObsidianBookData, vaultName: string = "MyVault") {
  const tags = [
    "Study",
    bookData.dynamic_tags?.category || "Literature",
    bookData.dynamic_tags?.origin || "Western",
  ];

  const yaml = `---
Categories: "[[Books]]"
Author: "[[${bookData.author}]]"
Year: ${bookData.year || ""}
Movement: ${JSON.stringify(bookData.movement || [])}
Genre: ${JSON.stringify(bookData.genre || [])}
Theme: ${JSON.stringify(bookData.theme || [])}
Rating: 0
last: ${format(new Date(), "MM/dd/yyyy")}
via: "WeRead"
tags: ${JSON.stringify(tags)}
---

# ${bookData.title}

## Plot Summary
${bookData.plot_summary || ""}

## Quotes
${bookData.quotes?.map((q: string) => `> ${q}`).join("\n\n") || ""}
`;

  const fileName = `${bookData.title} - ${bookData.author}`;
  return `obsidian://new?vault=${encodeURIComponent(vaultName)}&name=${encodeURIComponent(fileName)}&content=${encodeURIComponent(yaml)}`;
}
