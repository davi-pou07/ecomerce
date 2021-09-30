var grade = {id:1,descricao:'Teste'}
var glinha = [{linha:'linha1'},{linha:'linha2'},{linha:'linha3'},{linha:'linha4'}]
var gcoluna = [{coluna:'coluna1'},{coluna:'coluna2'}]
var estoque = []

function teste(){
    for(var a = 0;a<glinha.length;a++){
        console.log("-")
        console.log(a)
        console.log("-")
        for(var b = 0;b<gcoluna.length;b++){
        console.log(a)
        console.log(b)
        estoque.push({
                refcoluna: gcoluna[b].coluna,
                reflinha: glinha[a].linha
            })
            console.log(estoque)
        }
    }
    
}

teste()
console.log(estoque)