const ModalWindow = (props) =>{
  return(
    <>
      <div
      className='modal fade'
      id={props.id}
      tabIndex={-1}
      aria-labelledby = "modalWindowLabel"
      aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {props.children}
          </div>
        </div>
    </div>
    </>
  )
}
export default ModalWindow;