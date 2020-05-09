$(function(){
  // console.log('in js');
  $.cloudinary.config({ cloud_name: 'dcjayhlgb', secure: true});

  $('.cloudinary-fileupload').cloudinary_fileupload({
    acceptFileTypes: /(\.|\/)(gif|jpe?g|png|bmp|ico)$/i
  });

  $('.cloudinary-fileupload').bind('cloudinaryprogress', function(e, data) {
    $('.progress_bar').css('width', Math.round((data.loaded * 100.0) / data.total) + '%');
  });

  $('.cloudinary-fileupload').on('cloudinarydone', function(e, data) {
    var tag = $.cloudinary.imageTag(data.result.public_id,
                           { format: data.result.format,
                             version: data.result.version,
                             crop: 'scale',
                             width: 200 });
    $('.preview').append(tag.toHtml());
    return true;
  });
});
