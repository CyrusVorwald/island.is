import React from 'react'

import { withFigma } from '../../utils/withFigma'
import { Input } from './Input'

export default {
  title: 'Form/Input',
  component: Input,
  parameters: withFigma('Input'),
}

const Template = (args) => <Input {...args} />

export const Default = Template.bind({})
Default.args = {
  label: 'Tegund fyrirtækis',
  placeholder: 'This is the placeholder',
  name: 'Test1',
}

export const Tooltip = Template.bind({})
Tooltip.args = {
  label: 'This is the label',
  placeholder: 'This is the placeholder',
  name: 'Test2',
  tooltip:
    'Bacon ipsum dolor amet ball tip leberkas pork belly pork chop, meatloaf swine jerky doner andouille tenderloin',
}

export const Error = Template.bind({})
Error.args = {
  label: 'This is the label',
  placeholder: 'This is the placeholder',
  name: 'Test3',
  hasError: true,
  errorMessage: 'This is the error message',
}

export const Required = Template.bind({})
Required.args = {
  label: 'This is the label',
  placeholder: 'This is the placeholder',
  name: 'Test4',
  required: true,
}

export const Textarea = Template.bind({})
Textarea.args = {
  label: 'Textarea label',
  placeholder: 'This is the placeholder',
  name: 'Test5',
  textarea: true,
  rows: 4,
}

export const Textarea10Rows = Template.bind({})
Textarea10Rows.args = {
  label: 'Textarea label',
  placeholder: 'This is the placeholder',
  name: 'Test6',
  textarea: true,
  rows: 10,
}

export const TextareaError = Template.bind({})
TextareaError.args = {
  label: 'Textarea label',
  placeholder: 'This is the placeholder',
  name: 'Test7',
  hasError: true,
  errorMessage: 'This is the error message',
  textarea: true,
  rows: 4,
}

export const TextareaRequired = Template.bind({})
TextareaRequired.args = {
  label: 'Textarea label',
  placeholder: 'This is the placeholder',
  name: 'Test8',
  required: true,
  textarea: true,
  rows: 4,
}

export const BlueBackgroundColor = Template.bind({})
BlueBackgroundColor.args = {
  label: 'This is the label',
  placeholder: 'Blue background',
  name: 'Test9',
  backgroundColor: 'blue',
}

export const ResponsiveBackgroundColor = Template.bind({})
ResponsiveBackgroundColor.args = {
  label: 'This is the label',
  placeholder: 'Try change the window size',
  name: 'Test10',
  backgroundColor: ['white', 'blue', 'white', 'blue', 'white'],
}

export const WithLabelAbove = Template.bind({})
WithLabelAbove.args = {
  label: 'This is the above label',
  placeholder: 'This is the placeholder',
  name: 'Test11',
  size: 'xs',
}

export const Disabled = Template.bind({})
Disabled.args = {
  label: 'This is the label',
  placeholder: 'This is the placeholder',
  name: 'Test12',
  disabled: true,
}

export const ReadOnly = Template.bind({})
ReadOnly.args = {
  label: 'Read only label',
  placeholder: 'Read only',
  name: 'Test13',
  backgroundColor: 'blue',
  readOnly: true,
  value: 'Read only have a transparent background',
}
