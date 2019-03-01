<template>
    <div id="DropZon" 
        @dragover.prevent
        v-on:drop.prevent="handleDrop"
        @click="$refs.inputFile.click()"
    >
        <input type="file" :multiple="multiple" @change="handleDrop" ref="inputFile">
        <p>{{uploaderState}}</p>
        <div class="progressBar" ref="progressBar"></div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                uploadProgress: [],
                uploaderState: this.centerText
            }
        },
        props: {
            centerText: {
                type: String,
                default: "drag and drop your files" 
            },
            uploadingProgress:{
                type: String,
                default: "Uploading is in progress..." 
            },
            uploadFaild:{
                type: String,
                default: "Uploading face to an Error!" 
            },
            uploadFinish:{
                type: String,
                default: "Upload finish!" 
            },
            multiple:{
                type: Boolean,
                default: false
            },
            url:{
                type: String,
                default: ""
            },
            after:{},
            before:{},
            progress:{}
        },
        methods: {
            handleDrop(event) {
                const files = event.target.files ? event.target.files : event.dataTransfer.files;
                this.handleFiles(files);
            },
            initializeProgress(numFiles){
                //this.$progressbar.style.display = "block";
                this.uploadProgress = [];
                for(let i = numFiles; i > 0; i--) {
                    this.uploadProgress.push(0);
                }
            },
            updateProgress(fileNumber, percent){
                this.uploadProgress[fileNumber] = percent;
                const total = Math.floor( this.uploadProgress.reduce((tot, curr) => tot + curr, 0) / this.uploadProgress.length);
                
                // Progress Callback
                if(this.progress)
                    this.progress(total, this.uploadProgress);

                this.$refs.progressBar.style.width = total+"%";
                this.$refs.progressBar.innerText = total+"%"
                this.uploaderState = this.uploadingProgress;
            },
            handleFiles(files){
                files = [...files];
                this.initializeProgress(files.length);
                files.forEach(this.uploadFile);
            },
            uploadFile(file, i){

                if(!this.url)
                    throw new Error("POST url is not defind.");

                const url = this.url;
                const xhr = new XMLHttpRequest();
                const formData = new FormData();

                xhr.upload.addEventListener("progress", (event) => {
                    this.updateProgress(i, (event.loaded * 100.0 / event.total) || 100);
                });

                xhr.addEventListener('readystatechange', () =>  {

                if (xhr.readyState == 4 && xhr.status == 200) {
                    this.$refs.progressBar.style.display = "none";
                    this.uploaderState = this.uploadFinish;
                }else if (xhr.readyState == 4 && xhr.status != 200) {
                    // Error. Inform the user
                    this.$refs.progressBar.style.width = "0";
                    this.uploaderState = this.uploadFaild
                }

                // after XHR callback
                if(xhr.readyState == 4)
                    if(this.after)
                        this.after(xhr.responseText, xhr.status);
                
                });

                formData.append('file', file);
                
                xhr.open('POST', url, true);
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

                // Befor send XHR 
                if(this.before)
                    this.before(() => xhr.send(formData) );
                else
                    xhr.send(formData);
            }
        }
    }
</script>

<style lang="scss">

    #DropZon {
        border: 3px dashed black;
        border-radius: 6px;
        width: 480px;
        margin: 50px auto;
        height: 90px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
        overflow: hidden;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        cursor: pointer;
        transition: all 0.23s linear;

        &:hover {
            border-color: orangered;
            box-shadow: 1px 1px 18px rgba(0, 0, 0, .2), inset 1px 1px 2px rgba(0, 0, 0, .1);
        }

        &:active {
            box-shadow:1px 1px 2px rgba(0, 0, 0, .1),inset 1px -1px 4px rgba(0, 0, 0, .2);
        }

        > input[type=file]{
            display: none
        }

        > p {
            text-transform: capitalize;
            font-weight: bold;
            color: #ccc;
        }

        > .progressBar{
            position: absolute;
            top: 0;
            left: 0;
            width: 0;
            height: 16px;
            text-align: center;
            background-color: #cddc39;
            font-size: 12px;
            font-weight: bold;
            color: #fff;
            line-height: 16px;
            transition: all .3s;
        }

    }
</style>