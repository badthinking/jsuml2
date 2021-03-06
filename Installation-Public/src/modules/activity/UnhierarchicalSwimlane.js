/**
 ** MODULE NAME: 
 **	  UnhierarchicalSwimlane.js
 **
 ** DESCRIPTION:
 **   Define the properties and methods of the UnhierarchicalSwimlane element of the activity diagram of UML 2.
 **
 ** DEVELOPED BY:
 **   Rafael Molina Linares (RML)
 **
 ** SUPERVISED BY:
 **		José Raúl Romero, PhD (Associate Professor, University of Córdoba, Spain)
 **
 ** HISTORY:
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
 * UnhierarchicalSwimlane class constructor, creates a composite state in the state machine diagram
 *
 * @author Rafael Molina Linares
 * @update 18/9/2011
 *
 * @class UnhierarchicalSwimlane
 * @extends SuperNode
 *
 */
var UnhierarchicalSwimlane = function( params ){

	params = params || {};
	UnhierarchicalSwimlane.baseConstructor.call(this,params);
}
JSFun.extend(UnhierarchicalSwimlane,SuperNode);


/**
 * Delete a region or child node to the supernode
 *
 * @author Rafael Molina Linares
 * @update 19/8/2011
 *
 * @class SuperNode
 * @param {Number} node Represents the node to add
 *
 */
UnhierarchicalSwimlane.prototype.deleteRegion = function( node ) {

  var i;
  var j;

	//Saves the height/width of the node to delete so that the height/width of the supernode be reduced by this height/width 
  if(this._orientation)
		var mov = node.getWidth();
  else
		var mov = node.getHeight();

	//Gets the position of the region inside the supernode that will be removed and is stored in 'i' variable
  for( i=0; i < this._nodeChilds.length;i++ ) {
    if( this._nodeChilds[i] == node )
      break;
  }

	//Delete the region or swimlane
  node.remove();  

  var index = i;

	// if the last region has been removed, the region line of the previously region is removed
  if(index == (this._nodeChilds.length)){

		if(this._nodeChilds[index -1]._components[2])
		  this._nodeChilds[index - 1]._components[2].notifyDelete();
  }

	//supernode reduces the size(width or height according to the orientation) of the supernode after remove the region
  if(this._orientation){
		this._minWidth = this.getWidth() - mov;
		this.setWidth(this.getWidth() - mov);
  }
  else {
    this._minHeight = this.getHeight() - mov;
	  this.setHeight(this.getHeight() - mov);
  }

  this.notifyChange(true);

	//notify that the diagram must re-draw
  this.notifyDraw();
}


/**
 * Notify to the supernode that a change has been produced by some 
 * relationed element with the supernode
 *
 * @author Rafael Molina Linares
 * @update 18/09/2011
 *
 * @method notifyChange
 * @param {Boolean} recall If the call to the parent method is done or not
 * @param {Boolean} resize If the call of this method is triggered when the supernode has been resizing
 * @param {Boolean} movementLine If the call of this method is triggered when a region line has been moved
 */
UnhierarchicalSwimlane.prototype.notifyChange = function(recall,resize, movementLine) {

	//initialize parameters if its value is undefined
  recall = recall || false;
	resize = resize || false;
	movementLine = movementLine || false;


	//Update the height or width of the swimlanes according to the swimlane's orientation to get a straight line
	this.resetSizeComponentSwimlane();
	this.updateSizeComponentSwimlane();

	//Call to base method 
	UnhierarchicalSwimlane.base.notifyChange.call(this,recall,resize,movementLine);	
}



/**
 * Sets the swimlane's size of width or height (according to horizontal 
 * or vertical orientation) to right value without take in account 
 * the with or height of another swimlane to get a straight line
 * with the supernode
 *
 * @author Rafael Molina Linares
 * @update 18/09/2011
 *
 * @method resetSizeComponentSwimlane
 *
 */
UnhierarchicalSwimlane.prototype.resetSizeComponentSwimlane = function(){

	var nod = this._nodeChilds;
	for(var i=0;i< nod.length;i++){

		nod[i]._heightComp = (this._orientation) ? (nod[i]._components[0]._height + nod[i]._components[1]._height) : 0;
		nod[i]._widthComp = (this._orientation) ? 0 : (nod[i]._components[0]._width + nod[i]._components[1]._width);
	}
}


/**
 * Sets the swimlane's size of width or height (according to horizontal 
 * or vertical orientation) to right value taking in account 
 * the with or height of another swimlane to get a straight line
 * with the supernode
 *
 * @author Rafael Molina Linares
 * @update 18/09/2011
 *
 * @method updateSizeComponentSwimlane
 *
 */

