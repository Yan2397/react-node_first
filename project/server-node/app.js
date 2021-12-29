const express = require('express');
const app = express()
const server = require('http').createServer(app);
const uniqid = require("uniqid")

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const fs = require('fs')
const UserController = require("./controllers/UserController")
const FriendsController = require("./controllers/FriendsController")
const SocketController = require("./controllers/SocketController")

const bodyParser = require('body-parser');
const Model = require('./model');
app.use(bodyParser.urlencoded({
  extended: false
}))
// parse application/json
app.use(bodyParser.json())
app.use(express.static("public"))

var multer = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/photos/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + ".jpg")
  }
});


var upload = multer({
  storage: storage
})

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

let sock = new SocketController(io);

app.get("/", (req, res) => {
  fs.readFile("./index.html", "utf-8", (err, data) => {
    res.send(data)
  })
})

app.get("/show/:table", (req, res) => {
  Model.findAll(req.params.table)
    .then(r => {
      let elm = "<table style='width:100%;border-collapse:collapse' border='1'>"

      if (r.length) {
        let keys = Object.keys(r[0])
        elm += "<tr>"
        keys.forEach((a) => elm += `<th>${a}</th>`)
        elm += "</tr>"
      } else {
        return res.send("EMPTY")
      }
      r.forEach(item => {
        elm += "<tr>"
        for (let key in item) {
          elm += `<td>${item[key]}</td>`
        }
        elm += "</tr>"
      })
      elm += "</table>"


      res.send(elm)
    })
})

app.post("/signup", (req, res) => UserController.signup(req, res));
app.post("/login", (req, res) => UserController.login(req, res));
app.post("/getUserByToken", (req, res) => UserController.getUserByToken(req, res));
app.post("/search", (req, res) => UserController.search(req, res));
app.post("/updateLogin", (req, res) => UserController.updateLogin(req, res))
app.post("/updatePassword", (req, res) => UserController.updatePassword(req, res))

app.post("/addFriend", (req, res) => FriendsController.addFriend(req, res))
app.post("/getMyRequests", (req, res) => FriendsController.getMyRequests(req, res))
app.post("/getMyFriends", (req, res) => FriendsController.getMyFriends(req, res))
app.post("/acceptRequest", (req, res) => FriendsController.acceptRequest(req, res))
app.post("/declineRequest", (req, res) => FriendsController.declineRequest(req, res))
app.post("/cancelRequest", (req, res) => FriendsController.cancelRequest(req, res))
app.post("/unfriend", (req, res) => FriendsController.unfriend(req, res))

app.post('/uploadPic', upload.single('avatar'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  if (req.file) {
    Model.find("users", a => a.token == req.body.token)
      .then(r => {
        if (r.length) {
          r = r[0]
          console.log(req.file)
          return Model.update("users", r.id, {
            photo: req.file.filename
          })
        }
      })
      .then(r => {
        res.send({
          success: "OK"
        })
      })

  } else {
    res.send({
      error: "Can't upload file"
    })
  }

})


//gluxgorcoci skizb

app.post('/addBackPhoto', upload.single("back"), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  if (req.file) {
    Model.find("users", a => a.token == req.body.token)
      .then(r => {
        if (r.length) {
          r = r[0]
          console.log(req.file)
          return Model.update("users", r.id, {
            back: req.file.filename
          })
        }
      })
      .then(r => {
        res.send({
          success: "EKAV"
        })
      })

  } else {
    res.send({
      error: "Can't upload file"
    })
  }

})


//gluxgorcoci avart






app.post('/addPost', upload.single('avatar'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  if (req.file) {
    Model.find("users", a => a.token == req.body.token)
      .then(r => {
        if (r.length) {
          r = r[0]
          console.log(req.file)
          return Model.add("posts", {
            id: uniqid(),
            text: req.body.text,
            user: r.id,
            photo: req.file.filename
          })
        }
      })
      .then(r => {
        res.send({
          success: "OK"
        })

      })

  } else {
    res.send({
      error: "Can't upload file"
    })
  }


})

app.post("/getMyPosts", (req, res) => {
  Model.find("users", y => y.token == req.body.token)
    .then(r => {
      if (r) {
        r = r[0]
        return Model.find("posts", elm => elm.user == r.id)
      }
    })
    .then(async (r) => {

      for (let i = 0; i < r.length; i++) {
        r[i].likes = await Model.find("likes", elm => elm.post_id == r[i].id)
      }
      res.send(r);
    })
})

