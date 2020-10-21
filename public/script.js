document.addEventListener("click", function(e) {
    //delete feature
    if(e.target.classList.contains("delete-me")) {
        axios.post("/delete", {id: e.target.getAttribute("data-id")}).then(function() {
            e.target.parentElement.parentElement.remove()
        }).catch(function() {
            console.log("Something went wrong while deleting")
        })
    }
    //Update feature
    if(e.target.classList.contains("edit-me")) {
        e.target.parentElement.querySelector(".edit-me").innerHTML = "Save"
        e.target.parentElement.parentElement.getElementsByClassName("text-input")[0].setAttribute("type","text")
        //let userInput = prompt("Enter new value")
        let userInput = e.target.parentElement.parentElement.getElementsByClassName("text-input")[0].value
        console.log(userInput)
        if(userInput) {
            axios.post("/update", {text: userInput, id: e.target.getAttribute("data-id")}).then(function() {
                //this is execute the func
                e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput
                e.target.parentElement.querySelector(".edit-me").innerHTML = "Edit"
                e.target.parentElement.parentElement.getElementsByClassName("text-input")[0].setAttribute("type","hidden")
                e.target.parentElement.parentElement.getElementsByClassName("text-input")[0].value = ""
            }).catch(function() {
                //This is to catch errors
                console.log("Something went wrong!!")
            })
        }
    }
})