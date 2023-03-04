import { unified } from 'unified';
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { visit } from 'unist-util-visit'
import { toMarkdown } from 'mdast-util-to-markdown';
import { gfmToMarkdown } from 'mdast-util-gfm';

import {
  alternateListBullets,
  alternatingBulletsExtension
} from './alternating-bullets.js';

function countWords(tree) {
  let wc = 0;
  visit(tree, 'text', function (node) {
    wc += node.value.trim().split(' ').length;
  });
  return wc;
}

const MARKDOWN_STRINGIFY_OPTIONS = {
  bullet: '*',
  emphasis: '_',
  rule: '-',
  extensions: [
    gfmToMarkdown(),
    alternatingBulletsExtension(),
  ]
};



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

function processTree(markdownTree) {
  return toMarkdown(markdownTree, MARKDOWN_STRINGIFY_OPTIONS);
}

function process(markdownString, options={}) {
  // Convert Markdown into an AST.
  let tree = parseTree(markdownString);

  // Do some intermediate processing on the AST.
  const wordCount = countWords(tree);

  alternateListBullets(tree);

  // Convert the AST back to Markdown.
  const result = processTree(tree);

  return {
    result,
    meta: {
      wordCount
    }
  }
}

export { process };
