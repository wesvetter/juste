import assert from 'assert';
import { process } from '../src/index.js';

const exampleMarkdown =
`# Hello World!

This is a **great** text.
`

const badListBullets =
`## Some Items

-   Apples
-   Bananas
-   Oranges
`

const goodListBullets =
`## Some Items

*   Apples
*   Bananas
*   Oranges
`

const badItalics =
`I *love* candy corn.
`

const goodItalics =
`I _love_ candy corn.
`

const badListIndent =
`## Some Items

* Apples
* Bananas
* Oranges
`

const goodListIndent =
`## Some Items

*   Apples
*   Bananas
*   Oranges
`

const badHeaderSpacing =
`## Chapter 4
The cat in the hat.
`

const goodHeaderSpacing =
`## Chapter 4

The cat in the hat.
`

const badThematicSeperator =
`## My Book

The dog is growling at me.

***

La dee da dee
`

const goodThematicSeperator =
`## My Book

The dog is growling at me.

---

La dee da dee
`

const badTable =
`Pilot|Airport|Hours
--|:--:|--:
John Doe|SKG|1338
Jane Roe|JFK|314
`

const goodTable =
`| Pilot    | Airport | Hours |
| -------- | :-----: | ----: |
| John Doe |   SKG   |  1338 |
| Jane Roe |   JFK   |   314 |
`

describe('process()', function () {
  it('returns an object with a `result` property', function() {
    assert.equal(process(exampleMarkdown).result, exampleMarkdown);
  });

  describe('list items', function () {
    it('outputs tab-aligned indents', function () {
      assert.equal(process(badListIndent).result, goodListIndent);
    });
  });

  describe('unordered lists', function () {
    it('converts dashes to bullets (asterisks)', function () {
      assert.equal(process(badListBullets).result, goodListBullets);
    });
  });

  describe('italics', function () {
    it('converts asterisks to underscores', function () {
      assert.equal(process(badItalics).result, goodItalics);
    });
  });

  describe('headers', function () {
    it('separates headers from other blocks with a newline', function () {
      assert.equal(process(badHeaderSpacing).result, goodHeaderSpacing);
    });
  });

  describe('seperators', function () {
    it('uses triple-dash for thematic seperators', function () {
      assert.equal(process(badThematicSeperator).result, goodThematicSeperator);
    });
  });

  describe('tables', function () {
    it('formats tables nicely', function () {
      assert.equal(process(badTable).result, goodTable);
    });
  });

  describe('the `meta` property', function () {
    it('has a word-count', function () {
      const { meta } = process(exampleMarkdown);
      assert.equal(meta.wordCount, 7);
    });
  });
});
