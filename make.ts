import * as fs from "https://deno.land/std/fs/mod.ts";
import * as path from "https://deno.land/std/fs/path.ts";

const html = String.raw;
const title = "deno_intro";

main();

async function main() {
  let slides = await readSlides();
  if (areSlidesOrdered(slides)) {
    await generateHtml(slides);
  } else {
    await reorderSlides(slides);
    await generateHtml(slides);
  }
}

async function readSlides() {
  let fileInfos = await Deno.readDir("slides");
  let filePaths = fileInfos.map(f => path.join("slides", f.name));
  let slideContents = await Promise.all(filePaths.map(f => fs.readFileStr(f)));
  let slideNumbers = fileInfos.map(f => slideNumber(f));
  let slideTypes = fileInfos.map(f => path.extname(f.name) as ".msf" | ".html");
  return slideContents.map((c, i) => ({
    content: c,
    number: slideNumbers[i],
    type: slideTypes[i]
  }));
}

function slideNumber(fileInfo: Deno.FileInfo) {
  let extname = path.extname(fileInfo.name);
  let basename = path.basename(fileInfo.name, extname);
  return Number(basename);
}

interface Slide {
  number: number;
  content: string;
  type: ".msf" | ".html";
}

function areSlidesOrdered(slides: Slide[]) {
  return slides.every((s, i) => s.number === i);
}

function reorderSlides(slides: Slide[]) {
  return Promise.all(
    slides
      .sort((a, b) => a.number - b.number)
      .map(async (s, i) => {
        if (s.number !== i) {
          await Deno.remove(path.join("slides", `${s.number}${s.type}`));
          s.number = i;
          return fs.writeFileStr(
            path.join("slides", `${i}${s.type}`),
            s.content
          );
        }
      })
  );
}

function generateHtml(slides: Slide[]) {
  let htmlPath = path.join("docs", "index.html");
  return fs.writeFileStr(htmlPath, Document(slides));
}

function Document(slides: Slide[]) {
  return html`
    <!DOCTYPE html>
    <meta charset="utf-8" />
    <title>${title}</title>
    <link href="index.css" rel="stylesheet" />
    <script src="index.js"></script>
    <script>
      window.lastSlide = ${slides.length - 1};
    </script>
    ${Presentation(slides)}
  `;
}

function Presentation(slides: Slide[]) {
  return slides.map((s, i) => Main(i, s)).join("\n");
}

function Main(index: number, slide: Slide) {
  let content =
    slide.type === ".msf"
      ? slide.content
          .split("\n")
          .map(Line)
          .join("\n")
      : slide.content;
  return html`
    <div class="slide" id="s${index}">${content}</div>
  `;
}

function Line(line: string) {
  return replaceAnchors(replaceColors(replaceSpaces(line))) + "<br />";
}

function replaceSpaces(line: string) {
  return line.replace(/ /g, "&nbsp;");
}

function replaceAnchors(line: string) {
  return line.replace(/<a><href>/g, '<a href="').replace(/<\/href>/g, '">');
}

function replaceColors(line: string) {
  for (let color of colors()) {
    line = line
      .replace(new RegExp(`<${color}>`, "g"), `<span style="color: ${color};">`)
      .replace(new RegExp(`</${color}>`, "g"), "</span>");
  }
  return line;
}

function colors() {
  return [
    "aliceblue",
    "antiquewhite",
    "aqua",
    "aquamarine",
    "azure",
    "beige",
    "bisque",
    "black",
    "blanchedalmond",
    "blue",
    "blueviolet",
    "brown",
    "burlywood",
    "cadetblue",
    "chartreuse",
    "chocolate",
    "coral",
    "cornflowerblue",
    "cornsilk",
    "crimson",
    "cyan",
    "darkblue",
    "darkcyan",
    "darkgoldenrod",
    "darkgray",
    "darkgrey",
    "darkgreen",
    "darkkhaki",
    "darkmagenta",
    "darkolivegreen",
    "darkorange",
    "darkorchid",
    "darkred",
    "darksalmon",
    "darkseagreen",
    "darkslateblue",
    "darkslategray",
    "darkslategrey",
    "darkturquoise",
    "darkviolet",
    "deeppink",
    "deepskyblue",
    "dimgray",
    "dimgrey",
    "dodgerblue",
    "firebrick",
    "floralwhite",
    "forestgreen",
    "fuchsia",
    "gainsboro",
    "ghostwhite",
    "gold",
    "goldenrod",
    "gray",
    "grey",
    "green",
    "greenyellow",
    "honeydew",
    "hotpink",
    "indianred",
    "indigo",
    "ivory",
    "khaki",
    "lavender",
    "lavenderblush",
    "lawngreen",
    "lemonchiffon",
    "lightblue",
    "lightcoral",
    "lightcyan",
    "lightgoldenrodyellow",
    "lightgray",
    "lightgrey",
    "lightgreen",
    "lightpink",
    "lightsalmon",
    "lightseagreen",
    "lightskyblue",
    "lightslategray",
    "lightslategrey",
    "lightsteelblue",
    "lightyellow",
    "lime",
    "limegreen",
    "linen",
    "magenta",
    "maroon",
    "mediumaquamarine",
    "mediumblue",
    "mediumorchid",
    "mediumpurple",
    "mediumseagreen",
    "mediumslateblue",
    "mediumspringgreen",
    "mediumturquoise",
    "mediumvioletred",
    "midnightblue",
    "mintcream",
    "mistyrose",
    "moccasin",
    "navajowhite",
    "navy",
    "oldlace",
    "olive",
    "olivedrab",
    "orange",
    "orangered",
    "orchid",
    "palegoldenrod",
    "palegreen",
    "paleturquoise",
    "palevioletred",
    "papayawhip",
    "peachpuff",
    "peru",
    "pink",
    "plum",
    "powderblue",
    "purple",
    "rebeccapurple",
    "red",
    "rosybrown",
    "royalblue",
    "saddlebrown",
    "salmon",
    "sandybrown",
    "seagreen",
    "seashell",
    "sienna",
    "silver",
    "skyblue",
    "slateblue",
    "slategray",
    "slategrey",
    "snow",
    "springgreen",
    "steelblue",
    "tan",
    "teal",
    "thistle",
    "tomato",
    "turquoise",
    "violet",
    "wheat",
    "white",
    "whitesmoke",
    "yellow",
    "yellowgreen"
  ];
}
