import { BrowserRouter, Route, Switch } from "react-router-dom";
import Profile from "../container/profile/Profile";
import Register from "../container/register/Register";
import Error from "../container/error/Error";
import UserInfo from "../container/usInfo/UserInfo";
import Settings from "../container/settings/Settings";
import { Friends } from "../container/friends/Friends";
import Photo from "../container/Photo/Photo";
import { Post } from "../container/Post/Post";
import News from "../container/news/News";
import UsInfoPhotos from "../container/usInfoPhotos/UsInfoPhotos";


export const Router = ()=>{


    return(<div>

        <BrowserRouter>
          

            <Switch>
                <Route exact path="/" component={Register}/>
                <Route exact path="/register" component={Register}/>
                <Route exact path="/profile" component={Profile}/>
                <Route exact path="/profile/settings" component={Settings}/>
                <Route exact path="/profile/guest" component={UserInfo}/>
                <Route exact path="/profile/friends" component={Friends}/>
                <Route exact path="/profile/photos" component={Photo}/>
                <Route exact path="/profile/posts" component={Post}/>
                <Route exact path="/profile/news" component={News}/>
                <Route exact path="/profile/guest/photos" component={UsInfoPhotos}/>
                <Route render={()=><Error></Error>}/>
            </Switch>
        
        </BrowserRouter>
    </div>)
}