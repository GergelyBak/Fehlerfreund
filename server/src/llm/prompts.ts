import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Prompts live in /server/prompts as <name>.v<N>.md so every stored correction
// can record which prompt version produced it.
const PROMPTS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../prompts");

export const PROMPT_VERSIONS = {
  roleplay: "v1",
  correction: "v1",
} as const;

export type PromptName = keyof typeof PROMPT_VERSIONS;

const cache = new Map<string, string>();

export async function loadPrompt(name: PromptName, vars: Record<string, string> = {}) {
  const version = PROMPT_VERSIONS[name];
  const file = `${name}.${version}.md`;
  let template = cache.get(file);
  if (template === undefined) {
    template = await readFile(path.join(PROMPTS_DIR, file), "utf8");
    cache.set(file, template);
  }
  const text = template.replace(/\{\{(\w+)\}\}/g, (match, key: string) => vars[key] ?? match);
  return { text, version: `${name}.${version}` };
}
