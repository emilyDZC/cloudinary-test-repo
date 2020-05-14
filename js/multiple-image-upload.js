(function(){
  const cloudName = 'dcjayhlgb';
  const unsignedUploadPreset = 'vvqon8nr';

  const input = document.getElementById("image_uploads");
  const dropbox = document.querySelector('.dropbox');
  const preview = document.querySelector('.preview');
  const submit = document.querySelector('input[name="submit_images"]');
  let files;

  dropbox.addEventListener("dragenter", dragenter, false);
  dropbox.addEventListener("dragover", dragover, false);
  dropbox.addEventListener("drop", drop, false);
  input.addEventListener('change', updateImageDisplay);

  function dragenter(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  function dragover(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  function drop(e) {
    e.stopPropagation();
    e.preventDefault();

    let dt = e.dataTransfer;
    input.files = dt.files;

    updateImageDisplay();
  }

  function updateImageDisplay() {
    while(preview.firstChild) {
      preview.removeChild(preview.firstChild);
    }

    const curFiles = input.files;
    if(curFiles.length === 0) {
      const para = document.createElement('p');
      para.textContent = 'No files currently selected for upload';
      preview.appendChild(para);
    } else {
      const list = document.createElement('ul');
      preview.appendChild(list);

      let index = 0;
      for(let file of curFiles) {
        const listItem = document.createElement('li');
        listItem.id = `id_${index}`;
        index++;
        const para = document.createElement('p');
        if(validFileType(file)) {
          para.textContent = `File name ${file.name}, file size ${returnFileSize(file.size)}.`;
          const image = document.createElement('img');
          image.src = URL.createObjectURL(file);
          listItem.appendChild(image);
          const bar = document.createElement('div');
          bar.className = "progress-bar";
          listItem.appendChild(bar);
          listItem.appendChild(para);
        } else {
          para.textContent = `File name ${file.name}: Not a valid file type. Update your selection.`;
          listItem.appendChild(para);
        }

        list.appendChild(listItem);
      }
      files = curFiles;
      submit.classList.remove('hidden');
      submit.addEventListener('click', upload_files_to_cloudinary);
    }
  }

  function upload_files_to_cloudinary(e){
    e.preventDefault();
    for (let i = 0; i < files.length; i++) {
      uploadFile(files[i], i); // call the function to upload the file
    }
  }

  function uploadFile(file, index) {
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    let xhr = new XMLHttpRequest();
    let fd = new FormData();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    // Update progress (can be used to show progress indicator)
    xhr.upload.addEventListener("progress", function(e) {
      var progress = Math.round((e.loaded * 100.0) / e.total);
      document.querySelector(`#id_${index} .progress-bar`).style.width = progress + "%";
    });

    xhr.onreadystatechange = function(e) {
      if (xhr.readyState == 4 && xhr.status == 200) {
        // File uploaded successfully
        // let response = JSON.parse(xhr.responseText);
        // let url = response.secure_url;
        if (index == files.length - 1) {
          const success = document.createElement('div');
          success.className = "tick";
          dropbox.appendChild(success);
        }
      }
    };

    fd.append('upload_preset', unsignedUploadPreset);
    fd.append('tags', 'browser_upload'); // Optional - add tag for image admin in Cloudinary
    fd.append('file', file);
    xhr.send(fd);
  }

  // https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types
  const fileTypes = [
    "image/apng",
    "image/bmp",
    "image/gif",
    "image/jpeg",
    "image/pjpeg",
    "image/png",
    "image/svg+xml",
    "image/tiff",
    "image/webp",
    "image/x-icon"
  ];

  function validFileType(file) {
    return fileTypes.includes(file.type);
  }

  function returnFileSize(number) {
    if(number < 1024) {
      return number + 'bytes';
    } else if(number >= 1024 && number < 1048576) {
      return (number/1024).toFixed(1) + 'KB';
    } else if(number >= 1048576) {
      return (number/1048576).toFixed(1) + 'MB';
    }
  }
})();
