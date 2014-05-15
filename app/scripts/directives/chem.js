'use strict';

angular.module('studiApp')
.directive('molecule', function ($timeout) {
    return {
        template: '<div></div>',
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
            var uniqid = 'mol-' + Date.now();
            console.log('attrs', attrs)

            element.append('<canvas id="' + uniqid +'"></canvas>')
            var context = new ChemDoodle.ViewerCanvas(uniqid, 200, 200, {});
            context.specs.atoms_useJMOLColors = true;
            //context.specs.bonds_width_2D = 1;
            //context.specs.bonds_saturationWidth_2D = .18;
            //context.specs.bonds_hashSpacing_2D = 2.5;
            //context.specs.atoms_font_size_2D = 16;
            //context.specs.atoms_font_families_2D = ['Helvetica', 'Arial', 'sans-serif'];
            //context.specs.atoms_displayTerminalCarbonLabels_2D = true;
            var molFile = scope[attrs.molSrc]
            var molObj = ChemDoodle.readMOL(molFile);
            //molObj.scaleToAverageBondLength(25);
            var size = molObj.getDimension();
            var scale = Math.min(context.width/size.x, context.height/size.y);
            context.loadMolecule(molObj);
            context.specs.scale = scale*.85;
            context.repaint();
            
            
        }
    };
});
