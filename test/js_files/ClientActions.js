var ClientActions = {};
//
// -- Subscribe All MEs 
//
ClientActions.SubscribeAll = function()
{
  var queryString = "RequestID=SubscribeAll";
  var url         = WebLib.getApplicationURL2();
  url             = url + queryString;   
  WebLib.makeRequest(url, null);     
}
//
// Create Summary
//
ClientActions.CreateSummary = function() 
{
  var queryString = "RequestID=CreateSummary";
  var url         = WebLib.getApplicationURL2();
  url             = url + queryString; 
  
  WebLib.makeRequest(url, null);     
}
//
// -- Save MEs in a file
//
ClientActions.SaveToFile = function() 
{
  var queryString = "RequestID=SaveToFile";
  var url         = WebLib.getApplicationURL2();
  url             = url + queryString;   
  WebLib.makeRequest(url, null);     
}
//
// -- Create Tracker Map
//
ClientActions.CreateTrackerMap = function()
{
  var queryString = "RequestID=CreateTkMap";
  var obj         = document.getElementById("create_tkmap");
  var url         = WebLib.getApplicationURL2();
  url             = url + queryString;
   
  WebLib.makeRequest(url, null);
 
  setTimeout('ClientActions.OpenTrackerMap()', 5000);   
}
//
// -- Create Tracker Map
//
ClientActions.OpenTrackerMap = function()
{
  var queryString = "RequestID=OpenTkMap";

  var url   = WebLib.getApplicationURL2();
  url       = url + queryString;
   
  WebLib.makeRequest(url, ClientActions.ReadResponseAndOpenTkMap); 
}
//
// -- check the response and open tracker map
//
ClientActions.ReadResponseAndOpenTkMap = function() 
{
  if (WebLib.http_request.readyState == 4) {
    if (WebLib.http_request.status == 200) {
      try {
        var doc  = WebLib.http_request.responseXML;
        var root = doc.documentElement;
        var rows = root.getElementsByTagName('Response');
        if ( rows.length == 1) { 
          var name  = rows[0].childNodes[0].nodeValue;
          if (name == "Successful" ) {            
             var win = window.open('svgmap.xml');
             win.focus();            
          } else {
            alert(" Creation of Tracker Map Failed !! ");	
          }
        }
      }
      catch (err) {
        alert ("Error detail: " + err.message);
      }
    }
    else {
      alert("FillFileList:  ERROR:"+WebLib.http_request.readyState+", "+WebLib.http_request.status);
    }
  }
}
//
// Collate MEs
//
ClientActions.CollateME = function() {
  var queryString = "RequestID=CollateME";
  var url         = WebLib.getApplicationURL2();
  url             = url + queryString; 
  
  WebLib.makeRequest(url, null);     
}
