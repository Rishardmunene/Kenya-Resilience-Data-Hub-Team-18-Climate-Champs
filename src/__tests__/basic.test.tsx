import { render, screen } from '@testing-library/react'

describe('Basic Test', () => {
  it('should pass a basic test', () => {
    render(<div data-testid="test-element">Test Content</div>)
    expect(screen.getByTestId('test-element')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should handle basic math', () => {
    expect(2 + 2).toBe(4)
  })

  it('should handle string operations', () => {
    const greeting = 'Hello, World!'
    expect(greeting).toContain('Hello')
    expect(greeting.length).toBeGreaterThan(0)
  })
})
