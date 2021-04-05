function selecionar() {

    var produto = document.getElementById('produto').value

    window.location.href = '/admin/estoques/' + produto
}

function selecionar2() {

    var produto = document.getElementById('produto').value

    window.location.href = '/admin/estoque/estgrade/' + produto
}
