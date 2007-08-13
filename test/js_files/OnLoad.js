window.onload=function(){
  initTabs('dhtmlgoodies_tabView1', Array('Shifter View', 'Summary View','Alarm View', 'Expert View'), 0, '99.5%','100%');

  document.onkeypress = stopRKey;
  ShowProgress('visible', 'Histograms from Collector');
  ShowButtons(true);
  ShowTabs('hidden');  
//  FillSlides();

  RequestReadyState();
}
function ShowTabs(option) {
  var obj = document.getElementById("dhtmlgoodies_tabView1");
  if (obj == null) return;
  obj.style.visibility = option; // "visible" or "hidden"
}
function ShowButtons(option) {
  var obj;
  obj = document.getElementById("collate_me");
  if (obj != null ) obj.disabled=option;
  obj = document.getElementById("create_summary");
  if (obj != null ) obj.disabled=option;
  obj = document.getElementById("check_qtest_result");
  if (obj != null ) obj.disabled=option;
  obj = document.getElementById("create_tkmap");
  if (obj != null ) obj.disabled=option;
  obj = document.getElementById("draw_summary");
  if (obj != null ) obj.disabled=option;
}
function ShowProgress (option) {
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
function RequestReadyState() {
  var url = getApplicationURL2();
  var queryString = "RequestID=IsReady";
  url += queryString;
  makeRequest(url, FillReadyState);
}
function FillReadyState() {
  if (http_request.readyState == 4) {
    if (http_request.status == 200) {
      try {
        var callAgain = false;
        var doc = http_request.responseXML;
        var root = doc.documentElement;

        var aobj = document.getElementById("summary_plot_type");
        aobj.options.length = 0;
      
        var hrows = root.getElementsByTagName('LName');
//        alert(" rows = " + hrows.length);
        if (hrows.length < 1) {
          callAgain = true; 
        }  else {
          for (var i = 0; i < hrows.length; i++) {
            var l_name  = hrows[i].childNodes[0].nodeValue;
            var aoption = new Option(l_name, l_name);
            try {
              aobj.add(aoption, null);
              var image_src = getApplicationURL() + "/temporary/" + l_name + ".png";
              slideList[i] = image_src; 
            }
            catch (e) {
              aobj.add(aoption, -1);
            }
          }
          nSlides = slideList.length;
	  ShowButtons(false);
          ShowTabs('visible');
          ShowProgress('hidden');
        }
        if (callAgain) setTimeout('RequestReadyState()',20000);
      }
      catch (err) {
        alert ("Error detail: " + err.message); 
      }
    }
  }
}
