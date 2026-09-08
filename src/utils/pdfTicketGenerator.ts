import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { Ticket, TicketOrder } from '../types';

/**
 * Generates a high-quality, printable PDF document for a single ticket or full order.
 */
export async function generateTicketPDF(ticket: Ticket, order?: TicketOrder | null) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  await renderTicketOnPage(doc, ticket, order);

  const cleanTitle = ticket.eventTitle.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 20);
  doc.save(`IWACU-Kids-Ticket-${ticket.ticketCode}-${cleanTitle}.pdf`);
}

/**
 * Generates a combined printable PDF containing all tickets in an order.
 */
export async function generateAllTicketsPDF(order: TicketOrder) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  for (let i = 0; i < order.tickets.length; i++) {
    if (i > 0) {
      doc.addPage('a4', 'portrait');
    }
    await renderTicketOnPage(doc, order.tickets[i], order, i + 1, order.tickets.length);
  }

  const cleanTitle = order.eventTitle.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 20);
  doc.save(`IWACU-Kids-Order-${order.id}-${cleanTitle}.pdf`);
}

/**
 * Renders a stylized, culturally authentic printable ticket layout on the current jsPDF page.
 */
async function renderTicketOnPage(
  doc: jsPDF,
  ticket: Ticket,
  order?: TicketOrder | null,
  pageIndex?: number,
  pageTotal?: number
) {
  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 18;
  const contentWidth = pageWidth - margin * 2; // 174mm

  // Generate QR Code data URL
  let qrDataUrl = '';
  try {
    qrDataUrl = await QRCode.toDataURL(ticket.qrPayload || ticket.ticketCode, {
      width: 400,
      margin: 1,
      color: {
        dark: '#1c1917',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    });
  } catch (err) {
    console.error('Failed to generate QR for PDF:', err);
  }

  // 1. TOP Rwandan Orange Accent Line
  doc.setFillColor(234, 88, 12); // #ea580c Warm Rwandan Sun Orange
  doc.rect(margin, 14, contentWidth, 5, 'F');

  // 2. HEADER CONTAINER (Charcoal)
  doc.setFillColor(28, 25, 23); // #1c1917
  doc.roundedRect(margin, 19, contentWidth, 32, 2, 2, 'F');

  // Brand text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('IWACU KIDS', margin + 8, 30);

  doc.setTextColor(251, 146, 60); // Orange 400
  doc.setFontSize(9);
  doc.text('OFFICIAL DIGITAL ENTRANCE PASS • NYAKALIRO, RWANDA', margin + 8, 36);

  doc.setTextColor(214, 211, 209);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Culture • Creativity • Talent • Fun • Rwandan Heritage', margin + 8, 42);

  // Status badge on the top right
  doc.setFillColor(16, 185, 129); // Emerald 500
  doc.roundedRect(pageWidth - margin - 38, 25, 30, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(ticket.status === 'VALID' ? 'VERIFIED PASS' : ticket.status, pageWidth - margin - 35, 30.5);

  // 3. MAIN TICKET CARD BORDER
  const cardTop = 53;
  const cardHeight = 185;
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.6);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, cardTop, contentWidth, cardHeight, 3, 3, 'FD');

  // Event Title Banner inside Card
  doc.setFillColor(250, 248, 245);
  doc.roundedRect(margin + 5, cardTop + 5, contentWidth - 10, 20, 2, 2, 'F');
  doc.setTextColor(28, 25, 23);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(ticket.eventTitle, margin + 9, cardTop + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text(ticket.eventVenue || `Nyakaliro Cultural Center & Grounds • Sector Nyakaliro, Rwanda`, margin + 9, cardTop + 20);

  // 4. METADATA 2-COLUMN TABLE
  const metaY = cardTop + 32;

  // Date Box
  doc.setFillColor(245, 245, 244);
  doc.roundedRect(margin + 5, metaY, 52, 16, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(120, 113, 108);
  doc.text('EVENT DATE', margin + 8, metaY + 5);
  doc.setFontSize(10);
  doc.setTextColor(28, 25, 23);
  doc.text(ticket.eventDate, margin + 8, metaY + 11.5);

  // Time Box
  doc.setFillColor(245, 245, 244);
  doc.roundedRect(margin + 61, metaY, 52, 16, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(120, 113, 108);
  doc.text('EVENT TIME', margin + 64, metaY + 5);
  doc.setFontSize(10);
  doc.setTextColor(28, 25, 23);
  doc.text(ticket.eventTime, margin + 64, metaY + 11.5);

  // Ticket Tier & Price Box
  doc.setFillColor(254, 243, 199); // Warm amber
  doc.roundedRect(margin + 117, metaY, 52, 16, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(180, 83, 9);
  doc.text('TIER & PRICE', margin + 120, metaY + 5);
  doc.setFontSize(9);
  doc.setTextColor(146, 64, 14);
  doc.text(`${ticket.ticketTypeName} • ${ticket.price.toLocaleString()} RWF`, margin + 120, metaY + 11.5);

  // 5. ATTENDEE STRIP
  const attendeeY = metaY + 22;
  doc.setFillColor(255, 247, 237); // Light orange tint
  doc.setDrawColor(254, 215, 170);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin + 5, attendeeY, contentWidth - 10, 18, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(194, 65, 12);
  doc.text('TICKET HOLDER (ATTENDEE)', margin + 9, attendeeY + 6);
  doc.setFontSize(11);
  doc.setTextColor(28, 25, 23);
  doc.text(ticket.attendeeName, margin + 9, attendeeY + 13);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(120, 113, 108);
  doc.text('PHONE / MOBILE CONTACT', margin + 105, attendeeY + 6);
  doc.setFontSize(10);
  doc.setTextColor(28, 25, 23);
  doc.text(ticket.attendeePhone || 'Verified in System', margin + 105, attendeeY + 13);

  // Registration number & check-in number strip
  const regStrip = attendeeY + 21;
  doc.setFillColor(28, 25, 23);
  doc.roundedRect(margin + 5, regStrip, contentWidth - 10, 12, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(251, 146, 60);
  if (ticket.ticketNumber !== undefined) {
    doc.text(`#${ticket.ticketNumber}`, margin + 10, regStrip + 8);
  }
  doc.setTextColor(214, 211, 209);
  doc.text(`Ticket No: ${ticket.ticketCode}`, margin + 28, regStrip + 8);
  if (ticket.ticketNumber !== undefined) {
    doc.text(`Registration: ${ticket.ticketNumber}`, margin + 78, regStrip + 8);
  }
  if (ticket.checkInNumber !== undefined) {
    doc.setTextColor(16, 185, 129);
    doc.text(`Check-In: #${ticket.checkInNumber}`, margin + 128, regStrip + 8);
  }

  // 6. QR CODE AND SCAN INSTRUCTIONS
  const qrSectionY = attendeeY + 38;
  doc.setFillColor(250, 250, 249);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin + 5, qrSectionY, contentWidth - 10, 68, 2, 2, 'FD');

  // Insert QR Code image
  if (qrDataUrl) {
    const qrSize = 52;
    const qrX = margin + 10;
    const qrY = qrSectionY + 8;
    // White background for QR code
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(qrX - 2, qrY - 2, qrSize + 4, qrSize + 4, 1, 1, 'F');
    doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
  }

  // Right side of QR: Security Details
  const infoX = margin + 70;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(120, 113, 108);
  doc.text('OFFICIAL TICKET CODE', infoX, qrSectionY + 14);

  doc.setFont('courier', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(234, 88, 12);
  doc.text(ticket.ticketCode, infoX, qrSectionY + 22);

  if (order?.id) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(120, 113, 108);
    doc.text('ORDER REFERENCE', infoX, qrSectionY + 30);
    doc.setFont('courier', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(28, 25, 23);
    doc.text(order.id, infoX, qrSectionY + 35);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(16, 185, 129);
  doc.text('✓ MTN MoMo / Airtel / USSD Verified', infoX, qrSectionY + 43);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(75, 85, 99);
  doc.text('• Show this QR code at the Nyakaliro entrance gate.', infoX, qrSectionY + 50);
  doc.text('• Gate scanners will verify authenticity in real-time.', infoX, qrSectionY + 55);
  doc.text('• Each barcode is valid for one admission scan only.', infoX, qrSectionY + 60);

  // 7. GATE POLICIES & GUIDELINES
  const policyY = qrSectionY + 73;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(28, 25, 23);
  doc.text('IMPORTANT EVENT ADMISSION POLICIES:', margin + 8, policyY + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(107, 114, 128);
  const policies = [
    '1. Gates open 1 hour prior to event start time. Arrive early for smooth cultural seating.',
    '2. You may present this ticket directly on your phone screen or as a printed paper copy.',
    '3. Children must be accompanied by a guardian or registered camp chaperone.',
    '4. Tickets are non-refundable but transferable with valid ID matching attendee name.',
  ];
  policies.forEach((p, idx) => {
    doc.text(p, margin + 8, policyY + 9 + idx * 4.5);
  });

  // 8. HOT SUPPORT & FOOTER BAR
  const footerY = cardTop + cardHeight + 6;

  // Hot support strip
  doc.setFillColor(254, 242, 242); // Light red / coral
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(margin, footerY, contentWidth, 14, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(185, 28, 28);
  doc.text('🔥 HOTLINE SUPPORT & ASSISTANCE (24/7 NYAKALIRO GATE DESK):', margin + 6, footerY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(153, 27, 27);
  doc.text(
    `WhatsApp & Direct Call: ${ticket.companyPhone || '+250 788 000 000'}   |   Email: info@iwacukids.rw   |   CEO: Coopstar`,
    margin + 6,
    footerY + 10.5
  );

  // Document footer stamp
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(156, 163, 175);
  const now = new Date().toLocaleString('en-RW');
  const pageText = pageTotal && pageIndex ? `Pass ${pageIndex} of ${pageTotal} • ` : '';
  doc.text(
    `${pageText}Issued by IWACU Kids Ticketing System • Nyakaliro, Rwanda • Generated: ${now}`,
    margin,
    footerY + 20
  );
}
