# uplodear

### UPlodear Options
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


### ES5, ES6 ex:

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

### Vue Component:

How run and test vue component version?

> Note: befor use `vue` clie for serve component, install `node-sass` and `sass-loader` like below:
``` bash
$ npm install node-sass sass-loader --save-dev
```
Then:

  1. open command line in to the `vue` folder
  2. type `vue serve test.vue`

### Vue ex:
  ``` javascript
    <template>
      <div>
          <uploader 
              multiple
              v-bind:before   = "before"
              v-bind:after    = "after"
              v-bind:progress = "progress"
              url = "https://api.cloudinary.com/v1_1/joezimim007/image/upload"
          />
      </div>
  </template>

  <script>
      import uploader from "./uploader";
      export default {
          components:{
              uploader
          },
          methods: {
              before(done) {

                  setTimeout(() => {
                      console.log("Befor send");
                      done();
                  }, 1000);
              },
              after(){
                  console.log("Data sent");
              },
              progress(total, lists){
                  console.log(total, lists);
              }
          }
      }
  </script>
  ```

> The idea was taken and made from [Joseph Zimmerman](https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/) on [Smashingmagazine](https://www.smashingmagazine.com) website.