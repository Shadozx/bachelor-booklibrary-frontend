import TextareaAutosize from 'react-textarea-autosize'

export default function TextArea({ value, onChange, ...rest }) {
  console.log(rest)
  return (
    <TextareaAutosize
      {...rest}
      value={value}
      onChange={onChange}
      placeholder="Введіть текст"
      className="form-control color-text"
      style={{ backgroundColor: 'transparent', resize: 'none' }}
      minRows={1}
    />
  )
}
