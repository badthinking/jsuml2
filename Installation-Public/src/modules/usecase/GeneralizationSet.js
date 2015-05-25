/**
 ** MODULE NAME: 
 **	  GeneralizationSet.js
 **
 ** DESCRIPTION:
 **   Define the properties and methods of the generalizationset's node of the class diagram of UML 2.
 **
 ** DEVELOPED BY:
 **   Alejandro Arrabal Hidalgo (AAH)
 **
 ** SUPERVISED BY:
 **		Jos� Ra�l Romero, PhD (Associate Professor, University of C�rdoba, Spain)
 **
 ** HISTORY:
 ** 	000 - Oct 2012 - AAH - Initial version release
 **
 ** CONTACT INFO:
 ** 	Jos� Ra�l Romero, http://www.jrromero.net
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
 * GeneralizationSet class constructor, creates a relation of GeneralizationSet in the class diagram
 *
 * @author Alejandro Arrabal Hidalgo
 * @update 30/09/2012
 *
 * @class GeneralizationSet
 * @extends Relation
 *
 */

var GeneralizationSet = function( params ) {
  params=params || {};
  GeneralizationSet.baseConstructor.call(this);
}
JSFun.extend(GeneralizationSet,Relation);


/**
 * Adds new item to the stereotype fields component of the element UML
 *
 * @author Martín Vega-leal Ordóñez
 * @update 28/11/2010
 *
 * @method addStereotype
 * @param {String} text Text that will contain the new field of the stereotype component
 *
 */

GeneralizationSet.prototype.addStereotype = function(text){
	var text = text || '';
	this._components[0].addField( '\xAB' + text + '\xBB' );
}


/**
 * Set the name of the element UML
 *
 * @author Martín Vega-leal Ordóñez
 * @update 28/11/2010
 *
 * @method setName
 * @param {String} text Text to establish the new name
 *
 */
GeneralizationSet.prototype.setName = function( text ){
	this._components[1].setValue( text );
}



/**
 * Return the stereotypes of the element UML in array's form
 *
 *
 * @author Martín Vega-leal Ordóñez
 * @update 28/11/2010
 *
 * @method getStereotypes
 * @return {Array} Array with the stereotypes components of the element
 *
 */

GeneralizationSet.prototype.getStereotypes = function( ){
	return	this._components[0]._childs;
}


/**
 * Returns the name of the element UML
 *
 * @author Martín Vega-leal Ordóñez
 * @update 28/11/2010
 *
 * @method getName
 * @return {String} Text of the element's name
 *
 */
