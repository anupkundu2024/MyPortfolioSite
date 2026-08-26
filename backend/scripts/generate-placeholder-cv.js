/**
 * Generates a valid placeholder PDF at backend/private/<CV_FILE_NAME>.
 *
 * Why a script instead of a checked-in file: a PDF's `xref` table stores the
 * absolute byte offset of every object, so the offsets have to be computed from
 * the assembled bytes. Hand-writing them produces a file that most viewers
 * reject.
 *
 * Usage:
 *   node scripts/generate-placeholder-cv.js            # skips if a file exists
 *   node scripts/generate-placeholder-cv.js --force    # overwrites
 *
 * Replace the output with the real CV whenever you like — the API only cares
 * that a readable PDF sits at that path.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";

dotenv.config();

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const PRIVATE_DIR = path.resolve(currentDir, "..", "private");
const FILE_NAME = process.env.CV_FILE_NAME || "Anup-Kundu-CV.pdf";
const OUTPUT_PATH = path.join(PRIVATE_DIR, FILE_NAME);

/** Escape the characters that terminate a PDF string literal. */
const pdfString = (text) => text.replace(/([\\()])/g, "\\$1");

const PAGE_WIDTH = 595.28; // A4 at 72 dpi
const PAGE_HEIGHT = 841.89;

const LINES = [
  { text: "Anup Kundu", size: 26, font: "F1", gap: 34 },
  { text: "Full Stack Developer", size: 13, font: "F2", gap: 40 },
  { text: "Placeholder CV", size: 16, font: "F1", gap: 26 },
  {
    text: "This file was generated so the authenticated /api/cv endpoint has",
    size: 11,
    font: "F2",
    gap: 17,
  },
  {
    text: "something valid to serve during development and testing.",
    size: 11,
    font: "F2",
    gap: 30,
  },
  { text: "To publish the real CV:", size: 12, font: "F1", gap: 20 },
  {
    text: "1.  Replace backend/private/" + FILE_NAME + " with your PDF, or",
    size: 11,
    font: "F2",
    gap: 17,
  },
  {
    text: "2.  Set CV_SOURCE=redirect and CV_EXTERNAL_URL in backend/.env.",
    size: 11,
    font: "F2",
    gap: 30,
  },
  {
    text: "This directory is never served statically and is git-ignored.",
    size: 10,
    font: "F2",
    gap: 0,
  },
];

/** Build the page's content stream from the line definitions above. */
const buildContentStream = () => {
  const left = 64;
  let cursorY = PAGE_HEIGHT - 110;
  const operators = [];

  LINES.forEach((line) => {
    operators.push(
      "BT",
      `/${line.font} ${line.size} Tf`,
      `1 0 0 1 ${left.toFixed(2)} ${cursorY.toFixed(2)} Tm`,
      `(${pdfString(line.text)}) Tj`,
      "ET"
    );
    cursorY -= line.gap;
  });

  // Thin rule under the name block.
  operators.push(
    "0.55 0.35 0.95 RG",
    "1.4 w",
    `${left} ${(PAGE_HEIGHT - 152).toFixed(2)} m`,
    `${(PAGE_WIDTH - left).toFixed(2)} ${(PAGE_HEIGHT - 152).toFixed(2)} l`,
    "S"
  );

  return operators.join("\n");
};

const contentStream = buildContentStream();

const objects = [
  "<< /Type /Catalog /Pages 2 0 R >>",
  "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
  `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] ` +
    "/Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
  `<< /Length ${Buffer.byteLength(contentStream, "latin1")} >>\nstream\n${contentStream}\nendstream`,
  "<< /Title (Anup Kundu - CV) /Author (Anup Kundu) /Producer (portfolio-backend) >>",
];

/** Assemble the file, recording each object's byte offset for the xref table. */
const buildPdf = () => {
  const chunks = [];
  let offset = 0;

  const push = (text) => {
    const buffer = Buffer.from(text, "latin1");
    chunks.push(buffer);
    offset += buffer.length;
  };

  push("%PDF-1.4\n");
  // Binary comment marks the file as non-text for transfer tools.
  push("%\xE2\xE3\xCF\xD3\n");

  const offsets = [];
  objects.forEach((body, index) => {
    offsets.push(offset);
    push(`${index + 1} 0 obj\n${body}\nendobj\n`);
  });

  const xrefOffset = offset;
  const pad = (value, width) => String(value).padStart(width, "0");

  // Every xref entry must be exactly 20 bytes.
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((value) => {
    xref += `${pad(value, 10)} ${pad(0, 5)} n \n`;
  });
  push(xref);

  push(
    `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info ${objects.length} 0 R >>\n` +
      `startxref\n${xrefOffset}\n%%EOF\n`
  );

  return Buffer.concat(chunks);
};

const force = process.argv.includes("--force");

if (fs.existsSync(OUTPUT_PATH) && !force) {
  console.log(`↩️  ${FILE_NAME} already exists in backend/private/ — left untouched.`);
  console.log("   Pass --force to overwrite it with the placeholder.");
  process.exit(0);
}

fs.mkdirSync(PRIVATE_DIR, { recursive: true });
const pdf = buildPdf();
fs.writeFileSync(OUTPUT_PATH, pdf);

console.log(`✅ Wrote backend/private/${FILE_NAME} (${pdf.length} bytes)`);
console.log("   Replace it with the real CV when ready; it is git-ignored.");
