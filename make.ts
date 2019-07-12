import * as fs from "https://deno.land/std/fs/mod.ts";
import * as path from "https://deno.land/std/fs/path.ts";

const html = String.raw;
const title = "deno_intro";

main();

async function main() {
  let slides = await loadSlides();
  if (areSlidesOrdered(slides)) {
    await createIndexHtml(slides);
  } else {
    await reorderSlides(slides);
    await createIndexHtml(slides);
  }
}

interface Slide {
  number: number;
  content: string;
  type: ".msf" | ".html";
}

async function loadSlides() {
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

function createIndexHtml(slides: Slide[]) {
  let htmlPath = path.join("docs", "index.html");
  return fs.writeFileStr(htmlPath, createDocument(slides));
}

function createDocument(slides: Slide[]) {
  return html`
    <!DOCTYPE html>
    <meta charset="utf-8" />
    <title>${title}</title>
    <link href="index.css" rel="stylesheet" />
    <script src="index.js"></script>
    <script>
      window.lastSlide = ${slides.length - 1};
    </script>
    ${createPresentation(slides)}
  `;
}

function createPresentation(slides: Slide[]) {
  return slides.map((s, i) => createSlide(i, s)).join("\n");
}

function createSlide(index: number, slide: Slide) {
  let content = slide.content;
  if (slide.type === ".msf") {
    content = slide.content
      .split("\n")
      .map(replaceLine)
      .map(line => line + "<br />")
      .join("\n");
  }
  return html`
    <div id="s${index}" style="display:none">${content}</div>
  `;
}

function replaceLine(line: string) {
  // Spaces
  line = line.replace(/ /g, "&nbsp;");

  // Anchors
  line = line.replace(/<a><href>/g, '<a href="').replace(/<\/href>/g, '">');

  // Styles
  line = line
    .replace(/<span><style>/g, '<span style="')
    .replace(/<div><style>/g, '<div style="')
    .replace(/<\/style>/g, '">');

  // Colors
  for (let color of getHtmlColors()) {
    line = line
      .replace(new RegExp(`<${color}>`, "g"), `<span style="color:${color}">`)
      .replace(new RegExp(`</${color}>`, "g"), "</span>");
  }
  return line;
}

function getHtmlColors() {
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
