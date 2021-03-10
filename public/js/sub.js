function sub(event, form) {
    event.preventDefault()
    var titulo = document.getElementById('titulo').value
    if (titulo == undefined) {
        alert("Titulo não pode ficar vazio, preencha por favor!")
        return false
    }
    button= document.getElementById('buttom').setAttribute("disabled", "disabled");
    form.submit()
    return true
}