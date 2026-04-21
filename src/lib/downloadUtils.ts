import { jsPDF } from 'jspdf';

export interface ReceiptFields {
  title: string;
  receiptId: string;
  studentName: string;
  amount: string;
  paymentDate: string;
  paymentMethod: string;
  description?: string;
  items?: Array<{ name: string; price: string }>;
  referenceNumber?: string;
}

export const downloadReceiptPDF = (fields: ReceiptFields) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const pageW = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = 20;

  const centerText = (text: string, fontSize: number, yPos: number, bold = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    const textW = doc.getTextWidth(text);
    doc.text(text, (pageW - textW) / 2, yPos);
  };

  const labelValue = (label: string, value: string, yPos: number) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(label, margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value, margin + 45, yPos);
  };

  const hLine = (yPos: number, color: [number, number, number] = [220, 220, 220]) => {
    doc.setDrawColor(...color);
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, pageW - margin, yPos);
  };

  // ── Header ──────────────────────────────────────────────
  doc.setFillColor(37, 99, 235);          // primary blue
  doc.rect(0, 0, pageW, 38, 'F');

  doc.setTextColor(255, 255, 255);
  centerText('SISB INTERNATIONAL SCHOOL', 14, 14, true);
  centerText('Schooney Parent Portal', 9, 22);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  const titleW = doc.getTextWidth(fields.title.toUpperCase());
  doc.text(fields.title.toUpperCase(), (pageW - titleW) / 2, 32);

  doc.setTextColor(30, 30, 30);
  y = 52;

  // ── Receipt meta box ────────────────────────────────────
  doc.setFillColor(245, 247, 250);
  doc.setDrawColor(210, 215, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentW, 48, 2, 2, 'FD');

  y += 10;
  labelValue('Receipt No.', fields.receiptId, y);
  y += 8;
  labelValue('Student', fields.studentName, y);
  y += 8;
  labelValue('Payment Date', fields.paymentDate, y);
  y += 8;
  labelValue('Payment Method', fields.paymentMethod, y);
  if (fields.referenceNumber) {
    y += 8;
    labelValue('Reference', fields.referenceNumber, y);
  }

  y += 16;
  hLine(y, [200, 205, 215]);
  y += 8;

  // ── Description ─────────────────────────────────────────
  if (fields.description) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Description', margin, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    const wrapped = doc.splitTextToSize(fields.description, contentW);
    doc.text(wrapped, margin, y);
    y += wrapped.length * 5 + 4;
    doc.setTextColor(30, 30, 30);
    hLine(y, [200, 205, 215]);
    y += 8;
  }

  // ── Items table ──────────────────────────────────────────
  if (fields.items && fields.items.length > 0) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Items', margin, y);
    y += 6;

    // table header
    doc.setFillColor(37, 99, 235);
    doc.setTextColor(255, 255, 255);
    doc.rect(margin, y - 4, contentW, 7, 'F');
    doc.setFontSize(9);
    doc.text('Description', margin + 2, y);
    doc.text('Amount', pageW - margin - 2 - doc.getTextWidth('Amount'), y);
    y += 5;

    doc.setTextColor(30, 30, 30);
    fields.items.forEach((item, i) => {
      doc.setFillColor(i % 2 === 0 ? 252 : 246, i % 2 === 0 ? 252 : 248, i % 2 === 0 ? 252 : 250);
      doc.rect(margin, y - 4, contentW, 7, 'F');
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(item.name, margin + 2, y);
      const priceW = doc.getTextWidth(item.price);
      doc.text(item.price, pageW - margin - 2 - priceW, y);
      y += 7;
    });

    hLine(y - 2, [200, 205, 215]);
    y += 6;
  }

  // ── Total ────────────────────────────────────────────────
  doc.setFillColor(37, 99, 235);
  doc.setTextColor(255, 255, 255);
  doc.roundedRect(margin, y, contentW, 14, 2, 2, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL', margin + 6, y + 9);
  const totalW = doc.getTextWidth(fields.amount);
  doc.text(fields.amount, pageW - margin - 6 - totalW, y + 9);

  doc.setTextColor(30, 30, 30);
  y += 24;

  // ── Footer ───────────────────────────────────────────────
  hLine(y, [200, 205, 215]);
  y += 6;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  centerText('Thank you for your payment', 8, y);
  y += 5;
  centerText(`Generated: ${new Date().toLocaleString()}`, 7, y);

  doc.save(`${fields.receiptId}.pdf`);
};

/** Legacy: still used by InvoiceCard which already has its own .txt logic */
export const triggerFileDownload = (filename: string, content: string, mimeType = 'text/plain; charset=utf-8') => {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
