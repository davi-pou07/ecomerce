function validar() {
    senha = document.getElementById("senha")
    confirma = document.getElementById('confirm')
    if (senha.value != confirma.value) {
        window.alert("Senhas não são iguais")
        confirma.value = ''
    }
}