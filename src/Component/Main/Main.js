import React, { useEffect, useState } from 'react'
import wordPic from '../Pics/wordPic.png'
import wordPic2 from '../Pics/wordPic2.png'
import crossPic from '../Pics/crossIcon.png'
import DocumentSaverText from '../Pics/DocumentSaverText.png'
import PopUp from '../PopUp/PopUp.js'
import loaderPic from '../Pics/loader.gif'
import UplaodIcon from '../Pics/upload Icon.png'
import axios from 'axios'
import './Main.css'

function Main() {

    const [uploadDocument, setUploadDocument] = useState()
    const [deletePopup, setdeletePopup] = useState(false)
    const [filename, setfilename] = useState()
    const [uploadFile, setuploadFile] = useState(false)
    const [fileloadLoader, setfileloadLoader] = useState(true)
    const [file, setFile] = useState();
    const [wordFile, setwordFile] = useState();
    const [refreshPage, setRefreshPage] = useState(0);
    const [transparentDivData,setTransparentDivData]=useState()

    const [DocumentationAvailable, setDocumentationAvailable] = useState(false);


    const ServerData = () => {

        console.log("Server Data");
        axios.get('http://localhost:3100')
            .then(response => {
                if (response.data.status == "ok") {
                    setFile(response.data.content[0].doc);
                    console.log(response.data.content[0].doc);
                    setfileloadLoader(false)
                    // console.log(response.data[0].doc)
                    setUploadDocument("Data Loaded")
                }
                else {
                    setUploadDocument("Something's Wrong")

                }
            })

    }

    // ----------- Display Documentation Data From File ----------- //

    const showDocumentation = async () => {

        await axios.get('http://localhost:3100/checkdocument')
            .then(res => {
                console.log(res.data);
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


    const uploadWordImages=async()=>{

        // e.preventDefault()
            const uploadDiv=document.getElementsByClassName('document-display-div')[0];
            const images =uploadDiv.getElementsByTagName('img');
            
        console.log("UploadWordFile");
        setTimeout(async() => {
            
        console.log('as');
        const form = new FormData();
      
            console.log("UploadWordFile2");
    
            console.log(uploadDiv);
            console.log(images);
            console.log(images.length);  
            const b=[];
            for (let index = 0; index < images.length; index++) {
                // b.push(images[index].currentSrc)
                form.append("uploadedFile", images[index].currentSrc)
                console.log(images[index].currentSrc);
            
            }
            console.log(images);
            console.log(b);
            const ab = await axios.post('http://localhost:3100/uploads', form)
                .then((response) => {
                    console.log(response);
                    for (let index2 = 0; index2 < images.length; index2++) {
    
                        images[index2].setAttribute('src', response.data[index2])
                    }
                    return response.data
                })
                .then((data) => {
                    console.log(uploadDiv, 'data');
                    console.log(uploadDiv.innerHTML, 'data');
                    const b = uploadDiv
                    console.log('data1',b);
                    console.log('data2',JSON.stringify(b, replacerFunc()));
                    axios.post('http://localhost:3100/savedoc', { data: uploadDiv.innerHTML })
                        .then(response => { setRefreshPage(refreshPage+1); console.log(response.data) })
                        .catch(error => console.log(error));
                })
                .catch(error => console.log(error));
          
        }, 1000);
    
       
    }


    const docToHtml=async(e)=>{
        await console.log("doctoHtml");
        axios.get('http://localhost:3100/doctohtml')
        .then((res) => {
            console.log(res);
            // console.log(res.data.content);
            if(res.status==200){
            

                console.log("dc 105");
                // transparentDivData(res.data.content)
                setFile(res.data.content)
                setRefreshPage(refreshPage+1)
                console.log('testing');
                uploadWordImages(e)
                
            }
                console.log(res);

            })
        
    }
    // if(DocumentationAvailable){

    // const sd=document.getElementsByClassName('document-display-div');
    // console.log(sd);
    // console.log(sd[0]);
    // }

    // ----------- Send File To Database and Store Images ----------- //

    const submit = async (e) => {

        const formData = new FormData();
        formData.append("file", wordFile)

        await axios.post('http://localhost:3100/uploadFile', formData)
            .then((response) => {
                // setRefreshPage(refreshPage+1)
                console.log(response);
                console.log(response.data=="ok");
                if(response.data==="ok"){
                    console.log('test 162');
                    docToHtml(e);
                    // console.log("enter");
                };
            })
    }

    const submit2 = async (e) => {

        // e.preventDefault()
        // const a=document.getElementsByClassName("display-upload-section")[0];
        // const uploadDiv = a.getElementsByClassName('document-display-div')[0];
        // console.log(uploadDiv);
        // const images = uploadDiv.getElementsByTagName('img');

        // console.log(uploadDiv, 'uploadDiv');
        // console.log(images, 'img');

        // const form = new FormData();

        // for (let index = 0; index < images.length; index++) {
        //     form.append("uploadedFile", images[index].getAttribute('src'))
        // }

        // const ab = await axios.post('http://localhost:3100/uploads', form)
        //     .then((response) => {
        //         for (let index2 = 0; index2 < images.length; index2++) {

        //             images[index2].setAttribute('src', response.data[index2])
        //         }
        //         return response.data
        //     }).then((data) => {
        //         console.log(uploadDiv, 'data');
        //         console.log(uploadDiv.innerHTML, 'data');
        //         const b = uploadDiv
        //         console.log(JSON.stringify(b, replacerFunc()), 'data2');
        //         axios.post('http://localhost:3100/savedoc', { data: uploadDiv.innerHTML })
        //             .then(response => { console.log(response.data) })
        //             .catch(error => console.log(error));
        //     })
        //     .catch(error => console.log(error));

        // console.log(e.target.files);
    }

    const inputChangeEvent = (e) => {
        
        const file=e.target.files[0]
        if (file != null) { setuploadFile(true) }
        console.log(e.target.files);
        setwordFile(e.target.files[0])
    }

    useEffect(() => {
        showDocumentation();
        // docToHtml();
        // ServerData()
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
                                        {/* <button className='btn btn-primary' onClick={()=>uploadWordImages()}>Upload2</button> */}
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
                        <div className="file-load-loader" style={{ display: fileloadLoader ? "flex" : "none" }}><img src={loaderPic} className="loader" />                        </div>
                        {/* {DocumentationAvailable ? */}
                            <div className='document-display-div' dangerouslySetInnerHTML={{ __html: file }} ></div>
                            {/* : */}
                        {/* <div className='file-not-available'>
                                <img src={UplaodIcon} className="upload-icon-img" />
                                <span className='file-not-available-text'>No Documentation is Available<br />
                                    Upload a new one</span></div>
                        } */}
                    </div>
                    
                </div>
            </div>

            <PopUp deletePopup={deletePopup} setdeletePopup={(data) => setdeletePopup(data)} />
        </>
    )
}

export default Main
