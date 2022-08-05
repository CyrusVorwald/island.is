import PDFDocument from 'pdfkit'

/*export const PdfConstants = {
  BOLD_FONT: 'Helvetica-Bold',
  NORMAL_FONT: 'Helvetica',
  HEADER_FONT_SIZE: 26,
  SMALL_FONT_SIZE: 8,
  VALUE_FONT_SIZE: 12,
  SUB_HEADER_FONT_SIZE: 14,
  NO_LINE_GAP: 0,
  SMALL_LINE_GAP: 4,
  NORMAL_LINE_GAP: 8,
  LARGE_LINE_GAP: 24,
  PAGE_SIZE: 'A4',
}
*/

export const PdfConstants = {
  BOLD_FONT: 'Helvetica-Bold',
  ROW_HEADER_FONT_SIZE: 26,
  ROW_HEADER_WIDTH: 80,
  ROW_HEADER_MARGIN: 48,
  HORIZONTAL_MARGIN: 48,
  VERTICAL_MARGIN: 48,
  ROW_TEXT_FONT_SIZE: 12,
  ROW_TEXT_FONT: 'Helvetica',
  COL_WIDTH: 48,
  COL_MARGIN: 24,
}

export const formatSsn = (ssn: string) => {
  return ssn.replace(/(\d{6})(\d+)/, '$1-$2')
}

export const newDocument = () => {
  return new PDFDocument({
    size: 'Letter',
    margins: {
      top: PdfConstants.VERTICAL_MARGIN,
      bottom: PdfConstants.VERTICAL_MARGIN,
      left: PdfConstants.HORIZONTAL_MARGIN,
      right: PdfConstants.HORIZONTAL_MARGIN,
    },
  })
}

export const addRow = (
  doc: PDFKit.PDFDocument,
  header: string,
  col1: string,
  col2?: string,
) => {
  doc
    .fontSize(PdfConstants.ROW_HEADER_FONT_SIZE)
    .font('Helvetica-Bold')
    .text(
      header,
      PdfConstants.HORIZONTAL_MARGIN,
      PdfConstants.VERTICAL_MARGIN,
      {
        width: PdfConstants.ROW_HEADER_WIDTH,
      },
    )

  let xPos =
    PdfConstants.HORIZONTAL_MARGIN +
    PdfConstants.ROW_HEADER_WIDTH +
    PdfConstants.ROW_HEADER_MARGIN

  doc
    .fontSize(PdfConstants.ROW_TEXT_FONT_SIZE)
    .font(PdfConstants.ROW_TEXT_FONT)
    .text(col1, xPos, PdfConstants.VERTICAL_MARGIN, {
      width: PdfConstants.COL_WIDTH,
    })

  if (col2) {
    xPos += PdfConstants.COL_WIDTH + PdfConstants.COL_MARGIN

    doc
      .fontSize(PdfConstants.ROW_TEXT_FONT_SIZE)
      .font(PdfConstants.ROW_TEXT_FONT)
      .text(col1, xPos, PdfConstants.VERTICAL_MARGIN, {
        width: PdfConstants.COL_WIDTH,
      })
  }
}
