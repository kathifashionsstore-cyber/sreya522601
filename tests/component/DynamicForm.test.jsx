import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DynamicForm } from '../../src/admin/DynamicForm'

describe('DynamicForm', () => {
  it('renders labeled fields and emits changed values', async () => {
    const onChange = vi.fn()
    render(
      <DynamicForm
        sections={[
          {
            title: 'Basic Info',
            fields: [
              { name: 'name', label: 'Name', type: 'text', required: true },
              { name: 'active', label: 'Active', type: 'boolean' },
            ],
          },
        ]}
        value={{ name: 'Sreya', active: false }}
        onChange={onChange}
      />,
    )

    expect(screen.getByText('Basic Info')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: 'Care' } })
    expect(onChange).toHaveBeenCalled()
  })
})