UnhierarchicalSwimlane.prototype.updateSizeComponentSwimlane = function(){

	var nod = this._nodeChilds;

	if(this._orientation){
		var max = 0;
		//Searchs the maximum height of components 
		for(var i=0; i<nod.length;i++)
			if(nod[i]._heightComp > max)
				max = nod[i]._heightComp;
		//Updates the maximum heigh of components of each swimlane
		for(var i=0; i<nod.length;i++)
			nod[i]._heightComp = max;
	} else {
		var max = 0;
		//Searchs the maximum width of components 
		for(var i=0; i<nod.length;i++)
			if(nod[i]._widthComp > max)
				max = nod[i]._widthComp;
		//Updates the maximum width of components of each swimlane
		for(var i=0; i<nod.length;i++)
			nod[i]._widthComp = max;
	}
}


/**
 * Update width of all region of the node. This method just must be called if horizontal regions are used.
 *
 * @author Rafael Molina Linares
 * @update 19/8/2011
 *
 * @method updateWidth
 * @param {Boolean} resize If the call of this method is triggered when the supernode has been resizing
 * @param {Boolean} movementLine If the call of this method is triggered when a region line has been moved
 *
 */
UnhierarchicalSwimlane.prototype.updateRegions = function( resize, movementLine ) {

	//initialize parameter if your value is undefined
	resize = resize || false;
	movementLine = movementLine || false;

	var len = this._nodeChilds.length;

	//vertical orientation
	if(this._orientation){
		var width = 0;
		var x = this.getX();

		//Update the height of all the region line of the supernode
		for(var j=0 ; j< len; j++){

			var nod = this._nodeChilds[j];

			//Updates the minimal height of the regions according to the supernode's height
			nod.setMinHeight(this._minHeight );
			nod.setHeight(this.getHeight() );
			if(nod._components[2] instanceof RegionLine)
				nod._components[2].setHeight(this.getHeight() );	
		}

		//Update the x,y coordinates of the all regions
	  for(j = 0; j<len ; j++){
			this._nodeChilds[j]._x = x;
			this._nodeChilds[j]._y = this.getY();

			//ensure that the last region isn't out of the supernode
			if(j == len - 1) {

				/*
					If the supernode has been resizing or the right x coordinate of the last
					supernode's region is less than the right x coordinate of the super-node,
					the width of the last region is modified so that the right x coordinate of
					the last region match with the right x coordinate of the super-node. 
					In other case, the width of the super-node is modified so that your right x 
					coordinate match with the right x coordinate of the last region.
				*/
				if( resize || (x + this._nodeChilds[j]._width) < (this.getWidth() + this.getX()))
					this._nodeChilds[j].setWidth(this.getWidth() + this.getX() - x);
				else 
					this.setWidth(x + this._nodeChilds[j]._width - this.getX());
			}

			x += this._nodeChilds[j].getWidth();

	  }

		//Update position of elements contained by regions
		for(j = 0; j<len ; j++){

			/*
				Calculates the movement of the region taking in account 
				the your current position compared to your before position
			*/
			var mov = this._nodeChilds[j]._x - this._nodeChilds[j]._prex;

			/*
				If the movement is greater than 0, or is less than 
				0 and has been produced by the movement of the a 
				region line, the child nodes of the region updates 
				your position. The third parameter of the method 
				'updatePosition' indicates that the update of the position
				is produced by the movement of a region.
			*/
			if(mov > 0 || (mov < 0 && !movementLine)){
				for(var i=0;i<this._nodeChilds[j]._nodeChilds.length;i++)
					this._nodeChilds[j]._nodeChilds[i].updatePosition(mov,0,true);
			}

			//Reset the movement of the region
			this._nodeChilds[j].resetMovement();
		}

 } else {//horizontal orientation

		var height = 0;
		var y = this.getY(); 


		//Update the width of all the region and region line of the supernode
		for(var j=0 ; j< len; j++){
			var nod = this._nodeChilds[j];

			//Updates the width of the regions according to the supernode's width
			nod.setMinWidth(this._minWidth );
			nod.setWidth(this.getWidth() );
			if(nod._components[2] instanceof RegionLine)
				nod._components[2].setWidth(this.getWidth() );	
		}

		//Update the x,y coordinates of the all regions
	  for(j = 0; j<len ; j++){
			this._nodeChilds[j]._x = this.getX();
			this._nodeChilds[j]._y = y;

			//ensure that the last region isn't out of the supernode
			if(j == len - 1) {

				/*
					If the supernode has been resizing or the bottom y coordinate of the last
					supernode's region is less than the bottom y coordinate of the super-node,
					the height of the last region is modified so that the bottom y coordinate of
					the last region match with the bottom y coordinate of the super-node. 
					In other case, the height of the super-node is modified so that your bottom y 
					coordinate match with the bottom y coordinate of the last region.
				*/
				if( resize || (y + this._nodeChilds[j]._height) < (this.getHeight() + this.getY()))
					this._nodeChilds[j].setHeight(this.getHeight() + this.getY() - y);
				else 
					this.setHeight(y + this._nodeChilds[j]._height - this.getY());
			}

			y += this._nodeChilds[j].getHeight();
	  }

		//Update position of elements contained by regions
		for(j = 0; j<len ; j++){

			/*
				Calculates the movement of the region taking in account 
				the your current position compared to your before position
			*/
			var mov = this._nodeChilds[j]._y - this._nodeChilds[j]._prey;

			/*
				If the movement is greater than 0, or is less than 
				0 and has been produced by the movement of the a 
				region line, the child nodes of the region updates 
				your position. The third parameter of the method 
				'updatePosition' indicates that the update of the position
				is produced by the movement of a region.
			*/
			if(mov > 0 || (mov < 0 && !movementLine)){
				for(var i=0;i<this._nodeChilds[j]._nodeChilds.length;i++)
					this._nodeChilds[j]._nodeChilds[i].updatePosition(0,mov,true);
			}
			//Reset the movement of the region
			this._nodeChilds[j].resetMovement();
		}
	
 }

  //Update components of the own supernode
  this.updateComponents();

  //Update components of all regions of supernode
  for(j=0 ; j<this._nodeChilds.length; j++)
     this._nodeChilds[j].updateComponents();
}


