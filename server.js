let express = require("express")
let mongodb = require("mongodb")

let app = express()
let db

app.use(express.static('public'));
var port = process.env.port || 3000;

let connectionString = 'mongodb+srv://pradamit:pradamit@cluster1-2nlkc.mongodb.net/test?retryWrites=true&w=majority'
mongodb.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
    db = client.db()
    app.listen(port)
})

app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.get("/", function(req, res) {
    db.collection("todoApp").find().toArray(function(err, item) {
        res.send(`
    <!doctype html>
<html lang="en">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
        integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">

    <title>To Do App</title>
</head>

<body>
    <div class="container mx-auto">
        <h1>To do App</h1>
        <br>
        <form action="/create" method="POST">
            <div class="form-group">
                <input type="text" name="itemAdd" class="form-control" id="formGroupExampleInput"
                    placeholder="Enter the item">
            </div>
            <button type="submit" class="btn btn-primary">Add</button>
        </form>
    </div>
    <br><br>
    <div class="container mx-auto">
        <ul class="list-group pb-5">
            ${item.map(function(item) {
                return `
            <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
                <span class="item-text">${item.text}</span><br>
                <input type="hidden" class="form-control text-input"><br>
                <div>
                    <button data-id="${item._id}" type="button" class="btn btn-primary btn-sm mr-1 edit-me">Edit</button>
                    <button data-id="${item._id}" type="button" class="btn btn-secondary btn-sm mr-1 delete-me">Delete</button>
                </div>
            </li>`
            }).join('')}
        </ul>
    </div>
    <!-- Optional JavaScript -->
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <script src="/script.js"><script>
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"
        integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj"
        crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"
        integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN"
        crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"
        integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV"
        crossorigin="anonymous"></script>
</body>

</html>
    `)
})
    })

app.post("/create", function(req, res) {
    let itemToAdd = req.body.itemAdd
    db.collection("todoApp").insertOne({text: itemToAdd}, function() {
        res.redirect("/")
    })
})

app.post('/update', (req, res) => {
    let userInput = req.body.text
    db.collection('todoApp').findOneAndUpdate({_id: new mongodb.ObjectId(req.body.id)}, {$set: {text: userInput}}, function() {
        res.send("Success");
    })
    console.log(userInput)
});

app.post('/delete', (req, res) => {
    db.collection('todoApp').deleteOne({_id: new mongodb.ObjectId(req.body.id)}, function() {
        res.send("Success");
    })
});