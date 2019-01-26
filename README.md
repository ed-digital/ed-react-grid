A simple, yet highly-configurable, responsive *n*-column grid system for React, built with `styled-components` integration and TypeScript support. Supports a mix of static grids (in `px`) and fluid grids (in `vw`) at different resolutions.

# Installation

```bash
yarn add @_ed/grid
```

# Usage

This library provides three main components:

* `<GridProvider />` — Defines grid properties for descendant Row and Col elements.
* `<Row />` — Creates a new row in the grid.
* `<Col />` — Where the magic happens!

There are also a handful of useful mixins for use with `styled-components`.

## `GridProvider`

To begin using the system, you'll first need to create a grid definition using `createGrid()`, and supply it to a `GridProvider` component like so:

```javascript
// theme.ts (or theme.js)
import { createGrid } from '@_ed/grid'

export const grid = createGrid({
  columns: 12,
  breakpoints: {
    xs: {
      at: 0,
      fluid: true,
      padding: 5,
      gutter: 5,
      width: 100
    },
    md: {
      at: 900,
      fluid: true,
      padding: 2,
      gutter: 3,
      width: 100
    },
    lg: {
      at: 1500,
      fluid: false,
      padding: 40,
      gutter: 30,
      width: 1200
    }
  }
})
```

The above creates a 12-column, mobile-first grid, with three breakpoints, named `xs`, `md` and `lg`. The first two sizes are fluid, while the `lg` breakpoint is pixel based. It's useful to define your grid in a separate file, to reduce clutter.

To use these grid settings in your application:

```jsx
// App.ts
import { GridProvider } from `@_ed/grid`
import { grid } from 'theme'

export function App() {
  return (
    <GridProvider grid={grid}>
      <Row>
        <Col cols={12}>
          <h1>My Cool Site!</h1>
        </Col>
      </Row>
    </GridProvider>
  )
}
```

## `Row`

You must wrap groups of `<Col />` components in a `<Row />` to ensure correct layout.

Row currently only takes two props, `gutterTop` and `gutterBottom`, which are both optional. They can either be `true` or a number. Using these props will assign `margin-top` and/or `margin-bottom`, to the value of the current breakpoint's `gutter` size. This allows you to have the same spacing above/below, as between columns. There is also a mixin to achieve this anywhere else.

## `Col`

The `Col` component takes the following props:

* `cols` — (required) the number of columns this element should take up. This will be the default number of columns, but can be overridden per-breakpoint.
* `left` — (optional, number) adds a `margin-left` to this element, where the value is the number passed, multiplied by the column width, plus any gutters. This affects the placement of this column, plus any columns to the right.
* `right` — (optional, number) adds a `margin-right` to this element, where the value is the number passed, multiplied by the column width, plus any gutters. This affects any columns to the right.
* `drift` — (optional, number) shifts the element by n columns. A negative number will drift the column to the left, and a positive to the right. This does not affect surrounding columns.
* `visible` — (optional, defaults to true, boolean) whether or not this column is visible.

Each property can be overridden for each and any breakpoint. Simply prepend the breakpoint name, to the property name, camel-cased. For example, if you have a `lg` breakpoint, you can use `lgCols`, `lgLeft`, `lgRight`, `lgDrift`, `lgVisible`.

# Grid Settings

Grids are created with `createGrid` — see the example above.

When creating a grid, each breakpoint can have the following parameters.

* `at` (required, number) — the screen resolution at which this breakpoint takes effect. For the smallest mobile breakpoint, this should be `0`
* `fluid` (required, boolean) — whether or not this breakpoint is fluid, or static in width. Static breakpoints will use `px` for all CSS, whereas fluid will use `vw` for all CSS. You would typically make all of your breakpoints fluid, except for perhaps the largest one, if you'd like to limit the width of your content on a larger screen.
* `width` (required, number) — the total width of the grid, in grid units, at this breakpoint, including all side padding, gutters and columns. For fluid, this should probably be `100`. For static, it'll be in pixels (eg `1200`).
* `gutter` (required, number) — the spacing between each column, in grid units. For fluid, you might use `3` (3% of the viewport width), whereas for static you might use `30` (for 30px).
* `padding` (required, number) — similar to `gutter`, except it instead defines the spacing between the content and the edge of the grid. You'd often set this to be the same value as `gutter`
* `columns` (optional, number) — use this to override the number of columns at this breakpoint. For instance, you might set this to `4` for your mobile grid. In most cases, you'll probably want to just ignore this option.

# Mixins

There are a handful of mixins available for use with `styled-components`. Some even allow you to bypass using `Col` and `Row` altogether :)

`column(args)` takes the same arguments as the `Col` component, detailed above. In fact, the `Col` component just uses this mixin!

```jsx
import styled from 'styled-components'
import { column } from '@_ed/grid'

const BigRedCol = styled.div`
  background: red;
  ${column({
    cols: 12,
    mdCols: 6
  })}
`
```

`row()` takes no arguments. It adds the appropriate styling to create a Row-like component.

```jsx
import styled from 'styled-components'
import { row } from '@_ed/grid'

const MyCustomRow = styled.div`
  margin-top: 100px;
  margin-bottom: 100px;
  ${row()}
`
```

