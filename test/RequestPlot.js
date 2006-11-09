function DrawSelectedHistos() {
  var queryString;
  var url = getApplicationURL2();
  url += "/Request?";
  if (document.getElementById("SingleModuleHisto").checked) {
    queryString = 'RequestID=PlotAsModule';
    // Get Module Number
    var obj = document.getElementById("module_numbers");
    var value =  obj.options[obj.selectedIndex].value;
    queryString += '&ModId='+value;
  } 
  else if (document.getElementById("SummaryHisto").checked) {
    queryString = 'RequestID=PlotSummaryHistos';
    // Get Selected Tracker Structure
    var obj = document.getElementById("structure_name");
    var sname =  obj.options[obj.selectedIndex].value;
    queryString += '&StructureName='+sname;
  }
  var hist_opt = SetHistosAndPlotOption();
  if (hist_opt == " ") return;
  queryString += hist_opt;	
  // Get Canavs
  var canvas = document.getElementById("drawingcanvas");
  if (canvas == null) {
    alert("Canvas is not defined!");
    return;
  }
  url += queryString;
  makeRequest(url, dummy);
   
  setTimeout('UpdatePlot()', 2000);   
}
//
//  -- Set Histograms and plotting options 
//    
function SetHistosAndPlotOption() {
   var dummy = " ";
   var qstring;
  // Histogram Names 
  var histos =GetSelectedHistos();
  if (histos.length == 0) {
    alert("Plot(s) not defined!");
    return dummy;
  }
//  
  var nhist = histos.length;
// alert(" "+nhist);
  for (var i = 0; i < nhist; i++) {
    if (i == 0) qstring = '&histo='+histos[i];
    else qstring += '&histo='+histos[i];
  }

  // Rows and columns
  var nr = 1;
  var nc = 1;
  if (nhist == 1) {
    // logy option
    if (document.getElementById("logy").checked) {
      qstring += '&logy=true';
    }
    obj = document.getElementById("x-low");
    value = parseFloat(obj.value);
    if (!isNaN(value)) qstring += '&xmin=' + value;

    obj = document.getElementById("x-high");
    value = parseFloat(obj.value);
    if (!isNaN(value)) qstring += '&xmax=' + value;
  } else {
    if (document.getElementById("multizone").checked) {
      obj = document.getElementById("nrow");
      nr =  parseInt(obj.value);
      if (isNaN(nr)) {
        nr = 1;
      }
      obj = document.getElementById("ncol");
      nc = parseInt(obj.value);
      if (isNaN(nc)) {
        nc = 2;       
      }
    }
    if (nr*nc < nhist) {
      if (nhist <= 10) {
        nc = 2;
      } else if (nhist <= 20) {
        nc = 3;
      } else if (nhist <= 30) {
         nc = 4;
      } 		
       nr = Math.ceil(nhist*1.0/nc);
    }
    qstring += '&cols=' + nc + '&rows=' + nr;       
  }
  return qstring;
}  
function UpdatePlot() {
  var canvas = document.getElementById("drawingcanvas");

  var queryString = "RequestID=UpdatePlot";
  var url = getApplicationURL2();
  url = url + "/Request?";
  url = url + queryString;
  url = url + '&t=' + Math.random();
  canvas.src = url; 
}