function replaceInlineFootnotes(children, state) {
  const replaced = [];

  for (const child of children) {
    if (child?.type === "text" && typeof child.value === "string" && child.value.includes("^[")) {
      const source = child.value;
      const pattern = /\^\[([\s\S]+?)\]/g;
      let cursor = 0;
      let matched = false;
      let match;

      while ((match = pattern.exec(source)) !== null) {
        matched = true;

        if (match.index > cursor) {
          replaced.push({
            type: "text",
            value: source.slice(cursor, match.index),
          });
        }

        state.count += 1;
        const identifier = `inline-${state.count}`;
        const footnoteText = (match[1] ?? "").trim();

        replaced.push({
          type: "footnoteReference",
          identifier,
          label: identifier,
        });

        state.definitions.push({
          type: "footnoteDefinition",
          identifier,
          label: identifier,
          children: [
            {
              type: "paragraph",
              children: [
                {
                  type: "text",
                  value: footnoteText,
                },
              ],
            },
          ],
        });

        cursor = match.index + match[0].length;
      }

      if (!matched) {
        replaced.push(child);
        continue;
      }

      if (cursor < source.length) {
        replaced.push({
          type: "text",
          value: source.slice(cursor),
        });
      }

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
  return (tree) => {
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
