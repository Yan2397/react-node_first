import React from "react"; 
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";



export const Navbar=(props)=>{

    const friends=useSelector(state=>state.user.friends.users);
    const myPost=useSelector(st=>st.user.post)
    const photo=useSelector(state=>state.user.usPhoto);


    return(<div>
        <div className="tools">
            <div className="vertLine"></div>
                <NavLink  activeStyle={{background:"#045e5c",color:"#fff"}}  exact to={{pathname:"/profile/news"}}  className="toolsSpan">
                <img alt="show" src={"http://localhost:3000/img/news1.png"} width="30px" height="30px" style={{padding:"0 15px 0 0"}}/>   
                Timeline</NavLink>
            <div className="vertLine"></div>
                 <NavLink activeStyle={{background:"#045e5c",color:"#fff"}}  exact to={{pathname:"/profile/posts"}}  className="toolsSpan"><img alt="show" src={"http://localhost:3000/img/news.png"} width="30px" height="30px" style={{padding:"0 15px 0 0"}}/> My Posts({myPost.length})</NavLink>
                
            <div className="vertLine"></div>
                <NavLink activeStyle={{background:"#045e5c",color:"#fff"}}  exact to={{pathname:"/profile/friends"}} className="toolsSpan">
                <img alt="show" src={"http://localhost:3000/img/ifFr.png"} width="30px" height="30px" style={{padding:"0 15px 0 0"}}/>Friends  ( {friends.length} )</NavLink>
            <div className="vertLine"></div>
                <NavLink activeStyle={{background:"#045e5c",color:"#fff"}}  exact to={{pathname:"/profile/photos"}} className="toolsSpan"> <img alt="show" src={"http://localhost:3000/img/photo.png"} width="30px" height="30px" style={{padding:"0 15px 0 0"}}/>Photo ({photo.length}) </NavLink>
            <div className="vertLine"></div>
                <NavLink activeStyle={{background:"#045e5c",color:"#fff"}}  exact to={{pathname:"/profile/settings"}} className="toolsSpan s1">
                    <img alt="show" src={"http://localhost:3000/img/set.png"} width="30px" height="30px" style={{padding:"0 15px 0 0"}}/>
                        Settings 
                </NavLink>
            <div className="vertLine"></div>
         </div>
         
    </div>)

}