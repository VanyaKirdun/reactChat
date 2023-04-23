import RecordingModal from "./RecordingModal"

export default function Recorder({setFile}: {setFile:(param: any) => File|null}) {
  return (
    <div className=''>
      <button
        type='button'
        className='p-2 rounded bg-transparent border-0 btn btn-lg'
        data-bs-toggle="modal" 
        data-bs-target="#modalRecordWindow"
      >
        <i className="bi bi-record-circle"></i>
      </button>

      <RecordingModal setFile={setFile}/>
    </div>
  )
}