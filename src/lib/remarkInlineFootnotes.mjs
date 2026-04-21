import { fromMarkdown } from "mdast-util-from-markdown";

/**
 * Find `^[ ... ]` where inner `[` / `]` pairs are balanced so markdown like
 * `[label](url)` inside the footnote does not terminate the footnote early.
 *
 * @param {string} source
 * @param {number} fromIndex index where `^[` begins
 * @returns {{ start: number, end: number, inner: string } | null}
 */
function findBracketFootnote(source, fromIndex) {
  if (source.slice(fromIndex, fromIndex + 2) !== "^[") return null;
  let depth = 1;
  let i = fromIndex + 2;
  while (i < source.length && depth > 0) {
    const c = source[i];
    if (c === "[") depth++;
    else if (c === "]") depth--;
    i++;
  }
  if (depth !== 0) return null;
  return {
    start: fromIndex,
    end: i,
    inner: source.slice(fromIndex + 2, i - 1),
  };
}

/**
 * Serialize phrasing content back to a markdown string (links, emphasis, plain text).
 * Used when CommonMark split `^[[label](url) ...]` across nodes before this plugin runs.
 * @param {import('mdast').PhrasingContent[]} nodes
 * @returns {string}
 */
function phrasingNodesToMarkdown(nodes) {
  if (!Array.isArray(nodes)) return "";
  return nodes
    .map((n) => {
      if (n.type === "text") return n.value;
      if (n.type === "link") {
        const label =
          n.children?.map((c) => (c.type === "text" ? c.value : phrasingNodesToMarkdown([c]))).join("") ?? "";
        const dest = n.url ?? "";
        const title = n.title ? ` "${n.title.replace(/"/g, '\\"')}"` : "";
        return `[${label}](${dest}${title})`;
      }
      if (n.type === "strong") {
        return `**${phrasingNodesToMarkdown(n.children ?? [])}**`;
      }
      if (n.type === "emphasis") {
        return `*${phrasingNodesToMarkdown(n.children ?? [])}*`;
      }
      if (n.type === "inlineCode") {
        const d = String(n.value ?? "").includes("`") ? "``" : "`";
        return `${d}${n.value}${d}`;
      }
      return "";
    })
    .join("");
}

/**
 * Parse footnote body as markdown so links, emphasis, etc. work.
 * @param {string} inner
 * @returns {import('mdast').RootContent[]}
 */
function footnoteDefinitionChildren(inner) {
  const trimmed = inner.trim();
  if (!trimmed) {
    return [
      {
        type: "paragraph",
        children: [{ type: "text", value: "" }],
      },
    ];
  }
  try {
    const tree = fromMarkdown(trimmed);
    if (Array.isArray(tree.children) && tree.children.length > 0) {
      return tree.children;
    }
  } catch {
    // fall through
  }
  return [
    {
      type: "paragraph",
      children: [{ type: "text", value: inner }],
    },
  ];
}

/**
 * `^[[MeZO](url) ...]` is often parsed as: text ending with `^[`, then link, then text with `]`.
 * Merge that shape into a real footnote reference + definition.
 * @param {import('mdast').Paragraph} paragraph
 * @param {{ count: number, definitions: unknown[] }} state
 */
