window.onload=function(){
  initTabs('dhtmlgoodies_tabView1', Array('Shifter View', 'Summary View','Alarm View', 'Expert View'), 0, '99.5%','100%');

  document.onkeypress = CommonActions.stopRKey;
  CommonActions.ShowProgress('visible', 'Histograms from Collector');
  CommonActions.ShowButtons(true);
  CommonActions.ShowTabs('hidden');  
//  FillSlides();

  CommonActions.RequestReadyState();
}
var CommonActions = {};
//
// --Get File
//
CommonActions.GetFile = function() 
{
  var obj   = document.getElementById("filename");
  var fname =  obj.options[obj.selectedIndex].value;
  return fname;
}
//
// -- Get Reference File
//
CommonActions.GetRefFile = function() 
{
  var obj   = document.getElementById("ref_filename");
  var fname = obj.options[obj.selectedIndex].value;
  return fname;
}
//
// -- Get Selected Histos
//
CommonActions.GetSelectedHistos = function() 
{
  var hlist = new Array();
  var obj   = document.getElementById("histolistarea");
  var len   = obj.length; 
  if (len == 0) {
    alert("Histogram List Area Empty!");
  } else {
    for (var i = 0; i < len; i++) {
      if (obj.options[i].selected) {
	hlist[hlist.length] = obj.options[i].value;
      }
    }
  }
  return hlist;
}
//
// -- Get plotting options
//
CommonActions.GetPlotOptions = function()
{
  var hlist = new Array();
  var obj = document.getElementById("histolistarea");
  var len = obj.length; 
  if (len == 0) {
    alert("Histogram List Area Empty!");
  } else {
    for (var i = 0; i < len; i++) {
      if (obj.options[i].selected) {
	hlist[hlist.length] = obj.options[i].value;
      }
    }
  }
  return hlist;
}
//
// -- Fill text area with comments
//
CommonActions.FillText = function(id, text)
{
 var obj = document.getElementById(id);
 if (obj != null) {
   obj.innerHTML = '<PRE>'+text+'</PRE>';
 }
}
//
// -- Set selected value 
//
CommonActions.SetSelectedValue = function() {
  var aobj = document.getElementById("module_numbers");
  if (aobj != null) {
    var value =  aobj.options[aobj.selectedIndex].value;
    var bobj = document.getElementById("module_number_edit");
    if (bobj != null) {
      bobj.value = value;
    }   
  }
}
//
// -- just a dummy function
//
CommonActions.DummayAction = function() 
{
  alert ("Hello World ");
}
//
// -- Disable 
//
CommonActions.stopRKey = function(evt) 
{
 var evt  = (evt) ? evt : ((event) ? event : null);
 var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement :null);
 if ((evt.keyCode == 13) && (node.type=="text"))  {return false;}
}
//
// -- Make the Tabs visible/invisible
//
CommonActions.ShowTabs = function(option) 
{
  var obj = document.getElementById("dhtmlgoodies_tabView1");
  if (obj == null) return;
  obj.style.visibility = option; // "visible" or "hidden"
}
//
// -- Make the buttons visible/invisible
//
CommonActions.ShowButtons = function(option) 
{
  var obj;
  obj = document.getElementById("create_summary");
  if (obj != null ) obj.disabled=option;
  obj = document.getElementById("check_qtest_result");
  if (obj != null ) obj.disabled=option;
  obj = document.getElementById("create_tkmap");
  if (obj != null ) obj.disabled=option;
  obj = document.getElementById("draw_summary");
  if (obj != null ) obj.disabled=option;
}
//
// -- Show the progress bar with comment during waiting time
//
CommonActions.ShowProgress = function(option)
{
  var progress = document.getElementById('progressbar');
  if (progress == null) return;

  var label = document.getElementById('progress_message');
  if (label == null) return;

  var args = arguments[1];
  if (args != null && args.length > 0) {
    label.innerHTML = '<B>Please wait, loading '+args +'</B>';
  }
  progress.style.visibility = option; // "visible" or "hidden"
}
//
// -- Check whether the DQM Client is ready with histograms
//
CommonActions.RequestReadyState = function()
{
  var url         = WebLib.getApplicationURL2();
  var queryString = "RequestID=IsReady";
  queryString += '&width='+IMGC.BASE_IMAGE_WIDTH+
                 '&height='+IMGC.BASE_IMAGE_HEIGHT;
  url             += queryString;
  var getMEURLS = new Ajax.Request(url,                    
 	 		         {			  
 	 		          method: 'get',	  
 			          parameters: '', 
 			          onSuccess: CommonActions.FillReadyState 
 			         });
}
CommonActions.FillReadyState = function(transport) 
{
  try {
    var callAgain = false;
    var doc       = transport.responseXML;
    var root      = doc.documentElement;

    var aobj            = document.getElementById("summary_plot_type");
    aobj.options.length = 0;
    
    var hrows = root.getElementsByTagName('LName');
//    alert(" rows = " + hrows.length);
    if (hrows.length < 1) {
      callAgain = true; 
    }  else {
      for (var i = 0; i < hrows.length; i++) {
        var l_name  = hrows[i].childNodes[0].nodeValue;
        var aoption = new Option(l_name, l_name);
        try {
          aobj.add(aoption, null);
          var image_src = WebLib.getApplicationURL() + "/temporary/" + l_name + ".png";
          SlideShow.slideList[i] = image_src; 
        }
        catch (e) {
          aobj.add(aoption, -1);
        }
      }
      SlideShow.nSlides = SlideShow.slideList.length;
      CommonActions.ShowButtons(false);
      CommonActions.ShowTabs('visible');
      CommonActions.ShowProgress('hidden');
    }
    if (callAgain) setTimeout('CommonActions.RequestReadyState()',20000);
  }
  catch (err) {
    alert ("[CommonActions.FillReadyState] Error detail: " + err.message); 
  }
}

