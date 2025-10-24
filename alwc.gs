function onEdit(e) {
  if (!e) return;

  var sheet = e.source.getActiveSheet();
  if (sheet.getName() !== "eBay") return;

  var range = e.range;
  var row = range.getRow();
  var col = range.getColumn();

  // Only trigger when editing J column (10)
  if (col !== 10 || row < 2) return;

  var Kprice = parseFloat(range.getValue());
  if (!Kprice || isNaN(Kprice)) return;

  var ROI_min, ROI_max;

  if (Kprice <= 9) { 
    ROI_min = 0.15; ROI_max = 0.15; 
  } else if (Kprice <= 20) { 
    ROI_min = 0.12; ROI_max = 0.13; 
  } else if (Kprice <= 30) { 
    ROI_min = 0.11; ROI_max = 0.12; 
  } else if (Kprice <= 40) { 
    ROI_min = 0.10; ROI_max = 0.11; 
  } else if (Kprice <= 60) { 
    ROI_min = 0.09; ROI_max = 0.10; 
  } else if (Kprice <= 100) { 
    ROI_min = 0.08; ROI_max = 0.09; 
  } else if (Kprice <= 150) { 
    ROI_min = 0.06; ROI_max = 0.07; 
  } else { 
    ROI_min = 0.06; ROI_max = 0.06; 
  }

  function iFromR(R) {
    return (1.08 * Kprice * (1 + R)) / (0.8 - 0.2 * R);
  }

  var Imin = iFromR(ROI_min);
  var Imax = iFromR(ROI_max);

  var minCents = Math.ceil(Imin * 100);
  var maxCents = Math.floor(Imax * 100);

  var Iprice;
  if (minCents > maxCents) {
    Iprice = Math.min(Math.round(Imin * 100) / 100, Imax);
  } else {
    var randCents = Math.floor(Math.random() * (maxCents - minCents + 1)) + minCents;
    Iprice = randCents / 100;
  }

  // Write calculated value to column I
  var sellCell = sheet.getRange(row, 9);
  sellCell.setValue(Iprice);

  // Compare with H column value
  var ebayPrice = parseFloat(sheet.getRange(row, 8).getValue());
  if (!isNaN(ebayPrice)) {
    if (ebayPrice < Iprice) {
      sellCell.setBackground("#ff0000ff"); // red if sell > ebay price
    } else {
      sellCell.setBackground("#fce5cd"); // clear color if ok
    }
  }
}
