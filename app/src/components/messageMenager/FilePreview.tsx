import { useEffect, useState } from 'react'
import ModalWindow from '../ModalWindow'

export default function FilePreview({ file, setFile, send }: { file: File|null, setFile: (param: any) => File|null, send:() => void }) {
  const [src, setSrc] = useState<string>()
  const [type, setType] = useState<string>()

  useEffect(() => {
    if (file) {
      setSrc(URL.createObjectURL(file))
      setType(file.type.split('/')[0])
    }
  }, [file])

  let element

  switch (type) {
    case 'image':
      element = <img className='img-fluid' src={src} alt={''} />
      break
    case 'audio':
      element = <audio className='mw-100' src={src} controls></audio>
      break
    case 'video':
      element = <video className='mw-100' src={src} controls></video>
      break
    default:
      element = null
      break
  }

  return (
    <ModalWindow id={'modalFileWindow'}>
        <div className="modal-body">
          <div className='d-flex justify-content-center'>
            {element}
          </div>
        </div>
        <div className="modal-footer">
          <button type='button' className='btn close' onClick={() => send()} data-bs-dismiss="modal" aria-label="Close" >
            Отправить
          </button>
          <button type='button' className='btn close' onClick={() => {
              setFile(null)
              setSrc(undefined)
              setType(undefined)}} 
              data-bs-dismiss="modal" aria-label="Close" >
            Отменить
          </button>
        </div>
      </ModalWindow>
  )
}