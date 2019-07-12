# dev

- All slides must be `.msf` (Mark's Slide Format) or `.html` files located in the `/slides` directory.
- `Shift+Meta+o` toggles fullscreen.
- `Right` navigates to the next slide, `Left` to the previous one.
- All spaces within a `.msf` slide will be replaced with `&nbsp;`.
- All [HTML color names](https://www.w3schools.com/colors/colors_names.asp) are available as tags, e.g. `<green>I'm green</green>`. They will be transformed into spans, e.g. `<span style="color: green;">I'm green</span>`.
- `<a><href>https://example.org</href>example.org</a>` will be transformed into `<a href="https://example.org">example.org</a>`.

# todo

- Split agenda in 2
- How to color links?
- Remove padding and font-size from CSS
- Remove title from HTML generation
- Create config?
- Refactor and clean-up `index.js` and `make.ts`
