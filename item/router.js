/*默认启动页面，以及不能识别的路由都返回anchors*/
angular.module('xsWeb')
    .config(['$stateProvider', '$urlRouterProvider','$locationProvider',
        function ($stateProvider, $urlRouterProvider, $locationProvider) {

            if (urlH5Mode) {
                $locationProvider.html5Mode(true);
            }
            $urlRouterProvider.when('', '/');

            $stateProvider

            // web 页面
                //带上方通用头部UI的基础html
                .state('baseHead', {
                    url : '',
                    abstract : true,
                    views : {
                        '' : {
                            templateUrl: 'item/common/html/baseHead.html'
                        }
                    }
                })

                //直播大厅
                .state('baseHead.liveHall', {
                    url : '/',
                    views : {
                        'mainView' : {
                            templateUrl: 'item/liveHall/html/liveHall.html'
                        }
                    }
                })

                //充值
                .state('baseHead.recharge', {
                    url : '/recharge',
                    views : {
                        'mainView' : {
                            templateUrl: 'item/others/html/recharge.html'
                        }
                    }
                })

                //微信充值
                .state('baseHead.weixin', {
                    url : '/weixin',
                    views : {
                        'mainView' : {
                            templateUrl: 'item/others/html/weixinpay.html'
                        }
                    }
                })

                //搜索主播
                .state('baseHead.searchAnchor', {
                    url : '/searchAnchor/:searchAnchorKeywords',
                    views : {
                        'mainView' : {
                            templateUrl: 'item/others/html/searchAnchor.html'
                        }
                    }
                })

                //修改密码
                .state('baseHead.password', {
                    url : '/password',
                    views : {
                        'mainView' : {
                            templateUrl: 'item/others/html/password.html'
                        }
                    }
                })
                //个人空间
                .state('baseHead.selfRecord', {
                    url : '/profile/{r:[0-9]{3}}{uid:[0-9]{1,9}}_1',
                    views : {
                        'mainView' : {
                            templateUrl: 'item/others/html/recordSelf.html'
                        }
                    }
                })
                //他人空间
                .state('baseHead.otherRecord', {
                   // url : '/other',
                    url : '/profile/{r:[0-9]{3}}{uid:[0-9]{1,9}}_2',
                    views : {
                        'mainView' : {
                            templateUrl: 'item/others/html/recordElse.html'
                        }
                    }
                })
                //个人空间
                /*.state('baseHead.spaceSelf', {
                    url : '/profile/{r:[0-9]{3}}{uid:[0-9]{1,9}}',
                    views : {
                        'mainView' : {
                            templateUrl: 'item/others/html/spaceSelf.html'
                        }
                    }
                })*/

                //用户信息导航
                .state('baseHead.user', {
                    url : '/user',
                    views : {
                        'mainView' : {
                            templateUrl: 'item/mySpace/html/userLeft.html'
                        }
                    }
                })

                //我的资料
                .state('baseHead.user.info', {
                    url : '/info',
                    views : {
                        'userView' : {
                            templateUrl: 'item/mySpace/html/myHome.html'
                        }
                    }
                })


                //麦时统计
                .state('baseHead.user.tongji', {
                    url : '/tongji',
                    views : {
                        'userView' : {
                            templateUrl: 'item/mySpace/html/tongji.html'
                        }
                    }
                })

                //实名认证
                .state('baseHead.user.renZheng', {
                    url : '/renzheng',
                    views : {
                        'userView' : {
                            templateUrl: 'item/mySpace/html/renzheng.html'
                        }
                    }
                })

                //兑换红钻
                .state('baseHead.user.exchange', {
                    url : '/exchange',
                    views : {
                        'userView' : {
                            templateUrl: 'item/mySpace/html/exchange.html'
                        }
                    }
                })
                //手机绑定
                .state('baseHead.user.mobileBound', {
                    url : '/mobileBound',
                    views : {
                        'userView' : {
                            templateUrl: 'item/mySpace/html/mobileBound.html'
                        }
                    }
                })


                //商城
                .state('baseHead.shop',{
                    url : '/shop',
                    views : {
                        'mainView' : {
                            templateUrl: 'item/shop/html/shopMain.html'
                        }
                    }
                })
                .state('baseHead.shop.car',{
                    url : '/car',
                    views : {
                        'shopView' : {
                            templateUrl: 'item/shop/html/car.html'
                        }
                    }
                })
                .state('baseHead.shop.guard',{
                    url : '/guard',
                    views : {
                        'shopView' : {
                            templateUrl: 'item/shop/html/guard.html'
                        }
                    }
                })
                .state('baseHead.shop.vip',{
                    url : '/vip',
                    views : {
                        'shopView' : {
                            templateUrl: 'item/shop/html/vip.html'
                        }
                    }
                })
                //排行榜
                .state('baseHead.rankingList',{
                    url : '/rankingList',
                    views : {
                        'mainView' : {
                            templateUrl: 'item/rankingList/html/rankingList.html'
                        }
                    }
                })

                //直播间基础页
                .state('roomBase', {
                    url : '',
                    abstract : true,
                    views : {
                        '' : {
                            templateUrl: 'item/room/html/roomBase.html'
                        }
                    }
                })

                //个人空间
                .state('roomBase.room', {
                    url : '/{showid:[0-9]{1,9}}',
                    views : {
                        'roomView' : {
                            templateUrl: 'item/room/html/room.html'
                        }
                    }
                })

        }
    ]);
