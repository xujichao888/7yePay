<template>
  <div class="home" :style="{height:clientHeight+'px'}">
      <div class="pay-title">充值</div>
      <div class="input-box">
          <div class="input1">
              <div class="names">充值账号:</div>
              <input class="input"  type="text" v-model="val1">
          </div>
          <div class="input1">
              <div class="names">确认账号:</div>
              <input class="input"  type="text" v-model="val2">
          </div>
      </div>
      <div class="props">
         <div class="block" v-for="(item,index) in propsArr" :key="index" :class="{active:propsCurrent==index}" @click="changeState(index)">
            <div class="first">
                <img class="icon" src="@/assets/zuanshi@3x.png">
                <div class="diamond">{{item.count}}</div>
            </div>
            <div class="second">
              {{item.count+'.00元'}}
            </div>
         </div>
      </div>
      <div class="next" @click="handlePop" :class="{btnActive:isTrue}">下一步</div>
      <van-popup @closed="close" safe-area-inset-bottom position="bottom" :style="{ height: '280px' }" 
		   round v-model="show" duration="0.1">
          <div class="pay-content">
              <div class="title">确认信息</div>
              <div class="box">
                  <div class="user-number ">充值账号:{{val1}}</div>
                  <div class="users" >充值钻石:{{payMoney+'钻石'}}</div>
                  <div class="user-number " >充值金额:{{payMoney+'.00元'}}</div>
              </div>
              <div class="btnss">
                <div class="boxss">
                   <div class="rbtn btna" @click="show=false">重新选择</div>
                   <div class="surebtn btna">确认充值</div>
                </div>
              </div>
          </div>
      </van-popup>
      <van-popup @closed="close" safe-area-inset-bottom position="bottom" :style="{ height: '380px' }" 
		   round v-model="show" duration="0.1">
          <div class="pay-content">
              <div class="title">确认信息</div>
              <div class="box">
                  <div class="money">
                    <span>￥</span>
                    <span class="bigsize">{{payMoney+'.00元'}}</span>
                  </div>
                  <div class="darmend">
                      {{payMoney+'个钻石'}}
                  </div>
                  <div>
                    充值账号:{{val1}}
                  </div>
              </div>
              <div class="pay-mode">
                  <div class="pay-icon">
                     <img class="pay-mode-icon" src="@/assets/wx.png"  v-if="paymode==0">
                     <img class="pay-mode-icon" src="@/assets/zfb.png" v-if="paymode!=0" >
                     <div v-if="paymode==0" class="pay-text">微信支付</div>
                     <div v-if="paymode!=0" class="pay-text">支付宝支付</div>
                  </div>
                  <van-icon name="wechat-pay" color="#1fb03f" size="20px" v-if="paymode==0"/>
                  <van-icon name="checked" color="#1989fa" size="20px" v-if="paymode!=0"/>
              </div>
              <div class="btnss">
                <div class="boxss">
                   <div class="surebtn btna" @click="paySubmit">确认充值</div>
                </div>
              </div>
          </div>
      </van-popup>
       <pub-toast ref="toast"/>
  </div>
</template>

