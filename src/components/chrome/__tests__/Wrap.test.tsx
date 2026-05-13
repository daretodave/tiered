import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Wrap } from '../Wrap'

describe('<Wrap>', () => {
  it('renders children inside a .wrap container', () => {
    render(
      <Wrap>
        <p>inner</p>
      </Wrap>,
    )
    const wrap = screen.getByTestId('wrap')
    expect(wrap.className).toContain('wrap')
    expect(wrap).toContainHTML('<p>inner</p>')
  })

  it('appends className', () => {
    render(
      <Wrap className="extra">
        <span />
      </Wrap>,
    )
    expect(screen.getByTestId('wrap').className).toContain('extra')
    expect(screen.getByTestId('wrap').className).toContain('wrap')
  })

  it('defaults to width="default" with no narrow class', () => {
    render(
      <Wrap>
        <span />
      </Wrap>,
    )
    const wrap = screen.getByTestId('wrap')
    expect(wrap.dataset.width).toBe('default')
    expect(wrap.className).not.toContain('narrow')
  })

  it('renders width="narrow" with the narrow class for 1100px shells', () => {
    render(
      <Wrap width="narrow">
        <span />
      </Wrap>,
    )
    const wrap = screen.getByTestId('wrap')
    expect(wrap.dataset.width).toBe('narrow')
    expect(wrap.className).toContain('narrow')
    expect(wrap.className).toContain('wrap')
  })
})
