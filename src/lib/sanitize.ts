import sanitizeHtml from "sanitize-html";

export function sanitizeEditorHtml(dirty: string): string {
  return sanitizeHtml(dirty, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "u",
      "s",
      "del",
      "ins",
      "mark",
      "sub",
      "sup",
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      "*": ["class"],
    },
    disallowedTagsMode: "discard",
  });
}
