#!/usr/bin/env node
/**
 * convert-pdfs.js
 *
 * Converts the two Lalo book PDFs into per-page PNG images used by the
 * Lalo subpages.  Run from the repository root:
 *
 *   node scripts/convert-pdfs.js
 *
 * Requirements (install once):
 *   npm install
 *
 * Output:
 *   assets/images/lalo-portes-des-reves/page-01.png … page-NN.png
 *   assets/images/lalo-portes-des-reves/pages.json
 *
 *   assets/images/lalo-pays-sans-soleil/page-01.png … page-NN.png
 *   assets/images/lalo-pays-sans-soleil/pages.json
 */

'use strict';

const path   = require('path');
const fs     = require('fs');
const { createCanvas } = require('canvas');

// pdfjs-dist v4 ships ESM only – use dynamic import inside the async entry point.
// No workerSrc override is needed for Node.js; the library handles it automatically.

const ROOT    = path.resolve(__dirname, '..');
const SCALE   = 2; // render at 2× for crisp images (≈144 DPI for A4 at 72 DPI base)

/** Map from PDF source path to output directory */
const BOOKS = [
  {
    pdf:    path.join(ROOT, 'assets', 'images', 'LALODRAFTu OUVRAGE SANS BLEED.pdf'),
    outDir: path.join(ROOT, 'assets', 'images', 'lalo-portes-des-reves'),
  },
  {
    pdf:    path.join(ROOT, 'assets', 'images', 'Lalo .pdf'),
    outDir: path.join(ROOT, 'assets', 'images', 'lalo-pays-sans-soleil'),
  },
];

async function convertBook({ pdf, outDir }, pdfjsLib) {
  if (!fs.existsSync(pdf)) {
    console.warn(`[SKIP] PDF not found: ${pdf}`);
    return;
  }

  fs.mkdirSync(outDir, { recursive: true });

  console.log(`Converting: ${path.basename(pdf)} → ${outDir}`);

  const data    = new Uint8Array(fs.readFileSync(pdf));
  const pdfDoc  = await pdfjsLib.getDocument({ data }).promise;
  const total   = pdfDoc.numPages;
  const pages   = [];

  for (let i = 1; i <= total; i++) {
    const page     = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale: SCALE });
    const canvas   = createCanvas(viewport.width, viewport.height);
    const ctx      = canvas.getContext('2d');

    await page.render({
      canvasContext: ctx,
      viewport,
      // pdfjs v4 needs a factory that creates a canvas for its own internals
      canvasFactory: {
        create(w, h)    { return { canvas: createCanvas(w, h), context: null }; },
        reset(obj, w, h){ obj.canvas.width = w; obj.canvas.height = h; },
        destroy(obj)    { obj.canvas.width = 0; obj.canvas.height = 0; },
      },
    }).promise;

    const paddedNum = String(i).padStart(3, '0');
    const name    = `page-${paddedNum}.png`;
    const outPath = path.join(outDir, name);

    fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
    pages.push(name);
    console.log(`  ✓ ${name}`);
  }

  // Write a manifest so the HTML can discover the pages without probing
  const manifest = { count: total, pages };
  fs.writeFileSync(
    path.join(outDir, 'pages.json'),
    JSON.stringify(manifest, null, 2) + '\n',
  );

  console.log(`  → ${total} pages written to ${outDir}\n`);
}

(async () => {
  // pdfjs-dist v4 ships ESM only; use dynamic import from within the async context.
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

  for (const book of BOOKS) {
    await convertBook(book, pdfjsLib);
  }
  console.log('Done.');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
