class uploader {

  constructor(options) {

    this.el                 = options.el;
    this.url                = options.url;
    this.multiple           = options.multiple;
    this.centerText         = options.centerText;
    this.uploadFaild        = options.uploadFaild;
    this.before             = options.before;
    this.after              = options.after;
    this.progress           = options.progress;
    this.centerText         = options.centerText || "drag and drop your files";
    this.uploadingProgress  = options.uploadingProgress || "Uploading is in progress...";
    this.uploadFinish       = options.uploadFinish || "Upload finish!";
    this.uploadFaild        = options.uploadFaild || "Uploading face to an Error!";
    this.multiple           = options.multiple || false;

    this.uploadProgress     = [];

    this.elements();
  } // @constructor()


  elements() {
    this.$dropArea = document.getElementById(this.el);
    const domList = [
      {el:"input",name:"$inputFile"},
      {el:"div",name:"$progressbar"},
      {el:"p",name:"$pinput"}
    ];
    this.createDom(domList);
    this.appendDOM();
    this.domListener();
  } // @Function: elements()

  createDom = (element) => {
    element.forEach(dom => this[`${dom.name}`] = document.createElement(dom.el) );
    this.$inputFile.type = "file";
    this.$inputFile.style.display = "none"
    this.$inputFile.multiple = this.multiple;
    this.$pinput.textContent = this.centerText;
    this.$progressbar.className = "progressBar";
  } // @Function: createDom()

  appendDOM = () => {
    // append can accept array of node dome
    // more info: https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/append
    this.$dropArea.append(this.$inputFile, this.$progressbar, this.$pinput);
  } // @Function: appendDOM()

  domListener = () => {
      // Prevent default drag behaviors
      ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach( (eventName) => {
        this.$dropArea.addEventListener(eventName, event => this.preventDefaults(event), false) 
        document.body.addEventListener(eventName, event => this.preventDefaults(event), false)
      });
      // Handle dropped files
      this.$dropArea.addEventListener('drop', this.handleDrop, false);
      this.$dropArea.addEventListener("click", () => this.$inputFile.click() , false);
      this.$inputFile.addEventListener('change', event => this.handleFiles(event.target.files) , false)
  } // @Function: domListener()

  preventDefaults (event) {
    event.preventDefault();
    event.stopPropagation();
  } // @Function: preventDefaults()

  handleDrop(event) {
    const files = event.dataTransfer.files;
    this.handleFiles(files);
  } // @Function: handleDrop()

  handleFiles(files) {
    files = [...files];
    this.initializeProgress(files.length);
    files.forEach(this.uploadFile);
  } // @Function: handleFiles()

  initializeProgress(numFiles) {
    this.$progressbar.style.display = "block";
    this.uploadProgress = [];
    for(let i = numFiles; i > 0; i--) {
      this.uploadProgress.push(0)
    }
  } // @Function: initializeProgress()
  
  updateProgress(fileNumber, percent) {
    this.uploadProgress[fileNumber] = percent;
    const total = Math.floor( this.uploadProgress.reduce((tot, curr) => tot + curr, 0) / this.uploadProgress.length);
    // Progress Callback
     if(this.progress)
       this.progress(total, this.uploadProgress);
    this.$progressbar.style.width = total+"%";
    this.$progressbar.innerText = total+"%"
    this.$pinput.textContent = this.uploadingProgress;
  } // @Function: updateProgress()

  uploadFile = (file, i) => {

    const url = this.url;
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    xhr.upload.addEventListener("progress", (event) => {
      this.updateProgress(i, (event.loaded * 100.0 / event.total) || 100);
    });


    xhr.addEventListener('readystatechange', () =>  {

      if (xhr.readyState == 4 && xhr.status == 200) {
        this.$progressbar.style.display = "none";
        this.$pinput.textContent = this.uploadFinish;
      }else if (xhr.readyState == 4 && xhr.status != 200) {
        // Error. Inform the user
        this.$progressbar.style.width = "0";
        this.$pinput.textContent = this.uploadFaild
      }

      // after XHR callback
       if(xhr.readyState == 4)
         if(this.after)
           this.after(xhr.responseText, xhr.status);
      
    });

    formData.append('file', file);

    // Befor send XHR 
    if(this.before)
      this.before(() => xhr.send(formData) );
    else
      xhr.send(formData);
   
  } // @Function: uploadFile()

} // @Class: uploader()



console.time("time");
var upload = new uploader({
  el : "DropZon",
  multiple: true,
  centerText: "ES6, drag and drop your files",
  url: "https://api.cloudinary.com/v1_1/joezimim007/image/upload",
  before: function(done){
    setTimeout(function(){
      console.log("Befor send");
      done();
    }, 1000);
  },
  after: function(data, status){
    console.log("Data sent");
    console.log(data, status);
  },
  progress: function(total, lists){
    console.log(total,lists);
  }
});
console.timeEnd("time");





