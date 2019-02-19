# uplodear


### ES5 example:

```javascript

var upload = new uploader({
  el : "DropZon",
  url: "https://api.cloudinary.com/v1_1/joezimim007/image/upload",
  before: function(done) {
    setTimeout(function () {
      console.log("Befor Send Data.");
      done();
    }, 1000);
  },
  after: function (data, status) {
    console.log("After Data Send");
    console.log(data, status)
  },
  progress: function (total, lists) {
    console.log(total, lists);
  }
});
```

### ES5 Options
```javascript
var upload = new uploader(options);
```
Options          | Default                           | Description
---             | ---                               | ---
el              | `DropZon `                        | drop zone html tag by id
url             | `null`                            | post url address
multiple        | `false`                           | allowed to enter more than one file
before          |                                   | call function before send data to server
after           |                                   | call function after data sent to server
progress        |                                   | show progress
centerText      | drag and drop your files          |
uploadProgress  | Uploading is in progress...       |
uploadFinish    | Upload finish!                    |
uploadFaild     | Uploading face to an Error!       |
