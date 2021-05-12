

function updateFunction(event){
    let id = event.target.name;
    document.getElementById(`task-update-area-${id}`).toggleAttribute("hidden");
    
}

function deleteFunction(event){
    var result = confirm(`Sure to Delete This Task ?`);
    if (result) {
        return true;
    }
    return false;
}


