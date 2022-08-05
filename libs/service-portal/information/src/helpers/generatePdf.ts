import { addRow, newDocument, PdfConstants } from './pdfUtils'
import streamBuffers from 'stream-buffers'

export const generatePdf = async (name: string) => {
  const doc = newDocument()
  const stream = doc.pipe(new streamBuffers.WritableStreamBuffer())

  doc
    .font(PdfConstants.BOLD_FONT)
    .fontSize(PdfConstants.ROW_HEADER_FONT_SIZE)
    .text('Forsjáraðilar')

  addRow(doc, 'Nafn barns', 'Dagur Örn Kristjánsson')
  addRow(doc, 'Kennitala barns', '111111-1111')
  addRow(doc, 'Nafn', 'Lísa Jónsdóttir', 'Kristján Hannesson')
  addRow(doc, 'Staða forsjár', 'Sameiginleg forsja', 'Sameiginleg forsja')
  addRow(doc, 'Kennitala', 'Lísa Jónsdóttir', 'Kristján Hannesson')
  addRow(doc, 'Lögheimilsforeldri', 'Nei', 'Já')
  addRow(doc, 'Búsetuforeldri', 'Nei', 'Já')

  doc.end()

  const pdf = await new Promise<Buffer>(function (resolve) {
    stream.on('finish', () => {
      resolve(stream.getContents() as Buffer)
    })
  })

  const blob = new Blob([pdf])
  const uri = URL.createObjectURL(blob)
  const fileName = `${name} - ${new Date().toISOString().split('T')[0]}`

  const link = document.createElement('a')
  link.setAttribute('href', uri)
  link.setAttribute('download', fileName)
  document.body.appendChild(link)

  link.click()

  document.body.removeChild(link)
}
