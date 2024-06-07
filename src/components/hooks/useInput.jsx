import { useState } from 'react'

export default function useInput(defaultValue = '') {
  const [value, setValue] = useState(defaultValue)

  return {
    value,
    setValue,
    onChange: (e) => setValue(e.target.value),
  }
}
