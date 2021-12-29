const Model = require("../model")
const uniqid = require("uniqid")

class SocketController{
    constructor(io){
        this.io = io;
        this.io.on("connection", (socket)=>{
            this.socket = socket;
            socket.on("joined", (data)=> this.joined(data))
            socket.on("newMessage", (data)=> this.newMessage(data))
            socket.on("startConversation", (data)=>this.getMessages(data))
        })
    }
    
    joined(data){
        console.log("joined", data)
        this.socket.join(data.id)
        this.socket.emit("START", {text:"YOU ARE ONLINE"})
    }
    
    newMessage(data){
        Model.add("messenger", {...data, status:0, time:Date.now(), id:uniqid()})
             .then(r=>{
                 this.getMessages({me:data.from, with:data.to})
             })
    }
    getMessages(data){
        Model.find("messenger", a=> (a.from == data.me && a.to == data.with) || (a.to == data.me && a.from == data.with) )
             .then(r=>{
                 console.log(r)
                //  this.io.emit("newMessages", r)
                 this.io.local.emit("newMessages", r)
                this.socket.broadcast.emit("newMessages", r);
                //  this.socket.broadcast.to(data.with).emit("newMessages", r)
             })
    }
}

module.exports = SocketController