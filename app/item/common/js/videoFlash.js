/**
 * Created by NM-029 on 10/24/2016.
 */
(function (win) {
    /* 视频 */
    var Video = function(swfAddr, media_url, showid, param_quality, resourceId, servIp, servPort){
        if(media_url)
            this.media_url = media_url;         //视频流地址
        if(param_quality)
            this.param_quality = param_quality; //视频流参数

        /* openfire */
        if(resourceId)
            this.resourceId = resourceId;
        if(servIp)
            this.servIp = servIp;
        if(servPort)
            this.servPort = servPort;
        this.swfAddr = swfAddr;     //播放器地址
        this.showid = showid;
        this.websocketIp="";
        this.websocketPort=7070;
        var screenWidth=$(document.documentElement).width();
        var screenHeight;
        if (window.innerHeight){
            //滚动条
            if(document.body.style.overflow!="hidden"&&document.body.scroll!="no"&&
                document.body.scrollWidth>document.body.offsetWidth)
            {
                screenHeight = window.innerHeight;//横向有滚动条
            }else
            {
                screenHeight = window.innerHeight;
            }
        }else if ((document.body) && (document.body.clientHeight)){
            screenHeight = document.body.clientHeight;
        }

        if(screenWidth>1300){//大屏幕设置
            if(screenHeight>629){//自由伸缩
                this.videoHeight = screenHeight;                   //视频高
                this.videoWidth = parseInt(screenHeight/1.77);     //视频宽
            }else if(screenHeight>960){
                this.videoHeight = 960;
                this.videoWidth = 540;
            }else{
                this.videoHeight = 629;
                this.videoWidth = 355;
            }
        }else{
            this.videoHeight = 629;
            this.videoWidth = 355;
        }

        this.videoSel='#mediaUrl';
        this.videoPaneSel = '.liveroom_video';
        this.funcInit();
    };
    Video.prototype = {
        constructor:Video,
        funcInit:function () {
            this.funcGenerateVideoHtml();
        },
        funcGetMediaUrl:function(){
            return this.media_url;
        },

        funcGetParamQuality:function(){
            return this.param_quality;
        },
        funcGetResourceId:function(){
            return this.resourceId;
        },
        funcGetServIp:function(){
            return this.servIp;
        },
        funcGetServPort:function(){
            return this.servPort;
        },
        funcGetShowId:function () {
            return this.showid;
        },
        funcSetShowId:function (showid) {
            return this.showid=showid;
        },
        funcSetMediaUrl:function(mediaUrl){
            this.media_url = mediaUrl;
        },
        funcSetParamQuality:function(paramQuality){
            this.param_quality = paramQuality;
        },
        funcSetResourceId:function(resourceId){
            this.resourceId = resourceId;
        },
        funcSetServIp:function(servIp){
            this.servIp = servIp;
        },
        funcSetServPort:function(servPort){
            this.servPort = servPort;
        },
        funcSetWebsocketIp:function(websocketIp)
        {
            this.websocketIp=websocketIp;
        },
        funcGetWebsocketIp:function()
        {
            return this.websocketIp;
        },
        funcSetWebsocketPort:function(websocketPort)
        {
           return this.websocketPort=websocketPort;
        },
        funcGetWebsocketPort:function()
        {
            return this.websocketPort;
        },
        /**========= start ======首页 flash 接口================*/
        //进入房间
        funEnterRoomByRoomid:function (showId) {
            // console.log("showId==="+showId );
            win.open("#/" + showId, "_blank");
        },
        //错误信息输出，flash这边有错误后调用js，将错误信息传递给js
        funRecordViewerSwfErrorLog:function (str) {
            console.log(str);
        },
        //视频播放器重新拉流 restartPlayStream
        //设置房间号 setRoomid
        funcSetShowid:function (showid) {
            var dtplayer = this.getDTPlayerSwfObject();
            dtplayer.setRoomid(showid);
        },

        /**========= end ======首页 flash 接口================*/
        getDTPlayerSwfObject:function(){
            if (navigator.appName.indexOf("Microsoft Internet")==-1){//非IE
                if (document.embeds && document.embeds['DTPlayer'])
                    return document.embeds['DTPlayer'];
                else
                    return window['DTPlayer'];//document.getElementById("DTPlayer");
            }
            else{
                return window['DTPlayer'];
            }
        },
        //调整视频大小
        funcChangeVideoWidth:function() {
            var that = this;
            var dtplayer = this.getDTPlayerSwfObject();
            dtplayer.setPlayerSize(this.videoWidth, this.videoHeight);
            $(dtplayer).attr('width', this.videoWidth);
            $(dtplayer).attr('height', this.videoHeight);
        },
        funcGenerateVideoHtml:function(){
            var videoWidth = 283;
            var videoHeight = 505;

            try{
                if(win.funcGetIsRoomPage()){
                    videoWidth = this.funcGetVideoWidth();
                    videoHeight = this.funcGetVideoHeight();
                }
            }catch (e){
                console.log('funcGenerateVideoHtml: '+e);
            }
            // console.log('videoWidth:'+videoWidth+', videoHeight:'+videoHeight);

            var html  = this.videoHdMb.replace(/\{\{mediaUrl\}\}/g, this.funcGetMediaUrl())
                .replace(/\{\{width\}\}/g, videoWidth)
                .replace(/\{\{height\}\}/g, videoHeight)
                .replace(/\{\{showid\}\}/g, this.showid)
                .replace(/\{\{swfAddr\}\}/g, this.swfAddr);
            $(this.videoSel).html(html);
        },
        funcResize:function () {
            var oldWidth = this.funcGetVideoWidth();
            var nowWidth = document.querySelector(this.videoPaneSel).offsetWidth;
            var nowHeight = document.querySelector(this.videoPaneSel).offsetHeight;
            //不变化
            if( oldWidth == nowWidth ){
                return false;
            }
            this.funcSetVideoWidth(nowWidth);
            this.funcSetVideoHeight(nowHeight);
            return true;
        },
        funcGetVideoWidth:function(){
            return this.videoWidth;
        },
        funcGetVideoHeight:function(){
            return this.videoHeight;
        },
        funcSetVideoWidth:function(videoWidth){
            this.videoWidth = videoWidth;
        },
        funcSetVideoHeight:function(videoHeight){
            this.videoHeight = videoHeight;
        },
        videoHdMb:'\
        <object type="application/x-shockwave-flash" id="DTPlayer" data="{{swfAddr}}" width="{{width}}" height="{{height}}">\
        <param name="quality" value="high">	<param name="allowScriptAccess" value="always">	\
        <param name="allowFullScreen" value="true">	<param name="wmode" value="transparent">\
        <param name="flashvars" value="width={{width}}&height={{height}}&playurl={{mediaUrl}}&roomid={{showid}}"></object>'
    };
//离开首页 首页视频暂停
    var isFocus="";
    window.onblur = function() {
        isFocus = false;
        if (!isFocus) {
            var homePagePlayerSwfObj = Video.prototype.getDTPlayerSwfObject('hrindexplayer');
            if (homePagePlayerSwfObj && homePagePlayerSwfObj.stopPlay) {
                homePagePlayerSwfObj.stopPlay();
            }
        }
        window.onfocus = function () {
            isFocus = true;
        }
    };

    //视频变黑后，回调重新加载流
    function funIndexPagePullStreamFail(){
        console.log('funIndexPagePullStreamFail');
        win.EventMd.create(eventEmType.EM_TYPE_FLASH_EVT).trigger(eventEmType.EM_SUB_TYPE_FLASH_VIDEO_FLOW_INTERRUPT);
    }
    //重新加载首页，当主页当前播放的主播停播后，flash监测到流已经断了，调用js，用于重新拉取首页，获取最新推荐主播，拉流播放
    function funFlushPage(){
        console.log('funFlushPage');
        win.EventMd.create(eventEmType.EM_TYPE_FLASH_EVT).trigger(eventEmType.EM_SUB_TYPE_FLASH_VIDEO_FLOW_INTERRUPT);
    }

    win.Video = Video;
    /*首页 视频调用*/
    win.funEnterRoomByRoomid = Video.prototype.funEnterRoomByRoomid;
    win.funRecordViewerSwfErrorLog = Video.prototype.funRecordViewerSwfErrorLog;
    win.funIndexPagePullStreamFail = funIndexPagePullStreamFail;
    win.funFlushPage = funFlushPage;
})(window);
