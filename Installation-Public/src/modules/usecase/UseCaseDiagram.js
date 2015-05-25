/**
 ** MODULE NAME: 
 **	  UseCaseDiagram.js
 **
 ** DESCRIPTION:
 **   Define the properties and methods of the UseCaseDiagram element of the activity diagram of UML 2.
 **
 ** DEVELOPED BY:
 **	Alejandro Arrabal Hidalgo (AAH)
 **   Rafael Molina Linares (RML)
 **
 ** SUPERVISED BY:
 **		José Raúl Romero, PhD (Associate Professor, University of Córdoba, Spain)
 **
 ** HISTORY:
 **	001 - Agu 2012 - AAH -
 ** 	000 - Sep 2011 - RML - Second version release
 **
 ** CONTACT INFO:
 ** 	José Raúl Romero, http://www.jrromero.net
 **
 ** NOTES:
 **
 ** LICENSE & DISCLAIMER:
 **    Copyright (C) 2011 The authors
 **
 **    This program is free software: you can redistribute it and/or modify
 **    it under the terms of the GNU General Public License as published by
 **    the Free Software Foundation, either version 3 of the License, or
 **    (at your option) any later version.
 **
 **    This program is distributed in the hope that it will be useful,
 **    but WITHOUT ANY WARRANTY; without even the implied warranty of
 **    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 **    GNU General Public License for more details.
 **
 **    You should have received a copy of the GNU General Public License
 **    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 **
**/



/**
 * UseCaseDiagram class constructor, creates a diagram of state machine
 *
 * @author Rafael Molina Linares
 * @update 9/09/2011
 *
 * @class UseCaseDiagram
 * @extends Diagram
 *
 */
var UseCaseDiagram = function( params ){
	UseCaseDiagram.baseConstructor.call(this,params);
}
JSFun.extend(UseCaseDiagram,Diagram);



/**
 * Generates the diagram from a tree with the elements in xml
 *
 * @author Rafael Molina Linares
 * @update 05/12/2011
 *
 * @method setXML
 * @param {DOMNode} xml document's node that contains the diagram
 * @param {Array} stereotypeObjects List of objects stereotypes that can be used by the diagram 
 * @return {Boolean} If a bug has been found, is returned false
*/

UseCaseDiagram.prototype.setXML = function( xml, stereotypeObjects ) {

	var stereotypeObjects = stereotypeObjects || null;
  var ids = [];

  if( this._alone ) {

    var diagram = xml.getElementsByTagName( this.getType() )[0];

    if( !diagram ) {
      return false;
    }
  } else {
    var diagram = xml;
  }

  this._name.setValue( diagram.getAttribute( 'name' ) );

	if(diagram.getAttribute( 'backgroundNodes' ))
		this._backgroundNodes = diagram.getAttribute( 'backgroundNodes' );
  
  var xmlnodes = diagram.childNodes;


  var i;

  for( i = 0; i < xmlnodes.length; i++ ) {
    this._instantiateElements( xmlnodes[i], ids );
  }

  
  for( i = 0; i < xmlnodes.length; i++ ) {
    this._addElementXML( xmlnodes[i], ids, null, stereotypeObjects );
  }


  for( i = 0; i < this._relations.length; i++ ) {
    this._relations[i].notifyChange();
  }

  this._sortNodesByArea();

  return true;
}



/**
 * From the retrieved information in the XML tree recovers the values ​​
 * of attributes of each node, passing the information, added to the 
 * diagram and his father is assigned
 *
 * @author Rafael Molina Linares
 * @update 05/12/2011
 *
 
 * @method _addElementXML
 * @private
 * @param {DOMNode} xmlnode DOM node of the elements
 * @param {Array} ids Ids of references a each instantiated element
 * @param {Node} parent Parent of the current xml node
 * @param {Array} stereotypeObjects List of objects stereotypes that can be used by the diagram 
*/

