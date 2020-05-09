// data-cloudinary-field="image_id"
// data-form-data='{&quot;upload_preset&quot;:&quot;vvqon8nr&quot;,&quot;callback&quot;:&quot;https:&#x2F;&#x2F;emilydzc.github.io&#x2F;cloudinary_js-master&#x2F;html&#x2F;cloudinary_cors.html&quot;}'

$(function(){
  const cloudName = 'dcjayhlgb';
  const unsignedUploadPreset = 'doc_codepen_example';

  // ************************ Drag and drop ***************** //

  $('.file-browse').click(function(e){
    e.preventDefault()
    $('.fileupload-input').click();
  });

  function dragenter(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  function dragover(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  dropbox = $(".dropbox");
  dropbox.on("dragenter", dragenter);
  dropbox.on("dragover", dragover);
  dropbox.on("drop", drop);

  function drop(e) {
    e.stopPropagation();
    e.preventDefault();

    var dt = e.dataTransfer;
    var files = dt.files;

    handleFiles(files);
  }

  // *********** Upload file to Cloudinary ******************** //
  function uploadFile(file) {
    var url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    // Reset the upload progress bar
     document.getElementById('progress').style.width = 0;

    // Update progress (can be used to show progress indicator)
    xhr.upload.addEventListener("progress", function(e) {
      var progress = Math.round((e.loaded * 100.0) / e.total);
      document.getElementById('progress').style.width = progress + "%";

      console.log(`fileuploadprogress data.loaded: ${e.loaded},
    data.total: ${e.total}`);
    });

    xhr.onreadystatechange = function(e) {
      if (xhr.readyState == 4 && xhr.status == 200) {
        // File uploaded successfully
        var response = JSON.parse(xhr.responseText);
        // https://res.cloudinary.com/cloudName/image/upload/v1483481128/public_id.jpg
        var url = response.secure_url;
        // Create a thumbnail of the uploaded image, with 150px width
        var tokens = url.split('/');
        tokens.splice(-2, 0, 'w_150,c_scale');
        var img = new Image(); // HTML5 Constructor
        img.src = tokens.join('/');
        img.alt = response.public_id;
        document.getElementById('gallery').appendChild(img);
      }
    };

    fd.append('upload_preset', unsignedUploadPreset);
    fd.append('tags', 'browser_upload'); // Optional - add tag for image admin in Cloudinary
    fd.append('file', file);
    xhr.send(fd);
  }

  // *********** Handle selected files ******************** //
  var handleFiles = function(files) {
    for (var i = 0; i < files.length; i++) {
      uploadFile(files[i]); // call the function to upload the file
    }
  };


});
