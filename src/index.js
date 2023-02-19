import { unified } from 'unified';
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { visit } from 'unist-util-visit'

function countWords(tree) {
  let wc = 0;
  visit(tree, 'text', function (node) {
    wc += node.value.trim().split(' ').length;
  });
  return wc;
}

function parseTree(markdownString) {
  return unified()
  .use(remarkParse)
  .use(remarkGfm)
  .parse(markdownString)
}

function processMarkdown(markdownString) {
  return unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkStringify, {
    bullet: '*',
    emphasis: '_',
    rule: '-',
  })
  .processSync(markdownString)
  .value
}

function process(markdownString, options={}) {
  // Convert Markdown into an AST.
  const tree = parseTree(markdownString);

  // Do some intermediate processing on the AST.
  const wordCount = countWords(tree);

  // Convert the AST back to Markdown.
  const result = processMarkdown(markdownString);

  return {
    result,
    meta: {
      wordCount
    }
  }
}

export { process };
