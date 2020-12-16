// Run once sheet is open by a trigger
function GetData(){
  ThisSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Current Values");
  // Delete old data
  ThisSheet.getRange(2,1,ThisSheet.getLastRow(),ThisSheet.getLastColumn()).clear();
  // Get all names and device UIDs
  var KeyValue=SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Patient-Device").getDataRange().getValues();
  // Database connection
  var db = FirebaseApp.getDatabaseByUrl("<url>","<optSecret>");
  // Get all devices and latest values
  for (var [Device,Values] of Object.entries(db.getData("lastUpdated"))) {
    // Device data with placeholder in case we don't have a name associated with the device
    var ThisRecord = [Device,Values["SYS"],Values["DIA"],Values["PPM"],Values["Temp"]* 9 / 5 + 32,ReadableDate(Values["time"])];
    // Lookup patient name
    KeyValue.forEach(function(i){if(i[1]==Device){ThisRecord.shift();ThisRecord.unshift(i[0]);}});
    // Save to spreadsheet
    ThisSheet.getRange(ThisSheet.getLastRow() + 1, 1, 1, ThisRecord.length).setValues([ThisRecord]);
    // Add color
    ThisSheet.getRange(ThisSheet.getLastRow(),7).setBackground(ColorCode (ThisRecord[1],ThisRecord[2]))
  }
  // Report run timestamp
  ThisSheet.getRange(ThisSheet.getLastRow() + 2, 1, 1, 1).setValue(Date(Date.now()));
  // Align
  ThisSheet.getDataRange().setHorizontalAlignment("left");
}

function ReadableDate(timestamp){
  var d = new Date(timestamp );
  return  d.getFullYear() + "-" + ("00" + (d.getMonth() + 1)).slice(-2) + "-" + ("00" + d.getDate()).slice(-2) + " " +
    ("00" + d.getHours()).slice(-2) + ":" + ("00" + d.getMinutes()).slice(-2) + ":" + ("00" + d.getSeconds()).slice(-2);
}

function ColorCode (SYS,DIA) {
  if (DIA<80) {
    if (SYS<120) return "lime";
    else if (SYS<130) return "yellow";
  } else if (SYS>180||DIA>120) return "red";
  else if (SYS>=140||DIA>=90)  return "brown";
  else if (SYS>=130||DIA>=80) return "orange";
  else return"white";
}
