var DEBUG = true;
var slideList = new Array();
var slideShowSpeed = 10000;  // miliseconds
var index = 0;
var nSlides = 0;
var MAX_SLIDES = 20;
var timerID;


//function FillSlides() {
//  var image_src;
//  image_src = getApplicationURL() + "/temporary/GlobalTracks.png";
//  slideList[0] = image_src;
//  image_src = getApplicationURL() + "/temporary/LocalTracks.png";
//  slideList[1] = image_src;
//  image_src = getApplicationURL() + "/temporary/TIBSummary.png";
//  slideList[2] = image_src;
//  image_src = getApplicationURL() + "/temporary/TOBSummary.png";
//  slideList[3] = image_src;
//  image_src = getApplicationURL() + "/temporary/TIDFSummary.png";
//  slideList[4] = image_src;
//  nSlides = slideList.length;
//}
function StartSlideShow() {
 setSlide(index);
 index = (index+1) % nSlides;
 timerID = setTimeout('StartSlideShow()', slideShowSpeed);
}
function StopSlideShow() {
 if (timerID != null) clearTimeout(timerID);
}
function ShowFirst() {
 setSlide(0);
}
function ShowLast() {
 setSlide(nSlides-1);
}
function ShowPrev() {
 index = (index-1) % nSlides;
 if (index<0) index = nSlides-1;
 setSlide(index);
}
function ShowNext() {
 index = (index+1) % nSlides;
 setSlide(index);
}
function setSlide(index) {
 if (nSlides == 0) {
   if (DEBUG) alert("No canvas name selected!");
   return false;
 }
 var canvas = document.getElementById("drawingcanvas");
 if (canvas == null) return;
 var url = slideList[index];
 canvas.src = url;
}