GeneralizationSet.prototype.getName = function( ){
	return this._components[1].getValue();
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
GeneralizationSet.prototype.getNameAsComponent = function( ){
	return this._components[1];
}



/**
* Returns an Array wich contains the relations of the n-arry relation
*
 *
 * @author Alejandro Arrabal Hidalgo
 * @update 25/08/2012
 *
 * @method getRelations
 * @return {Array} Array wich contains the relations of the n-arry relation
 *
 */
GeneralizationSet.prototype.getRelations=function() {
	return this._relations;
}




/**
 * Define the elements of the relation.
 *
 * @author Alejandro Arrabal Hidalgo
 * @update 30/09/2012
 *
 * @method setElements
 * @param {Array} Array that contains elements of the relation
 * @return {Boolean} If the assign of the new elements has been produced
 */
GeneralizationSet.prototype.setElements = function( elem,elem2) {
	//comprobamos si se busca llamar a la funcion setElements con 2 parametros
	if(!(elem instanceof Array)){
		if(GeneralizationSet.base.setElements.call(this,elem,elem2))
		{
			this.updateParent();
			return true;
		}
		return false;
	}
	//comprobamos que todos los elementos sean nodos
	for( i in elem){
		  if(!(elem[i] instanceof Node) ) {
			  return false;
		  }
	  }
	//comprobamos que sean al menos dos elementos
	 if(elem[0]&&elem[1])
		 {
		 	this.setElements(elem.shift(), elem.shift());
		 	while(elem[0])this.addElement(elem.shift());
			this.updateParent();	 
			this._calculateLineEnds();
			return true;
		 }
	 else{
		 return false;
	 }

}



/**
 * Returns the relation associated to an element.
 *
 * @author Alejandro Arrabal Hidalgo
 * @update 04/09/2012
 *
 * @method getRelation
 * @param {Element} elem  Element witch associated relation is gone be get. 
 * @return {Relation}  The relation associated to the element.
 */
GeneralizationSet.prototype.getRelation = function( elem) {
 for( i in this._relations){
			if(this._relations[i]._elemA===elem || this._relations[i]._elemB===elem)return this._relations[i];
	 }
}



/**
 * Adds a element to relation.
 *
 * @author Alejandro Arrabal Hidalgo
 * @update 30/09/2012
 *
 * @method addElement
 * @param {Element} Element to be add to relation
 * @return {Boolean} If the add of the new element has been produced
 */
GeneralizationSet.prototype.addElement = function( elem) {
	//check if the elem is a node
	  if(!(elem instanceof Node) )return false;
	  
    //check if the node was part of the relation
  for(i in this._relations ) if(this._relations[i]._elemA==elem || this._relations[i]._elemB==elem )return false;
 
   //add the new relation
    relation=null;
 	relation=new SetLine({a:elem,b:this});  
 	relation._calculatePoint();
 	if(this._elemB._diagram!=null)this._elemB._diagram.addElement(relation);
    this.notifyChange();
    return true;
}




/**
 * Remove an element from relation.
 *
 * @author Alejandro Arrabal Hidalgo
 * @update 28/09/2012
 *
 * @method delElement
 * @param {Element} Element to be remove from relation
 * @return {Boolean} If the remove of element has been produced
 */
GeneralizationSet.prototype.delElement = function( elem) {
	//comprobamos que el elemento sea un nodo
  if(!(elem instanceof Node) )return false;
	  

  for(i in this._relations ){
	  if(this._relations[i]._elemA===elem  || this._relations[i]._elemB===elem ){
		  this._relations[i].remove();
		  //this._relations.splice( i, 1 );
	  }
     
    return false;
  }
}




/**
 *
 * @author Alejandro Arrabal Hidalgo
 * @update 17/10/2012
 *
 * @method notifyDeleted
 * @return {Element} Element that has been remove
 */
GeneralizationSet.prototype.notifyDeleted = function( elem ) {
	  for(i in this._relations )if(this._relations[i]===elem) this._relations.splice( i, 1 );
}




/**
 * Constructor de la clase SetLine
 * Representa una relación n-aria
 * 
 * @author Alejandro Arrabal Hidalgo
 * @update 07/10/2012
 *
 * @class SetLine
 * @extends Relation
 */
var SetLine = function( params ) {
	  params=params || {};
	  SetLine.baseConstructor.call(this,params);
	  
	  f=this;
	  //Add item to contextual menu
	  f.setMenu([[function(){f.showStyleDialog({that: f});f.removeContextualMenu();},'Style']]);
	  this._last=null;
	  this.setType( 'SetLine' );
      this.setLine( new SolidLine() );
}
JSFun.extend(SetLine,Relation);


/**
 * The relation and its components are drawn with the defined style
 *
 * @author Alejandro Arrabal Hidalgo
 * @update 07/10/2012
 *
 * @method draw
 * @param {CanvasRenderingContext2D} context Context of the canvas 
*/

SetLine.prototype.notifyChange = function() {
	if(this._points[this._selected]!=this._last)this._calculatePoint();
	SetLine.base.notifyChange.call(this);
}



/**
 * Notifies to the relation what a change in some 
 * of its components or nodes has been produced
 *
 * @author Alejandro Arrabal Hidalgo
 * @update 28/11/2010
 *
 * @method _calculatePoint
 */
SetLine.prototype._calculatePoint = function() {
		elem=this._elemB;
		found=-1;
		splice=1;
		var cGS=new Point(this._elemA.getCentralPoint());
		var cE=new Point(elem.getLinkCentered(cGS));
		//check if the last point has been changed by the user
		for(i in this._points)if(this._points[i]==this._last)found=i;
		if(this._last==null){
			found = 1;
			splice=0;
		}
		if(found!=-1/*&&!(cE.getX()==cGS.getX())*/){
			var m=(cGS.getY()-cE.getY())/(cE.getX()-cGS.getX());
			if(m<1&&m>-1){
				var point=new Point(cGS.getX(),cE.getY());
		 		this._points.splice(found,splice,point);
		 		this._last=point;
		 		this.notifyDraw();
		 	}
		else if(found!=-1){
		 		var point=new Point(cE.getX(),cGS.getY());	 	 		
		 		this._points.splice(found,splice,point);
		 		this._last=point;
		 		this.notifyDraw();
			}
		}
	
}