app.post("/removePost", (req, res) => {
  Model.find("users", elm => elm.token == req.body.token)
    .then(r => {
      if (r) {
        r = r[0]
        return Model.remove("posts", req.body.post_id)
      } else {
        res.send({
          error: "TOKEN IS NOT MATCH!"
        })
      }
    })
    .then(r => {
      res.send({
        status: "ok"
      })
    })
})

app.post("/like", (req, res) => {
  //token; post_id
  let user = -1;
  Model.find("users", elm => elm.token == req.body.token)
    .then(r => {
      if (r) {
        r = r[0];
        user = r.id;
        return Model.find("likes", elm => elm.user_id == r.id && elm.post_id == req.body.post_id)
      }
    })
    .then(async (r) => {
      if (r.length) {
        //already liked
        r = r[0]
        console.log("LIKED", r)
        return Model.remove("likes", r.id)
      } else {
        let acc = await Model.find("users", elm => elm.id == user)
        return Model.add("likes", {
          id: uniqid(),
          user_id: user,
          user: acc,
          post_id: req.body.post_id
        })

      }
    })
    .then(r => {
      res.send({
        status: "OK"
      })
    })
})

app.post("/getFriendsPosts", (req, res) => {
  let myid = -1;
  Model.find("users", a => a.token == req.body.token)
    .then(r => {
      if (!r.length) {
        res.send({
          error: "Token is not valid"
        })
      } else {
        r = r[0];
        myid = r.id
        return Model.find("friends", elm => (elm.user2 == myid || elm.user1 == myid) && elm.status == 1)
      }
    })
    .then((r) => {
      let temp = []
      for (let i = 0; i < r.length; i++) {
        let key = r[i].user1 == myid ? "user2" : "user1"
        temp.push(r[i][key])
      }

      return Model.find("posts", elm => temp.includes(elm.user))


    })
    .then(async (r) => {
      for (let i = 0; i < r.length; i++) {
        // console.log(r[i])
        let isLiked = await Model.find("likes", elm => elm.post_id == r[i].id)
        r[i].isLiked = isLiked.length > 0
        let account = await Model.find('users', elm => elm.id == r[i].user)
        r[i].account = account.length ? {
          name: account[0].name,
          surname: account[0].surname
        } : null

        r[i].likes = await Model.find("likes", elm => elm.post_id == r[i].id)
      }

      return res.send(r)
    })
})

// ------------------
app.post("/addPhoto", upload.single("avatar"), (req, res) => {
  Model.find("users", elm => elm.token == req.body.token)
    .then(r => {
      if (r.length) {
        r = r[0]
        return Model.add("photos", {
          id: uniqid(),
          privacy: 0,
          photo: req.file.filename,
          text: req.body.text,
          user: r.id
        })

      }
    }).then(r => {
      res.send({
        status: "OK"
      })
    })
})






app.post("/getMyPhotos", (req, res) => {
  Model.find("users", elm => elm.token == req.body.token)
    .then(r => {
      if (r.length) {
        r = r[0]
        return Model.find("photos", elm => elm.user == r.id, false)

      }
    })
    .then(r => {
      res.send(r)
    })
})

app.post("/changePhotoStatus", (req, res) => {
  Model.find("users", elm => elm.token == req.body.token)
    .then(r => {
      r = r[0]
      return Model.find("photos", elm => elm.user == r.id && elm.id == req.body.id)
    })
    .then(r => {
      if (r) {
        return Model.update("photos", r[0].id, {
          privacy: req.body.privacy
        })
      }
    })
    .then(r => {
      res.send({
        status: 'ok'
      })
    })
})



app.post("/getUserById", (req, res) => {
  Model.find("users", elm => (elm.token == req.body.token))
    .then((a) => {
      if (a) {
        Model.find("users", elm => (elm.id == req.body.id))
          .then(async (r) => {
            let obj = {
              name: r[0].name,
              id: r[0].id,
              surname: r[0].surname,
              photo: r[0].photo,
              back: r[0].back
            };

            obj.posts = await Model.find("posts", elm => elm.user == r[0].id)
            obj.album = await Model.find("photos", elm => elm.user == r[0].id)
            let areWeFriends = await Model.find("friends", elm => ((elm.user1 == r[0].id && elm.user2 == a[0].id) || (elm.user2 == r[0].id && elm.user1 == a[0].id)) && elm.status == 1, true);

            let isRequestSent = await Model.find("friends", elm => elm.user1 == a[0].id && elm.user2 == r[0].id && elm.status == 0, true);

            obj.areWeFriends = areWeFriends.length > 0
            obj.isRequestSent = isRequestSent.length > 0
            return res.send(obj)
          })
      }
    })
})

server.listen(5000);