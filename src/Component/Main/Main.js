import React, { useEffect, useState } from 'react'
import wordPic from '../Pics/wordPic.png'
import wordPic2 from '../Pics/wordPic2.png'
import crossPic from '../Pics/crossIcon.png'
import DocumentSaverText from '../Pics/DocumentSaverText.png'
import PopUp from '../PopUp/PopUp.js'
import loaderPic from '../Pics/loader.gif'
import axios from 'axios'
import './Main.css'

function Main() {

    const [uploadDocument, setUploadDocument] = useState(false)
    const [deletePopup, setdeletePopup] = useState(false)
    const [filename, setfilename] = useState()
    const [uploadFile, setuploadFile] = useState(false)
    const [fileloadLoader, setfileloadLoader] = useState(true)
    const [file, setFile] = useState();


    console.log(document.getElementById("formFile"));

    // ----------- Load File Pic ----------- //
    
    var loadFile = (event) => {

        if (file != null) { setuploadFile(true) }
       
    }

    // ----------- Display Documentation Data From File ----------- //
    
    const showDocumentation = async () => {

        axios.get('http://localhost:3100/data')
            .then(response => { 
                if(response.data.status=="ok"){
                setFile(response.data.content[0].doc); 
                setfileloadLoader(false)
                console.log(response.data[0].doc)  
                setUploadDocument(true)           
            }
            else{
                setUploadDocument(false)           

            }
        })
            .catch(error => console.log(error));

    };

    // ----------- Help to Stringify Circular Structure ----------- //

    const replacerFunc = () => {
        const visited = new WeakSet();
        return (key, value) => {
          if (typeof value === "object" && value !== null) {
            if (visited.has(value)) {
              return;
            }
            visited.add(value);
          }
          return value;
        };
      };


    // ----------- Send File To Database and Store Images ----------- //

    const submit = async (e) => {

        e.preventDefault()
        const uploadDiv=document.getElementsByClassName('document-display-div')[0];
        console.log(uploadDiv.innerHTML);
        const images=uploadDiv.getElementsByTagName('img');

        console.log(uploadDiv, 'uploadDiv');
        console.log(images, 'img');

        const form = new FormData();

        for (let index = 0; index < images.length; index++) {
            form.append("uploadedFile", images[index].getAttribute('src'))
        }

        const ab = await axios.post('http://localhost:3100/uploads', form)
            .then((response) => {
                for (let index2 = 0; index2 < images.length; index2++) {

                    images[index2].setAttribute('src', response.data[index2])
                }
                return response.data
            }).then((data)=>{
                console.log(uploadDiv,'data');
                console.log(uploadDiv.innerHTML,'data');
                const b=uploadDiv
                console.log(JSON.stringify(b,replacerFunc()),'data2');
                axios.post('http://localhost:3100/savedoc', {data: uploadDiv.innerHTML })
                .then(response => { console.log(response.data) })
                .catch(error => console.log(error));
            })
            .catch(error => console.log(error));

        console.log(e.target.files);
    }


    useEffect(()=>{
        showDocumentation();
    },[])


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
                                            <input multiple type="file" accept="application/msword/*" name="file" id="formFile" onChange={(e) => loadFile(e)} style={{ width: "80%" }} />
                                        </form>
                                    </div>
                                    <div className='d-flex justify-content-center align-items-center' style={{ width: "100%", paddingTop: "3%" }}>
                                        <button className='btn btn-primary' onClick={(e) => submit(e)}>Upload</button>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-center align-items-center h6" style={{ width: "50%", borderLeft: "2px solid darkgray" }}>
                                    {uploadDocument ?
                                        <div className='d-flex flex-column'>
                                            <div className='d-flex justify-content-end' style={{ paddingRight: "3%", cursor: "pointer" }}>
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
                        <div className='uploaded-document-name'> Document Name  </div>


                    </div>
                    <div className="display-upload-section">
                        <div className="file-load-loader" style={{display:fileloadLoader?"flex":"none"}}><img src={loaderPic} className="loader"/>                        </div>
                    
                        <div className='document-display-div' dangerouslySetInnerHTML={{ __html: file }} ></div>
                    </div>
                </div>
            </div>

            <PopUp deletePopup={deletePopup} setdeletePopup={(data) => setdeletePopup(data)} />
        </>
    )
}

export default Main