UseCaseDiagram.prototype._addElementXML = function( xmlnode, ids, parent, stereotypeObjects ) {

	var parent = parent || null;
	var stereotypeObjects = stereotypeObjects || null;
  var obj = ids[ xmlnode.getAttribute( 'id') ];

  if( obj ){ 

		//Adds components to the supernode's region
		if(parent instanceof SuperNode && obj instanceof Region)
			obj.addComponents(false);

		/*
			It is set the list of stereotypes object 
			that can be applied to the object
		*/
		if( obj._stereotypeProperties && stereotypeObjects )
			obj._stereotypeProperties.setStereotypesProfile( stereotypeObjects );						

    obj.setElementXML( xmlnode, ids );

		/*
			If obj is a region, mustn't be added to the 'nodes' array 
			of the diagram via the _addElementOnly method, so the 
			user can't move this region separately from the 
			supernode and can only move the entire supernode 
		*/
    if(parent instanceof SuperNode && obj instanceof Node){
      obj.setDiagram( this );

			if(obj instanceof Region ){
				var nod = obj._parent._nodeChilds;
				var len = nod.length;			
				if(len > 0){
					if(obj._parent._orientation)
						nod[len - 1].setWidth( obj._x - nod[len-1]._x);
					else
						nod[len - 1].setHeight( obj._y - nod[len-1]._y);

					nod[len - 1].updateComponents();
				}
			}
		}
    else
      this._addElementOnly( obj );

    if( parent && obj instanceof Node ) {
      parent.addChild( obj );
			if(obj instanceof Swimlane )
				obj._parent.updateSizeComponentSwimlane();
		  parent.updateContainer(false);
			if(parent._parent instanceof SuperNode)
				parent._parent.updateContainer(false);
    }

    for(var i = 0; i < xmlnode.childNodes.length; i++ ) {
			this._addElementXML( xmlnode.childNodes[i], ids, obj, stereotypeObjects);
    }
  }  
}




/**
 * Checks the existence of two nodes in the given coordinates, and in affirmative case,
 * is assigned the relation to the selected elements
 *
 * @author Alejandro Arrabal Hidalgo
 * @update 21/08/2012
 *
 * @method addRelationFromPoints
 * @param {Relation} newRelation Relation that is added to the diagram
 * @param {Number} x1 Coordinate x of the first point
 * @param {Number} y1 Coordinate y of the first point
 * @param {Number} x2 Coordinate x of the second point
 * @param {Number} y2 Coordinate y of the second point
 */
UseCaseDiagram.prototype.addRelationFromPoints = function( newRelation, x1, y1, x2, y2 ) {

  var elem1 = this.getElementByPoint( x1, y1 );
  var elem2 = this.getElementByPoint( x2, y2 );
  var set=false;
  var i;
  if( elem1 && elem2 ) { 	
	  if(newRelation.getType()=='UMLGeneralization' && elem1 instanceof Node && elem2 instanceof  Node)
	  {
		if(elem1.getType()=='UMLGeneralizationSet'){
			var line = new UMLSetLine();
			line.setElements(elem1,elem2);
			line.notifyChange();
			this.addElement(line);
			set=true;
		}
	  	for(i=0;i<elem1._relations.length && !set ;i++){
	  		if(elem1._relations[i].getType()=='UMLGeneralization' && elem1._relations[i]._elemA==elem1){
				var elem = new UMLGeneralizationSet({ x:elem1._relations[i].getCentralPoint().getX(), y:elem1._relations[i].getCentralPoint().getY()});
			    //elem.notifyChange();
				elem.setSuperClass(elem1);
				this.addElement( elem );
				var line = new UMLSetLine();
				line.setElements(elem1,elem);
				line.notifyChange();
				this.addElement(line);
				var line2=new UMLSetLine();
				line2.setElements(elem,elem1._relations[i]._elemB);
				line2.notifyChange();
				this.addElement(line2);
				var line3=new UMLSetLine();
				line3.setElements(elem,elem2);
				line3.notifyChange();
				this.addElement(line3);
				elem1._relations[i].remove();
				set=true;
			}
	  		else if(elem1._relations[i].getType()=='UMLSetLine' && elem1._relations[i]._elemA==elem1){
				var line=new UMLSetLine();
				line.setElements(elem1._relations[i]._elemB,elem2);
				this.addElement(line);
				line.notifyChange();
	  			set=true;
	  		}
	  	}
	  }
  	if( !set && newRelation.setElements( elem1, elem2 ) ) {    	
	  	newRelation.notifyChange();
		this.addElement( newRelation );
    }
  }
}