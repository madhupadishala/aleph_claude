import { prescriptions, scoreAnswers, type Dimension } from "./diagnostic";

type PracticeIntelligenceResult = ReturnType<typeof scoreAnswers>;

type RGB = [number, number, number];

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 46;

const COLORS = {
  cream: hex("#FBF8F1"),
  forest: hex("#123629"),
  teal: hex("#0F766E"),
  terracotta: hex("#C86745"),
  gold: hex("#C59A3D"),
  mint: hex("#EDF4F1"),
  border: hex("#DCE6E1"),
  muted: hex("#66766F"),
  soft: hex("#8FA69A"),
  white: hex("#FFFFFF"),
};

const ACTIONS: Record<Dimension, string> = {
  visibility:
    "Complete and maintain the local discovery foundation: accurate profile, services, location, hours, reviews, and a clear booking route.",
  trust:
    "Strengthen pre-booking trust with specific service pages, clinician story, common patient questions, proof, and a confident next step.",
  pricing:
    "Standardise how the consultation fee and structure are explained so the team communicates value consistently instead of discounting reactively.",
  retention:
    "Create a reliable booking, reminder, education, and follow-up rhythm so interested patients do not silently drop out of the journey.",
  authority:
    "Define one memorable specialist position and reinforce it consistently across profile, website, education, reviews, and public content.",
  operations:
    "Map the patient journey and review which standardised non-diagnostic tasks can be handled safely by trained staff under clinic protocols.",
  affordability:
    "Map the common total episode-of-care cost and look for transparent, clinically appropriate lower-cost medicine, diagnostic, and access options.",
};

function hex(value: string): RGB {
  const clean = value.replace("#", "");
  return [0, 2, 4].map((offset) => parseInt(clean.slice(offset, offset + 2), 16) / 255) as RGB;
}

function color([r, g, b]: RGB) {
  return `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)}`;
}

function ascii(value: string) {
  return value
    .replace(/[–—]/g, "-")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/…/g, "...")
    .replace(/₹/g, "INR ")
    .replace(/[^\x20-\x7E\n]/g, " ");
}

