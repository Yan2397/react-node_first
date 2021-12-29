const fs = require('fs')
const uniqid = require("uniqid")

class Model{

    static add(table, result){
        return new Promise((resolve, reject)=>{
            result.id = uniqid();
            let temp = []
            fs.readFile("./database/"+table+".json", "utf-8", (err,data)=>{
                if(err) throw err;
                if(!data){
                  temp.unshift(result)
                  fs.writeFile("./database/"+table+".json", JSON.stringify(temp), (err,res)=>{
                      console.log("DONE....");
                      resolve()
                  })
                }else{
                    data = JSON.parse(data)
                    data.unshift(result);
                    fs.writeFile("./database/"+table+".json", JSON.stringify(data), (err,res)=>{
                        console.log("DONE....");
                        resolve()
                    })
                }
            })
        })
        

    }

    static findAll(table){
        return new Promise((resolve, reject)=>{
            fs.readFile("./database/"+table+".json", "utf-8", (err,data)=>{
                if(err) reject(err)
                if(data){
                    resolve(JSON.parse(data))
                }else{
                    resolve([])
                }
            })
        })       
    }

    
    static find(table, fn, count=false){
        return new Promise((resolve, reject)=>{
            fs.readFile("./database/"+table+".json", "utf-8", (err,data)=>{
                if(err) reject(err)
                if(data.trim()){
                    data = JSON.parse(data);
                    let temp = data.filter(fn);
                   
                        resolve(temp)
                }else{
                    resolve([])
                }
            })
        }) 
    }


    static remove(table, id){
        return new Promise((resolve,reject)=>{
            Model.findAll(table)
            .then(r=>{
                if(r.length){
                    r = r.filter(a => a.id != id)
                    fs.writeFile("./database/"+table+".json", JSON.stringify(r), (err,res)=>{
                       resolve("DONE....");
                    })
                }
            })
        })
    }

    static update(table, id, changing){

        Model.findAll(table)
             .then(r=>{
                 let index = r.findIndex(elm => elm.id == id)
                    for(let key in changing){
                        if(key in r[index]){
                            r[index][key] = changing[key]

                        }else if(key == "photo"){
                            r[index].photo = changing.photo
                        }else if(key == "back"){
                            r[index].back = changing.back
                        }
                    }

                    fs.writeFile("./database/"+table+".json", JSON.stringify(r), (err,res)=>{
                        console.log("DONE....");
                    })

             })
    }


}

module.exports = Model;