<script>
// @ is an alias to /src  f0dcc9
import { Toast } from 'vant';
import pubToast from '@/components/pubToast/index.vue'
export default {
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
    })
  },
  components:{
    pubToast,
    Toast
  },
  name: 'Home',
  data(){
    return{
       baseUrl : "//api.7nightapp.com/v1",
       propsArr:[

       ],
       propsCurrent:-1,
       show:false,
       clientHeight:0,
       val1:'',
       val2:'',
       isSure:false,
       paymode:1,
       appid:'wx0bb1a745c126db35',
       code:'',
       openid:''
    }
  },
  computed:{
      isTrue(){
        return !(this.val1!=''&& this.val2!=''&& this.propsCurrent!=-1);
      },
      payMoney(){
          if(this.propsCurrent>=0){
            return this.propsArr[this.propsCurrent].count
          }
      }
  },
  mounted(){
    this.isWechatWebSite()
    this.getProps()
    this.clientHeight=document.documentElement.clientHeight;

  },
  methods:{
    async getProps(){
        try{
          let result = await this.$axios({ url: `${this.baseUrl}/props/getprops` })
          this.propsArr.push(...result.data.data)
          console.log(this.propsArr)
        }catch(err){
          console.log('出错了')
        }
    },
    changeState(idx){
      this.propsCurrent = idx;
    },
    close(){
      if(!this.isSure){
        this.val1=''
        this.val2=''
        this.propsCurrent = -1
      }
   
    },
    
    async getCode () { // 非静默授权，第一次有弹框
                this.code = ''
                var local = "https://pay.7nightapp.com"// 获取页面url
                var appId = 'wx0bb1a745c126db35'
                this.code = this.getUrlCode().code // 截取code

                if (this.code == null || this.code === '') { // 如果没有code，则去请求
                    window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${encodeURIComponent(local)}&response_type=code&scope=snsapi_base&state=123#wechat_redirect`
                } else {
                    // 业务逻辑
                    console.log('code:',this.code)
                    console.log('url',`${this.baseUrl}/order/codetoopenid?code=${this.code}`)
                    let localCode = localStorage.getItem(this.code);
                    console.log(localCode)
                    if(localCode){
                      this.openid = localCode;
                      return
                    }
                    try{
                      var result = await this.$axios({url:`${this.baseUrl}/order/codetoopenid?code=${this.code}`})
                      if(result.data.code == 0){
                        this.openid = result.data.data;
                        localStorage.setItem(this.code,this.openid)
                      }
                    }catch(e){
                      console.log(e)
                    }
                  
                }
            },
    getUrlCode() { // 截取url中的code方法
                var url = location.search
                this.winUrl = url
                var theRequest = new Object()
                if (url.indexOf("?") != -1) {
                    var str = url.substr(1)
                    var strs = str.split("&")
                    for(var i = 0; i < strs.length; i ++) {
                        theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1])
                    }
                }
                return theRequest
    },

    handlePop(){
      if(this.val1 != this.val2){
         this.$refs.toast.show('两次账号不一致,请重新输入');
         return false
      }
      if(this.propsCurrent==-1){
          this.$refs.toast.show('请选择支付金额');
         return false
      }
       this.show = this.isTrue?false: !this.show

    },
    paySubmit(){
            let that = this
      			let data = {
							paymenttype: this.paymode,
							propsid: this.propsArr[this.propsCurrent].propsid,
							tradetype: "4",
              username:this.val1,
              openid:this.openid
						}
      			this.$axios({
							url: `${that.baseUrl}/order/pccreateorder`,
							method:'POST',
							data
						}).then(res => {
            
              console.log(res)
               if(res.data.code != 0) {
                 this.$refs.toast.show('账号不存在,请核对');
                this.val1=''
                this.val2=''
                this.propsCurrent = -1
                this.show=false
                 return false
               }
               console.log('创建订单的返回',res)
               if(res.data.code ==0){
                 this.wxpay(res.data.data)
               }
               
						})
    },
     wxpay(payjson) {
                    if (typeof WeixinJSBridge == "undefined"){
                        if( document.addEventListener ){
                            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                        }else if (document.attachEvent){
                            document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
                            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                        }
                        }else{
                        this.onBridgeReady(payjson);
                    }
              
        },
        onBridgeReady(params) {
            const pay_params = params;
            let self = this;
            console.log({
               "appId": pay_params.appid,  //公众号名称，由商户传入     
                    "timeStamp":  parseInt(new Date().getTime()/1000),  //时间戳，自1970年以来的秒数     
                    "nonceStr": pay_params.nonce_str,  //随机串     
                    "package": `prepay_id=${pay_params.prepay_id}`,     
                    "signType": 'RSA',  //微信签名方式：     
                    "paySign": pay_params.sign  //微信签名 
            })
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', {
                    "appId": pay_params.appid,  //公众号名称，由商户传入     
                    "timeStamp":  parseInt(new Date().getTime()/1000)+'',  //时间戳，自1970年以来的秒数     
                    "nonceStr": pay_params.nonce_str,  //随机串     
                    "package": `prepay_id=${pay_params.prepay_id}`,     
                    "signType": 'MD5',  //微信签名方式：     
                    "paySign": pay_params.sign  //微信签名 
                },
                function(res){
                   console.log('调起微信支付的返回',res)
                    if(res.err_msg == "get_brand_wcpay_request:ok" ){
                      alert('支付成功');
                   self.val1=''
                  self.val2=''
                  self.propsCurrent = -1
                  self.show=false
                } 
            }); 
        },
    isWechatWebSite(){
          //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
      let ua = window.navigator.userAgent.toLowerCase();
      //通过正则表达式匹配ua中是否含有MicroMessenger字符串
      if(ua.match(/MicroMessenger/i) == 'micromessenger'){
          this.paymode=0;
          this.getCode()
          
      } 
    }
  }

}
</script>
<style lang="scss" scoped>
  /deep/ .van-popup--round {
    border-radius: 35px;
  }
  .home{
    width: 750px;
    font-size: 38px;
    position: absolute;
    .pay-title{
      font-size: 38px;
      font-weight: bold;
      height: 120px;
      line-height: 140px;
    }
    .input-box{
        width: 700px;
        margin: 0 auto;
        height: 300px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: start;
        font-size: 28px;
        .input1{
          width: 100%;
          margin-bottom: 20px;
          .names{
            color: #666;
            margin-bottom: 5px;
          }
          .input{
            display: block;
            width: 100%;
            box-sizing: border-box;
            border: solid 3px #eac9aa;
            background: none;
            border-radius: 10px;
            height: 80px;
            padding: 0 20px;
          }
        }
    }
    .props{
      padding: 0 25px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      align-content: flex-start;
      .block{
        width: 220px;
        height: 140px;
        background: rgba(0,0,0,0.05);
        margin-bottom: 20px;
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .first{
          display: flex;
          align-items: center;
          .icon{
            width: 51px;
            height: 45px;
            display: block;
            margin-right: 10px;
          }
          .diamond{
            font-size: 38px;
          }
        }
        .second{
          font-size: 28px;
          color: #999;
        }

      }
      .active{
        background: #eac9aa;
      }
    }
    .next{
      font-size: 30px;
      position: absolute;
      bottom: 50px;
      width: 650px;
      height: 90px;
      border-radius: 90px;
      background: #eac9aa;
      left: 50%;
      transform: translateX(-50%);
      color: #fff;
      line-height: 90px;
    }
    .pay-content{
        font-size: 28px;
        .title{
           height: 80px;
           line-height: 80px;
           font-size: 28px;
           color: rgba(90,90,90,1);
            border-bottom: solid 1px rgba(233,233,233,1);
        }
        .box{
          width: 700px;
          margin: 0 auto;
          border-bottom: 2px solid rgba(233,233,233,1);
          height: 300px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .money{
            display: flex;
            align-items: flex-end;
            .bigsize{
              font-size: 50px;
            }
          }
          .darmend{
            margin-top: 20px;
            margin-bottom: 20px;
          }
        }
        .pay-mode{
          margin-top: 30px;
          padding: 0 25px;
          display: flex;
          justify-content: space-between;
          width: 750px;
          box-sizing: border-box;
          align-items: center;
          .pay-icon{
            display: flex;
            align-items: center;
            .pay-mode-icon{
              width: 72px;
            }
            .pay-text{
              margin-left: 20px;
            }
          }
        }
        .btnss{
          position: absolute;
          bottom: 50px;
          display: flex;
          width: 100%;
         justify-content: center;
       
         box-sizing: border-box;
         .boxss{
           width: 100%;
            padding: 0 50px;
          display: flex;
           justify-content: space-between;
           .btna{
             width: 700px;
             display: flex;
             align-items: center;
             justify-content: center;
             border-radius: 500px;
             background: #eac9aa;
             height: 80px;
           }
           .rbtn{
             background: rgba(0,0,0,0.05);
             color: #999;
           }
         }
        }
    }
    .btnActive{
      background: #f0dcc9;
    }
  }
</style>