`columnPadding(args, fromSize)` args should be an object, containing one or two arguments, `gutterTop` and `gutterBottom`, both numbers. It'll add `margin-top` or `margin-bottom` for each breakpoint, where the value used is the gutter size multiplied by the number supplied. Also takes an optional `fromSize` argument, which should be a breakpoint name. The padding will apply from this breakpoint and larger.

```jsx
import styled from 'styled-components'
import { columnPadding } from '@_ed/grid'

const GridItem = styled.div`
  ${columnPadding({
    gutterTop: 2
  })}
`
```

`each(callback)` — calls your callback for each breakpoint, returning the result. The result for each breakpoint is automatically wrapped in a _clamped media query_ (with `min-width` AND `max-width`), in that the result for each breakpoint only affects that exact breakpoint only (not mobile-first).

```jsx
import styled, { css } from 'styled-components'
import { each } from '@_ed/grid'

const OneColHigh = styled.div`
  // Make this div the same height as 1 column width,
  // for every breakpoint
  ${each(breakpoint => css`
    height: ${breakpoint.colWidths[1]}${breakpoint.units};
  `)}
`
```

`at(sizes, callback)` — exactly the same as `each`, however you must specify one or more sizes to be iterated over. Just like `each`, the result of your callback for each breakpoint is wrapped in a min/max media query, rather than just a `min-width` one. The `size` argument should either be a string, or an array of strings. `callback` can also just be a piece of CSS, rather than a function.

```jsx
import styled, { css } from 'styled-components'
import { at } from '@_ed/grid'

const MyBox = styled.div`
  // Font size is 30 on desktop, 10 on mobile
  font-size: 30px;
  ${at('xs', css`
    font-size: 10px;
  `)}
  // Padding-top is the same as the gutter size on xs and md
  ${at(['xs', 'md'], breakpoint => css`
    padding-top: ${breakpoint.gutter}${breakpoint.units};
  `)}
```

`from(sizes, callback)` — the same as `at`, except the media queries used are not clamped. This means that if you have breakpoints `xs`, `md` and `lg`, then `from('md')` will affect both `md` and `lg`.

```jsx
import styled, { css } from 'styled-components'
import { from } from '@_ed/grid'

const MyBox = styled.div`
  // Padding-top is the same as the gutter size for `md` and higher
  ${from(['md'], breakpoint => css`
    padding-top: ${breakpoint.gutter}${breakpoint.units};
  `)}
```

`queryAt(sizes)` — produces a clamped media query in the form `(min-width: X) and (max-width: X)`, except for the smallest breakpoint which would be `(max-width: X)` or the largest breakpoint which would be `(min-width: X)`. The `sizes` arg can be a string or array of strings

```jsx
import styled, { css } from 'styled-components'
import { queryAt } from '@_ed/grid'

const MyBox = styled.div`
  // Hide this element at the xs breakpoint only
  @media ${queryAt('xs')} {
    display: none;
  }
```

`queryFrom(size)` — produces a `min-width` media query, which will it's contents from the specified size and upwards

```jsx
import styled, { css } from 'styled-components'
import { queryFrom } from '@_ed/grid'

const MyBox = styled.div`
  // Hide this element at md and higher breakpoints
  @media ${queryFrom('md')} {
    display: none;
  }
```

<strike>`queryTo(size)`</strike> — TODO, not built yet!

`columnWidth(cols, size?)` — sets the width of this element to be the same as a column with that number of columns. The `size` arg is an optional breakpoint name, for which this mixin will apply.

```jsx
import styled, { css } from 'styled-components'
import { columnWidth } from '@_ed/grid'

const MyBox = styled.div`
  ${columnWidth(6)}  // default to 6
  ${columnWidth(8, 'lg')} // 8 cols wide at 'lg'
```

# Grid Properties

When using mixins like `each`, or the `useGrid()` method, or when accessing the grid from `props.theme.grid`, you should note that each breakpoint has additional properties to the ones passed in with `createGrid`. Here is the schema:

* `name: string` — the name of the breakpoint, eg `xs`
* `columns: number` — the number of columns at this breakpoint. defaults to the number of columns for the grid.
* `min: number` — the minimum viewport width for this breakpoint
* `max: number | null` — the size of the next biggest breakpoint, or null for the largest
* `query: string` — a string in the form `(min-width: min)`, or an empty string for the smallest
* `rangedQuery: string` — the same as `query`, but also includes a `(max-width)` value
* `colWidths: { [index: number]: number }` — a dictionary of column widths. So `colWidths[2]` is how wide a Col taking up 2-columns would be.
* `units: string` — either "vw" or "px"
* `size` — an object with all primitive sizes used by this breakpoint. It has the properties `width`, `column`, `gutter` and `padding`

# Tips

## Mobile-First

This system is inherently mobile-first. When you use a `<Col />` component, the `cols` prop will target _all_ breakpoints. If you have 3 breakpoints, `sm`, `md` and `lg`, then the `mdCols` prop will target both `md` and `lg` breakpoints.

## Nesting Rows and Cols

Rows and columns can be nested infinitely, however the nesting should alternate between `Row` and `Col`.

For example, this will result in display issues:

```jsx
<Col cols={12}>
  <Col cols={6}>
    INVALID
  </Col>
  <Col cols={6}>
    INVALID
  </Col>
</Col>
```

Instead you should do this:

```jsx
<Col cols={12}>
  <Row>
    <Col cols={6}>
      :)
    </Col>
    <Col cols={6}>
      :)
    </Col>
  </Row>
</Col>
```