/**
 * Checks that some element has been pressed in the given coordinates, 
 * and if that's right, the necessary flags are activated
 *
 * @author Rafael Molina Linares
 * @update 19/8/2011
 *
 * @method select
 * @param {Number} x Coordinate x
 * @param {Number} y Coordiante y
 * @return {Boolean} If the point is over the node or some of your components
 */
UnhierarchicalSwimlane.prototype.select = function( x, y ) {

	var i;
	var selectedNode = -1;

	//Ensures that the components isn't selected
	this.deselectComponent();

	/*
		Deselects the regions of the super-node(so such its components), 
		and keeps the last child node selected before that is removed
	*/
	for(i=0;i<this._nodeChilds.length;i++){
		if( this._nodeChilds[i]._selected )
			selectedNode = i;
		this._nodeChilds[i].deselect();
	}

	//Remove the contextual menu when the select event is triggered
	if(this._diagram._activeMenu){
		this.removeContextualMenu();
	}

  //If left bottom is clicked
  if(this._diagram._pressMouse == true){


	


	  if( this._selected ) {

			//you have clicked on the small rectangle that allows to resize the node
	    if( this._moveable 
	        && Math.abs( x - ( this._x + this._width + 2.5 ) ) <= 5 
	        && Math.abs( y - ( this._y + this._height + 2.5 ) ) <= 5 )
	    {
	      this._resizing = true;
	      return true;
	    }

	    //you have been clicked on red circle
	    var nodes = this._nodeChilds;

	    for(i=0;i < nodes.length - 1;i++){

				//If is the selected node
				if( i == selectedNode ){

					if(this._orientation){

						var compX1 = nodes[i].getX() + nodes[i].getWidth() - 7;
						var compY1 = nodes[i].getY() + nodes[i]._heightComp + 7;
						var compX2 = nodes[i+1].getX() + nodes[i+1].getWidth() - 7;
						var compY2 = nodes[i+1].getY() + nodes[i+1]._heightComp + 7;
					} else  {
						var widthComp = nodes[i]._components[0]._width + nodes[i]._components[1]._width;
						var compX1 = nodes[i].getX() + nodes[i]._widthComp + 7;
						var compY1 = nodes[i].getY() + nodes[i].getHeight() - 7;
						var compX2 = nodes[i+1].getX() + nodes[i+1]._widthComp + 7;
						var compY2 = nodes[i+1].getY() + nodes[i+1].getHeight() - 7;
					}

					//Creates a dialog box
					var that = this;
					var confirmDialog = new Dialog({ text: 'Do you want to delete the region?',cancelable: true});

					//If red circle of region upper to the region line has been pressed
					if( Math.abs( x - ( compX1 ) ) <= 8 &&
						  Math.abs( y - ( compY1 ) ) <= 8 ) {

						this._diagram._pressMouse = false;
						//Shows the dialog
						confirmDialog.show(function(){ that.deleteRegion( nodes[i] );});
						return true;
					} 

					//If red circle of region bottom to the region line has been pressed
					if( Math.abs( x - ( compX2 ) ) <= 8 &&
						  Math.abs( y - ( compY2 ) ) <= 8 ){

						this._diagram._pressMouse = false;
						//Shows the dialog
						confirmDialog.show(function(){ that.deleteRegion( nodes[i+1]);});
						return true;
					}  
				}
			}


	    // you have clicked on one component of a child node or region of supernode
	    for(i=0;i<this._nodeChilds.length;i++){
				var nod = this._nodeChilds[i];

				if(nod.isOverComponent(x, y)){

					if(nod.isOverRegionLine(x, y)){
			      nod.selectComponent(x,y);						
					} else {
				    this._relx = x - this._x;
				    this._rely = y - this._y;
						this._selectedBefore = true;
					}
		      return true;
				}
	    }

	    // you have clicked on one component
	    if( this.isOverComponent( x, y ) ) {

	      this._relx = x - this._x;
	      this._rely = y - this._y;
	      this._selectedBefore = true;  
  
	      return true;
	    }
	  }

	  // you have clicked on the supernode
	  if( this.isOver( x, y ) ) {

	    this._relx = x - this._x;
	    this._rely = y - this._y;

	    this._selectedBefore = this._selected;
	    this._selected = true;
		    
	    return true;
	  } else {
	    return false;
	  }
  } 
  else if(this._diagram._pressMouseRight == true){//Activate the contextual menu

		/* 
			If the right button has been pressed, and therefore,
			the contextual menu is activated
		 */

		if( this.isOver( x, y ) ) {

		  document.oncontextmenu = function (){return false;};

			/*	  
				Capture the movement of the scroll bar making into account that Chrome 
				and Opera browsers support the document.documentElement element and 
				Firefox and IE browsers support the document.body element.
			*/

		  x = x + this._diagram._div.offsetLeft;
		  y = y + this._diagram._div.offsetTop;

	    //Shows the contextual menu
		  this.showContextualMenu(x,y);

		  return true;
	  } else {

	    return false;
	  }	  
  }
}




