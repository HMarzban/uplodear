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
                    // callback
                    done();
                }, 1000);
            },
            after(){
                console.log("data done");
            },
            progress(total, lists){
                console.log(total, lists);
            }
        },
    }
</script>

<style scoped>

</style>