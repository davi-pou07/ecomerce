function sub(event, form) {
    event.preventDefault()
    button = document.getElementById('buttom').setAttribute("disabled", "disabled");
    form.submit()
    return true 
}