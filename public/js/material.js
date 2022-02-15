
 function salvarMaterial() {
    var nomeMaterial = document.getElementById("nomeMaterial").value
    if (nomeMaterial != '') {
        if (confirm("Salvar alteração?")) {
            axios.post("/material/salvar", { nomeMaterial: nomeMaterial }).then(resp => {
                console.log(resp)
                if (resp.data.erro == undefined) {
                    var material = resp.data.material
                    console.log(material.material)
                    var materialId = document.getElementById("materialId")
                    materialId.value = material.id
                    var option = new Option(material.material, material.id)
                    option.setAttribute("selected", "selected")
                    materialId.add(option)
                    document.getElementById("modalFechar").click()
                } else {
                    alert("Erro ao salvar dados")
                }
            })
        }
    } else {
        alert("Campo Material em branco")
    }
}
function materiais(x) {
    if (x == 'A') {
        var modalMaterial = new bootstrap.Modal(document.getElementById('modalMaterial'))
        modalMaterial.show()
    }
}