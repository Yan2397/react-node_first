import React from "react"; 
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import '../profile/profile.css'
import { useState } from "react";
import {Navbar} from "../../component/Navbar"
import {Menu} from "../../component/Menu"
import { MY_PHOTO, MY_PROFILE } from "../../store/typeSaga";
import Cropper from "react-easy-crop"
import  Slider  from "@material-ui/core/Slider"
import  Button  from "@material-ui/core/Button";
import getCroppedImg from "../../getCroppedImage";
import { dataURLtoFile } from "../../dataURLtoFile";


export const Post=(props)=>{
    const info =useSelector(state=>state.user.profile);
    // const friends=useSelector(state=>state.user.friends);
    // const photo=useSelector(state=>state.user.usPhoto);
    const post = useSelector(state=>state.user.post);
    const [postText,setPostText]=useState("");
    const dispatch=useDispatch();



    const [image,setImage]=useState(null)
    const [backImage,setBackImage]=useState(null)
    const [croppedArea,setCroppedArea]=useState(null)
    const [crop,setCrop]=useState({x:0,y:0})
    const [zoom,setZoom]=useState(1);



    useEffect(()=>{
        if(localStorage.us){
            dispatch({
                type:MY_PROFILE
            });

        }else{
            props.history.push({pathname:"/"})
        }
    },[])

    // useEffect(()=>{
    //     if(localStorage.us){
    //         dispatch(getUserByToken(props.history))
    //     }else{
    //         props.history.push({pathname:"/"})
    //     }
    // },[])
  
  
  
  
    const onCropComplete=(croppedAreaPercentage,croppedAreaPixels)=>{
        setCroppedArea(croppedAreaPixels)
    };

      const  onSelectFile=(event)=>{
        if(event.target.files && event.target.files.length>0){
          const reader=new FileReader();
          reader.readAsDataURL(event.target.files[0]);
          reader.addEventListener("load",()=>{
            setImage(reader.result)
           
          })
        }
    }
  
    const  onSelectBackFile=(event)=>{
          if(event.target.files && event.target.files.length>0){
            const reader=new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.addEventListener("load",()=>{
              setBackImage(reader.result)
              
            })
          }
    }
  
    const changeProfPhoto=async()=>{
  
          if(image){
              const canvas= await getCroppedImg(image,croppedArea)
              const canvasDataUrl=canvas.toDataURL("image/jpeg")
              const convertedUrlToFile=dataURLtoFile(canvasDataUrl,"cropped-image.jpeg")
  
              let form=new FormData();
              form.append("avatar",convertedUrlToFile);
              form.append("token",localStorage.us);
              console.log("form" , form)
              // dispatch(uploadPic(form,props.history))
              dispatch({
                  name:"uploadAvatar",
                  obj:form,
                  type:MY_PHOTO
              })
              // e.target.files=null
              setImage(null)
          }
         
  
    }
  
    const changeProfBackPhoto= async()=>{
          if(backImage){
              const canvas= await getCroppedImg(backImage,croppedArea)
              const canvasDataUrl=canvas.toDataURL("image/jpeg")
              const convertedUrlToFile=dataURLtoFile(canvasDataUrl,"cropped-image.jpeg")
              let form=new FormData()
              form.append("back",convertedUrlToFile);
              form.append("token",localStorage.us);
              // dispatch(uploadBackPic(form,props.history));
              dispatch({
                  name:"uploadBack",
                  obj:form,
                  type:MY_PHOTO
              })
              // e.target.files=null
              setBackImage(null)
          }
          
    }

    const addingPost=(e)=>{
        if(e.target.files.length){
            let form = new FormData()
            form.append("avatar",e.target.files[0]);
            form.append("token",localStorage.us);
            form.append("text",postText);
            // dispatch(addPost(form,props.history))
            dispatch({
                type:MY_PHOTO,
                obj:form,
                name:"addPost",
                history:props.history
            })
            e.target.files=null;
            setPostText("");
            // dispatch(getMyPost(props.history));
            let x=document.getElementById("toggleInp");
            x.classList.toggle("showInp");
        }

    }

    const openToggle=()=>{
        let x=document.getElementById("toggleInp");
        x.classList.toggle("showInp");

    }

    const closeToggle=()=>{
        let x=document.getElementById("toggleInp");
            x.classList.toggle("showInp");
    }


    return(<div>
        <Menu/>
                <main className="main">
                    <div className="bgdImg" style={{backgroundImage:"url(http://localhost:5000/photos/"+info.back}}></div>
                        <div className="usInfoCont">
                            <div className="photoCont">
                                <img alt="show" className="userPhoto" src={info.photo?"http://localhost:5000/photos/"+info.photo:"http://localhost:3000/img/user.png"}/>
                                <span className="usInfo">{info.name} {info.surname}</span>
                            </div>

                            <div className="profBtnCont">
                            <button  className="usInfBtn" style={{position:"relative"}}>
                            <input type="file" onChange={onSelectFile} style={{width:"100%", height:"100%", position:"absolute", left:0, top:0, opacity:0}}/>
                                Change Profile Photo</button>
                                <button style={{position:"relative"}} className="usInfBtn">
                                    <input  type="file" style={{width:"100%", height:"100%", position:"absolute", left:0, top:0,opacity:0}} onChange={onSelectBackFile}/>
                                        Change Background Photo </button>
                            </div>

                            <div style={image?{display:'block'}:{display:"none"}} className="container">

<div className="container-cropper">
      <div className="cropper">
            <Cropper 
            image={image} 
            crop={crop} 
            zoom={zoom} 
            aspect={1} 
            onCropChange={setCrop} 
            onZoomChange={setZoom} 
            onCropComplete={onCropComplete}/>
     </div>

     <div className="slider">
        <Slider
        min={1}
        max={2}
        step={0.01}
        value={zoom} 
        onChange={(e,zoom)=>setZoom(zoom)}/>
    </div>
</div >


<div className="container-button" >
<Button style={{marginRight:"20px"}} variant="contained" color="primary" onClick={()=>changeProfPhoto()}>Upload Photo</Button>
    <Button variant="contained"  color="secondary" onClick={()=>setImage(null)}>Cancel</Button>
</div>

</div>


<div style={backImage?{display:'block'}:{display:"none"}} className="container">

<div className="container-cropper">
      <div className="cropper">
            <Cropper 
            image={backImage} 
            crop={crop} 
            zoom={zoom} 
            aspect={4} 
            onCropChange={setCrop} 
            onZoomChange={setZoom} 
            onCropComplete={onCropComplete}/>
     </div>

     <div className="slider">
        <Slider
        min={1}
        max={2}
        step={0.01}
        value={zoom} 
        onChange={(e,zoom)=>setZoom(zoom)}/>
    </div>
</div >


<div className="container-button" >
    <Button style={{marginRight:"20px"}} variant="contained" color="primary" onClick={()=>changeProfBackPhoto()}>Upload Photo</Button>
    <Button variant="contained"  color="secondary" onClick={()=>setBackImage(null)}>Cancel</Button>
</div>

</div>
                        </div>

                            <Navbar/>

                            <div className="shareBtnCont">
                                <button onClick={()=>openToggle()}  className="usInfBtn ">Share something...</button>
                            </div>

                                 <div id="toggleInp" className="postInpCont">

                                     <textarea placeholder='Type discription' value={postText} type="text" className="postInput" onChange={(e)=>setPostText(e.target.value)}></textarea>

                                        <div className="buttonsCont">
                                             <button className="usInfBtn btn1" style={{position:"relative"}} onClick={()=>{}}>
                                            <input onChange={(event)=>addingPost(event)} id="uploadPost"  style={{width:"100%", height:"100%", position:"absolute", left:0, top:0, opacity:0}} type="file"/>
                                            Choose Photo For Share <img alt="show" src={"http://localhost:3000/img/share.png"} width="25px" height="25px"/></button>

                                             <button className="btn2" onClick={()=>closeToggle()}>Cancel</button>

                                        </div>
                                 </div>

                                 <div style={!post.length?{display:"none"}: {display:"flex"}} className="mainPostCont">
                                     {post?.map((e,i)=>{
                                         return(<div key={e.id} className="singlPost">
                                             <div className="postInfo">
                                                 <div>
                                                        <img alt="show" src={"http://localhost:5000/photos/"+info.photo} width="50px" height="50px" style={{borderRadius:'50%',margin:"0 10px"}}/>
                                                        <span className="postText">{info.name} {info.surname}</span>
                                                    <span className="p1p"><img src={"http://localhost:3000/img/rup.png" } width="30px" height="30px" alt="show"/> {e.text} </span>

                                                 </div>

                                             <div style={{display:"flex",justifyContent:"flex-end",alignItems:'center'}}>
                                                 {/* <span className="postText">Likes {e.likes.length}</span> */}
                                                {/* <img alt="show" 
                                                className="likePost" src={e.likes.length?"http://localhost:3000/img/like.png":"http://localhost:3000/img/unlike.png"} width="30px" height="30px"/> */}

                                                 <img alt="show" className="delPost" 
                                                //  onClick={()=>dispatch(removePost(e.id))} 
                                                onClick={()=>dispatch({
                                                    type:MY_PHOTO,
                                                    name:"deletePost",
                                                    id:e.id
                                                })}
                                                 src={"http://localhost:3000/img/trash1.png"} width="30px" height="30px"/>
                                             </div>
                                            </div>    

                                             <img alt="show" src={"http://localhost:5000/photos/"+e.photo} width="100%" style={{borderRadius:"10px"}}/>

                                             <div style={{display:"flex",justifyContent:"flex-end",alignItems:'center'}}>
                                                <span className="postText">Likes {e.likes.length}</span>

                                             </div>
                                         </div>)
                                     })}
                                 </div>
                </main>
    </div>)
}