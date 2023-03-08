import React from 'react'
import crossIcon from '../Pics/crossIcon.png'
import './PopUp.css'

function PopUp({deletePopup,setdeletePopup,DeleteDocumentation}) {
  return (
    <div className='PopUp-main-div' style={{display:deletePopup?"block":"none"}}>

      <div className='PopUp-main-div'>

        <div className="PopUp-div">

          <div className='d-flex flex-direction-row' style={{height:"20%",color:"crimson",fontSize:"large",fontFamily:"cursive"}}>
            <div style={{ width: "90%", paddingLeft: "10%" }} className="d-flex justify-content-center h6">Delete Document !</div>
            <div style={{ width: "10%" }} className="d-flex justify-content-end">
              <img src={crossIcon} style={{ width: "50%",height:"55%", paddingTop: "5%", paddingRight: "5%" , cursor:"pointer"}} onClick={()=>setdeletePopup(false)}/>
            </div>
          </div>

          <div style={{height:"60%",paddingLeft:"7%",fontFamily:"cursive"}} className="d-flex align-items-center">
            Are you sure to want to permanently delete this Document !
          </div>

          <div className='d-flex justify-content-center' style={{height:"20%"}}>
            <button className='btn btn-danger' style={{width:"30%",paddingBottom:"2%"}} onClick={DeleteDocumentation}>Delete</button>
          </div>


        </div>

      </div>
    </div>
  )
}

export default PopUp
