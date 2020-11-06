import React from 'react' // eslint-disable-line no-unused-vars
import Text from '../components/text/Text' // eslint-disable-line no-unused-vars
import { render } from '@testing-library/react'

test('renders text component correctly', () => {
  const div = document.createElement('div')
  render(<Text />, div)
})
