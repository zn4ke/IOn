var sketcher = new ChemDoodle.SketcherCanvas('mychemsketcher', 500, 300, {
    useServices:false,
    oneMolecule:true
});
console.log('mychemsketcher',document.getElementById('mychemsketcher'))
sketcher.repaint()
