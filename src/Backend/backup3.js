import React, { useEffect, useRef, useState } from 'react'
import PopUp from '../PopUp/PopUp.js'
import axios from 'axios'
import wordPic from '../Pics/wordPic.png'
import wordPic2 from '../Pics/wordPic2.png'
import crossPic from '../Pics/crossIcon.png'
import DocumentSaverText from '../Pics/DocumentSaverText.png'
import UplaodIcon from '../Pics/upload Icon.png'
import loaderPic from '../Pics/loader.gif'

import './Main.css'

function Main() {

    const [deletePopup, setdeletePopup] = useState(false)
    const [uploadFile, setuploadFile] = useState(false)
    const [fileloadLoader, setfileloadLoader] = useState(true)
    const [file, setFile] = useState();
    const [wordFile, setwordFile] = useState();
    const [refreshPage, setRefreshPage] = useState(0);
    const [DocumentationAvailable, setDocumentationAvailable] = useState(true);
    const documentDisplayDiv=useRef(); 
    // const uploadDiv=documentDisplayDiv.current

    console.log(process.env.URL_ADRESS);

    const ServerData = () => {

        console.log("Server Data");
        axios.get('http://localhost:3100')
            .then(response => {
                if (response.data.status == "ok") {
                    setFile(response.data.content);
                    setfileloadLoader(false)
                }
                else {
                    console.log("Something's Wrong")
                }
            })
            .catch(error=> console.log(error.response) )


    }

    // ----------- Display Documentation Data From File ----------- //

    const showDocumentation = async () => {

        await axios.get('http://localhost:3100/checkdocument')
            .then(res => {

                if (res.data == "file avilable") {
                    ServerData()
                    setDocumentationAvailable(true)
                }
                else if (res.data == "file not avilable") {
                    console.log(res.data);
                    setfileloadLoader(false)
                    setDocumentationAvailable(false)
                }

            })

            .catch(error => console.log(error));
    };


    // ----------- Upload Word File Images to Cloudinary ----------- //

    const uploadWordImages=async()=>{

        const uploadDiv=document.getElementsByClassName("document-display-div")[0];
        const images =uploadDiv.getElementsByTagName('img');
        
        console.log(documentDisplayDiv.current);
        
        setTimeout(async() => {
            
        const form = new FormData();
      
            for (let index = 0; index < images.length; index++) {
            
                form.append("uploadedFile", images[index].currentSrc)
            
            }

            await axios.post('http://localhost:3100/uploads', form)

            .then((response) => {

                    for (let index2 = 0; index2 < images.length; index2++) {
    
                        images[index2].setAttribute('src', response.data[index2])
                    }
                    return response.data
                })

            .then(async(data) => {
                    await axios.post('http://localhost:3100/savedoc', { data: uploadDiv.innerHTML })
                        .then(response => { setRefreshPage(refreshPage+1);setfileloadLoader(false)
                        })
                        .catch(error => console.log(error));
                })
                .catch(error => console.log(error));
          
        }, 1000);
    
       
    }

    // ----------- Convert Doc File into Html and send into the Display Word Div ----------- //

    const docToHtml=async(e)=>{
        
        await axios.get('http://localhost:3100/doctohtml')
        .then((res) => {

            if(res.status==200){
                setTimeout(() => {
                    console.log(res.data.content);
                    setFile(res.data.content)
                    setRefreshPage(refreshPage+1)
                    uploadWordImages(e)                        
                }, 1000);
                
            }

        })
        .catch(error=> console.log(error.response) )
        
    }
 

    // ----------- Send File To Database and Store Images ----------- //

    const submit = async (e) => {

        const formData = new FormData();
        formData.append("file", wordFile)

        await axios.post('http://localhost:3100/uploadFile', formData)
            .then((response) => {
                if(response.data==="ok"){
                    setDocumentationAvailable(true);
                    setfileloadLoader(true);
                    setTimeout(() => {
                        docToHtml(e);                                           
                        
                    }, 2000);
                };
            })            
            .catch(error=> console.log(error.response) )
       
        }

        const DeleteDocumentation=async()=>{
            const uploadDiv=document.getElementsByClassName("document-display-div")[0];
            const images =uploadDiv.getElementsByTagName('img');
            const imgArray=[];
            console.log(images.length);
            for (let i = 0; i < images.length; i++) {
                console.log(images[i].src);
                imgArray.push(images[i].src.split("/")[7].split(".")[0])
                
            }
            
            // console.log(imgArray[0].split("/")[7].split(".")[0]);
            await axios.post("http://localhost:3100/deleteDocumentation",{data:imgArray})
            .then((res)=>{
                console.log(res);
                if(res.data=="fileDeleted"){
                    setdeletePopup(false)
                    setRefreshPage(refreshPage+1)
                    setDocumentationAvailable(false)
                }
            })
        }


    const inputChangeEvent = (e) => {
        
        const file=e.target.files[0]
        if (file != null) { setuploadFile(true) }
        setwordFile(e.target.files[0])
        console.log(e.target.files[0]);
        // console.log(e.target.files[0].getObjectPart("word/header1.xml").text());
    }

    useEffect(() => {
        showDocumentation();
    }, [refreshPage])

    return (
        <>
            <div className='container-fluid d-flex main-div '>
                <div className='container-fluid d-flex row'>
                    <div className='col-md-6 d-flex justify-content-center align-items-center flex-column' style={{ borderLeft: "2px solid black" }}>
                        <div className='d-flex justify-content-start align-items-center' style={{ height: "40%" }}>
                            <img src={DocumentSaverText} style={{ height: "30%" }} />
                        </div>

                        <div className='submit-form-container d-flex flex-direction-column ' >

                            <div className='upload-text d-flex justify-content-center h6' >Upload Document</div>

                            <div className="submit-input-field d-flex align-self-stretch">
                                <div style={{ width: "50%", padding: "0% 0% 2% 2%" }} className="d-flex align-items-end flex-column">
                                    <div className='d-flex justify-content-center align-items-center' style={{ paddingBottom: "5%", height: "60%", width: "100%" }}>
                                        {uploadFile ?
                                            <img src={wordPic2} style={{ width: "45%" }} className="word-upload-image " />
                                            :
                                            <span className='h6'> Upload File </span>
                                        }
                                    </div>
                                    <div className='d-flex justify-content-center align-items-end ' >
                                        <form encType="multipart/form-data" method="post" className='submit-form' id="uploadedFile" >
                                            <input multiple type="file" name="file" id="formFile" onChange={(e) => inputChangeEvent(e)} style={{ width: "80%" }} />
                                        </form>
                                    </div>
                                    <div className='d-flex justify-content-center align-items-center' style={{ width: "100%", paddingTop: "3%" }}>
                                        <button className='btn btn-primary' onClick={(e) => submit(e)}>Upload</button>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-center align-items-center h6" style={{ width: "50%", borderLeft: "2px solid darkgray" }}>
                                    {DocumentationAvailable ?
                                        <div className='d-flex flex-column' style={{ height: "100%" }}>
                                            <div className='d-flex justify-content-end ali' style={{ paddingRight: "3%", cursor: "pointer", marginTop: "5%" }}>
                                                <img src={crossPic} style={{ width: "7%" }} onClick={() => setdeletePopup(true)} />
                                            </div>
                                            <div className='d-flex justify-content-center' style={{ paddingRight: "3%" }}>
                                                <img src={wordPic} className="cross-icon" style={{ width: "50%", paddingTop: "5%" }} />
                                            </div>
                                            <figcaption className='d-flex justify-content-center' style={{ flexGrow: 1, paddingTop: '5%' }}>Documentation</figcaption>
                                        </div>
                                        :
                                        "No Document Uploaded"}
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className='col-md-6 d-flex align-items-center flex-column' style={{ paddingTop: "1%" }}>
                        <div className='uploaded-document-name'> Document  </div>


                    </div>

                    <div className="display-upload-section">
                        <div className="file-load-loader" style={{ display: fileloadLoader ? "flex" : "none" }}><img src={loaderPic} className="loader" /></div>
                        {/* {DocumentationAvailable ? */}
                            <div className='document-display-div' dangerouslySetInnerHTML={{ __html: file }} ref={documentDisplayDiv}></div>
                            {/* :  */}
                         {/* <div className='file-not-available'>
                                <img src={UplaodIcon} className="upload-icon-img" />
                                <span className='file-not-available-text'>No Documentation is Available<br />
                                    Upload a new one</span></div> */}
                        {/* }  */}
                    </div>
                    
                </div>
            </div>

            <PopUp deletePopup={deletePopup} setdeletePopup={(data) => setdeletePopup(data)} DeleteDocumentation={DeleteDocumentation} />
        </>
    )
}

export default Main
