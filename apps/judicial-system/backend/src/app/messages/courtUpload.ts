import { defineMessage } from 'react-intl'

export const courtUpload = {
  courtRecord: defineMessage({
    id: 'judicial.system.backend:court_upload.court_record',
    defaultMessage: 'Þingbók {courtCaseNumber}',
    description: 'Notaður sem nafn á þingbók í Auði.',
  }),
  ruling: defineMessage({
    id: 'judicial.system.backend:court_upload.ruling',
    defaultMessage: 'Úrskurður {courtCaseNumber}',
    description: 'Notaður sem nafn á úrskurði í Auði.',
  }),
}
