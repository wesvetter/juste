import { visitParents } from 'unist-util-visit-parents'

function modulo(a, b) { return (+a % (b = +b) + b) % b; };

/* BEGIN - HELPERS
–––––––––––––––––––––––––––––––––––––––––––––––––– */

// These helper functions are copied directly from the `mdast-util-to-markdown` repo.
function checkBullet(state) {
  const marker = state.options.bullet || '*'

  if (marker !== '*' && marker !== '+' && marker !== '-') {
    throw new Error(
      'Cannot serialize items with `' +
        marker +
        '` for `options.bullet`, expected `*`, `+`, or `-`'
    )
  }

  return marker
}

function checkBulletOther(state) {
  const bullet = checkBullet(state)
  const bulletOther = state.options.bulletOther

  if (!bulletOther) {
    return bullet === '*' ? '-' : '*'
  }

  if (bulletOther !== '*' && bulletOther !== '+' && bulletOther !== '-') {
    throw new Error(
      'Cannot serialize items with `' +
        bulletOther +
        '` for `options.bulletOther`, expected `*`, `+`, or `-`'
    )
  }

  if (bulletOther === bullet) {
    throw new Error(
      'Expected `bullet` (`' +
        bullet +
        '`) and `bulletOther` (`' +
        bulletOther +
        '`) to be different'
    )
  }

  return bulletOther
}

function checkListItemIndent(state) {
  const style = state.options.listItemIndent || 'tab'

  // To do: remove in a major.
  // @ts-expect-error: deprecated.
  if (style === 1 || style === '1') {
    return 'one'
  }

  if (style !== 'tab' && style !== 'one' && style !== 'mixed') {
    throw new Error(
      'Cannot serialize items with `' +
        style +
        '` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`'
    )
  }

  return style
}
/* END - HELPERS
–––––––––––––––––––––––––––––––––––––––––––––––––– */

// This handler is copied from the `mdast-util-to-markdown` repo, with the only
// difference being the examination of `node.alternateBullet`.
function listItem(node, parent, state, info) {
  const listItemIndent = checkListItemIndent(state)

  // THIS IS THE ONLY MODIFICATION 👇
  let bullet = node.alternateBullet || state.bulletCurrent || checkBullet(state)

  // Add the marker value for ordered lists.
  if (parent && parent.type === 'list' && parent.ordered) {
    bullet =
      (typeof parent.start === 'number' && parent.start > -1
        ? parent.start
        : 1) +
      (state.options.incrementListMarker === false
        ? 0
        : parent.children.indexOf(node)) +
      bullet
  }

  let size = bullet.length + 1

  if (
    listItemIndent === 'tab' ||
    (listItemIndent === 'mixed' &&
      ((parent && parent.type === 'list' && parent.spread) || node.spread))
  ) {
    size = Math.ceil(size / 4) * 4
  }

  const tracker = state.createTracker(info)
  tracker.move(bullet + ' '.repeat(size - bullet.length))
  tracker.shift(size)
  const exit = state.enter('listItem')
  const value = state.indentLines(
    state.containerFlow(node, tracker.current()),
    map
  )
  exit()

  return value

  /** @type {Map} */
  function map(line, index, blank) {
    if (index) {
      return (blank ? '' : ' '.repeat(size)) + line
    }

    return (blank ? bullet : bullet + ' '.repeat(size - bullet.length)) + line
  }
}

// Set alternating list bullets for unordered lists.
function alternateListBullets(tree) {
  visitParents(tree, 'listItem', function (node, ancestors) {
    const [ parent ] = ancestors;
    // Don't operate on ordered lists.
    if (parent.ordered) {
      return;
    }

    const depth =
      ancestors
      .filter(node => node.type === 'list' && node.ordered === false)
      .length

    if (depth === 1) {
      node.bulletOther = '*';
    } else if (modulo(depth, 2) === 0) {
      node.alternateBullet = '-';
    }
  });
}



// This extension is a list-item handler function that writes a different
// bullet if `node.alternateBullet` is set.
//
// It is designed to be used in conjunction with the
// `alternateListBullets(tree)` function.
function alternatingBulletsExtension() {
  return {
    handlers: {
      listItem
    }
  }
}

export {
  alternateListBullets,
  alternatingBulletsExtension
};
