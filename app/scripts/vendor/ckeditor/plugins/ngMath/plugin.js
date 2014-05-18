CKEDITOR.plugins.add( 'ngMath', {
    init: function( editor ) {
        var iconPath = this.path + 'icons/ng-math.png';

        editor.addCommand( 'ngMathDialog',new CKEDITOR.dialogCommand( 'ngMathDialog' ) );

        editor.ui.addButton( 'NgMath', {
            label: 'Formel einfügen',
            command: 'ngMathDialog',
            icon: iconPath
        });

        if ( editor.contextMenu ) {
            editor.addMenuGroup( 'ngMathGroup' );
            editor.addMenuItem( 'ngMathItem', {
                label: 'Edit Abbreviation',
                icon: this.path + 'icons/ng-math.png',
                command: 'ngMathDialog',
                group: 'ngMathGroup'
            });

            editor.contextMenu.addListener( function( element ) {
                if ( element.getAscendant( 'abbr', true ) ) {
                    return { abbrItem: CKEDITOR.TRISTATE_OFF };
                }
            });
        }
    }
});



CKEDITOR.dialog.add( 'ngMathDialog', function( editor ) {
            return {
                title: 'Tex-Formel einfügen',
                minWidth: 400,
                minHeight: 200,
                contents: [
                    {
                        id: 'tab1',
                        label: 'Basic Settings',
                        elements: [
                            {
                                type: 'text',
                                id: 'title',
                                label: 'Tooltip',
                                //validate: CKEDITOR.dialog.validate.notEmpty( "Explanation field cannot be empty" ),
                                setup: function( element ) {
                                    this.setValue( element.getAttribute( "title" ) );
                                },
                                commit: function( element ) {
                                    element.setAttribute( "title", this.getValue() );
                                }
                            },
                            {
                                type: 'text',
                                id: 'tex',
                                label: 'Formula',
                                validate: CKEDITOR.dialog.validate.notEmpty( "Abbreviation field cannot be empty" ),
                                setup: function( element ) {
                                    var mathElem = element.getChild(0);
                                    console.log( 'setup math', mathElem.getText())
                                    this.setValue( mathElem.getText() );
                                },
                                commit: function( element ) {
                                    var mathElem = editor.document.createElement( 'mj-math' );
                                    mathElem.setText( this.getValue() );
                                    element.setHtml('');
                                    element.append(mathElem)
                                    console.log('commit math', this.getValue() )
                                    //mathElem.setText( this.getValue() );
                                }
                            }
                            
                        ]
                    }//,
                    // {
                    //     id: 'tab2',
                    //     label: 'Advanced Settings',
                    //     elements: [
                    //         {
                    //             type: 'text',
                    //             id: 'id',
                    //             label: 'Id',
                    //             setup: function( element ) {
                    //                 this.setValue( element.getAttribute( "id" ) );
                    //             },
                    //             commit: function ( element ) {
                    //                 var id = this.getValue();
                    //                 if ( id )
                    //                     element.setAttribute( 'id', id );
                    //                 else if ( !this.insertMode )
                    //                     element.removeAttribute( 'id' );
                    //             }
                    //         }
                    //     ]
                    // }
                ],

                onShow: function() {
                    var selection = editor.getSelection(),
                        element = selection.getStartElement();
                    console.log('start-element' ,element)
                    if ( element && ( element.getName() === 'mj-math') )
                        element = element.getParent();
                    console.log('element' ,element)

                    if ( !element || !element.hasClass('math') || element.data( 'cke-realelement' ) ) {
                        console.log('creating new math element')
                        var element = editor.document.createElement( 'span' );
                        element.addClass('math');
                        var mjMath = editor.document.createElement( 'mj-math' )
                        element.append( mjMath );
                        this.insertMode = true;
                    }
                    else
                        this.insertMode = false;

                    this.element = element;

                    if ( !this.insertMode )
                        this.setupContent( this.element );
                },

                onOk: function() {
                    var dialog = this,
                        formula = this.element;
                    console.log('onOk:', formula)
                    this.commitContent( formula );

                    if ( this.insertMode )
                        editor.insertElement( formula );
                }
            };
        });