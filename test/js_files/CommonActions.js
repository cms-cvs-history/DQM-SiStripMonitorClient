window.onload=function(){
  initTabs('dhtmlgoodies_tabView1', Array( 'Shifter View', 
                                          'Non-Geom View', 
                                           'Summary View',
                                             'Alarm View', 
                                            'Expert View'), 0, '99.5%','100%');

  document.onkeypress = CommonActions.stopRKey;
  CommonActions.CreateTkStrustures();
  CommonActions.ReadTkMapOptions();
  CommonActions.ShowProgress('visible', 'Histograms ');
  CommonActions.ShowButtons(true);
  CommonActions.ShowTabs('hidden');  
  CommonActions.RequestReadyState();
}
var CommonActions = {};
//
// -- Fill text area with comments
//
CommonActions.FillText = function(id, text)
{
 var obj = $(id);
 if (obj != null) {
   obj.innerHTML = '<PRE>'+text+'</PRE>';
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
  var obj = $('dhtmlgoodies_tabView1');
  if (obj == null) return;
  obj.style.visibility = option; // "visible" or "hidden"
}
//
// -- Make the buttons visible/invisible
//
CommonActions.ShowButtons = function(option) 
{
  var obj;
  obj = $('create_tkmap');
  if (obj != null ) obj.disabled=option;
  obj = $('draw_summary');
  if (obj != null ) obj.disabled=option;
}
//
// -- Show the progress bar with comment during waiting time
//
CommonActions.ShowProgress = function(option)
{
  var progress = $('progressbar');
  if (progress == null) return;

  var label = $('progress_message');
  if (label == null) return;

  var args = arguments[1];
  if (args != null && args.length > 0) {
    label.innerHTML = '<B><Font size="+2" color="#961414">Please wait, loading '+args +'</Font></B>';
  }
  progress.style.visibility = option; // "visible" or "hidden"
}
//
// -- Check whether the DQM Client is ready with histograms
//
CommonActions.RequestReadyState = function()
{
  var url         = WebLib.getApplicationURLWithLID();
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

    var aobj            = $('summary_plot_type');
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
          var image_src = WebLib.getApplicationURL() + "/images/" + l_name + ".lis";
          var title_src = WebLib.getApplicationURL() + "/images/" + l_name + "_titles.lis";
          SlideShow.slideImageList[i] = image_src; 
          SlideShow.slideTitleList[i] = title_src; 
        }
        catch (e) {
          aobj.add(aoption, -1);
        }
      }
      SlideShow.nSlides = SlideShow.slideImageList.length;
      CommonActions.ShowButtons(false);
      CommonActions.ShowTabs('visible');
      CommonActions.ShowProgress('hidden');
    }
    if (callAgain) setTimeout('CommonActions.RequestReadyState()',20000);
  }
  catch (err) {
    alert ("[CommonActions.FillReadyState111] Error detail: " + err.message); 
  }
}
//
// -- Create Tracker Map
//
CommonActions.OpenTrackerMapFrame = function()
{
  var win = window.open('TrackerMapFrame.html');
  win.focus();            
}
//
// -- Create Tracker Structure options
//
CommonActions.CreateTkStrustures = function()
{
   var tk_struct = new Array("TIB/layer_1",
                             "TIB/layer_2", 
                             "TIB/layer_3",
                             "TIB/layer_4",
                             "TOB/layer_1", 
                             "TOB/layer_2",
                             "TOB/layer_3",
                             "TOB/layer_4", 
                             "TOB/layer_5",
                             "TOB/layer_6",
                             "TEC/side_1/wheel_1",
                             "TEC/side_1/wheel_2",
                             "TEC/side_1/wheel_3",
                             "TEC/side_1/wheel_4",
                             "TEC/side_1/wheel_5",
                             "TEC/side_1/wheel_6",
                             "TEC/side_1/wheel_7",
                             "TEC/side_1/wheel_8",
                             "TEC/side_1/wheel_9",
                             "TEC/side_2/wheel_1",
                             "TEC/side_2/wheel_2",
                             "TEC/side_2/wheel_3",
                             "TEC/side_2/wheel_4",
                             "TEC/side_2/wheel_5",
                             "TEC/side_2/wheel_6",
                             "TEC/side_2/wheel_7",
                             "TEC/side_2/wheel_8",
                             "TEC/side_2/wheel_9",
                             "TID/side_1/wheel_1",
                             "TID/side_1/wheel_2",
                             "TID/side_1/wheel_3",
                             "TID/side_2/wheel_1",
                             "TID/side_2/wheel_2",
                             "TID/side_2/wheel_3");



    var aobj            = $('summ_struc_name');
    aobj.options.length = 0;
    var bobj            = $('alarm_struc_name');
    bobj.options.length = 0;
    
    for (var i = 0; i < tk_struct.length; i++) {
      var opt_val = "MechanicalView/" + tk_struct[i];
      var option1 = new Option(tk_struct[i], opt_val); 
      var option2 = new Option(tk_struct[i], opt_val); 
      aobj.add(option1, null);
      bobj.add(option2, null);
    }
    aobj.selectedIndex = 0;
    bobj.selectedIndex = 0;
}
//
// Read Options for Tracker Map Creation
//
CommonActions.ReadTkMapOptions = function() {
  var url          = WebLib.getApplicationURL();
  url              = url + "/sistrip_tkmap_option.xml"; 
  var retVal = new Ajax.Request(url,
                               {           
                  		method: 'get',	  
 			        parameters: '', 
 			        onSuccess: CommonActions.FillTkMapOptions
 			       });
}
//
// Fill Options for Tracker Map Creation
//
CommonActions.FillTkMapOptions = function(transport) {
    try 
    {
      var doc   = transport.responseXML;
      var root  = doc.documentElement;

      // TkMap Option Select Box
      var aobj  = $('tkmap_option');
      aobj.options.length = 0;
      var mrows = root.getElementsByTagName('TkMapOption');
      for (var i = 0; i < mrows.length; i++) {
        var mnum = mrows[i].childNodes[0].nodeValue;
        var aoption = new Option(mnum, mnum);
        try 
        {
          aobj.add(aoption, null);
        }
        catch (e) {
          aobj.add(aoption, -1);
        }
      }
    }
    catch (err) {
      alert ("[CommonActions.FillTkMapOptions] Error detail: " + err.message); 
    }
}

