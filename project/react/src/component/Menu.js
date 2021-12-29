import React from "react"; 
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useState } from "react";
import { MY_FRIENDS, MY_FUN } from "../store/typeSaga";




export const Menu =()=>{
    const info =useSelector(state=>state.user.profile);
    const searchMatch=useSelector(state=>state.user.users.users)
    const frReqToMe=useSelector(state=>state.user.reqToMe.users)
    const dispatch=useDispatch();
    const [search,setSearch]=useState("")
    const [tog,setTog]=useState(false)


    const logOut=()=>{
        delete localStorage.us
    }

    const showUser=(e)=>{
        // dispatch(getUser(e))
        dispatch({
            type:MY_FUN,
            name:"usById",
            id:e,
        })
        setSearch("")
    }

    const friendRequest=(e)=>{
        dispatch({
            type:MY_FRIENDS,
            id:e,
            name:"addFriend",
            text:search
        })
    }

    const cancelingFriend=(e)=>{
        dispatch({
            type:MY_FRIENDS,
            id:e,
            name:"cancelRequest",
            text:search
        })
    }

    const unFriend=(e)=>{
        // dispatch(deleteFriend(e, search))
        dispatch({
            type:MY_FRIENDS,
            id:e,
            name:"unfriend",
            text:search
        })
    }

    const acceptFriend=(e)=>{
        dispatch({
            type:MY_FRIENDS,
            name:"acceptRequest",
            id:e,
            text:search,
        })
        
    }

    const rejectFriend=(e)=>{
        dispatch({
            type:MY_FRIENDS,
            name:"declineRequest",
            id:e,
            text:search,
        })
    }


    return(<header className="header">
    <nav className='nav'>
        <div className="navLogoInput">
        <Link exact to={{pathname:"/profile/news"}}><img alt="show" className="logo" src={"http://localhost:3000/img/q.png"} width='130px' height="70px"/></Link>

        <div className="input-match">
            <div className="inpCont">
                <input placeholder="Type for searching..." className="searchInp" value={search} onChange={(e)=>{
                setSearch(e.target.value)
                // dispatch(searchUser(search))
                dispatch({
                    type:MY_FUN,
                    name:"search",
                    text:e.target.value,
                })
                }}></input>
            </div>
        
            <div className="liDiv">

                {searchMatch?.map((e,i)=>{
                        return(
                        <ul style={search!==''?{display:"block"}:{display:"none"}} className="ul">
                            
                            <li key={i}><Link className="searchLink" exact to={e.id===info.id?{pathname:"/profile/news"}:{pathname:"/profile/guest", state:e.id}}><img style={{borderRadius:"50%"}} alt="show" src={"http://localhost:5000/photos/"+e.photo} width="40px" height="40px"/><span onClick={()=>showUser(e.id)}>{e.name} {e.surname}</span>
                                 </Link>

                                 <div className="barDiv">
                                    <span style={e.id===info.id?{display:'none'}:{display:"inline-block"}} className="barer">{e.areWeFriends?"Friend":e.isRequestSent?"Requested":"Add Friend"}</span>
                                    <img alt="show" className="friends" width="35px" height="35px" style={e.id===info.id?{display:'none'}:{display:"inline-block"}} 
                            
                                     src={e.isRequestSent?
                                    "http://localhost:3000/img/requested.png":
                                     e.areWeFriends?"http://localhost:3000/img/ifFr.png":
                                    "http://localhost:3000/img/fR1.png"} onClick={()=>  {e.areWeFriends?
                                    unFriend(e.id):
                                    !e.isRequestSent?friendRequest(e.id):cancelingFriend(e.id)}}/>

                                 </div>
                            
                            </li>

                    </ul>)
                   })}
                </div>
            
            </div>

                
        </div>
        <div>
            
        </div>

        <div className="logOutform">
            <div className="headLogCont">

                <Link  exact to={{pathname:"/profile/news"}}>
                <div className="esim">
                     <img alt="show" className="headLogs hd1" src={info.photo?"http://localhost:5000/photos/"+info.photo:"http://localhost:3000/img/user.png"} width="40px" height="40px"/> 
                     <span className="profSpan"  style={{color:"#fff"}}> {info.name}</span>
                </div>
                </Link>

                   
                   <div>
                        <div className="relDiv" onClick={()=>setTog(!tog)}>
                                <img alt="show" className="headLogs" src={"http://localhost:3000/img/headfr.png"} width="30px" height="30px"/><div className="notCircle" style={frReqToMe.length!==0?{display:'inline-block'}:{display:"none"}}>{frReqToMe.length}</div>
                        </div>
                        
                        <div style={frReqToMe.length===0?{display:"none"}:{}} id="myPopup" className={tog?"popuptext show":"popuptext"}>
                            <span className="frLength">{frReqToMe.length} Friend requests</span>
                            <div id="z">
                            {frReqToMe?.map((e,i)=>{
                                return(<div id='d1' key={i}>
                                    <div className="verjapes">

                                            <div className="ara">
                                                <Link onClick={()=>showUser(e.id)} className="frLink" exact to={e.id===info.id?{pathname:"/profile/news"}:{pathname:"/profile/guest", state:e.id}} ><img style={{borderRadius:"50%"}} alt="show" src={"http://localhost:5000/photos/"+e.photo}  width="40px" height="40px"/>{e.name} {e.surname}</Link>
                                            </div>


                                            <div className="ara">
                                                <img alt="show" src={"http://localhost:3000/img/accept.png"} width="25px" height="25px" onClick={()=>acceptFriend(e.id)}/>


                                                <img alt="show" src={"http://localhost:3000/img/reject.png"}width="27px" height="27px" onClick={()=>rejectFriend(e.id)}/>

                                            </div>
                                    </div>       
                                </div>)
                                
                            })}
                            </div>
                        </div>
                        

                   </div>

                   <div className="relDiv">
                        <img alt="show" className="headLogs" src={"http://localhost:3000/img/headmes.png"} width="25px" height="25px"/><div className="notCircle">3</div>

                   </div>

                   <div className="relDiv">
                        <img alt="show" className="headLogs" src={"http://localhost:3000/img/headbell.png"}  width="25px" height="25px"></img><div className="notCircle">1</div>

                   </div>

            </div>
            <div>

                <p className="out" ><Link className="out" exact to={{pathname:"/"}} onClick={()=>logOut()}>Log Out</Link></p>
            </div>
        </div>
        
    </nav>
</header>)
}