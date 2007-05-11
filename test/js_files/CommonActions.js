// Get File
function GetFile() {
  var obj = document.getElementById("filename");
  var fname =  obj.options[obj.selectedIndex].value;
  return fname;
}
// Get Reference File
function GetRefFile() {
  var obj = document.getElementById("ref_filename");
  var fname = obj.options[obj.selectedIndex].value;
  return fname;
}
// Get Selected Histos
function GetSelectedHistos() {
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
function GetPlotOptions() {
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
function FillText(id, text)
{
 var obj = document.getElementById(id);
 if (obj != null) {
   obj.innerHTML = '<PRE>'+text+'</PRE>';
 }
}
function SetSelectedValue() {
  var aobj = document.getElementById("module_numbers");
  if (aobj != null) {
    var value =  aobj.options[aobj.selectedIndex].value;
    var bobj = document.getElementById("module_number_edit");
    if (bobj != null) {
      bobj.value = value;
    }   
  }
}
