import React, { useEffect, useState } from 'react'
import "./usersFiles.css"
import { Link } from 'react-router-dom'
import { axiosObj } from '../../utils/axios'
import { useAppContext } from "../../context/appContext"
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import FileDeleteApprove from '../../components/fileDeleteApprove/FileDeleteApprove'



const UsersFiles = () => {

    const {token} = useAppContext()

    // create two state array one for the original all data without any modify , the second one for any modify operation and the second array ref will always be the original one
    // this operation only when filter data based on frontend with no access from the backend
    const [userfiles , setUserFiles] = useState([])
    const [originalUserFiles , setOriginalUserFiles] = useState([])

    const [users , setUsers] = useState([])

    const [userSelected , setUserSelected] = useState(false)
    const [filterType , setFilterType] = useState("")
    const [userId , setUserId] = useState("")

    const [selectedFileId , setSelectedFileId] = useState("")

    const [page , setPage] = useState(1)

    const [isPrevious , setIsPrevious] = useState(false)
    const [openApproveModal , setOpenApproveModal] = useState(false)

    const [isApprovedToDelete , setIsApprovedToDelete] = useState(false)


    const filterOperations = [
        {
            name : "All" ,
            value: "all" ,
        },
        {
            name : "Documents" ,
            value: "documents" ,
        },
        {
            name : "Images" ,
            value: "images" ,
        },
        {
            name : "Videos" ,
            value: "videos" ,
        },
        {
            name : "Voices" ,
            value: "voices" ,
        },
    ]



    const downloadFileById = async (e , file) => {

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
    
    
    
      // const deleteSpecificFile = async (e , fileId) => {
        
      //   if(e){
      //     e.preventDefault()
      //   }
        
      //     try {
      //         await axiosObj.delete(`/deleteFile/${fileId}` , {
      //             headers : {
      //                 "admin_header" : `admin ${token}`
      //             }
      //         })
      //         setUserFiles(prev => prev.filter(file => file._id !== fileId))  
      //     } catch (error) {
      //       //console.log(error)
      //     }

      // }
    


    useEffect(() => {
        const getAllUsers = async () => {
         try {
            const response = await axiosObj.get("/getAllUsers" , {
             headers : {
                "admin_header" : `admin ${token}`
            }
            })
            setUsers(response.data)
        } catch (error) {
            //console.log(error)
        }
    }

    getAllUsers()

    } , [])



    const getUserAllFiles = async () => {
        try {
        const response = await axiosObj.get(`/getAllUserFiles/${userId}?${`page=${page}`}` , {
            headers : {
            "admin_header" : `admin ${token}`
            }
        })
        setUserFiles(response.data)
        setOriginalUserFiles(response.data)
        } catch (error) {
        //console.log(error)
        }
    }



    useEffect(() => {

        if(userId !== ""){
            getUserAllFiles()
        }
        
    } , [userId])




    useEffect(() => {

        if(filterType !== ""){


            if(filterType === "all"){
                setUserFiles(originalUserFiles)
            }

            
            if(filterType === "documents"){
                setUserFiles(originalUserFiles.filter(file => file.type === "pdf" || file.type === "msword" || file.type === "vnd.openxmlformats-officedocument.presentationml.presentation" || file.type === "vnd.ms-excel"))
            }


            if(filterType === "images"){
                setUserFiles(originalUserFiles.filter(file => file.type === "png" || file.type === "jpeg"))
            }


            if(filterType === "videos"){
                setUserFiles(originalUserFiles.filter(file => file.type === "mp4"))
            }


            if(filterType === "voices"){
                setUserFiles(originalUserFiles.filter(file => file.type === "mpeg"))
            }

        }

    } , [filterType , userId])



    useEffect(() => {
        if(userfiles.length !== 0 || isPrevious){
          getUserAllFiles()
          setIsPrevious(false)
        }
      } , [page , isPrevious])
    


    useEffect(() => {
        setFilterType("")
    } , [userId])



   


  return (
        
    <div className='usersFiles'>

        <div className='usersFilesContainer'>

            <div className='message-form-row'>

                <label className='messages-label' htmlFor="files-collection">Choose Files Collection</label>

                <select onChange={(e) => {setUserId(e.target.value) ; setUserSelected(true) ; setPage(1)}} className='mesages-select' id="files-collection" name="files-collection"> 

                <option selected disabled value="">Select User</option>

                {users.map((singleUser) => {
                    return (
                        <option value={singleUser._id} key={singleUser._id}>{singleUser.username}</option>
                    )
                })} 

                </select> 

                <div className='btnContainer'>
                    {/* {page !== 1 && <button onClick={() => {setPage(prev => prev - 1) ; setIsPrevious(true)}} className='nextPageBtn'><ArrowBackIosIcon/> </button>}
                    {userfiles.length < 1 && <button disabled={userfiles.length > 0} onClick={(e) => getFilesByType(e)}  className='getFilesBtn'>get files</button>}
                    {files.length !== 0 && <button onClick={() => setPage(prev => prev + 1)} className='nextPageBtn'><ArrowForwardIosIcon/> </button>}
                </div> */}

                </div>
  
                <Link to="/files">
                    <button className='usersFilesBtn'>all files</button>
                </Link>

            </div>


            {userSelected && <div className='message-form-row'>

                <label className='messages-label' htmlFor="files-collection">Choose Filter Collection</label>

                <select onChange={(e) => {setFilterType(e.target.value) ; setIsPrevious(false)}} className='mesages-select' id="files-collection" name="files-collection"> 

                <option selected disabled value="">Select filter</option>

                {filterOperations.map((filterOption) => {
                    return (
                        <option value={filterOption.value} key={filterOption.name}>{filterOption.name}</option>
                    )
                })} 

                </select>

                {filterType === "" && <div className='btnContainer'>
                    {page !== 1 && <button onClick={() => {setPage(prev => prev - 1) ; setIsPrevious(true)}} className='nextPageBtn'><ArrowBackIosIcon/> </button>}
                    {/* {userfiles.length < 1 && <button disabled={userfiles.length > 0} className='getFilesBtn'>get files</button>} */}
                    {userfiles.length !== 0 && <button onClick={() => setPage(prev => prev + 1)} className='nextPageBtn'><ArrowForwardIosIcon/> </button>}
                </div>}

  
                <Link to="/files">
                    <button className='usersFilesBtn'>all files</button>
                </Link>

                </div>}

                {openApproveModal && <FileDeleteApprove userfiles={userfiles} setUserFiles={setUserFiles} openApproveModal={openApproveModal} setOpenApproveModal={setOpenApproveModal} setIsApprovedToDelete={setIsApprovedToDelete} />}

            </div>


        {userfiles.length > 0 &&   (
          
          <table>

            <tr>
              <th>id</th>
              <th>Filename</th>
              <th>Filetype</th>
              <th>Actions</th>
            </tr>

            {userfiles && userfiles.map((file) => {
              return (
                
                <tr key={file?._id}>

                  <td className='tableData'>{file?._id}</td>
                  <td className='tableData'>{file?.filename}</td>
                  <td className='tableData'>{file?.type}</td>

                  <td className='tableData'>

                    <div className='actionBtns'>

                      <Link>
                        <button onClick={(e) => downloadFileById(e , file)} className='editUserBtn'>Download</button>
                      </Link>
                  
                      {/* <button onClick={(e) => deleteSpecificFile(e , file._id)} style={{border : "none" , cursor : "pointer"}}>
                        <DeleteOutlineIcon className='deleteUserBtn'/>
                      </button>
                       */}
                    
                      <Link to={`/fileApproveDeleteModal/${file._id}`} state={{from : "/usersFiles"}}>
                        <DeleteOutlineIcon className='deleteUserBtn'/>
                      </Link>
                  
                   
                    </div>
              
                  </td>

                </tr>

              )

            })}

          </table>

        )}

        {!userSelected && (
            <div style={{marginLeft :"20px" , fontSize : "40px" , fontWeight : "500" , color : "#427884"}}>Choose User to get files</div>
        )}

        {userSelected && userfiles.length === 0 && (
            <div style={{marginLeft :"20px" , fontSize : "40px" , fontWeight : "500" , color : "#427884"}}>No files for this User</div>            
        )}


      </div>
  )
}

export default UsersFiles 