function transformSplitFootnoteParagraph(paragraph, state) {
  if (!paragraph?.children?.length) return;

  let changed = true;
  while (changed) {
    changed = false;
    const ch = paragraph.children;

    for (let i = 0; i < ch.length; i++) {
      const node = ch[i];
      if (node.type !== "text" || typeof node.value !== "string") continue;
      const openIdx = node.value.indexOf("^[");
      if (openIdx === -1) continue;

      const prefix = node.value.slice(0, openIdx);
      const immediateInner = node.value.slice(openIdx + 2);

      // If the closing bracket is in the same text node, plain text replacement
      // handles it later in recursion (`replaceTextWithFootnotes`).
      if (immediateInner.includes("]")) continue;

      let j = i + 1;
      while (j < ch.length) {
        const n = ch[j];
        if (n.type === "text" && n.value.includes("]")) break;
        j++;
      }
      if (j >= ch.length) continue;

      const lastInFootnote = ch[j];
      if (lastInFootnote.type !== "text" || typeof lastInFootnote.value !== "string") continue;

      const closeIdx = lastInFootnote.value.lastIndexOf("]");
      if (closeIdx === -1) continue;

      const segment = ch.slice(i + 1, j + 1);
      const innerSegment = segment.map((n, segIdx) => {
        if (segIdx === segment.length - 1 && n.type === "text") {
          return { ...n, value: n.value.slice(0, closeIdx) };
        }
        return n;
      });

      /** @type {import('mdast').PhrasingContent[]} */
      const allInnerNodes = [];
      if (immediateInner) {
        allInnerNodes.push({ type: "text", value: immediateInner });
      }
      allInnerNodes.push(...innerSegment);

      const innerMd = phrasingNodesToMarkdown(allInnerNodes);
      const afterClose = lastInFootnote.value.slice(closeIdx + 1);

      state.count += 1;
      const identifier = `inline-${state.count}`;
      state.definitions.push({
        type: "footnoteDefinition",
        identifier,
        label: identifier,
        children: footnoteDefinitionChildren(innerMd),
      });

      /** @type {import('mdast').PhrasingContent[]} */
      const newChildren = [];
      newChildren.push(...ch.slice(0, i));
      if (prefix) {
        newChildren.push({ type: "text", value: prefix });
      }
      newChildren.push({
        type: "footnoteReference",
        identifier,
        label: identifier,
      });
      if (afterClose) {
        newChildren.push({ type: "text", value: afterClose });
      }
      newChildren.push(...ch.slice(j + 1));

      paragraph.children = newChildren;
      changed = true;
      break;
    }
  }
}

/**
 * @param {string} source
 * @param {{ count: number, definitions: unknown[] }} state
 */
function replaceTextWithFootnotes(source, state) {
  /** @type {import('mdast').PhrasingContent[]} */
  const out = [];
  let cursor = 0;
  while (cursor < source.length) {
    const idx = source.indexOf("^[", cursor);
    if (idx === -1) {
      if (cursor < source.length) {
        out.push({ type: "text", value: source.slice(cursor) });
      }
      break;
    }
    if (idx > cursor) {
      out.push({ type: "text", value: source.slice(cursor, idx) });
    }
    const fn = findBracketFootnote(source, idx);
    if (!fn) {
      out.push({ type: "text", value: "^" });
      cursor = idx + 1;
      continue;
    }
    state.count += 1;
    const identifier = `inline-${state.count}`;
    out.push({
      type: "footnoteReference",
      identifier,
      label: identifier,
    });
    state.definitions.push({
      type: "footnoteDefinition",
      identifier,
      label: identifier,
      children: footnoteDefinitionChildren(fn.inner),
    });
    cursor = fn.end;
  }
  return out;
}

function replaceInlineFootnotes(children, state) {
  const replaced = [];

  for (const child of children) {
    if (child?.type === "paragraph") {
      transformSplitFootnoteParagraph(child, state);
    }

    if (child?.type === "text" && typeof child.value === "string" && child.value.includes("^[")) {
      replaced.push(...replaceTextWithFootnotes(child.value, state));
      continue;
    }

    if (Array.isArray(child?.children)) {
      child.children = replaceInlineFootnotes(child.children, state);
    }

    replaced.push(child);
  }

  return replaced;
}

export default function remarkInlineFootnotes() {
  return (tree, file) => {
    if (!tree || !Array.isArray(tree.children)) return;

    const state = {
      count: 0,
      definitions: [],
    };

    tree.children = replaceInlineFootnotes(tree.children, state);

    if (state.definitions.length > 0) {
      tree.children.push(...state.definitions);
    }
  };
}
