import original from "./bytespace-welcome-patterns.json";

export const welcomeLines = ["Welcome", "to", "Bytespace!"];
export const welcomeTiming = { reveal: 2600, mountDelay: 100, pixelFade: 100, hold: 1400, exit: 500 };
export const welcomeDuration = welcomeTiming.reveal + welcomeTiming.hold + welcomeTiming.exit;

// Original WelcomeMessage pixel ordering and 120 x 120 grid, with Bytespace branding restored.
export const welcomePixels = welcomeLines.flatMap((line, lineIndex) => {
  const startRow = Math.floor((120 - welcomeLines.length * 10) / 2);
  const startCol = Math.floor((120 - line.length * 9) / 2);
  return line.split("").flatMap((char, charIndex) => {
    const pattern = original.letters[char.toUpperCase() as keyof typeof original.letters];
    return pattern.flatMap((row, rowIndex) => row.flatMap((pixel, pixelIndex) => pixel ? [{
      row: startRow + lineIndex * 10 + rowIndex,
      col: startCol + charIndex * 9 + pixelIndex,
    }] : []));
  });
});

// Document-scoped memory survives in-app navigation, but a fresh page load gets a new intro.
const visits = new WeakMap<Document, { elapsed: number; complete: boolean }>();
export function getWelcomeVisit(document: Document) {
  let visit = visits.get(document);
  if (!visit) {
    visit = { elapsed: 0, complete: false };
    visits.set(document, visit);
  }
  return visit;
}
