import { useRef, useState } from 'react'
import ModalWindow from '../../ModalWindow'
import {
  audioConstraints,
  isRecordingStarted,
  pauseRecording,
  resumeRecording,
  startRecording,
  stopRecording,
  videoConstraints
} from '../../utils/recording'

export default function RecordingModal({ setFile }) {
  const [constraints, setConstraints] = useState(audioConstraints)
  const [recording, setRecording] = useState(false)
  const selectBlockRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const onChange = ({ target: { value } }) =>
    value === 'audio'
      ? setConstraints(audioConstraints)
      : setConstraints(videoConstraints)

  const pauseResume = () => {
    if (recording) {
      pauseRecording()
    } else {
      resumeRecording()
    }
    setRecording(!recording)
  }

  const start = async () => {
    if(selectBlockRef.current !== null && videoRef.current!== null){
      if (isRecordingStarted()) {
        return pauseResume()
      }

      const stream = await startRecording(constraints)

      setRecording(true)

      selectBlockRef.current.style.display = 'none'

      if (constraints.hasOwnProperty('video') && stream) {
        videoRef.current.style.display = 'block'
        videoRef.current.srcObject = stream
      }
    }
  }

  const stop = () => {
    const file = stopRecording()

    setRecording(false)

    setFile(file)

  }

  return (
    <>
      <ModalWindow id={'modalRecordWindow'}>
        <div className="modal-body">
          <div ref={selectBlockRef}>
            <h2>Select type</h2>
            <select onChange={onChange}>
              <option value='audio'>Audio</option>
              <option value='video'>Video</option>
            </select>
          </div>
          {isRecordingStarted() && <p>{recording ? 'Recording...' : 'Paused'}</p>}
          <video ref={videoRef} autoPlay muted />
        </div>
        <div className="modal-footer">
          <button className='' onClick={start}>
            {recording ? (
              <i className="bi bi-pause"></i>
            ) : (
              <i className="bi bi-play"></i>
            )}
          </button>
          {isRecordingStarted() && (
            <button className='' onClick={stop} data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#modalFileWindow" aria-label="Close" >
              <i className="bi bi-stop"></i>
            </button>
          )}
        </div>
      </ModalWindow>
    </>
  )
}