
 function salvarMarca() {
    var nomeMarca = document.getElementById("nomeMarca").value
    if (nomeMarca != '') {
        if (confirm("Salvar alteração?")) {
            axios.post("/marca/salvar", { nomeMarca: nomeMarca }).then(resp => {
                console.log(resp)
                if (resp.data.erro == undefined) {
                    var marca = resp.data.marca
                    console.log(marca.marca)
                    var marcaId = document.getElementById("marcaId")
                    marcaId.value = marca.id
                    var option = new Option(marca.marca, marca.id)
                    option.setAttribute("selected", "selected")
                    marcaId.add(option)
                    document.getElementById("modalFechar").click()
                } else {
                    alert("Erro ao salvar dados")
                }
            })
        }
    } else {
        alert("Campo Marca em branco")
    }
}
function marcas(x) {
    if (x == 'A') {
        var modalMarca = new bootstrap.Modal(document.getElementById('modalMarca'))
        modalMarca.show()
    }
}