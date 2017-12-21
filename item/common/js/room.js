/**
 * Created by NM-029 on 10/28/2016.
 */
(function (win) {
    //后台返回的房间信息
    var recommendRoomListMapInfo = function (avatar,nickname,roomid,showid,verified,mediaUrl,location,big_avatar,level_url,live_status,member_num,show_duration,replay_id,verified_reason){               //上部分视频区
        this.avatar = avatar;
        this.nickname = nickname;
        this.roomid = roomid;
        this.showid = showid;
        this.verified = verified;
        this.mediaUrl = mediaUrl;
        this.location = location;
        this.big_avatar = big_avatar;
        this.level_url = level_url;
        this.live_status = live_status;
        this.member_num = member_num;
        this.show_duration = show_duration;
        this.replay_id = replay_id;
        this.verified_reason = verified_reason;
    };
    recommendRoomListMapInfo.prototype = {
        constructor:recommendRoomListMapInfo,
        funcGetAvatars:function () {
            return this.avatar;
        },
        funcGetNicknames:function () {
            // return this.nickname;
            return this.nickname.length>6?this.nickname.substr(0, 6):this.nickname;
        },
        funcGetRoomId:function () {
            return this.roomid;
        },
        funcGetShowId:function () {
            return this.showid;
        },
        funcGetVerified:function () {
            return this.verified;
        },
        funcGetMediaUrl:function () {
            return this.mediaUrl;
        },
        funcGetLocation:function () {
            return this.location;
        },
        funcGetBigAvatar:function () {
            return this.big_avatar;
        },
        funcGetLevelUrl:function () {
            return this.level_url;
        },
        funcGetLiveStatus:function () {
            return this.live_status;
        },
        funcShowDuration:function () {
            return this.show_duration;
        },
        funcGetMemberNum:function () {
            return this.member_num;
        },
        funcGetReplayId:function () {
            return this.replay_id;
        },
        funcGetVerifiedReason:function () {
            return this.verified_reason;
        }
    };

    win.recommendRoomListMapInfo = recommendRoomListMapInfo;
})(window);
