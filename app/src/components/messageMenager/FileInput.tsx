import { useEffect, useRef } from 'react'
import FilePreview from './FilePreview'

export default function FileInput({ file, setFile, send }: { file: File|null, setFile: (param: any) => File|null, send:any }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const buttonModal = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!file && inputRef.current != null) {
      inputRef.current.value = ''
    }
  }, [file])

  return (
    <div className=''>
      <input
        type='file'
        accept='image/*, audio/*, video/*'
        onChange={(e: any) => {
          setFile(e.target.files[0])
          if(buttonModal.current != null){
            buttonModal.current.click()
          }
        }}
        className='visually-hidden'
        ref={inputRef}
      />
      <button className='visually-hidden' type='button' data-bs-toggle="modal" data-bs-target="#modalFileWindow" ref={buttonModal}></button>
      <button
        type='button'
        className='btn'
        style={{fontSize: '20px'}}
        onClick={() => {
          if(inputRef.current != null){
            inputRef.current.click()
          }
        }}
        
      >
        <i className="bi bi-paperclip "></i>
      </button>

      <FilePreview file={file} setFile={setFile} send={send}/>
    </div>
  )
}