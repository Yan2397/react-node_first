const model = require("../model")
const uniqid = require("uniqid")
const bcrypt = require("bcrypt")
const Model = require("../model")

class FriendsController{
    static addFriend(req,res){
        Model.find("users", a=>a.token == req.body.token)
             .then(r=>{
                 if(!r.length){
                     res.send({error:"Token is not valid"})
                 }else{
                     r = r[0]
                     let currentUserId = r.id;
                     return model.add("friends", {user1:currentUserId, user2:req.body.id, id:uniqid(), status:0})
                 }
             })
             .then(r=>{
                res.send({status:"OK"})
             })
    }

    static getMyRequests(req,res){
        Model.find("users", a=>a.token == req.body.token)
             .then(r=>{
                 if(!r.length){
                    res.send({error:"Token is not valid"})
                 }else{
                     r = r[0];
                     return model.find("friends", elm=>elm.user2 == r.id && elm.status == 0)
                 }
             })
             .then(async (r)=>{
                 let temp = []
                    for(let i = 0; i < r.length; i++){
                        let obj = await model.find("users", elm=>elm.id == r[i].user1)
                        if(obj.length){
                            delete obj[0].token
                            delete obj[0].lastAccess
                            delete obj[0].password
                            delete obj[0].login
                            temp.push(obj[0])
                        }
                    }
                 res.send({users:temp})
             })
    }
    
    static getMyFriends(req,res){
        let myid=-1;
        
        Model.find("users", a=>a.token == req.body.token)
             .then(r=>{
                 if(!r.length){
                    res.send({error:"Token is not valid"})
                 }else{
                     r = r[0];
                     myid=r.id
                     return model.find("friends", elm=>(elm.user2 == myid || elm.user1==myid) && elm.status == 1)
                 }
             })
             .then(async (r)=>{
                 let temp = []
                    for(let i = 0; i < r.length; i++){
                        let key = r[i].user1==myid?"user2":"user1"
                        let obj = await model.find("users", elm=>elm.id == r[i][key]  )
                        if(obj.length){
                            delete obj[0].token
                            delete obj[0].lastAccess
                            delete obj[0].password
                            delete obj[0].login
                            if(obj[0].id!=myid){
                                temp.push(obj[0])
                            }
                        }
                    }
                 res.send({users:temp})
             })
    }

    static acceptRequest(req,res){
        Model.find("users", a=>a.token == req.body.token)
        .then(r=>{
            if(!r.length){
               res.send({error:"Token is not valid"})
            }else{
                let id = r[0].id
                return Model.find("friends", elm=>elm.user1 == req.body.id && elm.user2 == id && elm.status == 0)
            }
        })
        .then(r=>{
            if(!r.length){
                res.send({error:"no such request"})
            }else{
             r = r[0];
              return Model.update("friends", r.id, {status:1})
            }
        })
        .then(r=>{
            res.send({success:"OK"})
        })
    }


    static declineRequest(req,res){
        Model.find("users", a=>a.token == req.body.token)
        .then(r=>{
            if(!r.length){
               res.send({error:"Token is not valid"})
            }else{
                let id = r[0].id
                return Model.find("friends", elm=>elm.user1 == req.body.id && elm.user2 == id && elm.status == 0)
            }
        })
        .then(r=>{
            if(!r.length){
               res.send({error:"no such request"})
            }else{
             r = r[0];
              return Model.remove("friends", r.id)
            }
        })
        .then(r=>{
            res.send({success:"OK"})
        })
    }

    static cancelRequest(req,res){
        Model.find("users", a=>a.token == req.body.token)
        .then(r=>{
            if(!r.length){
               res.send({error:"Token is not valid"})
            }else{
                let id = r[0].id
                return Model.find("friends", elm=>elm.user1 == id && elm.user2 == req.body.id && elm.status == 0)
            }
        })
        .then(r=>{
            if(!r.length){
               res.send({error:"no such request"})
            }else{
             r = r[0];
              return Model.remove("friends", r.id)
            }
        })
        .then(r=>{
            res.send({success:"OK"})
        })
    }

    static unfriend(req,res){
        Model.find("users", a=>a.token == req.body.token)
        .then(r=>{
            if(!r.length){
               res.send({error:"Token is not valid"})
            }else{
                let id = r[0].id
                return Model.find("friends", elm=>((elm.user1 == id && elm.user2 == req.body.id) || (elm.user2 == id && elm.user1 == req.body.id)) && elm.status == 1)
            }
        })
        .then(r=>{
            if(!r.length){
               res.send({error:"no such request"})
            }else{
             r = r[0];
              return Model.remove("friends", r.id)
            }
        })
        .then(r=>{
            res.send({success:"OK"})
        })
    }
}

module.exports = FriendsController