var SiStripSvgMap = {} ;

 SiStripSvgMap.thisFile	= "sistrip_svgmap.js" ;
 SiStripSvgMap.theZoomAmount   = 1.05 ;
 SiStripSvgMap.theStepAmount   = 25 ;
 SiStripSvgMap.zoomAmount	= SiStripSvgMap.theZoomAmount ;
 SiStripSvgMap.stepAmount	= SiStripSvgMap.theStepAmount ;
 SiStripSvgMap.theViewText	= null ;
 SiStripSvgMap.theElementText  = null ;
 SiStripSvgMap.theSelectedText = null ;
 SiStripSvgMap.theClipArea     = null ;
 SiStripSvgMap.where  	 	= null ;
 SiStripSvgMap.oldPosX	 	= 0 ;
 SiStripSvgMap.oldPosY	 	= 0 ;
 SiStripSvgMap.panning	 	= 0 ;
 SiStripSvgMap.gotResponse	= 0 ;
 SiStripSvgMap.timeOutHandle ;
 SiStripSvgMap.layeradd = new Array();
 SiStripSvgMap.layerselected = 0;

 SiStripSvgMap.init = function()
 {
  SiStripSvgMap.theClipArea         = document.getElementById("clipArea") ;
  SiStripSvgMap.theViewText         = document.getElementById("currentViewText") ;
  SiStripSvgMap.theElementText      = document.getElementById("currentElementText") ;
  SiStripSvgMap.theSelectedText     = document.getElementById("selectedElementText") ;
  //var theRefresh             = top.opener.document.getElementById("refreshInterval") ;
  //var refreshInterval        = theRefresh.options[theRefresh.selectedIndex].value;
  //SiStripSvgMap.theClipArea.addEventListener('DOMMouseScroll',  SiStripSvgMap.mouseScrollListener, false);
  SiStripSvgMap.theClipArea.addEventListener("mousedown",       SiStripSvgMap.mouseDownListener,   false);
  //setTimeout( "SvgMap.updateTrackerMap()",1000) ; // Capture first data snapshot as soon as possibile
  //setInterval("SvgMap.updateTrackerMap()",refreshInterval) ;
   for (var i = 1; i < 44;i++) {
                var layername="layer"+i;
                SiStripSvgMap.layeradd[i]=document.getElementById(layername);
               // alert(layername+SiStripSvgMap.layeradd[i]);
                }
 }
function showData(evt) {
SiStripSvgMap.where  = evt.currentTarget;
if (evt.type == "mouseover") //   <----------------------------------------------- 
  {
     var theStyle = SiStripSvgMap.where.getAttribute("style") ;
    try
    {
     var opacity  = theStyle.match(/fill-opacity:\\s+(\\d+)/) ;
     theStyle     = "cursor:crosshair; fill-opacity: " + opacity ;
    } catch(error) {
     theStyle     = "cursor:crosshair; fill-opacity: 1" ;
    } 
    SiStripSvgMap.where.setAttribute("style",theStyle) ;
    SiStripSvgMap.theElementText.setAttribute("value",SiStripSvgMap.where.getAttribute("POS")+
                                               " -- Entries:" + 
					       SiStripSvgMap.where.getAttribute("entries")) ;
  }

  if (evt.type == "mouseout")  //   <-----------------------------------------------
  {
   SiStripSvgMap.theElementText.setAttribute("value","-") ;
  }
  if (evt.type == "click")  //   <-----------------------------------------------
  {

    var canvas = parent.parent.plot_area.IMGC
    var moduleId =  evt.currentTarget.getAttribute("detid");
    var queryString = "RequestID=PlotTkMapHistogram";
    queryString+= "&ModId=" + moduleId;
    canvas.computeCanvasSize();
    queryString += '&width='+canvas.BASE_IMAGE_WIDTH+
                   '&height='+canvas.BASE_IMAGE_HEIGHT;
    canvas.IMAGES_PER_ROW      = 2;
    canvas.IMAGES_PER_COL      = 2; 
    canvas.IMAGES_PER_PAGE     = canvas.IMAGES_PER_ROW * canvas.IMAGES_PER_COL;

    var url_serv = parent.WebLib.getApplicationURL2();
              
    var url1 = url_serv  + queryString;
                             
    var getMEURLS = new parent.parent.plot_area.Ajax.Request(url1,                    
		         {			  
		          method: 'get',	  
	                  parameters: '', 
		          onComplete: canvas.processIMGCPlots // <-- call-back function
		         });
  }

 }
