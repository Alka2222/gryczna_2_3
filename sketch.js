let loremWords = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur",
  "adipiscing", "elit", "sed", "do", "eiusmod", "tempor",
  "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua"
];

let words = [];
let fontSize = 32;
let minFontSize = 20;
let finalFontSize = null;
let typedLetters = 0;
let avoidRadius = 50;

function setup() {
  createCanvas(1920, 1080); // changed canvas size
  textAlign(LEFT, TOP);
  noSmooth();
  textFont('Arial');
}

function draw() {
  background(255);

  let attemptFontSize = fontSize;
  let lineHeight;
  let padding = 20;
  let maxW = width - 2 * padding;
  let maxH = height - 2 * padding;
  let lines = [];

  // Fit all current words into the canvas
  while (attemptFontSize >= minFontSize) {
    textSize(attemptFontSize);
    lineHeight = attemptFontSize * 1.3;
    lines = [];
    let currentLine = '';
    let currentLineWidth = 0;

    for (let i = 0; i < words.length; i++) {
      let word = words[i] + ' ';
      let wordW = textWidth(word);

      if (currentLineWidth + wordW > maxW) {
        lines.push(currentLine);
        currentLine = word;
        currentLineWidth = wordW;
      } else {
        currentLine += word;
        currentLineWidth += wordW;
      }
    }

    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    if (lines.length * lineHeight <= maxH) {
      break;
    }

    attemptFontSize -= 1;
  }

  if (attemptFontSize <= minFontSize) {
    finalFontSize = minFontSize;
  }

  textSize(attemptFontSize);

  // Draw text with cursor avoidance
  let y = padding;
  for (let i = 0; i < lines.length; i++) {
    let x = padding;
    let line = lines[i];
    let lineWords = line.trim().split(/\s+/);

    for (let w = 0; w < lineWords.length; w++) {
      let word = lineWords[w];
      let renderWord = word + " ";
      let wordW = textWidth(renderWord);
      let wordH = attemptFontSize;

      let wordX = x;
      let wordY = y;
      if (dist(mouseX, mouseY, wordX + wordW / 2, wordY + wordH / 2) < avoidRadius) {
        x += wordW;
        continue;
      }

      textStyle(NORMAL);
      fill(0);
      text(renderWord, x, y);
      x += wordW;
    }

    y += lineHeight;
  }

  // Display "the end" only after font size is <= 12
  if (attemptFontSize <= 20) {
    let endText = "the end".substring(0, typedLetters);
    if (finalFontSize === minFontSize) {
      endText = "the end";
      //textStyle(BOLD);
     // fill(255, 0, 0);
    } else {
      textStyle(NORMAL);
      fill(0);
    }

    textSize(attemptFontSize);
    let endW = textWidth(endText);
    let endH = attemptFontSize;
    text(endText, width / 2 - endW / 2, height / 2 - endH / 2);
  }
}

function mouseWheel(event) {
  if (finalFontSize !== null && finalFontSize <= minFontSize) return false;

  for (let i = 0; i < 10; i++) {
    words.push(random(loremWords));
  }

  // Start typing "the end" after font size reaches 12
  if (fontSize <= 20 && typedLetters < "the end".length) {
    typedLetters++;
  }

  return false;
}
