var entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

function escapeHtml (string) {
  return String(string).replace(/[&<>"'`=\/]/g, function (s) {
    return entityMap[s];
  });
}

let jsonToEscape = { "upload_preset" : "whatever_its_called",
                     "callback" : "https://emilydzc.github.io/cloudinary_js-master/html/cloudinary_cors.html" };

let string = JSON.stringify(jsonToEscape);

console.log(escapeHtml(string));