/**
 * If the node that call to this method, is container, check your minimal size
 * according to the contained elements within it and your components
 *
 * @author Rafael Molina Linares
 * @update 13/09/2011
 *
 * @method updateContainer
 * @param {Boolean} recall If your value is true, the call to the same method of the parent can be done
 *
 */
UnhierarchicalSwimlane.prototype.updateContainer = function(recall) {
 
	//initialize parameter if your value is undefined
  if(!(recall == false || recall == true))
	  recall = true;

	//If is a container node
  if( this._container ) {
    var i;


    var lx = this._x;
    var ly = this._y; 
    
    var rx = this._x;
    var ry = this._y;

    var elem;
    var elemRigthX, elemeRigthY, elemLeftX, elemeLeftY;
    var len = this._nodeChilds.length;

    for( i=0; i<len;i++ ) {

			//Region of the hierarchical swimlane
      elem = this._nodeChilds[i];
      
			//vertical orientation
      if(this._orientation){

				elemLeftX = elem._x;
				elemLeftY = elem._y;

				/*
					If this is the last region of supernode, just is 
					taken the minimal width of the region.In other case, 
					the width of the region is taken into account.
				*/
				if(i == (len -1))
					elemRigthX = elem._x + elem._minWidth;
				else   
					elemRigthX = elem._x + elem._width;

				elemRigthY = elem._y + elem._minHeight;
			}
			else {

				/* horizontal orientation */

				elemLeftX = elem._x;
				elemLeftY = elem._y;
				elemRigthX = elem._x + elem._minWidth;

				/*
					If this is the last region of supernode, just is 
					taken the minimal height of the region.In other case, 
					the height of the region is taken into account.
				*/

				if(i == (len -1))
					elemRigthY = elem._y + elem._minHeight;
				else
					 elemRigthY = elem._y + elem._height;

				elemRigthX = elem._x + elem._minWidth;
      }

	    //Coordinates of all sides of the supernode are updated		          
      if( elemRigthX > rx )
        rx = elemRigthX;
      if( elemRigthY > ry )
        ry = elemRigthY;
        
      if( elemLeftX < lx )
        lx = elemLeftX;
      if( elemLeftY < ly )
        ly =elemLeftY;

    }

		//If exist a region visible, the new values for the supernode will be established
    if( lx < this._x || ly < this._y ) {    

      this.setWidth(  this._x - lx + this._width );
      this.setHeight( this._y - ly + this._height );
      
      this._x = lx;
      this._y = ly;
      
      this.setMinWidth( rx - this._x );
      this.setMinHeight( ry - this._y );
      
    } else {

      this.setMinWidth( rx - this._x );
      this.setMinHeight( ry - this._y ); 
    }

    //reset the movement
    this._prex = this._x;
    this._prey = this._y;

    this.updateComponents();

		//if the 'recall' parameter is true and this supernode has parent, the parent method is called
    if( this._parent && recall) {
      this._parent.updateContainer();
		}
	}
}



