import { unified } from "unified";
import remarkParse from "remark-parse";

function parseTree(markdownString) {
  return unified()
  .use(remarkParse)
  .parse(markdownString)
}

function process(markdownString, options={}) {
  // Convert Markdown into an AST.
  const tree = parseTree(markdownString);

  // TODO: Convert AST back to Markdown.
  const result = markdownString;

  return {
    result
  }
}

export { process };
