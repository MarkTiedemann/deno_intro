#!/usr/bin/env deno --allow-read=slides --allow-write=slides,docs

import * as fs from "https://deno.land/std/fs/mod.ts";
import * as path from "https://deno.land/std/fs/path.ts";

let html = String.raw;

interface Slide {
  number: number;
  content: string;
  type: ".diff" | ".html";
}

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
  let slideTypes = fileInfos.map(
    f => path.extname(f.name) as ".diff" | ".html"
  );
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

function generateHtml(slides: Slide[]) {
  let htmlPath = path.join("docs", "index.html");
  return fs.writeFileStr(htmlPath, Document(slides));
}

function Document(slides: Slide[]) {
  return html`
    <!DOCTYPE html>
    <meta charset="utf-8" />
    <title>deno_intro</title>
    <link href="index.css" rel="stylesheet" />
    <script src="index.js"></script>
    <script>
      window.lastSlide = ${slides.length - 1};
    </script>
    ${Presentation(slides)}
  `
    .replace(/^\s*[\r\n]/gm, "") // remove empty lines
    .replace(/^\s+|\s+$/gm, ""); // remove indentation
}

function Presentation(slides: Slide[]) {
  return slides.map((s, i) => Main(i, s)).join("\n");
}

function Main(index: number, slide: Slide) {
  let content =
    slide.type === ".diff"
      ? slide.content
          .split("\n")
          .map(Line)
          .filter(Boolean)
          .join("\n")
      : slide.content;
  return html`
    <main id="s${index}" style="display: none">${content}</main>
  `;
}

function Line(text: string) {
  switch (text.charAt(0)) {
    case ">":
      return Paragraph("file", text);
    case "$":
      return Paragraph("shell", text);
    case "|":
      return Paragraph("code", ` ${text.slice(1)}`);
    case "#":
      return Paragraph("comment", ` ${text.slice(1)}`);
    case "+":
      return Paragraph("add", text);
    case "-":
      return Paragraph("rm", text);
  }
}

function Paragraph(className: string, text: string) {
  let escapedText = text
    .replace(/ /g, "&nbsp;") // whitespace => &nbsp;
    .replace(/\\w/g, " "); // \w => whitespace
  return html`
    <p class=${className}>${escapedText}</p>
  `;
}