function escapePdfText(value: string) {
  return ascii(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function estimateWidth(text: string, size: number, bold = false) {
  return ascii(text).length * size * (bold ? 0.54 : 0.5);
}

function wrapText(text: string, size: number, maxWidth: number, bold = false) {
  const words = ascii(text).replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && estimateWidth(candidate, size, bold) > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

class PdfPage {
  private commands: string[] = [];

  fillRect(x: number, top: number, width: number, height: number, fill: RGB) {
    const y = PAGE_HEIGHT - top - height;
    this.commands.push(`${color(fill)} rg ${x.toFixed(2)} ${y.toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)} re f`);
  }

  strokeRect(x: number, top: number, width: number, height: number, stroke: RGB, lineWidth = 1) {
    const y = PAGE_HEIGHT - top - height;
    this.commands.push(`${color(stroke)} RG ${lineWidth.toFixed(2)} w ${x.toFixed(2)} ${y.toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)} re S`);
  }

  line(x1: number, top1: number, x2: number, top2: number, stroke: RGB, lineWidth = 1) {
    const y1 = PAGE_HEIGHT - top1;
    const y2 = PAGE_HEIGHT - top2;
    this.commands.push(`${color(stroke)} RG ${lineWidth.toFixed(2)} w ${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`);
  }

  text(text: string, x: number, top: number, size: number, fill: RGB, bold = false) {
    const y = PAGE_HEIGHT - top - size;
    const font = bold ? "F2" : "F1";
    this.commands.push(
      `BT /${font} ${size.toFixed(2)} Tf ${color(fill)} rg 1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm (${escapePdfText(text)}) Tj ET`,
    );
  }

  paragraph(
    text: string,
    x: number,
    top: number,
    width: number,
    size: number,
    lineHeight: number,
    fill: RGB,
    bold = false,
    maxLines?: number,
  ) {
    const lines = wrapText(text, size, width, bold);
    const visible = maxLines ? lines.slice(0, maxLines) : lines;
    visible.forEach((line, index) => this.text(line, x, top + index * lineHeight, size, fill, bold));
    return top + visible.length * lineHeight;
  }

  circle(cx: number, topCenter: number, radius: number, fill: RGB) {
    const cy = PAGE_HEIGHT - topCenter;
    const k = radius * 0.5522847498;
    this.commands.push(
      `${color(fill)} rg ` +
        `${(cx + radius).toFixed(2)} ${cy.toFixed(2)} m ` +
        `${(cx + radius).toFixed(2)} ${(cy + k).toFixed(2)} ${(cx + k).toFixed(2)} ${(cy + radius).toFixed(2)} ${cx.toFixed(2)} ${(cy + radius).toFixed(2)} c ` +
        `${(cx - k).toFixed(2)} ${(cy + radius).toFixed(2)} ${(cx - radius).toFixed(2)} ${(cy + k).toFixed(2)} ${(cx - radius).toFixed(2)} ${cy.toFixed(2)} c ` +
        `${(cx - radius).toFixed(2)} ${(cy - k).toFixed(2)} ${(cx - k).toFixed(2)} ${(cy - radius).toFixed(2)} ${cx.toFixed(2)} ${(cy - radius).toFixed(2)} c ` +
        `${(cx + k).toFixed(2)} ${(cy - radius).toFixed(2)} ${(cx + radius).toFixed(2)} ${(cy - k).toFixed(2)} ${(cx + radius).toFixed(2)} ${cy.toFixed(2)} c f`,
    );
  }

  stream() {
    return this.commands.join("\n");
  }
}

function buildPdf(pages: PdfPage[]) {
  const encoder = new TextEncoder();
  const pageObjectIds = pages.map((_, index) => 5 + index * 2);
  const objects: string[] = [
    `<< /Type /Catalog /Pages 2 0 R >>`,
    `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pages.length} >>`,
    `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`,
    `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>`,
  ];

  pages.forEach((page, index) => {
    const pageId = 5 + index * 2;
    const streamId = pageId + 1;
    const stream = page.stream();
    const length = encoder.encode(stream).length;
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH.toFixed(2)} ${PAGE_HEIGHT.toFixed(2)}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${streamId} 0 R >>`,
    );
    objects.push(`<< /Length ${length} >>\nstream\n${stream}\nendstream`);
  });

  let pdf = "%PDF-1.4\n% Aleph Practice Intelligence\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(encoder.encode(pdf).length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = encoder.encode(pdf).length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return encoder.encode(pdf);
}

function drawFooter(page: PdfPage, pageNumber: number, totalPages: number, generatedOn: string) {
  page.line(MARGIN, 803, PAGE_WIDTH - MARGIN, 803, COLORS.border, 0.8);
  page.text("Aleph Practice Intelligence", MARGIN, 812, 8, COLORS.soft, true);
  page.text(`Generated ${generatedOn}`, 225, 812, 8, COLORS.soft);
  page.text(`Page ${pageNumber} of ${totalPages}`, 493, 812, 8, COLORS.soft);
}

function drawContextCard(page: PdfPage, label: string, value: string, x: number, top: number, width: number) {
  page.fillRect(x, top, width, 58, COLORS.white);
  page.strokeRect(x, top, width, 58, COLORS.border, 0.8);
  page.text(label.toUpperCase(), x + 12, top + 10, 7.5, COLORS.soft, true);
  page.paragraph(value, x + 12, top + 25, width - 24, 9.5, 12, COLORS.forest, true, 2);
}

function drawScoreBar(page: PdfPage, label: string, score: number, top: number) {
  const x = MARGIN;
  const labelWidth = 132;
  const barX = x + labelWidth;
  const barWidth = 330;
  page.text(label, x, top, 9.5, COLORS.forest, true);
  page.fillRect(barX, top + 1, barWidth, 10, COLORS.mint);
  page.fillRect(barX, top + 1, Math.max(3, (barWidth * score) / 100), 10, score < 45 ? COLORS.terracotta : score < 70 ? COLORS.gold : COLORS.teal);
  page.text(`${score}%`, barX + barWidth + 10, top - 1, 9, COLORS.muted, true);
}

function drawPriorityCard(
  page: PdfPage,
  index: number,
  label: string,
  description: string,
  action: string,
  top: number,
) {
  page.fillRect(MARGIN, top, PAGE_WIDTH - MARGIN * 2, 112, COLORS.white);
  page.strokeRect(MARGIN, top, PAGE_WIDTH - MARGIN * 2, 112, COLORS.border, 0.8);
  page.circle(MARGIN + 24, top + 27, 14, COLORS.terracotta);
  page.text(`0${index + 1}`, MARGIN + 15.5, top + 20, 9, COLORS.white, true);
  page.text(label, MARGIN + 50, top + 15, 13, COLORS.forest, true);
  page.paragraph(description, MARGIN + 50, top + 36, 435, 8.7, 11.5, COLORS.muted, false, 3);
  page.text("RECOMMENDED NEXT MOVE", MARGIN + 50, top + 73, 7.2, COLORS.teal, true);
  page.paragraph(action, MARGIN + 50, top + 87, 435, 8.2, 10.5, COLORS.forest, false, 2);
}

export function buildPracticeIntelligencePdf(
  result: PracticeIntelligenceResult,
  generatedAt = new Date(),
) {
  const generatedOn = generatedAt.toISOString().slice(0, 10);
  const page1 = new PdfPage();
  const page2 = new PdfPage();

  page1.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, COLORS.cream);
  page1.fillRect(0, 0, PAGE_WIDTH, 177, COLORS.forest);
  page1.text("aleph.", MARGIN, 34, 18, COLORS.white, true);
  page1.text("PRACTICE INTELLIGENCE REPORT", MARGIN, 72, 8.5, COLORS.gold, true);
  page1.text("A clearer view of what is limiting growth", MARGIN, 92, 24, COLORS.white, true);
  page1.text(result.fit.name, MARGIN, 131, 16, COLORS.white, true);
  page1.text("recommended starting pathway", MARGIN + estimateWidth(result.fit.name, 16, true) + 10, 136, 8, COLORS.soft);

  page1.fillRect(429, 66, 120, 82, COLORS.white);
  page1.text(String(result.overall), 454, 78, 31, COLORS.forest, true);
  page1.text("/100", 499, 93, 9, COLORS.teal, true);
  page1.text("overall practice signal", 447, 122, 7.2, COLORS.muted, true);

  page1.text("Executive summary", MARGIN, 205, 12, COLORS.forest, true);
  page1.fillRect(MARGIN, 227, PAGE_WIDTH - MARGIN * 2, 82, COLORS.mint);
  page1.paragraph(result.fit.copy, MARGIN + 16, 242, PAGE_WIDTH - MARGIN * 2 - 32, 9.3, 12.5, COLORS.forest, false, 3);
  page1.paragraph(result.fit.reason, MARGIN + 16, 280, PAGE_WIDTH - MARGIN * 2 - 32, 8.2, 10.5, COLORS.teal, true, 2);

  page1.text("Practice context", MARGIN, 335, 12, COLORS.forest, true);
  const cardWidth = (PAGE_WIDTH - MARGIN * 2 - 12) / 2;
  drawContextCard(page1, "Stage", result.context.stage, MARGIN, 355, cardWidth);
  drawContextCard(page1, "Performance", result.context.performance, MARGIN + cardWidth + 12, 355, cardWidth);
  drawContextCard(page1, "Capacity", result.context.capacity, MARGIN, 425, cardWidth);
  drawContextCard(page1, "Typical consultation", result.context.consultationTime, MARGIN + cardWidth + 12, 425, cardWidth);

  page1.text("Practice health profile", MARGIN, 515, 12, COLORS.forest, true);
  page1.text("Seven diagnostic dimensions - higher scores indicate a stronger current foundation.", MARGIN, 534, 8, COLORS.muted);
  result.normalized.forEach((item, index) => drawScoreBar(page1, item.label, item.score, 558 + index * 29));
  drawFooter(page1, 1, 2, generatedOn);

  page2.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, COLORS.cream);
  page2.fillRect(0, 0, PAGE_WIDTH, 62, COLORS.forest);
  page2.text("aleph.", MARGIN, 21, 15, COLORS.white, true);
  page2.text("PRIORITIES & RECOMMENDATIONS", 350, 25, 8, COLORS.gold, true);
  page2.text("Where to focus next", MARGIN, 88, 23, COLORS.forest, true);
  page2.text(
    `Primary constraint: ${result.weakest.label}. The three lowest-scoring dimensions are shown below in priority order.`,
    MARGIN,
    119,
    8.5,
    COLORS.muted,
  );

  result.priorities.forEach((priority, index) =>
    drawPriorityCard(
      page2,
      index,
      priority.label,
      prescriptions[priority.key],
      ACTIONS[priority.key],
      146 + index * 122,
    ),
  );

  page2.text("Two important operating insights", MARGIN, 526, 12, COLORS.forest, true);
  const insightWidth = (PAGE_WIDTH - MARGIN * 2 - 12) / 2;
  page2.fillRect(MARGIN, 548, insightWidth, 126, COLORS.forest);
  page2.text("OPERATIONAL CAPACITY", MARGIN + 14, 562, 7.5, COLORS.gold, true);
  page2.paragraph(result.operationalInsight, MARGIN + 14, 582, insightWidth - 28, 8.2, 11.2, COLORS.white, false, 7);

  page2.fillRect(MARGIN + insightWidth + 12, 548, insightWidth, 126, COLORS.mint);
  page2.text("PATIENT AFFORDABILITY", MARGIN + insightWidth + 26, 562, 7.5, COLORS.teal, true);
  page2.paragraph(result.affordabilityInsight, MARGIN + insightWidth + 26, 582, insightWidth - 28, 8.2, 11.2, COLORS.forest, false, 7);

  page2.fillRect(MARGIN, 693, PAGE_WIDTH - MARGIN * 2, 83, COLORS.white);
  page2.strokeRect(MARGIN, 693, PAGE_WIDTH - MARGIN * 2, 83, COLORS.border, 0.8);
  page2.text("RECOMMENDED ALEPH PATHWAY", MARGIN + 16, 707, 7.5, COLORS.teal, true);
  page2.text(result.fit.name, MARGIN + 16, 725, 15, COLORS.forest, true);
  page2.paragraph(result.fit.reason, MARGIN + 155, 711, 340, 8.2, 10.5, COLORS.muted, false, 5);

  page2.paragraph(
    "Practice-growth guidance only. Clinical decisions, delegation, medicines, diagnostics, and patient safety remain with the treating clinician and applicable standards.",
    MARGIN,
    782,
    PAGE_WIDTH - MARGIN * 2,
    6.2,
    7.5,
    COLORS.soft,
    false,
    2,
  );
  drawFooter(page2, 2, 2, generatedOn);

  return buildPdf([page1, page2]);
}
