var SiStripFedTrackerMap = {} ;

 SiStripFedTrackerMap.thisFile	= "sistrip_fedtrackermap.js" ;
 SiStripFedTrackerMap.theZoomAmount   = 1.05 ;
 SiStripFedTrackerMap.theStepAmount   = 25 ;
 SiStripFedTrackerMap.zoomAmount	= SiStripFedTrackerMap.theZoomAmount ;
 SiStripFedTrackerMap.stepAmount	= SiStripFedTrackerMap.theStepAmount ;
 SiStripFedTrackerMap.theViewText	= null ;
 SiStripFedTrackerMap.theElementText  = null ;
 SiStripFedTrackerMap.theSelectedText = null ;
 SiStripFedTrackerMap.theClipArea     = null ;
 SiStripFedTrackerMap.where  	 	= null ;
 SiStripFedTrackerMap.oldPosX	 	= 0 ;
 SiStripFedTrackerMap.oldPosY	 	= 0 ;
 SiStripFedTrackerMap.panning	 	= 0 ;
 SiStripFedTrackerMap.gotResponse	= 0 ;
 SiStripFedTrackerMap.timeOutHandle ;

 SiStripFedTrackerMap.init = function()
 {
  SiStripFedTrackerMap.theClipArea         = document.getElementById("clipArea") ;
  SiStripFedTrackerMap.theViewText         = document.getElementById("currentViewText") ;
  SiStripFedTrackerMap.theElementText      = document.getElementById("currentElementText") ;
  SiStripFedTrackerMap.theSelectedText     = document.getElementById("selectedElementText") ;
  SiStripFedTrackerMap.theClipArea.addEventListener("mousedown",       SiStripFedTrackerMap.mouseDownListener,   false);
 }
SiStripFedTrackerMap.updateTrackerMap = function()
 {
var xlinkns = "http://www.w3.org/1999/xlink"; 
var myTrackerPlot = document.getElementById("bgimage");
var url = 'svgmap1.png';
myTrackerPlot.setAttributeNS( xlinkns, "xlink:href", url);  
}
 //____________________________________________________________________________
SiStripFedTrackerMap.getLayer =function(what)
{
  if(what=="All") 
{
  for(var i=0;i<6;i++)
{
  var formname=document.getElementById('layerselect');
  if(formname.what[i].checked)
{
  var namedet=formname.what[i].getAttribute("value");
  var menuname="menu"+namedet;
  var DropDown = document.getElementById(menuname);
   var namelayer=DropDown.options[DropDown.selectedIndex].value;
   SiStripFedTrackerMap.theSelectedText.setAttribute("value",namelayer); 
   SiStripFedTrackerMap.zoomIt(namelayer);
}else{ }
}
  
} else {
  var menuname="menu"+what;
  var DropDown = document.getElementById(menuname);
   var namelayer=DropDown.options[DropDown.selectedIndex].value;
   SiStripFedTrackerMap.theSelectedText.setAttribute("value",namelayer); 
   SiStripFedTrackerMap.zoomIt(namelayer);
}
}

 //____________________________________________________________________________
 SiStripFedTrackerMap.showData = function (evt)
 {
//alert(evt.type);
  if(evt.type=="click")
  SiStripFedTrackerMap.theClipArea.addEventListener("mousedown",       SiStripFedTrackerMap.mouseDownListener,   true);
}
 //____________________________________________________________________________
 SiStripFedTrackerMap.mouseDownListener = function(evt)
 {
  SiStripFedTrackerMap.panning = 1 ;
  SiStripFedTrackerMap.oldPosX = evt.clientX ;
  SiStripFedTrackerMap.oldPosY = evt.clientY ;
  SiStripFedTrackerMap.theClipArea.setAttribute("style","cursor: move;");
  document.addEventListener("mousemove", SiStripFedTrackerMap.mouseMoveListener, true);
  document.addEventListener("mouseup",   SiStripFedTrackerMap.mouseUpListener,   true);
 }
 //____________________________________________________________________________
 SiStripFedTrackerMap.mouseUpListener = function(evt)
 {
  SiStripFedTrackerMap.panning = 0;
  SiStripFedTrackerMap.theClipArea.setAttribute("style","cursor: default;");
 }
