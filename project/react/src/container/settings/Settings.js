import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { withRouter ,Link} from "react-router-dom"
import Swal from "sweetalert2";
import './settings.css'
import { Menu } from "../../component/Menu";
import { MY_LOG_PAS, MY_PROFILE } from "../../store/typeSaga";

function Settings(props){
    const regex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    const [login,setLogin]=useState("")
    const [pass,setPass]=useState("")

    const dispatch=useDispatch()

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

    const changeLog =()=>{

        if(login===""){

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'PLEASE FILL ALL FIELDS!!!!',
              })
            }else{
                let y=login.split("@");

                if(!login.match(regex)){
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Incorrect Email!!',
                        
                    })


                } else  if(y.length!==2){
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Incorrect Email!!',
                            
                        })

                    }else if(y[1].indexOf(".")!==y[1].lastIndexOf(".") || !y[1].includes(".")){
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: 'Incorrect Email!!',
                                })
                            }else {
                                        
                                        // dispatch(changeLogin(login))
                                        dispatch({
                                            type:MY_LOG_PAS,
                                            name:"changeLogin",
                                            text:login
                                        })
                                        setLogin('')
                                    }
            
            }

    }

    const changePassword=()=>{
        if(pass.length<6){
            setPass("")
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Password need to be at least 6 simbols!!',
                
            });

        }else{
            
            // dispatch(changePass(pass))
            dispatch({
                type:MY_LOG_PAS,
                name:"changePas",
                text:pass
            })

            setPass("")
            Swal.fire(
                'Good job!',
                'Your password has been successfuly  changed! Please login again!',
                'success'
            )
        }

    }



    return(<div>
    
        <Menu/>
        <div className="mainSetCont">
                <div className="setCont">
                            <div className="cont">
                                <input className="change" type="text" value={login} placeholder="New Login" onChange={(e)=>{setLogin(e.target.value)}}/>
                                <Link exact to={{pathname:"/"}} className='setBtn' onClick={()=>changeLog()}>Change login</Link>
                            </div>

                            <div className="cont">
                                <input className="change" type="password" value={pass} placeholder="New password" onChange={(e)=>{setPass(e.target.value)}}/>
                                <Link exact to={{pathname:"/"}}  className='setBtn' onClick={()=>changePassword()}>Change password</Link>
                            </div>
                            <Link className="backLink" exact to={{pathname:"/profile"}}>Back to profile</Link>
                </div>
        </div>
    </div>)
}

export default withRouter(Settings)