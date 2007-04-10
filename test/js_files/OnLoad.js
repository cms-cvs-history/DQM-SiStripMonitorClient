window.onload=function(){
  initTabs('dhtmlgoodies_tabView1', Array('Non-Expert View', 'Single Module View','Summary View','Alarm View'), 0, '99.5%','100%');
  ShowProgress('visible');
  ShowButtons(true);
  ShowTabs('hidden');  
  FillSlides();

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
function ShowProgress(option) {
  var obj = document.getElementById("progress_icon");
  if (obj == null) return;
  obj.style.visibility = option; // "visible" or "hidden"
}
function RequestReadyState() {
  var url = getApplicationURL2();
  url += "/Request?";
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
      
        var hrows = root.getElementsByTagName('Response');
//        alert(" rows = " + hrows.length);
        if (hrows.length != 1) {
          callAgain = true; 
        }
        else {
          var name = hrows[0].childNodes[0].nodeValue;
          if (name == "ready") {
            ShowButtons(false);
            ShowTabs('visible');
            ShowProgress('hidden');
          } 
          else {
            callAgain = true; 
          }
        }
        if (callAgain) setTimeout('RequestReadyState()',20000);
      }
      catch (err) {
        alert ("Error detail: " + err.message); 
      }
    }
  }
}
