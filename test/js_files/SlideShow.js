var SlideShow = {};

SlideShow.DEBUG = true;
SlideShow.slideList = new Array();
SlideShow.slideShowSpeed = 10000;  // miliseconds
SlideShow.index = 0;
SlideShow.nSlides = 0;
SlideShow.MAX_SLIDES = 20;
SlideShow.timerID = null;
//
// -- Start slide show
//
SlideShow.StartSlideShow = function()
{
 setSlide(index);
 index = (index+1) % nSlides;
 timerID = setTimeout('StartSlideShow()', slideShowSpeed);
}
//
// -- Stop slide show
//
SlideShow.StopSlideShow = function()
{
 if (timerID != null) clearTimeout(timerID);
}
//
// -- Show first slide
//
SlideShow.ShowFirst  = function()
{
 setSlide(0);
}
//
// -- Show last slide
//
SlideShow.ShowLast = function()
{
 setSlide(nSlides-1);
}
//
// -- Show previous slide
//
SlideShow.ShowPrev = function()
{
 index = (index-1) % nSlides;
 if (index<0) index = nSlides-1;
 setSlide(index);
}
//
// -- Show next slide
//
SlideShow.ShowNext = function()
{
 index = (index+1) % nSlides;
 setSlide(index);
}
//
// -- Set a specific slide
//
SlideShow.setSlide = function(index) 
{
 if (nSlides == 0) {
   if (DEBUG) alert("No canvas name selected!");
   return false;
 }
 var canvas = document.getElementById("drawingcanvas");
 if (canvas == null) return;
 var image_src = slideList[index];
 image_src += '?t=' + Math.random();  //Should start with "?"
 canvas.src = image_src;
}

