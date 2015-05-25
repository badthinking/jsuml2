/**
 ** MODULE NAME: 
 **	  NodeInterface.js
 **
 ** DESCRIPTION:
 **   Contains the objects of the component diagrams of UML 2
 **
 ** DEVELOPED BY:
 **   Rafael Molina Linares (RML)
 **   Martin Vega-Leal Ordonez (MVL)
 **
 ** SUPERVISED BY:
 **		José Raúl Romero, PhD (Associate Professor, University of Córdoba, Spain)
 **
 ** HISTORY:
 ** 	001 - Sep 2011 - RML - Second version release
 ** 	000 - Feb 2011 - MVL - First version release
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
 * NodeInterface class constructor, creates a AcceptEventAction in the activity diagram
 *
 * @author Rafael Molina Linares
 * @update 16/10/2011
 *
 * @class NodeInterface
 * @extends Elliptical
 *
 */
var NodeInterface = function( params ) {
  params = params || {};
  NodeInterface.baseConstructor.call( this, params );

}
JSFun.extend( NodeInterface, Elliptical );



/**
 * Draws the node on the canvas element
 *
 * @author Rafael Molina Linares
 * @update 16/10/2011
 *
 * @method draw
 * @param {CanvasRenderingContext2D} context Context of canvas element
 *
 */
NodeInterface.prototype.draw = function( context ) {
  var no = false;
  var realization = false;
  
  if( this._relations.length <= 0 ) {
    no = true;
  }
  
  var i;
  for( i in this._relations ) {
    if( this._relations[i].getType() == 'UMLInterfaceRealization' ) {
      realization = true;
      break;
    }
  }
  
  if( no || realization ) {
    NodeInterface.base.draw.call( this, context );
  } else {
    this.drawComponents( context );
    
    if( this._selected ) {
      this.drawComponentsShape( context );
    }
  }

}



/**
 * Adds new item to the stereotype fields component of the element UML
 *
 * @author Rafael Molina Linares
 * @update 16/10/2011
 *
 * @method addStereotype
 * @param {String} text Text that will contain the new field of the stereotype component
 *
 */

NodeInterface.prototype.addStereotype = function(text){
	var text = text || '';
	this._components[0].addField( '\xAB' + text + '\xBB' );
}



/**
 * Set the name of the element UML
 *
 * @author Rafael Molina Linares
 * @update 16/10/2011
 *
 * @method setName
 * @param {String} text Text to establish the new name
 *
 */

NodeInterface.prototype.setName = function( text ){
	this._components[1].setValue( text );
}




/**
 * Return the stereotypes of the element UML in array's form
 *
 * @author Rafael Molina Linares
 * @update 18/11/2011
 *
 * @method getStereotypes
 * @return {Array} Array with the stereotypes components of the element
 *
 */

NodeInterface.prototype.getStereotypes = function( ){
	return	this._components[0]._childs;
}


/**
 * Returns the name of the element UML
 *
 * @author Rafael Molina Linares
 * @update 18/11/2011
 *
 * @method getName
 * @return {String} Text of the element's name
 *
 */
NodeInterface.prototype.getName = function( ){
	return this._components[1].getValue();
}



/**
 * Returns the stereotype fields component of the element UML
 *
 * @author Rafael Molina Linares
 * @update 16/10/2011
 *
 * @method getStereotype
 * @return {Component} Stereotype fields components of the element UML
 *
 */

NodeInterface.prototype.getStereotype = function(){		
	return this._components[0];
}






/**
 * Returns the name field component of the element UML
 *
 * @author Alejandro Arrabal Hidalgo
 * @update 22/09/2012
 *
 * @method getNameAsComponent
 * @return {Component} Stereotype field component of the element UML
 *
 */
NodeInterface.prototype.getNameAsComponent = function( ){
	return this._components[1];
}