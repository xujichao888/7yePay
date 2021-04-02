<template>
   <div class="toast" v-show="toastShow">
  {{toastText}}
</div>
</template>

<script>
export default {
    data(){
        return{
            toastShow: false,
            toastText: ''
        }
    },
    methods:{
        show (str) {
            if(this.toastShow) return false
            let v = this
            v.toastText = str
            v.toastShow = true
            setTimeout(function(){
            v.toastShow = false
            }, 1500)
        }

    }
}
</script>

<style lang="scss" scoped>
  .toast {  

            position: fixed;
            z-index: 2000;
            left: 50%;
            top:45%;
            transition:all .5s;
            -webkit-transform: translateX(-50%) translateY(-50%);
               -moz-transform: translateX(-50%) translateY(-50%);
                -ms-transform: translateX(-50%) translateY(-50%);
                 -o-transform: translateX(-50%) translateY(-50%);
                    transform: translateX(-50%) translateY(-50%);
            text-align: center;
            border-radius: 5px;
            color:#FFF;
            background: rgba(17, 17, 17, 0.7);
            line-height: 45px;
            padding: 20px;
            max-width: 600px;
            border-radius: 10px;
            font-size: 38;
        }
</style>