//____________________________________________________________________________
 SiStripFedTrackerMap.mouseMoveListener = function(evt)
 {
  var stepTolerance = 1 ;
  if( SiStripFedTrackerMap.panning == 1 )
  {
   var deltaX = evt.clientX - SiStripFedTrackerMap.oldPosX ;
   var deltaY = evt.clientY - SiStripFedTrackerMap.oldPosY ;
   SiStripFedTrackerMap.oldPosX    = evt.clientX ;
   SiStripFedTrackerMap.oldPosY    = evt.clientY ;
   if( deltaX > stepTolerance && Math.abs(deltaY) < stepTolerance)
   {
     SiStripFedTrackerMap.zoomIt("Right") ;
     return ;
   } else if ( deltaX < -stepTolerance && Math.abs(deltaY) < stepTolerance){
     SiStripFedTrackerMap.zoomIt("Left") ;
     return ;
   } 
   if( deltaY > stepTolerance && Math.abs(deltaX) < stepTolerance )
   {
     SiStripFedTrackerMap.zoomIt("Down") ;
     return ;
   } else if( deltaY < -stepTolerance && Math.abs(deltaX) < stepTolerance ){
     SiStripFedTrackerMap.zoomIt("Up") ;
     return ;
   } 
  } else {
  }
 }
 
//____________________________________________________________________________
 SiStripFedTrackerMap.zoomIt = function(what)
 {
var vBAtt = SiStripFedTrackerMap.theClipArea.getAttribute("viewBox") ;
  var geo   = vBAtt.split(/\s+/) ;

  SiStripFedTrackerMap.theViewText.setAttribute("value",what) ;
  SiStripFedTrackerMap.theElementText.setAttribute("value",geo[0]+" "+geo[1]+" "+geo[2]+" "+geo[3]);
switch (what) 
  {
   case "TIB":
       geo[0]=    750 ;
       geo[1]=    550 ;
       geo[2]= 1120 ;
       geo[3]= 593 ;
       break;
   case "TOB":
       geo[0]=    1650 ;
       geo[1]=    525 ;
       geo[2]= 1176 ;
       geo[3]= 622 ;
       break;
   case "TID-z":
       geo[0]=    650 ;
       geo[1]=    1175 ;
       geo[2]= 507 ;
       geo[3]= 265 ;
       break;
   case "TID+z":
       geo[0]=    675 ;
       geo[1]=    175 ;
       geo[2]= 507 ;
       geo[3]= 265 ;
       break;
   case "TEC-z":
       geo[0]=    1200 ;
       geo[1]=    950 ;
       geo[2]= 1779 ;
       geo[3]= 918 ;
       break;
   case "TEC+z":
       geo[0]=   1200 ;
       geo[1]=    -150 ;
       geo[2]= 1779 ;
       geo[3]= 918 ;
       break;
   case "Home":
       geo[0]=    0 ;
       geo[1]=    0 ;
       geo[2]= 3000 ;
       geo[3]= 1600 ;
       break;
   case "In":
       geo[2]= parseFloat(geo[2]) / SiStripFedTrackerMap.zoomAmount ;
       geo[3]= parseFloat(geo[3]) / SiStripFedTrackerMap.zoomAmount ;
       break;
   case "Out":
       geo[2]= parseFloat(geo[2]) * SiStripFedTrackerMap.zoomAmount ;
       geo[3]= parseFloat(geo[3]) * SiStripFedTrackerMap.zoomAmount ;
       break;
   case "Up":
       geo[1]= parseInt(geo[1])   + SiStripFedTrackerMap.stepAmount ;
       break;
   case "Down":
       geo[1]= parseInt(geo[1])   - SiStripFedTrackerMap.stepAmount ;
       break;
   case "Left":
       geo[0]= parseInt(geo[0])   + SiStripFedTrackerMap.stepAmount ;
       break;
   case "Right":
       geo[0]= parseInt(geo[0])   - SiStripFedTrackerMap.stepAmount ;
       break;
   case "TIB1":
       geo[0]=    750 ;
       geo[1]=    850 ;
       geo[2]= 561 ;
       geo[3]= 295 ;
       break;
  }
  var newGeo = geo[0]+" "+geo[1]+" "+parseInt(geo[2])+" "+parseInt(geo[3]);
  SiStripFedTrackerMap.theClipArea.setAttribute("viewBox",newGeo) ;
  //SiStripSvgMap.showIt() ;  
}

 //____________________________________________________________________________
 SiStripFedTrackerMap.showIt = function()
 {
  var where = document.getElementsByTagName("text");
  for( var i=0; i<where.length; i++)
  {
   if( where[i].getAttribute("name") == "overlappingDetectorLabel" )
   {
    var theStyle = where[i].getAttribute("style") ;
    if( theStyle.match(/visible/)) 
    {
     return ;
    }
    theStyle    += " visibility: visible;" ;
    where[i].setAttribute("style", theStyle) ;
   }
  }
 }

