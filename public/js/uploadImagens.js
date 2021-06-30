function encodeImageFileAsURL() {
    var filesSelected = document.getElementById("novaFoto").files;
    if (filesSelected.length > 0) {
        var fileToLoad = filesSelected[0];
        var fileReader = new FileReader();
        fileReader.onload = function (fileLoadedEvent) {
            var srcData = fileLoadedEvent.target.result; // <--- data: base64
            var logo = document.getElementById("foto").value = srcData
            var logo = document.getElementById("fotoAtual").src = srcData
        }
        fileReader.readAsDataURL(fileToLoad);
    }
}