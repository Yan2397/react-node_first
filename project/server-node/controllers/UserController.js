const model = require("../model")
const uniqid = require("uniqid")
const bcrypt = require("bcrypt")
const Model = require("../model")

class UserController{
    static signup(req, res){

        model.find("users", elm => elm.login == req.body.login)
             .then(r=>{
                if(r.length > 0){
                    return res.send({error:"Sorry but the login is busy. Try with another one..."})
                }else{
                    bcrypt.hash(req.body.password,10, (err,result)=>{
                        req.body.password = result;
                        req.body.token = uniqid();
                        req.body.lastAccess = 0
                        model.add("users", req.body)
                        res.send({status:"OK"})
                    })
                    
                }
             })
             .catch((err)=>{
                 res.send({error:"some internal server error occured."})
             })
       
    }

    static search(req,res){
        let currentId=-1;
        model.find("users", a => a.token == req.body.token)
             .then(r=>{
                 if(!r.length){
                     res.send({error:"token is not valid"})
                 }else{
                     currentId = r[0].id
                     return model.findAll("users")
                 }
             })
             .then(async(r)=>{
                 let temp = r.filter(a =>(a.name.toLowerCase().startsWith(req.body.text.toLowerCase())))
                 for(let i = 0; i < temp.length; i++){
                     let item = temp[i];
                     delete item.login
                     delete item.token
                     delete item.password
                     delete item.lastAccess

                    let areWeFriends = await model.find("friends", elm => ((elm.user1 == currentId && elm.user2 == item.id) || (elm.user2 == currentId && elm.user1 == item.id)) && elm.status == 1, true);
                    
                    let isRequestSent =  await model.find("friends", elm => elm.user1 == currentId && elm.user2 == item.id && elm.status == 0, true);
                     item.areWeFriends = areWeFriends.length >0
                     item.isRequestSent = isRequestSent.length > 0
                 }
                
                 res.send({users:temp})
             })
    }

    static login(req,res){
        model.find("users", a => a.login == req.body.login)
             .then(r=>{
                 if(r.length){
                    r = r[0]
                    bcrypt.compare(req.body.password, r.password, (err, result)=>{
                        if(!result){
                            res.send({error:"the password is wrong"})
                        }else{
                            Model.update("users", r.id, {lastAccess:Date.now()/1000})
                            res.send({token:r.token})
                        }
                    })
                 }else{
                     res.send({error:"The login is wrong"})
                 }
             })
    }
    

    static updateLogin(req,res){
        let id;
        Model.find("users", a=>a.token == req.body.token)
        .then(r=>{
            if(!r.length){
               res.send({error:"Token is not valid"})
            }else{
                 id = r[0].id
                return Model.find("users", elm => elm.login == req.body.text)
            }
        })
        .then(r=>{
            if(r.length > 0){
                return res.send({error:"Login is busy..."})
            }
            return Model.update("users", id, {login:req.body.text} )
        })
        .then(r=>{
            return res.send({status:"OK"})
        })
    }


    static updatePassword(req,res){
        let id;

        if(req.body.text.length < 6){
            return res.send({error:"Password length is too short.."})
        }
        if(req.body.text.split("").every(a => a.toUpperCase() != a)){
            return res.send({error: "One letter should be uppercase" })
        }
        
        

        Model.find("users", a=>a.token == req.body.token)
        .then(r=>{
            if(!r.length){
               res.send({error:"Token is not valid"})
            }else{
                 id = r[0].id
                return Model.find("users", elm => elm.id == id)
            }
        })
        
        .then(r=>{
            if(r.length > 0){
                r = r[0];
                bcrypt.hash(req.body.text, 10, (err,data)=>{
                    if(err){
                        return res.send({error:"something went wrong..."})
                    }
                    return Model.update("users", r.id, {password:data})
                })
            }
        })
        .then(r=>{
            return res.send({status:"OK"})
        })
    }

    
    
    static getUserByToken(req,res){
      let newToken = uniqid();
      let now = Date.now()/1000;
      let user = {}
      Model.find("users", a=>a.token == req.body.token)
           .then(r=>{
               if(!r.length){
                   res.send({error:"No user with such token..."})
               }else{
                   r = r[0];
                   let time = r.lastAccess
                   console.log(now-time)
                   if(now-time != now && now-time>500000000){
                       res.send({error:"session time out"})
                   }else{
                       user = r;
                       user.token = newToken
                       user.lastAccess = Date.now()/1000
                       return model.update("users", r.id, {token:newToken, lastAccess:user.lastAccess})

                   }
               }
           })
           .then(r=>{
                res.send(user);
           })

    }
}

module.exports = UserController