  var myMapApp = new mapApp();
  var myMainMap;
  var myRefMapDragger;
  var svgNS="http://www.w3.org/2000/svg";
  var layeradd = new Array();
  function init() {
     myMapApp.resetFactors();
     myMainMap = new map("mainMap",3000,100,1000,0.6);
     //set constraints to draggable rect in reference map
     myRefMapDragger = new dragObj("dragRectForRefMap",0,200,510,610,"ul");
     for (var i = 1; i < 44;i++) {
                var layername="layer"+i;
                layeradd[i]=document.getElementById(layername);
                                       }

//    zoomIt('TIB'); 
     //colorRegion();
  }
  function showData1(evt) {}
  function showData(evt) {
        var xlinkns = "http://www.w3.org/1999/xlink"; 
	var myPoly = evt.currentTarget;
	var myDynamicTrackerText = document.getElementById("TrackerText");
        var myDynamicTrackerText1 = document.getElementById("TrackerText1");
        var myDynamicTrackerMessage = document.getElementById("TrackerMessage");
        var myTrackerPlot = document.getElementById("plot");
        if (evt.type == "mouseover") {
                var myTracker = myPoly.getAttribute("POS");
                var myTracker1 = "  value="+myPoly.getAttribute("value");
                var myMessage = myPoly.getAttribute("MESSAGE");
                myTracker1 = myTracker1+" count="+myPoly.getAttribute("count");
//		alert (myTracker+" "+myTracker1);
                myDynamicTrackerText.firstChild.nodeValue=myTracker;
                myDynamicTrackerText1.firstChild.nodeValue=myTracker1;
                myDynamicTrackerMessage.firstChild.nodeValue=myMessage;
        }

	if (evt.type == "mouseout") {
		myDynamicTrackerText.firstChild.nodeValue="-";				
	}

	if (evt.type == "click") {
		myDynamicTrackerText.firstChild.nodeValue="-";	
		var moduleId = myPoly.getAttribute("detid");
                var url_serv = "http://cmstkmon.cern.ch:1972/urn:xdaq-application:lid=15/Request?";
                var queryString = "RequestID=PlotTkMapHistogram";
		queryString+= "&ModId=" + moduleId;
                var url1 = url_serv  + queryString;
//                var filename=moduleId+".jpg";
//                myTrackerPlot.setAttributeNS( xlinkns, "xlink:href", filename ) 
                myTrackerPlot.setAttributeNS( xlinkns, "xlink:href", url1);
                
                pausecomp(5000);
                queryString = "RequestID=UpdatePlot&t="+moduleId;
                var url2 = url_serv  + queryString;

                myTrackerPlot.setAttributeNS( xlinkns, "xlink:href", url2);  
              
		var myTracker = myPoly.getAttribute("POS");
                myTracker = myTracker+"  value="+myPoly.getAttribute("value");
	        myTracker = myTracker+"  count="+myPoly.getAttribute("count");
		myDynamicTrackerText.firstChild.nodeValue=myTracker;
	}

  }
  function colorRegion() {
	var myGroup = document.getElementById("tracker");
	var children = myGroup.childNodes;
	var myModule;					
	//loop over all children
	//for (var i = 0; i < children.length;i++) {
	for (var i = 0; i < 10000;i++) {
	//check if it is a path-element
	 if (children.item(i).nodeName == "polygon") {
	   myModule = children.item(i).getAttribute("MODULE");
		switch (myModule) {
		   case "stereo":
			myColor = "blue";
			break;
		   case "nostereo":
			myColor = "rgb(255,255,0)";
			break;
		   default:
			myColor = "red";
		}
	   children.item(i).setAttribute("fill",myColor);
	 }
        }			
  }
  //holds data on map
  function map(mapName,origWidth,minZoom,maxZoom,zoomFact) {
	var mapSVG = document.getElementById(mapName);
	this.mapName = mapName;
	this.origWidth = origWidth;
	this.minZoom = minZoom;
	this.maxZoom = maxZoom;
	this.zoomFact = zoomFact;
	this.pixXOffset = parseFloat(mapSVG.getAttributeNS(null,"x"));
	this.pixYOffset = parseFloat(mapSVG.getAttributeNS(null,"y"));
	viewBoxArray = mapSVG.getAttributeNS(null,"viewBox").split(" ");
	this.curxOrig = parseFloat(viewBoxArray[0]);
	this.curyOrig = parseFloat(viewBoxArray[1]);
	this.curWidth = parseFloat(viewBoxArray[2]);
	this.curHeight = parseFloat(viewBoxArray[3]);
	this.pixWidth = parseFloat(mapSVG.getAttributeNS(null,"width"));
	this.pixHeight = parseFloat(mapSVG.getAttributeNS(null,"height"));
	this.pixXOrig = parseFloat(mapSVG.getAttributeNS(null,"x"));
	this.pixYOrig = parseFloat(mapSVG.getAttributeNS(null,"y"));
	this.pixSize = this.curWidth / this.pixWidth;
	this.zoomVal = this.origWidth / this.curWidth * 100;
  }
  map.prototype.newViewBox = function(refRectId,refMapId) {
	var myRefRect = document.getElementById(refRectId);
	var myRefMapSVG = document.getElementById(refMapId);
	var viewBoxArray = myRefMapSVG.getAttributeNS(null,"viewBox").split(" ");
	var refPixSize = viewBoxArray[2] / myRefMapSVG.getAttributeNS(null,"width");
	this.curxOrig = parseFloat(viewBoxArray[0]) + (myRefRect.getAttributeNS(null,"x") - myRefMapSVG.getAttributeNS(null,"x")) * refPixSize;
	this.curyOrig = parseFloat(viewBoxArray[1]) + (myRefRect.getAttributeNS(null,"y") - myRefMapSVG.getAttributeNS(null,"y")) * refPixSize;
	this.curWidth = myRefRect.getAttributeNS(null,"width") * refPixSize;
	this.curHeight = myRefRect.getAttributeNS(null,"height") * refPixSize;
	var myViewBoxString = this.curxOrig + " " + this.curyOrig + " " + this.curWidth + " " + this.curHeight;
	this.pixSize = this.curWidth / this.pixWidth;
	this.zoomVal = this.origWidth / this.curWidth * 100;
	document.getElementById(this.mapName).setAttributeNS(null,"viewBox",myViewBoxString);
  }
  //holds data on window size
  function mapApp() {
  }		
  //calculate ratio and offset values of app window
  mapApp.prototype.resetFactors = function() {
	var svgroot = document.documentElement;
	if (!svgroot.getScreenCTM) {
		//case for ASV3 and Corel
		var viewBoxArray = svgroot.getAttributeNS(null,"viewBox").split(" ");
		var myRatio = viewBoxArray[2]/viewBoxArray[3];
		if ((window.innerWidth/window.innerHeight) > myRatio) { //case window is more wide than myRatio
			this.scaleFactor = viewBoxArray[3] / window.innerHeight;
		}
		else { //case window is more tall than myRatio
			this.scaleFactor = viewBoxArray[2] / window.innerWidth;		
		}
		this.offsetX = (window.innerWidth - viewBoxArray[2] * 1 / this.scaleFactor) / 2;
		this.offsetY = (window.innerHeight - viewBoxArray[3] * 1 / this.scaleFactor) / 2;
		}
  }
   mapApp.prototype.calcCoord = function(coordx,coordy) {
	var svgroot = document.documentElement;
	var coords = new Array();
	if (!svgroot.getScreenCTM) {
	  //case ASV3 a. Corel
	  coords["x"] = (coordx  - this.offsetX) * this.scaleFactor;
	  coords["y"] = (coordy - this.offsetY) * this.scaleFactor;
	}
	else {
	  matrix=svgroot.getScreenCTM();
	  coords["x"]= matrix.inverse().a*coordx+matrix.inverse().c*coordy+matrix.inverse().e;
	  coords["y"]= matrix.inverse().b*coordx+matrix.inverse().d*coordy+matrix.inverse().f;
	 }
	return coords;
  }		
  
  //make an element draggable with constraints
  function dragObj(dragId,constrXmin,constrXmax,constrYmin,constrYmax,refPoint) {
	this.dragId = dragId;
	this.constrXmin = constrXmin;
	this.constrXmax = constrXmax;
	this.constrYmin = constrYmin;
	this.constrYmax = constrYmax;
	this.refPoint = refPoint;
	this.status = "false";
  }
  dragObj.prototype.drag = function(evt) {
        //works only for rect and use-elements
        var myDragElement = evt.target;
	if (evt.type == "mousedown") {
		var coords = myMapApp.calcCoord(evt.clientX,evt.clientY);
		this.curX = coords["x"];
		this.curY = coords["y"];
		this.status = "true";
	}
	if (evt.type == "mousemove" && this.status == "true") {
		var coords = myMapApp.calcCoord(evt.clientX,evt.clientY);
		var newEvtX = coords["x"];
		var newEvtY = coords["y"];
		var bBox = myDragElement.getBBox();
		if (this.refPoint == "ul") {
		  var toMoveX = bBox.x + newEvtX - this.curX;
		  var toMoveY = bBox.y + newEvtY - this.curY;
		}
		else {
		  //refPoint = center
		  var toMoveX = bBox.x + bBox.width / 2 + newEvtX - this.curX;
		  var toMoveY = bBox.y + bBox.height / 2 + newEvtY - this.curY;
		}
		if ((bBox.x + newEvtX - this.curX) < this.constrXmin) {
		  if(this.refPoint == "ul") {
		     toMoveX = this.constrXmin;
		  }
		  else {
		   toMoveX = this.constrXmin + bBox.width / 2;
		  }
	        }
		if ((bBox.x + newEvtX - this.curX + bBox.width) > this.constrXmax) {
			if(this.refPoint == "ul") {
		  	  toMoveX = this.constrXmax - bBox.width;
			}
			else {
		  	  toMoveX = this.constrXmax - bBox.width / 2;
			}					
		}
		if ((bBox.y + newEvtY - this.curY) < this.constrYmin) {
	 		if(this.refPoint == "ul") {
		  	 toMoveY = this.constrYmin;
			}
			else {
		  	 toMoveY = this.constrYmin + bBox.height / 2;
			}
		}
		if ((bBox.y + bBox.height + newEvtY - this.curY) > this.constrYmax) {
			if(this.refPoint == "ul") {
		  	 toMoveY = this.constrYmax - bBox.height;
			}
			else {
		 	 toMoveY = this.constrYmax - bBox.height / 2;
			}					
		}
		myDragElement.setAttributeNS(null,"x",toMoveX);
		myDragElement.setAttributeNS(null,"y",toMoveY);
		this.curX = newEvtX;
		this.curY = newEvtY;
	}
	if (evt.type == "mouseup" || evt.type == "mouseout") {
		this.status = "false";
	}			
  }
  dragObj.prototype.zoom = function(inOrOut) {
	var myDragElement = document.getElementById(this.dragId);
	var myOldX = myDragElement.getAttributeNS(null,"x");
	var myOldY = myDragElement.getAttributeNS(null,"y");
	var myOldWidth = myDragElement.getAttributeNS(null,"width");
	var myOldHeight = myDragElement.getAttributeNS(null,"height");
	switch (inOrOut) {
	   case "in":
		var myNewX = parseFloat(myOldX) + myOldWidth / 2 - (myOldWidth * myMainMap.zoomFact * 0.5);
		var myNewY = parseFloat(myOldY) + myOldHeight / 2 - (myOldHeight * myMainMap.zoomFact * 0.5);
		var myNewWidth = myOldWidth * myMainMap.zoomFact;
		var myNewHeight = myOldHeight * myMainMap.zoomFact;
		break;
	   case "out":
		var myNewX = parseFloat(myOldX) + myOldWidth / 2 - (myOldWidth * (1 + myMainMap.zoomFact) * 0.5);
		var myNewY = parseFloat(myOldY) + myOldHeight / 2 - (myOldHeight * (1 + myMainMap.zoomFact) * 0.5);
		var myNewWidth = myOldWidth * (1 + myMainMap.zoomFact);
		var myNewHeight = myOldHeight * (1 + myMainMap.zoomFact);
		break;
           case "down":
                var myNewX = parseFloat(myOldX);
                var myNewY = parseFloat(myOldY) +1.3* 6.*myMainMap.zoomFact;
                var myNewWidth = myOldWidth ;
                var myNewHeight = myOldHeight ;
                break;
           case "up":
                var myNewX = parseFloat(myOldX);
                var myNewY = parseFloat(myOldY) -1.3*6.* myMainMap.zoomFact;
                var myNewWidth = myOldWidth ;
                var myNewHeight = myOldHeight ;
                break;
           case "left":
                var myNewX = parseFloat(myOldX) - 3.*6.* myMainMap.zoomFact;
                var myNewY = parseFloat(myOldY);
                var myNewWidth = myOldWidth ;
                var myNewHeight = myOldHeight ;
                break;
           case "right":
                var myNewX = parseFloat(myOldX)+3.*6.* myMainMap.zoomFact;
                var myNewY = parseFloat(myOldY);
                var myNewWidth = myOldWidth ;
                var myNewHeight = myOldHeight ;
                break;
           case "PIXB":
                var myNewX = 0.;
                var myNewY = 540.;
                var myNewWidth = 62. ;
                var myNewHeight = 36. ;
                updatetree(31,3);
                break;
           case "FPIX-z":
                var myNewX = 0.;
                var myNewY = 581.;
                var myNewWidth = 35.83 ;
                var myNewHeight = 21.01 ;
                updatetree(14,2);
                break;
           case "FPIX+z":
                var myNewX = 0.;
                var myNewY = 516.;
                var myNewWidth = 35.83 ;
                var myNewHeight = 21.01 ;
                updatetree(16,2);
                break;
           case "TID-z":
                var myNewX = 40.0;
                var myNewY = 585.;
                var myNewWidth = 34. ;
                var myNewHeight = 15. ;
                updatetree(10,3);
                break;
           case "TID+z":
                var myNewX = 40.0;
                var myNewY = 520.;
                var myNewWidth = 34. ;
                var myNewHeight = 15. ;
                updatetree(19,3);
                break;
           case "TOB":
                var myNewX = 97.;
                var myNewY = 542.;
                var myNewWidth = 72. ;
                var myNewHeight = 36. ;
                updatetree(38,6);
                break;
           case "TIB":
                var myNewX = 46.8;
                var myNewY = 540.;
                var myNewWidth = 64.8 ;
                var myNewHeight = 38. ;
                updatetree(34,4);
                break;
           case "TIB layer1":
                var myNewX = 46.8;
                var myNewY = 560.;
                var myNewWidth = 32.0 ;
                var myNewHeight = 19. ;
                updatetree(34,1);
                break;
           case "TIB layer2":
                var myNewX = 46.8;
                var myNewY = 540.;
                var myNewWidth = 32.0 ;
                var myNewHeight = 19. ;
                updatetree(35,1);
                break;
           case "TIB layer3":
                var myNewX = 72.;
                var myNewY = 560.;
                var myNewWidth = 32.0 ;
                var myNewHeight = 19. ;
                updatetree(36,1);
                break;
           case "TIB layer4":
                var myNewX = 72.;
                var myNewY = 540.;
                var myNewWidth = 32.0 ;
                var myNewHeight = 19. ;
                updatetree(37,1);
                break;
           case "TEC-z":
                var myNewX = 73.8;
                var myNewY = 568.;
                var myNewWidth = 115.2 ;
                var myNewHeight = 57.6 ;
                updatetree(1,9);
                break;
           case "TEC+z":
                var myNewX = 73.8;
                var myNewY = 500.;
                var myNewWidth = 115.2 ;
                var myNewHeight = 57.6 ;
                updatetree(22,9);
                break;

	   default:
		var myNewX = this.constrXmin;
		var myNewY = this.constrYmin;
		var myNewWidth = this.constrXmax - this.constrXmin;
		var myNewHeight = this.constrYmax - this.constrYmin;
		break;
	}
if(inOrOut=="in" || inOrOut=="out" || inOrOut=="full"){
	if (myNewWidth > (this.constrXmax - this.constrXmin)) {
		myNewWidth = this.constrXmax - this.constrXmin;
	}
	if (myNewHeight > (this.constrYmax - this.constrYmin)) {
		myNewHeight = this.constrYmax - this.constrYmin;
	}
	if (myNewX < this.constrXmin) {
		myNewX = this.constrXmin;
	}
	if (myNewY < this.constrYmin) {
		myNewY = this.constrYmin;
	}
	if ((myNewX + myNewWidth) > this.constrXmax) {
		myNewX = this.constrXmax - myNewWidth;
	}
	if ((myNewY + myNewHeight) > this.constrYmax) {
		myNewY = this.constrYmax - myNewHeight;
	}
	}
	myDragElement.setAttributeNS(null,"x",myNewX);
	myDragElement.setAttributeNS(null,"y",myNewY);
	myDragElement.setAttributeNS(null,"width",myNewWidth);
	myDragElement.setAttributeNS(null,"height",myNewHeight);
	myMainMap.newViewBox(this.dragId,"referenceMap");
  }
 function updatetree(from,nlayer){
                var trackerin=document.getElementById("trackerin"); 
              var  trackerin1=trackerin.cloneNode(false);
	for (var i = from; i < from+nlayer;i++) {
                //var layername="layer"+i; 
                //trackerin1.appendChild(document.getElementById(layername));
                trackerin1.appendChild(layeradd[i]);
                                       }
                trackerin.parentNode.replaceChild(trackerin1,trackerin);
  }
  //magnifier glass mouse-over effects
  function magnify(evt,scaleFact,inOrOut) {
	if (inOrOut == "in") {
	   if (myMainMap.zoomVal < myMainMap.maxZoom) {
	      scaleObject(evt,scaleFact);
	   }
	   else {
	   }
	}
	if (inOrOut == "out") {
           if (myMainMap.zoomVal > myMainMap.minZoom) {
	       scaleObject(evt,scaleFact);
	   }
	   else {
	   }		
	}
	if (inOrOut == "full") {
	   if (myMainMap.zoomVal > myMainMap.minZoom) {
	      scaleObject(evt,scaleFact);
	   }
	   else {			
	   }		
	}
	if (scaleFact == 1) {	
	   scaleObject(evt,scaleFact);
        }
  }
  //scale an object
  function scaleObject(evt,factor) {
  //reference to the currently selected object
        var element = evt.currentTarget;
	var myX = element.getAttributeNS(null,"x");
	var myY = element.getAttributeNS(null,"y");
        var newtransform = "scale(" + factor + ") translate(" + (myX * 1 / factor - myX) + " " + (myY * 1 / factor - myY) +")";
        element.setAttributeNS(null,'transform', newtransform);
  }
  function zoomIt(inOrOut) {
	if (inOrOut == "in") {
	   if (myMainMap.zoomVal < myMainMap.maxZoom) {
              myRefMapDragger.zoom("in");
	   }
	   else {
	   }
	}
	if (inOrOut == "out") {
	   if (myMainMap.zoomVal > myMainMap.minZoom) {
	       myRefMapDragger.zoom("out");
	   }
	   else {			
	   }		
	}
	if (inOrOut == "full") {
	     if (myMainMap.zoomVal > myMainMap.minZoom) {
	        myRefMapDragger.zoom("full");				
	     }
	     else {	
	     }		
	}
if(inOrOut!="in" && inOrOut!="out" && inOrOut!="full") myRefMapDragger.zoom(inOrOut);
  }

function pausecomp(millis)
{
  var inizio = new Date();
  var inizioint=inizio.getTime();
  var intervallo = 0;
  while(intervallo<millis){
    var fine = new Date();
    var fineint=fine.getTime();
     intervallo = fineint-inizioint;
   }
  return;
}
function getLayer()
{
  var DropDown = document.getElementById("menus");
   var namelayer=DropDown.options[DropDown.selectedIndex].value;
   var Output = document.getElementById("output");
   Output.setAttributeNS(null,"value",namelayer);
   zoomIt(namelayer);
   
}
