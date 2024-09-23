function onOpen(e) {
  DocumentApp.getUi()
      .createAddonMenu()
      .addItem('Open Page Size Changer', 'showSidebar')
      .addToUi();
}

function onInstall(e) {
  onOpen(e);
}

function showSidebar() {
  var ui = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle('Change Page Size');
  DocumentApp.getUi().showSidebar(ui);
}

// Preset sizes in cm
const PRESET_SIZES = {
  'A4': { width: 21.0, height: 29.7 },
  'Letter': { width: 21.6, height: 27.9 },
  'Legal': { width: 21.6, height: 35.6 }
};

function resizeDocument(width, height) {
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  
  // Store the current size for undo functionality
  PropertiesService.getDocumentProperties().setProperty('previousSize', JSON.stringify({
    width: body.getPageWidth() / 28.3465,
    height: body.getPageHeight() / 28.3465
  }));
  
  // Convert cm to points (1 cm = 28.3465 points)
  var widthPoints = width * 28.3465;
  var heightPoints = height * 28.3465;
  
  body.setPageWidth(widthPoints);
  body.setPageHeight(heightPoints);
  
  return "Page size updated successfully!";
}

function undoResize() {
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  
  var previousSizeStr = PropertiesService.getDocumentProperties().getProperty('previousSize');
  
  if (previousSizeStr) {
    var previousSize = JSON.parse(previousSizeStr);
    body.setPageWidth(previousSize.width * 28.3465);
    body.setPageHeight(previousSize.height * 28.3465);
    
    // Clear the stored previous size
    PropertiesService.getDocumentProperties().deleteProperty('previousSize');
    
    return {
      message: "Page size reverted to previous dimensions.",
      width: previousSize.width,
      height: previousSize.height
    };
  } else {
    return {
      message: "No previous size found to undo.",
      width: null,
      height: null
    };
  }
}

function getPresetSizes() {
  return PRESET_SIZES;
}
