# dev

- All slides must be `.diff` or `.html` files located in the `/slides` directory.
- If the slide is a `.diff` file, each line must start with one of the following identifiers:
  - `>`: file (_purple_)
  - `$`: shell (_orange_)
  - `|`: code (_white_)
  - `#`: comment (_blue_)
  - `+`: add (_green_)
  - `-`: rm (_red_)
- All whitespaces within a `.diff` slide will be replaced with `&nbsp;`.
- If you need an actual whitespace in one of your `.diff` slides, use `\w` instead.
