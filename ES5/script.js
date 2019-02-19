"use strict"
  var uploader = function(data) {

    var configs = {
      url: data.url || null,
      el: data.el || "DropZon",
      centerText : data.centerText || "drag and drop your files",
      uploadingProgress : data.uploadingProgress || "Uploading is in progress...",
      uploadFinish: data.uploadFinish || "Upload finish!",
      uploadFaild: data.uploadFaild || "Uploading face to an Error!",
      multiple: data.multiple || false,
      before: data.before ,
      after: data.after ,
      progress: data.progress
    }

    var uploadProgress = [];

    var dropArea = document.getElementById(configs.el);
    var inputFile = document.createElement("input");
    var pinput  = document.createElement("p");
    var progressbar = document.createElement("div");
    inputFile.type = "file";
    inputFile.style.display = "none";
    //inputFile.accept = "image/*"
    inputFile.multiple = configs.multiple;
    pinput.textContent = configs.centerText;
    progressbar.className = "progressBar";

    var appendDOM = [progressbar, inputFile, pinput];
    appendDOM.forEach(function(el){
      dropArea.appendChild(el);
    })

    // Prevent default drag behaviors
    ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach( function(eventName) {
      dropArea.addEventListener(eventName, preventDefaults, false)   
      document.body.addEventListener(eventName, preventDefaults, false)
    });

    // Handle dropped files
    dropArea.addEventListener('drop', handleDrop, false);
    dropArea.addEventListener("click", dropAreaClick , false);
    inputFile.addEventListener('change', function(){ handleFiles(this.files) }, false)

    function dropAreaClick(){ 
        inputFile.click();
    } // @Function: dropAreaClick()

    function preventDefaults (event) {
      event.preventDefault();
      event.stopPropagation();
    } // @Function: preventDefaults()

    function handleDrop(event) {
      var files = event.dataTransfer.dt.files;
      handleFiles(files);
    } // @Function: handleDrop()

    function handleFiles(files) {
      var fileList = []
      Object.keys(files).forEach(function(index){
        fileList.push(files[index])
      })
      initializeProgress(fileList.length);
      fileList.forEach(uploadFile);
    } // @Function: handleFiles()

    function initializeProgress(numFiles) {
      progressbar.style.display = "block";
      uploadProgress = [];
      for(var i = numFiles; i > 0; i--) {
        uploadProgress.push(0);
      }
    } // @Function: initializeProgress()
    
    function updateProgress(fileNumber, percent) {

      uploadProgress[fileNumber] = percent;

      var reduce = uploadProgress.reduce(function(tot, curr) { 
        return tot + curr
      });
      
      var total = Math.floor( reduce  / uploadProgress.length );
      // Progress Callback
      if(configs.progress)
        configs.progress(total, uploadProgress);

      progressbar.style.width = total+"%";
      progressbar.innerText = total+"%"
      pinput.textContent = configs.uploadingProgress;

    } // @Function: updateProgress()

    function uploadFile(file, i) {
      var url = configs.url;
      
      var xhr = new XMLHttpRequest();
      var formData = new FormData();
      xhr.open('POST', url, true);
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

      xhr.upload.addEventListener("progress", function(e) {
        updateProgress(i, (e.loaded * 100.0 / e.total) || 100);
      });

      xhr.addEventListener('readystatechange', function(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
          progressbar.style.display = "none";
          pinput.textContent = configs.uploadFinish;
        }
        else if (xhr.readyState == 4 && xhr.status != 200) {
          // Error. Inform the user
          progressbar.style.width = "0";
          pinput.textContent = configs.uploadFaild
        }
        // after XHR callback
        if(xhr.readyState == 4)
          if(data.after)
            data.after(xhr.responseText, xhr.status);
      });

      formData.append('file', file);

      // Befor send XHR 
      if(configs.before)
        configs.before(function(){
          xhr.send(formData);
        });
      else
        xhr.send(formData);
    
    } // @Function: uploadFile()

  } // @Function: uploader()


console.time("time");
var upload = new uploader({
  el : "DropZon",
  multiple: true,
  centerText: "ES5, drag and drop your files",
  url: "https://api.cloudinary.com/v1_1/joezimim007/image/upload",
  before: function(done){
    setTimeout(function(){
      console.log("befor up");
      done();
    }, 1000);
  },
  after: function(data, status){
    console.log("data done");
    console.log(data, status)
  },
  progress: function(total, lists){
    console.log(total,lists )
  }
});
console.timeEnd("time");