SiStripSvgMap.updateTrackerMap = function()
 {
var xlinkns = "http://www.w3.org/1999/xlink"; 
var myTrackerPlot = document.getElementById("bgimage");
var url = 'svgmap.png';
myTrackerPlot.setAttributeNS( xlinkns, "xlink:href", url);  
if(SiStripSvgMap.layerselected!=0){
url = 'Layer'+SiStripSvgMap.layerselected+'.xml';
var getxml = new parent.Ajax.Request(url, {
 method:  'get',
 onSuccess: function(transport) {
    var modTags = transport.responseXML.getElementsByTagName('mod');
    for (var b = 0; b < modTags.length; b++) {
      var id = modTags[b].getAttribute('id');
      var color = modTags[b].getAttribute('color');
      var polyline=document.getElementById(id);
      var theColor = 'rgb'+color ;
      polyline.setAttribute("fill",theColor);
     }
     }
     });
  }
}
 //____________________________________________________________________________
SiStripSvgMap.getLayer =function(what)
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
   SiStripSvgMap.theSelectedText.setAttribute("value",namelayer); 
   SiStripSvgMap.zoomIt(namelayer);
}else{ }
}
  
} else {
  var menuname="menu"+what;
  var DropDown = document.getElementById(menuname);
   var namelayer=DropDown.options[DropDown.selectedIndex].value;
   SiStripSvgMap.theSelectedText.setAttribute("value",namelayer); 
   SiStripSvgMap.zoomIt(namelayer);
}
}

 //____________________________________________________________________________
 SiStripSvgMap.showData = function (evt)
 {
//alert(evt.type);
  if(evt.type=="click")
  SiStripSvgMap.theClipArea.addEventListener("mousedown",       SiStripSvgMap.mouseDownListener,   true);
}
 //____________________________________________________________________________
 SiStripSvgMap.mouseDownListener = function(evt)
 {
  SiStripSvgMap.panning = 1 ;
  SiStripSvgMap.oldPosX = evt.clientX ;
  SiStripSvgMap.oldPosY = evt.clientY ;
  SiStripSvgMap.theClipArea.setAttribute("style","cursor: move;");
  document.addEventListener("mousemove", SiStripSvgMap.mouseMoveListener, true);
  document.addEventListener("mouseup",   SiStripSvgMap.mouseUpListener,   true);
 }
 //____________________________________________________________________________
 SiStripSvgMap.mouseUpListener = function(evt)
 {
  SiStripSvgMap.panning = 0;
  SiStripSvgMap.theClipArea.setAttribute("style","cursor: default;");
 }
//____________________________________________________________________________
 SiStripSvgMap.mouseMoveListener = function(evt)
 {
  var stepTolerance = 1 ;
  if( SiStripSvgMap.panning == 1 )
  {
   var deltaX = evt.clientX - SiStripSvgMap.oldPosX ;
   var deltaY = evt.clientY - SiStripSvgMap.oldPosY ;
   SiStripSvgMap.oldPosX    = evt.clientX ;
   SiStripSvgMap.oldPosY    = evt.clientY ;
   if( deltaX > stepTolerance && Math.abs(deltaY) < stepTolerance)
   {
     SiStripSvgMap.zoomIt("Right") ;
     return ;
   } else if ( deltaX < -stepTolerance && Math.abs(deltaY) < stepTolerance){
     SiStripSvgMap.zoomIt("Left") ;
     return ;
   } 
   if( deltaY > stepTolerance && Math.abs(deltaX) < stepTolerance )
   {
     SiStripSvgMap.zoomIt("Down") ;
     return ;
   } else if( deltaY < -stepTolerance && Math.abs(deltaX) < stepTolerance ){
     SiStripSvgMap.zoomIt("Up") ;
     return ;
   } 
  } else {
  }
 }
 
