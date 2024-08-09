import React, { useEffect, useState } from 'react'
import "./files.css"
import { axiosObj } from '../../utils/axios'
import { useAppContext } from "../../context/appContext"
import { Link } from 'react-router-dom'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';



const Files = () => {

  const {token} = useAppContext()
  
  const [fileType , setFileType] = useState("all")

  const [files , setFiles] = useState([])

  const [page , setPage] = useState(1)
  const [isPrevious , setIsPrevious] = useState(false)


  const filesTypes = [
    {
      name : "All Files" ,
      value : "all",
      selected : true
    },
    {
      name : "Documents" ,
      value : "documents",
      selected : false
    },
    {
      name : "Images" ,
      value : "images",
      selected : false
    },
    {
      name : "Videos" ,
      value : "videos",
      selected : false
    },
    {
      name : "Audios" ,
      value : "audios",
      selected : false
    },
  ]



 
  const getFilesByType = async (e) => {

    if(e){
      e.preventDefault()
    }

    if(fileType !== ""){

      let url = `/getFilesByAdmin?${fileType && `fileType=${fileType}`}&${`page=${page}`}`

      try {
        const response = await axiosObj.get(url , {
          headers : {
            "admin_header" : `admin ${token}`
          }
        })

        setFiles(response.data)

      } catch (error) {
        //console.log(error);
      }
    }
  }



  useEffect(() => {
    if(files.length !== 0 || isPrevious){
      getFilesByType()
      setIsPrevious(false)
    }
  } , [page , isPrevious])

 

  const downloadFileById = async (e , file) => {

    e.preventDefault()

    try {
      
      const response = await axiosObj.get(`/getFileByAdmin/${file._id}`, {
        responseType: 'blob',
        headers: {
          'admin_header': `admin ${token}`,
        },
      })

      const blob = new Blob([response.data], { type: response.headers['content-type'] })

      const downloadLink = document.createElement('a')

      downloadLink.href = window.URL.createObjectURL(blob)

      downloadLink.download = `${file.filename}.${blob.type.split('/')[1]}`

      document.body.appendChild(downloadLink)

      downloadLink.click()

      document.body.removeChild(downloadLink)

    } catch (error) {
      //console.log(error)
    }
  }






  return (

    <div className='files'>

      <div className='filesContainer'>

        <div className='message-form-row'>

            <label className='messages-label' htmlFor="files-collection">Choose Files Collection</label>

            <select onChange={(e) => {setFileType(e.target.value) ; setPage(1)}} className='mesages-select' id="files-collection" name="files-collection">

              {filesTypes.map((fileType , i) => {
                return (
                  <option selected={fileType.selected} value={fileType.value} key={i}>{fileType.name}</option>
                  )
                })}

            </select>

            <div className='btnContainer'>
              {page !== 1 && <button onClick={() => {setPage(prev => prev - 1) ; setIsPrevious(true)}} className='nextPageBtn'><ArrowBackIosIcon/> </button>}
              <button onClick={(e) => getFilesByType(e)}  className='getFilesBtn'>get files</button>
              {files.length !== 0 && <button onClick={() => setPage(prev => prev + 1)} className='nextPageBtn'><ArrowForwardIosIcon/> </button>}
            </div>

        </div>
        
        <Link to="/userFiles">
          <button className='usersFilesBtn'>users files</button>
        </Link>

      </div>


        {files.length > 0 &&   (
          
          <table>

            <tr>
              <th>id</th>
              <th>Filename</th>
              <th>Filetype</th>
              <th>Actions</th>
            </tr>

            {files && files.map((file) => {
              return (
                
                <tr key={file._id}>

                  <td className='tableData'>{file._id}</td>
                  <td className='tableData'>{file.filename}</td>
                  <td className='tableData'>{file.type}</td>

                  <td className='tableData'>

                    <div className='actionBtns'>

                      <Link>
                        <button onClick={(e) => downloadFileById(e , file)} className='editUserBtn'>Download</button>
                      </Link>

                      {/*                   
                      <button onClick={(e) => deleteSpecificFile(e , file._id)} style={{border : "none" , cursor : "pointer"}}>
                        <DeleteOutlineIcon className='deleteUserBtn'/>
                      </button> */}

                      <Link to={`/fileApproveDeleteModal/${file._id}`} state={{from : "/files"}}>
                        <DeleteOutlineIcon className='deleteUserBtn'/>
                      </Link>
                  
                    </div>
              
                  </td>

                </tr>

              )

            })}

          </table>


        )}
        
    </div>

  )

}

export default Files