//____________________________________________________________________________
 SiStripSvgMap.zoomIt = function(what)
 {
var vBAtt = SiStripSvgMap.theClipArea.getAttribute("viewBox") ;
  var geo   = vBAtt.split(/\s+/) ;

  SiStripSvgMap.theViewText.setAttribute("value",what) ;
  SiStripSvgMap.theElementText.setAttribute("value",geo[0]+" "+geo[1]+" "+geo[2]+" "+geo[3]);
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
       geo[2]= parseFloat(geo[2]) / SiStripSvgMap.zoomAmount ;
       geo[3]= parseFloat(geo[3]) / SiStripSvgMap.zoomAmount ;
       break;
   case "Out":
       geo[2]= parseFloat(geo[2]) * SiStripSvgMap.zoomAmount ;
       geo[3]= parseFloat(geo[3]) * SiStripSvgMap.zoomAmount ;
       break;
   case "Up":
       geo[1]= parseInt(geo[1])   + SiStripSvgMap.stepAmount ;
       break;
   case "Down":
       geo[1]= parseInt(geo[1])   - SiStripSvgMap.stepAmount ;
       break;
   case "Left":
       geo[0]= parseInt(geo[0])   + SiStripSvgMap.stepAmount ;
       break;
   case "Right":
       geo[0]= parseInt(geo[0])   - SiStripSvgMap.stepAmount ;
       break;
   case "TIB1":
       geo[0]=    750 ;
       geo[1]=    850 ;
       geo[2]= 561 ;
       geo[3]= 295 ;
       SiStripSvgMap.updatetree(34,1);
       break;
   case "TIB2":
       geo[0]=    750 ;
       geo[1]=    525 ;
       geo[2]= 561 ;
       geo[3]= 295 ;
       SiStripSvgMap.updatetree(35,1);
       break;
   case "TIB3":
       geo[0]=    1175 ;
       geo[1]=    825 ;
       geo[2]= 561 ;
       geo[3]= 295 ;
       SiStripSvgMap.updatetree(36,1);
       break;
   case "TIB4":
       geo[0]=    1150 ;
       geo[1]=    500 ;
       geo[2]= 561 ;
       geo[3]= 295 ;
       SiStripSvgMap.updatetree(37,1);
       break;
   case "TOB1":
       geo[0]=    1525 ;
       geo[1]=    825 ;
       geo[2]= 590 ;
       geo[3]= 309 ;
       SiStripSvgMap.updatetree(38,1);
       break;
   case "TOB2":
       geo[0]=    1600 ;
       geo[1]=    500 ;
       geo[2]= 590 ;
       geo[3]= 309 ;
       SiStripSvgMap.updatetree(39,1);
       break;
   case "TOB3":
       geo[0]=    1975 ;
       geo[1]=    825 ;
       geo[2]= 590 ;
       geo[3]= 309 ;
       SiStripSvgMap.updatetree(40,1);
       break;
   case "TOB4":
       geo[0]=    2000 ;
       geo[1]=    500 ;
       geo[2]= 590 ;
       geo[3]= 309 ;
       SiStripSvgMap.updatetree(41,1);
       break;
   case "TOB5":
       geo[0]=    2325 ;
       geo[1]=    825 ;
       geo[2]= 590 ;
       geo[3]= 309 ;
       SiStripSvgMap.updatetree(42,1);
       break;
   case "TOB6":
       geo[0]=    2375 ;
       geo[1]=    500 ;
       geo[2]= 619 ;
       geo[3]= 324 ;
       SiStripSvgMap.updatetree(43,1);
       break;
   case "TID-z1":
       geo[0]=    575 ;
       geo[1]=    1250 ;
       geo[2]= 279 ;
       geo[3]= 144 ;
       SiStripSvgMap.updatetree(12,1);
       break;
   case "TID-z2":
       geo[0]=    800 ;
       geo[1]=    1250 ;
       geo[2]= 279 ;
       geo[3]= 144 ;
       SiStripSvgMap.updatetree(11,1);
       break;
   case "TID-z3":
       geo[0]=    950 ;
       geo[1]=    1250 ;
       geo[2]= 279 ;
       geo[3]= 144 ;
       SiStripSvgMap.updatetree(10,1);
       break;
   case "TID+z1":
       geo[0]=    550 ;
       geo[1]=    250 ;
       geo[2]= 293 ;
       geo[3]= 152 ;
       SiStripSvgMap.updatetree(19,1);
       break;
   case "TID+z2":
       geo[0]=    750 ;
       geo[1]=    250 ;
       geo[2]= 293 ;
       geo[3]= 152 ;
       SiStripSvgMap.updatetree(20,1);
       break;
   case "TID+z3":
       geo[0]=    950 ;
       geo[1]=    250 ;
       geo[2]= 293 ;
       geo[3]= 152 ;
       SiStripSvgMap.updatetree(21,1);
       break;
   case "TEC-z1":
       geo[0]=    1100 ;
       geo[1]=    1200 ;
       geo[2]= 469 ;
       geo[3]= 240 ;
       SiStripSvgMap.updatetree(9,1);
       break;
   case "TEC-z2":
       geo[0]=    1300 ;
       geo[1]=    1200 ;
       geo[2]= 469 ;
       geo[3]= 240 ;
       SiStripSvgMap.updatetree(8,1);
       break;
   case "TEC-z3":
       geo[0]=    1450 ;
       geo[1]=    1200 ;
       geo[2]= 469 ;
       geo[3]= 240 ;
       SiStripSvgMap.updatetree(7,1);
       break;
   case "TEC-z4":
       geo[0]=    1650 ;
       geo[1]=    1200 ;
       geo[2]= 469 ;
       geo[3]= 240 ;
       SiStripSvgMap.updatetree(6,1);
       break;
   case "TEC-z5":
       geo[0]=    1850 ;
       geo[1]=    1200 ;
       geo[2]= 469 ;
       geo[3]= 240 ;
       SiStripSvgMap.updatetree(5,1);
       break;
   case "TEC-z6":
       geo[0]=    2050 ;
       geo[1]=    1200 ;
       geo[2]= 469 ;
       geo[3]= 240 ;
       SiStripSvgMap.updatetree(4,1);
       break;
   case "TEC-z7":
       geo[0]=    2250 ;
       geo[1]=    1200 ;
       geo[2]= 469 ;
       geo[3]= 240 ;
       SiStripSvgMap.updatetree(3,1);
       break;
   case "TEC-z8":
       geo[0]=    2450 ;
       geo[1]=    1200 ;
       geo[2]= 469 ;
       geo[3]= 240 ;
       SiStripSvgMap.updatetree(2,1);
       break;
   case "TEC-z9":
       geo[0]=    2650 ;
       geo[1]=    1200 ;
       geo[2]= 469 ;
       geo[3]= 240 ;
       SiStripSvgMap.updatetree(1,1);
       break;
   case "TEC+z1":
       geo[0]=   1075 ;
       geo[1]=    175 ;
       geo[2]= 517 ;
       geo[3]= 264 ;
       SiStripSvgMap.updatetree(22,1);
       break;
   case "TEC+z2":
       geo[0]=   1225 ;
       geo[1]=    175 ;
       geo[2]= 517 ;
       geo[3]= 264 ;
       SiStripSvgMap.updatetree(23,1);
       break;
   case "TEC+z3":
       geo[0]=   1425 ;
       geo[1]=    175 ;
       geo[2]= 517 ;
       geo[3]= 264 ;
       SiStripSvgMap.updatetree(24,1);
       break;
   case "TEC+z4":
       geo[0]=   1625 ;
       geo[1]=    175 ;
       geo[2]= 517 ;
       geo[3]= 264 ;
       SiStripSvgMap.updatetree(25,1);
       break;
   case "TEC+z5":
       geo[0]=   1825 ;
       geo[1]=    175 ;
       geo[2]= 517 ;
       geo[3]= 264 ;
       SiStripSvgMap.updatetree(26,1);
       break;
   case "TEC+z6":
       geo[0]=   2025 ;
       geo[1]=    175 ;
       geo[2]= 517 ;
       geo[3]= 264 ;
       SiStripSvgMap.updatetree(27,1);
       break;
   case "TEC+z7":
       geo[0]=   2225 ;
       geo[1]=    175 ;
       geo[2]= 517 ;
       geo[3]= 264 ;
       SiStripSvgMap.updatetree(28,1);
       break;
   case "TEC+z8":
       geo[0]=   2425 ;
       geo[1]=    175 ;
       geo[2]= 517 ;
       geo[3]= 264 ;
       SiStripSvgMap.updatetree(29,1);
       break;
   case "TEC+z9":
       geo[0]=   2625 ;
       geo[1]=    175 ;
       geo[2]= 517 ;
       geo[3]= 264 ;
       SiStripSvgMap.updatetree(30,1);
       break;
  }
  var newGeo = geo[0]+" "+geo[1]+" "+parseInt(geo[2])+" "+parseInt(geo[3]);
  SiStripSvgMap.theClipArea.setAttribute("viewBox",newGeo) ;
  //SiStripSvgMap.showIt() ;  
}
 //____________________________________________________________________________
  SiStripSvgMap.updatetree=function(from,nlayer){
                SiStripSvgMap.layerselected=from;
                var trackerin=document.getElementById("trackerin");
              var  trackerin1=trackerin.cloneNode(false);
        for (var i = from; i < from+nlayer;i++) {
                //var layername="layer"+i;
                //trackerin1.appendChild(document.getElementById(layername));
                trackerin1.appendChild(SiStripSvgMap.layeradd[i]);
                                       }
                trackerin.parentNode.replaceChild(trackerin1,trackerin);
  }

 //____________________________________________________________________________
 SiStripSvgMap.showIt = function()
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

