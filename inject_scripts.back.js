
(function() {
    console.info("injecting script to self:",self)
//    const newUrl = new URL(self.location.href).origin + '/video/assets/main-CIrjfxem.js';

   const nexusUrl = new URL(self.location.href).origin + '/video/assets/_nexus-CG5Ud4Gb.js';
    console.info("injecting import module url:",nexusUrl);
    import(nexusUrl).then(module => {
      console.info("injecting nexus module loaded:",module);
      self.nexus = module;
    });
    const piniaUrl = new URL(self.location.href).origin + '/video/assets/pinia-DYdZZe7e.js';
    console.info("injecting import module url:",piniaUrl);
    import(piniaUrl).then(module => {
      console.info("injecting pinia module loaded:",module);
      self.pinia = module;
    });

    const zc = (e => (e[e.HEARTBEATS = 1] = "HEARTBEATS",
        e[e.LOGIN_SUCCESS = 106] = "LOGIN_SUCCESS",
        e[e.LOGIN_ERROR = 107] = "LOGIN_ERROR",
        e[e.ERROR = 600] = "ERROR",
        e[e.SERVER_MAINTAIN = 700] = "SERVER_MAINTAIN",
        e[e.UPDATE_SCORE = 720] = "UPDATE_SCORE",
        e[e.GAME_CONFIG = 1201] = "GAME_CONFIG",
        e[e.ROOM_INFOS = 1001] = "ROOM_INFOS",
        e[e.SELF_SCORE = 1102] = "SELF_SCORE",
        e[e.CHECK_BETTING_ROOM = 1314] = "CHECK_BETTING_ROOM",
        e[e.ROOM_BEGIN_CHIP = 1002] = "ROOM_BEGIN_CHIP",
        e[e.ROOM_GAME_RESULT = 1004] = "ROOM_GAME_RESULT",
        e[e.GOOD_ROAD_CHANGE = 1303] = "GOOD_ROAD_CHANGE",
        e[e.ENTER_INNER_ROOM = 1006] = "ENTER_INNER_ROOM",
        e[e.DEAL_CARD = 1300] = "DEAL_CARD",
        e[e.BACCARAT_BET = 1008] = "BACCARAT_BET",
        e[e.SYNC_BET = 1999] = "SYNC_BET",
        e[e.ROAD_SET_SUCCEED = 1305] = "ROAD_SET_SUCCEED",
        e[e.BACCARAT_ONLINE_LIST = 1101] = "BACCARAT_ONLINE_LIST",
        e[e.BET_STAGE_ERROR = 1202] = "BET_STAGE_ERROR",
        e[e.EDIT_CARDS = 1301] = "EDIT_CARDS",
        e[e.WASHING_CARD = 1302] = "WASHING_CARD",
        e[e.INTO_MAINTAIN = 1304] = "INTO_MAINTAIN",
        e[e.BET_INFO_RES = 1315] = "BET_INFO_RES",
        e[e.BACCARAT_KICK_USER_2_LIST = 1316] = "BACCARAT_KICK_USER_2_LIST",
        e[e.SET_SHOW_OPTION_SUCCEED = 1308] = "SET_SHOW_OPTION_SUCCEED",
        e[e.BACCARAT_UPDATE_DEALER_INFO = 1317] = "BACCARAT_UPDATE_DEALER_INFO",
        e[e.BACCARAT_ROOM_VIDEO_URL_INFO = 1407] = "BACCARAT_ROOM_VIDEO_URL_INFO",
        e[e.BACCARAT_MI_START = 1400] = "BACCARAT_MI_START",
        e[e.BACCARAT_MI_INFO = 1401] = "BACCARAT_MI_INFO",
        e[e.BACCARAT_MI_END = 1402] = "BACCARAT_MI_END",
        e[e.BACCARAT_MI_RIGHT_INFO = 1403] = "BACCARAT_MI_RIGHT_INFO",
        e[e.BACCARAT_MI_OTHER_OPEN = 1404] = "BACCARAT_MI_OTHER_OPEN",
        e[e.BACCARAT_MI_CAN_ENTER_WITH_SIT = 1405] = "BACCARAT_MI_CAN_ENTER_WITH_SIT",
        e[e.BACCARAT_MI_ENTER_WITH_SIT_RES = 1406] = "BACCARAT_MI_ENTER_WITH_SIT_RES",
        e[e.BACCARAT_BET_RES = 1409] = "BACCARAT_BET_RES",
        e[e.ROOM_LIST = 2999] = "ROOM_LIST",
        e[e.ACCOUNT_REMOTE_LOGIN = 702] = "ACCOUNT_REMOTE_LOGIN",
        e[e.BACCARAT_CLIENT_CONFIG = 1430] = "BACCARAT_CLIENT_CONFIG",
        e[e.BACCARAT_SELF_CHIPS = 1441] = "BACCARAT_SELF_CHIPS",
        e))(zc || {});
    })

    console.info("injecting script to self:", self);

    function clickCenter(element, clickCount = 1) {
        if (!element) {
            console.warn('handleMessage clickCenter: element is null or undefined');
            return;
        }
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < clickCount; i++) {
            const event = new MouseEvent('click', {
                view: self,
                bubbles: true,
                cancelable: true,
                clientX: centerX,
                clientY: centerY
            });
            element.dispatchEvent(event);
        }
    }
    function selectCoins(betAmount) {
        const coins = [1000, 5000,10000,20000,50000,100000, 200000,500000,1000000,2000000,5000000, 10000000];
        let theBet = betAmount * 100;
        const selectedCoins = [];
        for (let i = coins.length - 1; i >= 0; i--) {
            while (theBet >= coins[i]) {
                selectedCoins.push(coins[i]);
                theBet -= coins[i];
            }
        }
        return selectedCoins;
    }
    function getNavigationTitle() {
        let div = document.querySelector('#navBar span.text-sm')
        if (div === null || div === undefined || div.innerText === null || div.innerText === undefined) {
            return '';
        }
        return div.innerText;
    }
    function isLongHuPage(){
        return getNavigationTitle().includes('L01')
    }
    
    function handleMessage(card1, card2, theTime, betAmount) {
        console.info('handle message:', card1, card2, theTime, betAmount);
        if (!isLongHuPage()) {
            console.warn('当前不是"龙虎 L01"页面,忽略消息');
            removeFloatingDiv();
            return;
        }
        if(betAmount==0){
            betAmount = localStorage.getItem('betAmount');
            if(!betAmount||betAmount==0)betAmount=10;
        }
        if(betAmount<=1){
            let maxBet = localStorage.getItem('totalMoney')
            if(!maxBet){
                maxBet = getMaxSelectedChipValue()
            }
            betAmount = maxBet * betAmount;
            if(betAmount<0)betAmount=-betAmount;
        }


        const card1_num = (card1 % 13) + 1;
        const card2_num = (card2 % 13) + 1;
        const area_num = card1_num > card2_num ? 0 : (card1_num < card2_num ? 2 : 1);

        if (self.wsNet && wsNet.send) {
            if (card1_num > card2_num) {
                wsNet.send(500, 2000, { roomId: 8801, betEnv: 1, carrier: '8801-' + Date.now(), areaBet: [{ area: 1, bet: betAmount * 100, betType: 0, count: 1 }] });
            } else if (card1_num < card2_num) {
                wsNet.send(500, 2000, { roomId: 8801, betEnv: 1, carrier: '8801-' + Date.now(), areaBet: [{ area: 2, bet: betAmount * 100, betType: 0, count: 1 }] });
            } else if (card1_num == card2_num) {
                wsNet.send(500, 2000, { roomId: 8801, betEnv: 1, carrier: '8801-' + Date.now(), areaBet: [{ area: 3, bet: betAmount * 100, betType: 0, count: 1 }] });
            }
            console.info('handle pack spend time:', new Date().getTime() - theTime, card1_num, card2_num, area_num,betAmount);
            //return;
        }

        const coins = selectCoins(betAmount);
        if(coins.length==0)return;
        const chipValue = coins[0];
        const cnt = coins.filter(item => item === chipValue).length;
        const chipButton = document.querySelector(`div[data-type="${chipValue}"]`);
        if (chipButton && window.getComputedStyle(chipButton).display !== 'none' && chipButton.parentElement && window.getComputedStyle(chipButton.parentElement).display !== 'none') {
            const betAreaSelector = '.area-' + area_num + ' > div[fast-click]';
            const confirmSelector = '.area-' + area_num + ' .button-click.chips-button-right';
            chipButton.addEventListener('click', () => {
                console.info(`handle message Clicked chip with value: ${chipValue}`);
                clickBetAreaThenConfirm(betAreaSelector,confirmSelector,cnt,theTime);
            }, { once: true });
            clickCenter(chipButton);
        }
    }

    function isMutipleTable(){
        let firstRoombettingDiv = document.querySelector('#more-list-wrap .room-betting')
        return firstRoombettingDiv!==undefined
    }

    function handleTableMessage(tableId, card1, card2, tableName, theTime, betAmount) {
        console.info('handle table message:', tableId, card1, card2, tableName, theTime, betAmount);
        if (tableId == 8801 && isLongHuPage()) {
            console.info('当前是龙虎 L01页面,且是龙虎消息,立即处理...');
            return handleMessage(card1, card2, theTime, betAmount);
        } else if (tableId == 8801) {
            console.info('当前不是龙虎页面，忽略龙虎消息。');
            return;
        }
        if (!isMutipleTable()) {
            console.info('当前不是多桌投注页面...');
            let navigationTitle = getNavigationTitle();
            if (navigationTitle.includes(tableName)) {
                console.info('当前在游戏' + tableName + '页面...');
                return betBaccInSingleTable(tableId, card1, card2, theTime, betAmount);
            }
            return void 0;
        }
    
        let maxBet = localStorage.getItem('totalMoney');
        if (!maxBet) {
            maxBet = getMaxSelectedChipValue();
        }
        const card1_num = (card1 % 13) + 1;
        const card2_num = (card2 % 13) + 1;
        let dot1 = card1_num >= 10 ? 0 : card1_num, dot2 = card2_num >= 10 ? 0 : card2_num;
        let xDot = (dot1 + dot2) % 10;
        let needBet,needBetAmount,theDotKey
        for(key in window.betRates){
            if(key.includes(''+xDot)){
                theDotKey = key
                needBet = window.betRates[key][1]
                needBetAmount = window.betRates[key][0]
                break
            }
        }
        if(card1_num==card2_num){
            let key = '闲对'
            needBet = window.betRates[key][1]
            needBetAmount = window.betRates[key][0]
        }
        if(!needBet){
            console.info("闲"+xDot+"["+card2_num+","+card2_num+"]  "+theDotKey+" 配置了不下注。");
            return
        }
        // area-0:闲对  area-3:闲  area-5:庄  area-4:和
        const betAreaMap = {
            0: 'area-5',
            1: 'area-5',
            2: 'area-5',
            3: 'area-5',
            4: 'area-5',
            5: 'area-5',
            6: 'area-4',
            7: 'area-3',
            8: 'area-3',
            9: 'area-3'
        };
        
        const betArea = card1_num === card2_num ? 'area-0' : betAreaMap[xDot];
        let theBetAmount;
        if(betAmount>1){
            theBetAmount = betAmount;
        }else if (betAmount==-1||betAmount==0){
            theBetAmount = needBetAmount;
        }
        if(theBetAmount<=1){
            theBetAmount = maxBet * theBetAmount;
        }
        if (theBetAmount < 10) theBetAmount = 10;
    
        const coins = selectCoins(theBetAmount);
        if (coins.length == 0) return;
        const chipValue = coins[0];
        const cnt = coins.filter(item => item === chipValue).length;
        const chipButton = document.querySelector(`div[data-type="${chipValue}"]`);
        const clickAreaSelector = `#lot-bet-item-box-${tableId} .${betArea} > div[fast-click]`;
        const confirmAreaSelector = `#lot-bet-item-box-${tableId} .${betArea} .button-click.chips-button-right`;
        const outDiv = document.querySelector(`#lot-bet-item-box-${tableId}`);
        let clickedBet = false;
    
        if (outDiv) {
            if (outDiv.getAttribute('class') == 'lazy-show' && outDiv.getAttribute('inview') == 'true') {
                clickChipAndBet();
            } else {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            observer.unobserve(outDiv); // 停止观察
                            if (outDiv.getAttribute('class') == 'lazy-show' && outDiv.getAttribute('inview') == 'true') {
                                clickChipAndBet();
                            } else {
                                const mutationObserver = new MutationObserver((mutationsList) => {
                                    for (let mutation of mutationsList) {
                                        if (mutation.type === 'attributes' && (mutation.attributeName === 'class' || mutation.attributeName === 'inview')) {
                                            if (outDiv.getAttribute('class') == 'lazy-show' && outDiv.getAttribute('inview') == 'true') {
                                                clickChipAndBet();
                                                mutationObserver.disconnect(); // 停止观察
                                            }
                                        }
                                    }
                                });
                                mutationObserver.observe(outDiv, { attributes: true, attributeFilter: ['class', 'inview'] });
                            }
                        }
                    });
                }, { threshold: 1 });
                observer.observe(outDiv);
                outDiv.scrollIntoView();
            }
            setTimeout(() => {
                clickChipAndBet();
            }, 20);
        }
    
        function clickChipAndBet() {
            if (chipButton && window.getComputedStyle(chipButton).display !== 'none' && chipButton.parentElement && window.getComputedStyle(chipButton.parentElement).display !== 'none' && !clickedBet) {
                chipButton.addEventListener('click', () => {
                    console.info(`handle message Clicked chip with value: ${chipValue}`);
                    clickBetAreaThenConfirm(clickAreaSelector, confirmAreaSelector, cnt, theTime);
                }, { once: true });
                clickCenter(chipButton);
                clickedBet = true;
            }
        }
    }
    
    function clickBetAreaThenConfirm(areaSelector, confirmSelector, count, theTime) {
        document.querySelectorAll(areaSelector).forEach(div => {
            for (let i = count - 1; i >= 0; i--) {
                clickCenter(div);
            }
            const clickPromise = new Promise(resolve => {
                div.addEventListener('click', function () {
                    // 触发点击事件
                    const childDivs = document.querySelectorAll(confirmSelector);
                    childDivs.forEach(div1 => {
                        requestAnimationFrame(() => {
                            if (window.getComputedStyle(div1).display !== 'none' && div1.parentElement && window.getComputedStyle(div1.parentElement).display !== 'none') { // 检查子div是否显示
                                clickCenter(div1); // 延迟触发点击事件
                                console.info('handle message click confirm spend time:', new Date().getTime() - theTime);
                            }
                        });
                    });
                    resolve(); // 解析 Promise
                }, { once: true });
            });
    
            clickCenter(div);
            console.info('handle message click bet div spend time:', new Date().getTime() - theTime);
            // 等待 clickPromise 解析后再继续
            clickPromise.then(() => {
            });
        });
    }
    
    self.handleTableMessage = handleTableMessage;

    // 暴露方法供外部调用
    self.handleMessage = handleMessage;

    function removeFloatingDiv(){
        const existingDiv = document.getElementById('betFloatingDiv');
        if (existingDiv) {
            existingDiv.remove();
            console.log("floating div removed!")
        }
    }
    // 创建悬浮的 div
    function createFloatingDiv() {
        // 检查是否已经存在悬浮 div
        removeFloatingDiv();
        const floatingDiv = document.createElement('div');
        floatingDiv.id = 'betFloatingDiv'; // 添加唯一的 id
        floatingDiv.style.position = 'fixed';
        floatingDiv.style.bottom = '20px';
        floatingDiv.style.left = '20px'; // 初始位置调整为左下角
        floatingDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        floatingDiv.style.border = '2px solid #ff6347'; // 设置鲜艳的颜色边框
        floatingDiv.style.padding = '10px';
        floatingDiv.style.borderRadius = '3px';
        floatingDiv.style.boxShadow = '0 2px 3px rgba(0, 0, 0, 0.2)';
        floatingDiv.style.zIndex = '10000';
        floatingDiv.style.cursor = 'move'; // 添加鼠标移动光标
        floatingDiv.style.width = '180px'; // 调整宽度以适应更多内容
        floatingDiv.style.height = 'auto'; // 高度自适应
        floatingDiv.style.fontSize = '12px';

        // 创建标题
        const title = document.createElement('div');
        title.id = 'bet-comment';
        title.textContent = '插件配置';
        title.style.textAlign = 'center';
        title.style.marginBottom = '10px';
        title.style.width = '100%';
        floatingDiv.appendChild(title);
        // 默认值
        const defaultValues = {
            '0庄': [0.29, true],
            '1庄': [0.28, true],
            '2庄': [0.25, true],
            '3庄': [0.21, true],
            '4庄': [0.14, true],
            '5庄': [0.05, true],
            '6和': [0.03, true],
            '7闲': [0.15, true],
            '8闲': [0.65, true],
            '9闲': [1, true],
            '闲对': [1, true],
            '龙虎': [1, true]
        };

        // 从 localStorage 加载数据，如果没有则使用默认值
        const storedValues = window.betRates || JSON.parse(localStorage.getItem('betRates')) || defaultValues;
        window.betRates = storedValues;

        // 创建标签、输入框和复选框
        const labelsAndInputs = Object.keys(window.betRates);
        labelsAndInputs.forEach(labelText => {
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.marginBottom = '3px';

            const label = document.createElement('label');
            label.textContent = labelText;
            label.style.marginRight = '3px';
            label.style.flex = '1';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'checkbox_' + labelText;
            checkbox.style.marginRight = '3px';

            const input = document.createElement('input');
            input.type = 'number';
            input.name = 'input_' + labelText;
            input.style.width = '65%'; // 设置输入框宽度
            input.style.border = '1px solid #ccc';
            input.style.marginRight = '3px';

            // 设置默认值
            input.value = storedValues[labelText][0];
            checkbox.checked = storedValues[labelText][1];


            // 将标签、复选框和输入框添加到容器
            container.appendChild(label);
            container.appendChild(checkbox);
            container.appendChild(input);

            // 将容器添加到悬浮 div
            floatingDiv.appendChild(container);
        });

        // 创建保存按钮
        const saveButton = document.createElement('button');
        saveButton.textContent = '保存';
        saveButton.style.backgroundColor = '#007bff'; // 蓝色背景
        saveButton.style.color = '#fff'; // 白色文字
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '3px';
        saveButton.style.padding = '3px 10px';
        saveButton.style.cursor = 'pointer';
        saveButton.style.width = '60px'; // 宽度占满整个 div
        saveButton.style.marginTop = '10px'; // 上边距

        saveButton.addEventListener('click', () => {
            const newValues = {};
            labelsAndInputs.forEach(labelText => {
                const checkbox = floatingDiv.querySelector(`input[name="checkbox_${labelText}"]`);
                const input = floatingDiv.querySelector(`input[name="input_${labelText}"]`);
                newValues[labelText] = [parseFloat(input.value) || defaultValues[labelText][0], checkbox.checked];
            });
            localStorage.setItem('betRates', JSON.stringify(newValues));
            window.betRates = newValues;
            console.info('数据已保存到 localStorage 并更新到 window.betRates');
        });

        // 将保存按钮添加到悬浮 div
        floatingDiv.appendChild(saveButton);

        // 添加拖动功能
        let offsetX, offsetY;

        floatingDiv.addEventListener('mousedown', (e) => {
            offsetX = e.clientX - floatingDiv.offsetLeft;
            offsetY = e.clientY - floatingDiv.offsetTop;
            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        });

        function mouseMoveHandler(e) {
            floatingDiv.style.left = (e.clientX - offsetX) + 'px';
            floatingDiv.style.top = (e.clientY - offsetY) + 'px';
        }

        function mouseUpHandler() {
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        }

        // 将悬浮 div 添加到 body
        document.body.appendChild(floatingDiv);
        console.info('betFloatingDiv div added');

    }

    function getMaxSelectedChipValue() {
        const selectedChips = document.querySelectorAll('#slide-container .relative.chips-icon');
        let maxValue = 0;
        selectedChips.forEach(chipDiv => {
            // 获取第一个子 div
            const firstChildDiv = chipDiv.querySelector('div');
            if (firstChildDiv) {
                // 获取 data-id 属性
                const dataId = firstChildDiv.getAttribute('data-id');
                // 将 data-id 转换为数字并更新 maxValue
                if (!dataId || dataId==='forbid_0') {
                    value = 0;
                } else {
                    value = parseInt(dataId.split('_')[1], 10);
                }
                if (!isNaN(value) && value > maxValue) {
                    maxValue = value;
                }
            }
        });
        return maxValue;
    }

    // 创建悬浮 div
    createFloatingDiv();

    /*! For license information please see tesseract.min.js.LICENSE.txt */
    !function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.Tesseract=e():t.Tesseract=e()}(self,(()=>(()=>{var t={670:t=>{function e(t){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},e(t)}t.exports=function(){return"undefined"!=typeof window&&"object"===e(window.process)&&"renderer"===window.process.type||!("undefined"==typeof process||"object"!==e(process.versions)||!process.versions.electron)||"object"===("undefined"==typeof navigator?"undefined":e(navigator))&&"string"==typeof navigator.userAgent&&navigator.userAgent.indexOf("Electron")>=0}},760:(t,e,r)=>{function n(t){return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},n(t)}var o=function(t){"use strict";var e,r=Object.prototype,o=r.hasOwnProperty,i="function"==typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",c=i.asyncIterator||"@@asyncIterator",u=i.toStringTag||"@@toStringTag";function s(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{s({},"")}catch(t){s=function(t,e,r){return t[e]=r}}function l(t,e,r,n){var o=e&&e.prototype instanceof g?e:g,i=Object.create(o.prototype),a=new _(n||[]);return i._invoke=function(t,e,r){var n=h;return function(o,i){if(n===d)throw new Error("Generator is already running");if(n===y){if("throw"===o)throw i;return A()}for(r.method=o,r.arg=i;;){var a=r.delegate;if(a){var c=S(a,r);if(c){if(c===v)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(n===h)throw n=y,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n=d;var u=f(t,e,r);if("normal"===u.type){if(n=r.done?y:p,u.arg===v)continue;return{value:u.arg,done:r.done}}"throw"===u.type&&(n=y,r.method="throw",r.arg=u.arg)}}}(t,r,a),i}function f(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}t.wrap=l;var h="suspendedStart",p="suspendedYield",d="executing",y="completed",v={};function g(){}function m(){}function w(){}var b={};s(b,a,(function(){return this}));var x=Object.getPrototypeOf,L=x&&x(x(N([])));L&&L!==r&&o.call(L,a)&&(b=L);var O=w.prototype=g.prototype=Object.create(b);function E(t){["next","throw","return"].forEach((function(e){s(t,e,(function(t){return this._invoke(e,t)}))}))}function j(t,e){function r(i,a,c,u){var s=f(t[i],t,a);if("throw"!==s.type){var l=s.arg,h=l.value;return h&&"object"===n(h)&&o.call(h,"__await")?e.resolve(h.__await).then((function(t){r("next",t,c,u)}),(function(t){r("throw",t,c,u)})):e.resolve(h).then((function(t){l.value=t,c(l)}),(function(t){return r("throw",t,c,u)}))}u(s.arg)}var i;this._invoke=function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return i=i?i.then(o,o):o()}}function S(t,r){var n=t.iterator[r.method];if(n===e){if(r.delegate=null,"throw"===r.method){if(t.iterator.return&&(r.method="return",r.arg=e,S(t,r),"throw"===r.method))return v;r.method="throw",r.arg=new TypeError("The iterator does not provide a 'throw' method")}return v}var o=f(n,t.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,v;var i=o.arg;return i?i.done?(r[t.resultName]=i.value,r.next=t.nextLoc,"return"!==r.method&&(r.method="next",r.arg=e),r.delegate=null,v):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,v)}function k(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function P(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function _(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(k,this),this.reset(!0)}function N(t){if(t){var r=t[a];if(r)return r.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var n=-1,i=function r(){for(;++n<t.length;)if(o.call(t,n))return r.value=t[n],r.done=!1,r;return r.value=e,r.done=!0,r};return i.next=i}}return{next:A}}function A(){return{value:e,done:!0}}return m.prototype=w,s(O,"constructor",w),s(w,"constructor",m),m.displayName=s(w,u,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===m||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,w):(t.__proto__=w,s(t,u,"GeneratorFunction")),t.prototype=Object.create(O),t},t.awrap=function(t){return{__await:t}},E(j.prototype),s(j.prototype,c,(function(){return this})),t.AsyncIterator=j,t.async=function(e,r,n,o,i){void 0===i&&(i=Promise);var a=new j(l(e,r,n,o),i);return t.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},E(O),s(O,u,"Generator"),s(O,a,(function(){return this})),s(O,"toString",(function(){return"[object Generator]"})),t.keys=function(t){var e=[];for(var r in t)e.push(r);return e.reverse(),function r(){for(;e.length;){var n=e.pop();if(n in t)return r.value=n,r.done=!1,r}return r.done=!0,r}},t.values=N,_.prototype={constructor:_,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(P),!t)for(var r in this)"t"===r.charAt(0)&&o.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=e)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var r=this;function n(n,o){return c.type="throw",c.arg=t,r.next=n,o&&(r.method="next",r.arg=e),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],c=a.completion;if("root"===a.tryLoc)return n("end");if(a.tryLoc<=this.prev){var u=o.call(a,"catchLoc"),s=o.call(a,"finallyLoc");if(u&&s){if(this.prev<a.catchLoc)return n(a.catchLoc,!0);if(this.prev<a.finallyLoc)return n(a.finallyLoc)}else if(u){if(this.prev<a.catchLoc)return n(a.catchLoc,!0)}else{if(!s)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return n(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&o.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var i=n;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,v):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),v},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),P(r),v}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;P(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,r,n){return this.delegate={iterator:N(t),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=e),v}},t}("object"===n(t=r.nmd(t))?t.exports:{});try{regeneratorRuntime=o}catch(t){"object"===("undefined"==typeof globalThis?"undefined":n(globalThis))?globalThis.regeneratorRuntime=o:Function("r","regeneratorRuntime = r")(o)}},927:function(t,e,r){var n,o;n=function(){return function(){var t=arguments.length;if(0===t)throw new Error("resolveUrl requires at least one argument; got none.");var e=document.createElement("base");if(e.href=arguments[0],1===t)return e.href;var r=document.getElementsByTagName("head")[0];r.insertBefore(e,r.firstChild);for(var n,o=document.createElement("a"),i=1;i<t;i++)o.href=arguments[i],n=o.href,e.href=n;return r.removeChild(e),n}},void 0===(o=n.call(e,r,e,t))||(t.exports=o)},793:(t,e,r)=>{function n(t){return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},n(t)}function o(){"use strict";o=function(){return t};var t={},e=Object.prototype,r=e.hasOwnProperty,i="function"==typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",c=i.asyncIterator||"@@asyncIterator",u=i.toStringTag||"@@toStringTag";function s(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{s({},"")}catch(t){s=function(t,e,r){return t[e]=r}}function l(t,e,r,n){var o=e&&e.prototype instanceof p?e:p,i=Object.create(o.prototype),a=new j(n||[]);return i._invoke=function(t,e,r){var n="suspendedStart";return function(o,i){if("executing"===n)throw new Error("Generator is already running");if("completed"===n){if("throw"===o)throw i;return{value:void 0,done:!0}}for(r.method=o,r.arg=i;;){var a=r.delegate;if(a){var c=L(a,r);if(c){if(c===h)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if("suspendedStart"===n)throw n="completed",r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n="executing";var u=f(t,e,r);if("normal"===u.type){if(n=r.done?"completed":"suspendedYield",u.arg===h)continue;return{value:u.arg,done:r.done}}"throw"===u.type&&(n="completed",r.method="throw",r.arg=u.arg)}}}(t,r,a),i}function f(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}t.wrap=l;var h={};function p(){}function d(){}function y(){}var v={};s(v,a,(function(){return this}));var g=Object.getPrototypeOf,m=g&&g(g(S([])));m&&m!==e&&r.call(m,a)&&(v=m);var w=y.prototype=p.prototype=Object.create(v);function b(t){["next","throw","return"].forEach((function(e){s(t,e,(function(t){return this._invoke(e,t)}))}))}function x(t,e){function o(i,a,c,u){var s=f(t[i],t,a);if("throw"!==s.type){var l=s.arg,h=l.value;return h&&"object"==n(h)&&r.call(h,"__await")?e.resolve(h.__await).then((function(t){o("next",t,c,u)}),(function(t){o("throw",t,c,u)})):e.resolve(h).then((function(t){l.value=t,c(l)}),(function(t){return o("throw",t,c,u)}))}u(s.arg)}var i;this._invoke=function(t,r){function n(){return new e((function(e,n){o(t,r,e,n)}))}return i=i?i.then(n,n):n()}}function L(t,e){var r=t.iterator[e.method];if(void 0===r){if(e.delegate=null,"throw"===e.method){if(t.iterator.return&&(e.method="return",e.arg=void 0,L(t,e),"throw"===e.method))return h;e.method="throw",e.arg=new TypeError("The iterator does not provide a 'throw' method")}return h}var n=f(r,t.iterator,e.arg);if("throw"===n.type)return e.method="throw",e.arg=n.arg,e.delegate=null,h;var o=n.arg;return o?o.done?(e[t.resultName]=o.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=void 0),e.delegate=null,h):o:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,h)}function O(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function E(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function j(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(O,this),this.reset(!0)}function S(t){if(t){var e=t[a];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var n=-1,o=function e(){for(;++n<t.length;)if(r.call(t,n))return e.value=t[n],e.done=!1,e;return e.value=void 0,e.done=!0,e};return o.next=o}}return{next:k}}function k(){return{value:void 0,done:!0}}return d.prototype=y,s(w,"constructor",y),s(y,"constructor",d),d.displayName=s(y,u,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===d||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,y):(t.__proto__=y,s(t,u,"GeneratorFunction")),t.prototype=Object.create(w),t},t.awrap=function(t){return{__await:t}},b(x.prototype),s(x.prototype,c,(function(){return this})),t.AsyncIterator=x,t.async=function(e,r,n,o,i){void 0===i&&(i=Promise);var a=new x(l(e,r,n,o),i);return t.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},b(w),s(w,u,"Generator"),s(w,a,(function(){return this})),s(w,"toString",(function(){return"[object Generator]"})),t.keys=function(t){var e=[];for(var r in t)e.push(r);return e.reverse(),function r(){for(;e.length;){var n=e.pop();if(n in t)return r.value=n,r.done=!1,r}return r.done=!0,r}},t.values=S,j.prototype={constructor:j,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(E),!t)for(var e in this)"t"===e.charAt(0)&&r.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function n(r,n){return a.type="throw",a.arg=t,e.next=r,n&&(e.method="next",e.arg=void 0),!!n}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],a=i.completion;if("root"===i.tryLoc)return n("end");if(i.tryLoc<=this.prev){var c=r.call(i,"catchLoc"),u=r.call(i,"finallyLoc");if(c&&u){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var o=this.tryEntries[n];if(o.tryLoc<=this.prev&&r.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,h):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),h},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),E(r),h}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;E(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,r){return this.delegate={iterator:S(t),resultName:e,nextLoc:r},"next"===this.method&&(this.arg=void 0),h}},t}function i(t,e,r,n,o,i,a){try{var c=t[i](a),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,o)}function a(t){return function(){var e=this,r=arguments;return new Promise((function(n,o){var a=t.apply(e,r);function c(t){i(a,n,o,c,u,"next",t)}function u(t){i(a,n,o,c,u,"throw",t)}c(void 0)}))}}var c=r(311),u=function(){var t=a(o().mark((function t(e,r,n){var i;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,c(n);case 2:return i=t.sent,t.next=5,i.loadLanguage(r);case 5:return t.next=7,i.initialize(r);case 7:return t.abrupt("return",i.recognize(e).finally(a(o().mark((function t(){return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,i.terminate();case 2:case"end":return t.stop()}}),t)})))));case 8:case"end":return t.stop()}}),t)})));return function(e,r,n){return t.apply(this,arguments)}}(),s=function(){var t=a(o().mark((function t(e,r){var n;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,c(r);case 2:return n=t.sent,t.next=5,n.loadLanguage("osd");case 5:return t.next=7,n.initialize("osd");case 7:return t.abrupt("return",n.detect(e).finally(a(o().mark((function t(){return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,n.terminate();case 2:case"end":return t.stop()}}),t)})))));case 8:case"end":return t.stop()}}),t)})));return function(e,r){return t.apply(this,arguments)}}();t.exports={recognize:u,detect:s}},847:t=>{t.exports={TESSERACT_ONLY:0,LSTM_ONLY:1,TESSERACT_LSTM_COMBINED:2,DEFAULT:3}},711:t=>{t.exports={OSD_ONLY:"0",AUTO_OSD:"1",AUTO_ONLY:"2",AUTO:"3",SINGLE_COLUMN:"4",SINGLE_BLOCK_VERT_TEXT:"5",SINGLE_BLOCK:"6",SINGLE_LINE:"7",SINGLE_WORD:"8",CIRCLE_WORD:"9",SINGLE_CHAR:"10",SPARSE_TEXT:"11",SPARSE_TEXT_OSD:"12",RAW_LINE:"13"}},214:(t,e,r)=>{var n=r(847);t.exports={defaultOEM:n.DEFAULT}},341:t=>{t.exports={langPath:"https://tessdata.projectnaptha.com/4.0.0",workerBlobURL:!0,logger:function(){}}},5:t=>{t.exports={AFR:"afr",AMH:"amh",ARA:"ara",ASM:"asm",AZE:"aze",AZE_CYRL:"aze_cyrl",BEL:"bel",BEN:"ben",BOD:"bod",BOS:"bos",BUL:"bul",CAT:"cat",CEB:"ceb",CES:"ces",CHI_SIM:"chi_sim",CHI_TRA:"chi_tra",CHR:"chr",CYM:"cym",DAN:"dan",DEU:"deu",DZO:"dzo",ELL:"ell",ENG:"eng",ENM:"enm",EPO:"epo",EST:"est",EUS:"eus",FAS:"fas",FIN:"fin",FRA:"fra",FRK:"frk",FRM:"frm",GLE:"gle",GLG:"glg",GRC:"grc",GUJ:"guj",HAT:"hat",HEB:"heb",HIN:"hin",HRV:"hrv",HUN:"hun",IKU:"iku",IND:"ind",ISL:"isl",ITA:"ita",ITA_OLD:"ita_old",JAV:"jav",JPN:"jpn",KAN:"kan",KAT:"kat",KAT_OLD:"kat_old",KAZ:"kaz",KHM:"khm",KIR:"kir",KOR:"kor",KUR:"kur",LAO:"lao",LAT:"lat",LAV:"lav",LIT:"lit",MAL:"mal",MAR:"mar",MKD:"mkd",MLT:"mlt",MSA:"msa",MYA:"mya",NEP:"nep",NLD:"nld",NOR:"nor",ORI:"ori",PAN:"pan",POL:"pol",POR:"por",PUS:"pus",RON:"ron",RUS:"rus",SAN:"san",SIN:"sin",SLK:"slk",SLV:"slv",SPA:"spa",SPA_OLD:"spa_old",SQI:"sqi",SRP:"srp",SRP_LATN:"srp_latn",SWA:"swa",SWE:"swe",SYR:"syr",TAM:"tam",TEL:"tel",TGK:"tgk",TGL:"tgl",THA:"tha",TIR:"tir",TUR:"tur",UIG:"uig",UKR:"ukr",URD:"urd",UZB:"uzb",UZB_CYRL:"uzb_cyrl",VIE:"vie",YID:"yid"}},106:(t,e,r)=>{var n=r(313),o=0;t.exports=function(t){var e=t.id,r=t.action,i=t.payload,a=void 0===i?{}:i,c=e;return void 0===c&&(c=n("Job",o),o+=1),{id:c,action:r,payload:a}}},936:function(t,e,r){function n(t){return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},n(t)}var o=this;function i(){"use strict";i=function(){return t};var t={},e=Object.prototype,r=e.hasOwnProperty,o="function"==typeof Symbol?Symbol:{},a=o.iterator||"@@iterator",c=o.asyncIterator||"@@asyncIterator",u=o.toStringTag||"@@toStringTag";function s(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{s({},"")}catch(t){s=function(t,e,r){return t[e]=r}}function l(t,e,r,n){var o=e&&e.prototype instanceof p?e:p,i=Object.create(o.prototype),a=new j(n||[]);return i._invoke=function(t,e,r){var n="suspendedStart";return function(o,i){if("executing"===n)throw new Error("Generator is already running");if("completed"===n){if("throw"===o)throw i;return{value:void 0,done:!0}}for(r.method=o,r.arg=i;;){var a=r.delegate;if(a){var c=L(a,r);if(c){if(c===h)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if("suspendedStart"===n)throw n="completed",r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n="executing";var u=f(t,e,r);if("normal"===u.type){if(n=r.done?"completed":"suspendedYield",u.arg===h)continue;return{value:u.arg,done:r.done}}"throw"===u.type&&(n="completed",r.method="throw",r.arg=u.arg)}}}(t,r,a),i}function f(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}t.wrap=l;var h={};function p(){}function d(){}function y(){}var v={};s(v,a,(function(){return this}));var g=Object.getPrototypeOf,m=g&&g(g(S([])));m&&m!==e&&r.call(m,a)&&(v=m);var w=y.prototype=p.prototype=Object.create(v);function b(t){["next","throw","return"].forEach((function(e){s(t,e,(function(t){return this._invoke(e,t)}))}))}function x(t,e){function o(i,a,c,u){var s=f(t[i],t,a);if("throw"!==s.type){var l=s.arg,h=l.value;return h&&"object"==n(h)&&r.call(h,"__await")?e.resolve(h.__await).then((function(t){o("next",t,c,u)}),(function(t){o("throw",t,c,u)})):e.resolve(h).then((function(t){l.value=t,c(l)}),(function(t){return o("throw",t,c,u)}))}u(s.arg)}var i;this._invoke=function(t,r){function n(){return new e((function(e,n){o(t,r,e,n)}))}return i=i?i.then(n,n):n()}}function L(t,e){var r=t.iterator[e.method];if(void 0===r){if(e.delegate=null,"throw"===e.method){if(t.iterator.return&&(e.method="return",e.arg=void 0,L(t,e),"throw"===e.method))return h;e.method="throw",e.arg=new TypeError("The iterator does not provide a 'throw' method")}return h}var n=f(r,t.iterator,e.arg);if("throw"===n.type)return e.method="throw",e.arg=n.arg,e.delegate=null,h;var o=n.arg;return o?o.done?(e[t.resultName]=o.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=void 0),e.delegate=null,h):o:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,h)}function O(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function E(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function j(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(O,this),this.reset(!0)}function S(t){if(t){var e=t[a];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var n=-1,o=function e(){for(;++n<t.length;)if(r.call(t,n))return e.value=t[n],e.done=!1,e;return e.value=void 0,e.done=!0,e};return o.next=o}}return{next:k}}function k(){return{value:void 0,done:!0}}return d.prototype=y,s(w,"constructor",y),s(y,"constructor",d),d.displayName=s(y,u,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===d||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,y):(t.__proto__=y,s(t,u,"GeneratorFunction")),t.prototype=Object.create(w),t},t.awrap=function(t){return{__await:t}},b(x.prototype),s(x.prototype,c,(function(){return this})),t.AsyncIterator=x,t.async=function(e,r,n,o,i){void 0===i&&(i=Promise);var a=new x(l(e,r,n,o),i);return t.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},b(w),s(w,u,"Generator"),s(w,a,(function(){return this})),s(w,"toString",(function(){return"[object Generator]"})),t.keys=function(t){var e=[];for(var r in t)e.push(r);return e.reverse(),function r(){for(;e.length;){var n=e.pop();if(n in t)return r.value=n,r.done=!1,r}return r.done=!0,r}},t.values=S,j.prototype={constructor:j,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(E),!t)for(var e in this)"t"===e.charAt(0)&&r.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function n(r,n){return a.type="throw",a.arg=t,e.next=r,n&&(e.method="next",e.arg=void 0),!!n}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],a=i.completion;if("root"===i.tryLoc)return n("end");if(i.tryLoc<=this.prev){var c=r.call(i,"catchLoc"),u=r.call(i,"finallyLoc");if(c&&u){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var o=this.tryEntries[n];if(o.tryLoc<=this.prev&&r.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,h):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),h},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),E(r),h}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;E(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,r){return this.delegate={iterator:S(t),resultName:e,nextLoc:r},"next"===this.method&&(this.arg=void 0),h}},t}function a(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function c(t,e,r,n,o,i,a){try{var c=t[i](a),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,o)}function u(t){return function(){var e=this,r=arguments;return new Promise((function(n,o){var i=t.apply(e,r);function a(t){c(i,n,o,a,u,"next",t)}function u(t){c(i,n,o,a,u,"throw",t)}a(void 0)}))}}var s=r(106),l=r(185).log,f=r(313),h=0;t.exports=function(){var t=f("Scheduler",h),e={},r={},n=[];h+=1;var c=function(){return Object.keys(e).length},p=function(){if(0!==n.length)for(var t=Object.keys(e),o=0;o<t.length;o+=1)if(void 0===r[t[o]]){n[0](e[t[o]]);break}},d=function(e,c){return new Promise((function(f,h){var d=s({action:e,payload:c});n.push(function(){var t=u(i().mark((function t(u){return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n.shift(),r[u.id]=d,t.prev=2,t.t0=f,t.next=6,u[e].apply(o,[].concat(function(t){if(Array.isArray(t))return a(t)}(i=c)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(i)||function(t,e){if(t){if("string"==typeof t)return a(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?a(t,e):void 0}}(i)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}(),[d.id]));case 6:t.t1=t.sent,(0,t.t0)(t.t1),t.next=13;break;case 10:t.prev=10,t.t2=t.catch(2),h(t.t2);case 13:return t.prev=13,delete r[u.id],p(),t.finish(13);case 17:case"end":return t.stop()}var i}),t,null,[[2,10,13,17]])})));return function(e){return t.apply(this,arguments)}}()),l("[".concat(t,"]: Add ").concat(d.id," to JobQueue")),l("[".concat(t,"]: JobQueue length=").concat(n.length)),p()}))},y=function(){var e=u(i().mark((function e(r){var n,o,a,u=arguments;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(0!==c()){e.next=2;break}throw Error("[".concat(t,"]: You need to have at least one worker before adding jobs"));case 2:for(n=u.length,o=new Array(n>1?n-1:0),a=1;a<n;a++)o[a-1]=u[a];return e.abrupt("return",d(r,o));case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),v=function(){var t=u(i().mark((function t(){return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:Object.keys(e).forEach(function(){var t=u(i().mark((function t(r){return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e[r].terminate();case 2:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()),n=[];case 2:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();return{addWorker:function(r){return e[r.id]=r,l("[".concat(t,"]: Add ").concat(r.id)),l("[".concat(t,"]: Number of workers=").concat(c())),p(),r.id},addJob:y,terminate:v,getQueueLen:function(){return n.length},getNumWorkers:c}}},311:(t,e,r)=>{function n(t){return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},n(t)}var o=["logger","errorHandler"];function i(){"use strict";i=function(){return t};var t={},e=Object.prototype,r=e.hasOwnProperty,o="function"==typeof Symbol?Symbol:{},a=o.iterator||"@@iterator",c=o.asyncIterator||"@@asyncIterator",u=o.toStringTag||"@@toStringTag";function s(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{s({},"")}catch(t){s=function(t,e,r){return t[e]=r}}function l(t,e,r,n){var o=e&&e.prototype instanceof p?e:p,i=Object.create(o.prototype),a=new j(n||[]);return i._invoke=function(t,e,r){var n="suspendedStart";return function(o,i){if("executing"===n)throw new Error("Generator is already running");if("completed"===n){if("throw"===o)throw i;return{value:void 0,done:!0}}for(r.method=o,r.arg=i;;){var a=r.delegate;if(a){var c=L(a,r);if(c){if(c===h)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if("suspendedStart"===n)throw n="completed",r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n="executing";var u=f(t,e,r);if("normal"===u.type){if(n=r.done?"completed":"suspendedYield",u.arg===h)continue;return{value:u.arg,done:r.done}}"throw"===u.type&&(n="completed",r.method="throw",r.arg=u.arg)}}}(t,r,a),i}function f(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}t.wrap=l;var h={};function p(){}function d(){}function y(){}var v={};s(v,a,(function(){return this}));var g=Object.getPrototypeOf,m=g&&g(g(S([])));m&&m!==e&&r.call(m,a)&&(v=m);var w=y.prototype=p.prototype=Object.create(v);function b(t){["next","throw","return"].forEach((function(e){s(t,e,(function(t){return this._invoke(e,t)}))}))}function x(t,e){function o(i,a,c,u){var s=f(t[i],t,a);if("throw"!==s.type){var l=s.arg,h=l.value;return h&&"object"==n(h)&&r.call(h,"__await")?e.resolve(h.__await).then((function(t){o("next",t,c,u)}),(function(t){o("throw",t,c,u)})):e.resolve(h).then((function(t){l.value=t,c(l)}),(function(t){return o("throw",t,c,u)}))}u(s.arg)}var i;this._invoke=function(t,r){function n(){return new e((function(e,n){o(t,r,e,n)}))}return i=i?i.then(n,n):n()}}function L(t,e){var r=t.iterator[e.method];if(void 0===r){if(e.delegate=null,"throw"===e.method){if(t.iterator.return&&(e.method="return",e.arg=void 0,L(t,e),"throw"===e.method))return h;e.method="throw",e.arg=new TypeError("The iterator does not provide a 'throw' method")}return h}var n=f(r,t.iterator,e.arg);if("throw"===n.type)return e.method="throw",e.arg=n.arg,e.delegate=null,h;var o=n.arg;return o?o.done?(e[t.resultName]=o.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=void 0),e.delegate=null,h):o:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,h)}function O(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function E(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function j(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(O,this),this.reset(!0)}function S(t){if(t){var e=t[a];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var n=-1,o=function e(){for(;++n<t.length;)if(r.call(t,n))return e.value=t[n],e.done=!1,e;return e.value=void 0,e.done=!0,e};return o.next=o}}return{next:k}}function k(){return{value:void 0,done:!0}}return d.prototype=y,s(w,"constructor",y),s(y,"constructor",d),d.displayName=s(y,u,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===d||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,y):(t.__proto__=y,s(t,u,"GeneratorFunction")),t.prototype=Object.create(w),t},t.awrap=function(t){return{__await:t}},b(x.prototype),s(x.prototype,c,(function(){return this})),t.AsyncIterator=x,t.async=function(e,r,n,o,i){void 0===i&&(i=Promise);var a=new x(l(e,r,n,o),i);return t.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},b(w),s(w,u,"Generator"),s(w,a,(function(){return this})),s(w,"toString",(function(){return"[object Generator]"})),t.keys=function(t){var e=[];for(var r in t)e.push(r);return e.reverse(),function r(){for(;e.length;){var n=e.pop();if(n in t)return r.value=n,r.done=!1,r}return r.done=!0,r}},t.values=S,j.prototype={constructor:j,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(E),!t)for(var e in this)"t"===e.charAt(0)&&r.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function n(r,n){return a.type="throw",a.arg=t,e.next=r,n&&(e.method="next",e.arg=void 0),!!n}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],a=i.completion;if("root"===i.tryLoc)return n("end");if(i.tryLoc<=this.prev){var c=r.call(i,"catchLoc"),u=r.call(i,"finallyLoc");if(c&&u){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var o=this.tryEntries[n];if(o.tryLoc<=this.prev&&r.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,h):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),h},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),E(r),h}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;E(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,r){return this.delegate={iterator:S(t),resultName:e,nextLoc:r},"next"===this.method&&(this.arg=void 0),h}},t}function a(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function c(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?a(Object(r),!0).forEach((function(e){u(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}function u(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function s(t,e){if(null==t)return{};var r,n,o=function(t,e){if(null==t)return{};var r,n,o={},i=Object.keys(t);for(n=0;n<i.length;n++)r=i[n],e.indexOf(r)>=0||(o[r]=t[r]);return o}(t,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(n=0;n<i.length;n++)r=i[n],e.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(t,r)&&(o[r]=t[r])}return o}function l(t,e,r,n,o,i,a){try{var c=t[i](a),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,o)}function f(t){return function(){var e=this,r=arguments;return new Promise((function(n,o){var i=t.apply(e,r);function a(t){l(i,n,o,a,c,"next",t)}function c(t){l(i,n,o,a,c,"throw",t)}a(void 0)}))}}var h=r(187),p=r(549),d=r(106),y=r(185).log,v=r(313),g=r(214).defaultOEM,m=r(581),w=m.defaultOptions,b=m.spawnWorker,x=m.terminateWorker,L=m.onMessage,O=m.loadImage,E=m.send,j=0;t.exports=f(i().mark((function t(){var e,r,n,a,u,l,m,S,k,P,_,N,A,T,G,I,F,R,D,M,U,C,z,Y,B,K,W,H,J,V,Z=arguments;return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=Z.length>0&&void 0!==Z[0]?Z[0]:{},r=v("Worker",j),n=h(c(c({},w),e)),a=n.logger,u=n.errorHandler,l=s(n,o),m={},S={},_=new Promise((function(t,e){P=t,k=e})),N=function(t){k(t.message)},(A=b(l)).onerror=N,j+=1,T=function(t,e){m[t]=e},G=function(t,e){S[t]=e},I=function(t){var e=t.id,n=t.action,o=t.payload;return new Promise((function(t,i){y("[".concat(r,"]: Start ").concat(e,", action=").concat(n)),T(n,t),G(n,i),E(A,{workerId:r,jobId:e,action:n,payload:o})}))},F=function(){return console.warn("`load` is depreciated and should be removed from code (workers now come pre-loaded)")},R=function(t){return I(d({id:t,action:"load",payload:{options:l}}))},D=function(t,e,r){return I(d({id:r,action:"FS",payload:{method:"writeFile",args:[t,e]}}))},M=function(t,e){return I(d({id:e,action:"FS",payload:{method:"readFile",args:[t,{encoding:"utf8"}]}}))},U=function(t,e){return I(d({id:e,action:"FS",payload:{method:"unlink",args:[t]}}))},C=function(t,e,r){return I(d({id:r,action:"FS",payload:{method:t,args:e}}))},z=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"eng",e=arguments.length>1?arguments[1]:void 0;return I(d({id:e,action:"loadLanguage",payload:{langs:t,options:l}}))},Y=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"eng",e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:g,r=arguments.length>2?arguments[2]:void 0,n=arguments.length>3?arguments[3]:void 0;return I(d({id:n,action:"initialize",payload:{langs:t,oem:e,config:r}}))},B=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=arguments.length>1?arguments[1]:void 0;return I(d({id:e,action:"setParameters",payload:{params:t}}))},K=function(){var t=f(i().mark((function t(e){var r,n,o,a=arguments;return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=a.length>1&&void 0!==a[1]?a[1]:{},n=a.length>2&&void 0!==a[2]?a[2]:{blocks:!0,text:!0,hocr:!0,tsv:!0},o=a.length>3?a[3]:void 0,t.t0=I,t.t1=d,t.t2=o,t.next=8,O(e);case 8:return t.t3=t.sent,t.t4=r,t.t5=n,t.t6={image:t.t3,options:t.t4,output:t.t5},t.t7={id:t.t2,action:"recognize",payload:t.t6},t.t8=(0,t.t1)(t.t7),t.abrupt("return",(0,t.t0)(t.t8));case 15:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),W=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"Tesseract OCR Result",e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],r=arguments.length>2?arguments[2]:void 0;return console.log("`getPDF` function is depreciated. `recognize` option `savePDF` should be used instead."),I(d({id:r,action:"getPDF",payload:{title:t,textonly:e}}))},H=function(){var t=f(i().mark((function t(e,r){return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.t0=I,t.t1=d,t.t2=r,t.next=5,O(e);case 5:return t.t3=t.sent,t.t4={image:t.t3},t.t5={id:t.t2,action:"detect",payload:t.t4},t.t6=(0,t.t1)(t.t5),t.abrupt("return",(0,t.t0)(t.t6));case 10:case"end":return t.stop()}}),t)})));return function(e,r){return t.apply(this,arguments)}}(),J=function(){var t=f(i().mark((function t(){return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return null!==A&&(x(A),A=null),t.abrupt("return",Promise.resolve());case 2:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),L(A,(function(t){var e=t.workerId,r=t.jobId,n=t.status,o=t.action,i=t.data;if("resolve"===n){y("[".concat(e,"]: Complete ").concat(r));var s=i;"recognize"===o?s=p(i):"getPDF"===o&&(s=Array.from(c(c({},i),{},{length:Object.keys(i).length}))),m[o]({jobId:r,data:s})}else if("reject"===n){if(S[o](i),"load"===o&&k(i),!u)throw Error(i);u(i)}else"progress"===n&&a(c(c({},i),{},{userJobId:r}))})),V={id:r,worker:A,setResolve:T,setReject:G,load:F,writeText:D,readText:M,removeFile:U,FS:C,loadLanguage:z,initialize:Y,setParameters:B,recognize:K,getPDF:W,detect:H,terminate:J},R().then((function(){return P(V)})).catch((function(){})),t.abrupt("return",_);case 30:case"end":return t.stop()}}),t)})))},352:(t,e,r)=>{function n(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function o(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}r(760);var i=r(936),a=r(311),c=r(793),u=r(5),s=r(847),l=r(711),f=r(185).setLogging;t.exports=function(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?n(Object(r),!0).forEach((function(e){o(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):n(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}({languages:u,OEM:s,PSM:l,createScheduler:i,createWorker:a,setLogging:f},c)},549:t=>{function e(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function r(t){for(var r=1;r<arguments.length;r++){var o=null!=arguments[r]?arguments[r]:{};r%2?e(Object(o),!0).forEach((function(e){n(t,e,o[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(o)):e(Object(o)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(o,e))}))}return t}function n(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}t.exports=function(t){var e=[],n=[],o=[],i=[],a=[];return t.blocks&&t.blocks.forEach((function(c){c.paragraphs.forEach((function(e){e.lines.forEach((function(n){n.words.forEach((function(o){o.symbols.forEach((function(i){a.push(r(r({},i),{},{page:t,block:c,paragraph:e,line:n,word:o}))})),i.push(r(r({},o),{},{page:t,block:c,paragraph:e,line:n}))})),o.push(r(r({},n),{},{page:t,block:c,paragraph:e}))})),n.push(r(r({},e),{},{page:t,block:c}))})),e.push(r(r({},c),{},{page:t}))})),r(r({},t),{},{blocks:e,paragraphs:n,lines:o,words:i,symbols:a})}},129:(t,e,r)=>{function n(t){return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},n(t)}var o=r(670);t.exports=function(t){var e={};return"undefined"!=typeof WorkerGlobalScope?e.type="webworker":o()?e.type="electron":"object"===("undefined"==typeof window?"undefined":n(window))?e.type="browser":"object"===("undefined"==typeof process?"undefined":n(process))&&(e.type="node"),void 0===t?e:e[t]}},313:t=>{t.exports=function(t,e){return"".concat(t,"-").concat(e,"-").concat(Math.random().toString(16).slice(3,8))}},185:function(t,e){var r=this,n=!1;e.logging=n,e.setLogging=function(t){n=t},e.log=function(){for(var t=arguments.length,e=new Array(t),o=0;o<t;o++)e[o]=arguments[o];return n?console.log.apply(r,e):null}},187:(t,e,r)=>{function n(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function o(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}var i="browser"===r(129)("type")?r(927):function(t){return t};t.exports=function(t){var e=function(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?n(Object(r),!0).forEach((function(e){o(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):n(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}({},t);return["corePath","workerPath","langPath"].forEach((function(r){t[r]&&(e[r]=i(e[r]))})),e}},854:(t,e,r)=>{function n(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function o(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?n(Object(r),!0).forEach((function(e){i(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):n(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}function i(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}var a=r(927),c=r(147).version,u=r(341);t.exports=o(o({},u),{},{workerPath:"undefined"!=typeof process&&"development"===process.env.TESS_ENV?a("/dist/worker.dev.js?nocache=".concat(Math.random().toString(36).slice(3))):"https://unpkg.com/tesseract.js@v".concat(c,"/dist/worker.min.js"),corePath:null})},581:(t,e,r)=>{var n=r(854),o=r(676),i=r(100),a=r(202),c=r(772),u=r(931);t.exports={defaultOptions:n,spawnWorker:o,terminateWorker:i,onMessage:a,send:c,loadImage:u}},931:(t,e,r)=>{function n(t){return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},n(t)}function o(){"use strict";o=function(){return t};var t={},e=Object.prototype,r=e.hasOwnProperty,i="function"==typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",c=i.asyncIterator||"@@asyncIterator",u=i.toStringTag||"@@toStringTag";function s(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{s({},"")}catch(t){s=function(t,e,r){return t[e]=r}}function l(t,e,r,n){var o=e&&e.prototype instanceof p?e:p,i=Object.create(o.prototype),a=new j(n||[]);return i._invoke=function(t,e,r){var n="suspendedStart";return function(o,i){if("executing"===n)throw new Error("Generator is already running");if("completed"===n){if("throw"===o)throw i;return{value:void 0,done:!0}}for(r.method=o,r.arg=i;;){var a=r.delegate;if(a){var c=L(a,r);if(c){if(c===h)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if("suspendedStart"===n)throw n="completed",r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n="executing";var u=f(t,e,r);if("normal"===u.type){if(n=r.done?"completed":"suspendedYield",u.arg===h)continue;return{value:u.arg,done:r.done}}"throw"===u.type&&(n="completed",r.method="throw",r.arg=u.arg)}}}(t,r,a),i}function f(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}t.wrap=l;var h={};function p(){}function d(){}function y(){}var v={};s(v,a,(function(){return this}));var g=Object.getPrototypeOf,m=g&&g(g(S([])));m&&m!==e&&r.call(m,a)&&(v=m);var w=y.prototype=p.prototype=Object.create(v);function b(t){["next","throw","return"].forEach((function(e){s(t,e,(function(t){return this._invoke(e,t)}))}))}function x(t,e){function o(i,a,c,u){var s=f(t[i],t,a);if("throw"!==s.type){var l=s.arg,h=l.value;return h&&"object"==n(h)&&r.call(h,"__await")?e.resolve(h.__await).then((function(t){o("next",t,c,u)}),(function(t){o("throw",t,c,u)})):e.resolve(h).then((function(t){l.value=t,c(l)}),(function(t){return o("throw",t,c,u)}))}u(s.arg)}var i;this._invoke=function(t,r){function n(){return new e((function(e,n){o(t,r,e,n)}))}return i=i?i.then(n,n):n()}}function L(t,e){var r=t.iterator[e.method];if(void 0===r){if(e.delegate=null,"throw"===e.method){if(t.iterator.return&&(e.method="return",e.arg=void 0,L(t,e),"throw"===e.method))return h;e.method="throw",e.arg=new TypeError("The iterator does not provide a 'throw' method")}return h}var n=f(r,t.iterator,e.arg);if("throw"===n.type)return e.method="throw",e.arg=n.arg,e.delegate=null,h;var o=n.arg;return o?o.done?(e[t.resultName]=o.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=void 0),e.delegate=null,h):o:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,h)}function O(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function E(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function j(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(O,this),this.reset(!0)}function S(t){if(t){var e=t[a];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var n=-1,o=function e(){for(;++n<t.length;)if(r.call(t,n))return e.value=t[n],e.done=!1,e;return e.value=void 0,e.done=!0,e};return o.next=o}}return{next:k}}function k(){return{value:void 0,done:!0}}return d.prototype=y,s(w,"constructor",y),s(y,"constructor",d),d.displayName=s(y,u,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===d||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,y):(t.__proto__=y,s(t,u,"GeneratorFunction")),t.prototype=Object.create(w),t},t.awrap=function(t){return{__await:t}},b(x.prototype),s(x.prototype,c,(function(){return this})),t.AsyncIterator=x,t.async=function(e,r,n,o,i){void 0===i&&(i=Promise);var a=new x(l(e,r,n,o),i);return t.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},b(w),s(w,u,"Generator"),s(w,a,(function(){return this})),s(w,"toString",(function(){return"[object Generator]"})),t.keys=function(t){var e=[];for(var r in t)e.push(r);return e.reverse(),function r(){for(;e.length;){var n=e.pop();if(n in t)return r.value=n,r.done=!1,r}return r.done=!0,r}},t.values=S,j.prototype={constructor:j,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(E),!t)for(var e in this)"t"===e.charAt(0)&&r.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function n(r,n){return a.type="throw",a.arg=t,e.next=r,n&&(e.method="next",e.arg=void 0),!!n}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],a=i.completion;if("root"===i.tryLoc)return n("end");if(i.tryLoc<=this.prev){var c=r.call(i,"catchLoc"),u=r.call(i,"finallyLoc");if(c&&u){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var o=this.tryEntries[n];if(o.tryLoc<=this.prev&&r.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,h):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),h},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),E(r),h}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;E(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,r){return this.delegate={iterator:S(t),resultName:e,nextLoc:r},"next"===this.method&&(this.arg=void 0),h}},t}function i(t,e,r,n,o,i,a){try{var c=t[i](a),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,o)}function a(t){return function(){var e=this,r=arguments;return new Promise((function(n,o){var a=t.apply(e,r);function c(t){i(a,n,o,c,u,"next",t)}function u(t){i(a,n,o,c,u,"throw",t)}c(void 0)}))}}var c=r(927),u=function(t){return new Promise((function(e,r){var n=new FileReader;n.onload=function(){e(n.result)},n.onerror=function(t){var e=t.target.error.code;r(Error("File could not be read! Code=".concat(e)))},n.readAsArrayBuffer(t)}))},s=function(){var t=a(o().mark((function t(e){var r,n;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(r=e,void 0!==e){t.next=3;break}return t.abrupt("return","undefined");case 3:if("string"!=typeof e){t.next=16;break}if(!/data:image\/([a-zA-Z]*);base64,([^"]*)/.test(e)){t.next=8;break}r=atob(e.split(",")[1]).split("").map((function(t){return t.charCodeAt(0)})),t.next=14;break;case 8:return t.next=10,fetch(c(e));case 10:return n=t.sent,t.next=13,n.arrayBuffer();case 13:r=t.sent;case 14:t.next=34;break;case 16:if(!(e instanceof HTMLElement)){t.next=30;break}if("IMG"!==e.tagName){t.next=21;break}return t.next=20,s(e.src);case 20:r=t.sent;case 21:if("VIDEO"!==e.tagName){t.next=25;break}return t.next=24,s(e.poster);case 24:r=t.sent;case 25:if("CANVAS"!==e.tagName){t.next=28;break}return t.next=28,new Promise((function(t){e.toBlob(function(){var e=a(o().mark((function e(n){return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u(n);case 2:r=e.sent,t();case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}())}));case 28:t.next=34;break;case 30:if(!(e instanceof File||e instanceof Blob)){t.next=34;break}return t.next=33,u(e);case 33:r=t.sent;case 34:return t.abrupt("return",new Uint8Array(r));case 35:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}();t.exports=s},202:t=>{t.exports=function(t,e){t.onmessage=function(t){var r=t.data;e(r)}}},772:t=>{function e(t){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},e(t)}function r(){"use strict";r=function(){return t};var t={},n=Object.prototype,o=n.hasOwnProperty,i="function"==typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",c=i.asyncIterator||"@@asyncIterator",u=i.toStringTag||"@@toStringTag";function s(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{s({},"")}catch(t){s=function(t,e,r){return t[e]=r}}function l(t,e,r,n){var o=e&&e.prototype instanceof p?e:p,i=Object.create(o.prototype),a=new j(n||[]);return i._invoke=function(t,e,r){var n="suspendedStart";return function(o,i){if("executing"===n)throw new Error("Generator is already running");if("completed"===n){if("throw"===o)throw i;return{value:void 0,done:!0}}for(r.method=o,r.arg=i;;){var a=r.delegate;if(a){var c=L(a,r);if(c){if(c===h)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if("suspendedStart"===n)throw n="completed",r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n="executing";var u=f(t,e,r);if("normal"===u.type){if(n=r.done?"completed":"suspendedYield",u.arg===h)continue;return{value:u.arg,done:r.done}}"throw"===u.type&&(n="completed",r.method="throw",r.arg=u.arg)}}}(t,r,a),i}function f(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}t.wrap=l;var h={};function p(){}function d(){}function y(){}var v={};s(v,a,(function(){return this}));var g=Object.getPrototypeOf,m=g&&g(g(S([])));m&&m!==n&&o.call(m,a)&&(v=m);var w=y.prototype=p.prototype=Object.create(v);function b(t){["next","throw","return"].forEach((function(e){s(t,e,(function(t){return this._invoke(e,t)}))}))}function x(t,r){function n(i,a,c,u){var s=f(t[i],t,a);if("throw"!==s.type){var l=s.arg,h=l.value;return h&&"object"==e(h)&&o.call(h,"__await")?r.resolve(h.__await).then((function(t){n("next",t,c,u)}),(function(t){n("throw",t,c,u)})):r.resolve(h).then((function(t){l.value=t,c(l)}),(function(t){return n("throw",t,c,u)}))}u(s.arg)}var i;this._invoke=function(t,e){function o(){return new r((function(r,o){n(t,e,r,o)}))}return i=i?i.then(o,o):o()}}function L(t,e){var r=t.iterator[e.method];if(void 0===r){if(e.delegate=null,"throw"===e.method){if(t.iterator.return&&(e.method="return",e.arg=void 0,L(t,e),"throw"===e.method))return h;e.method="throw",e.arg=new TypeError("The iterator does not provide a 'throw' method")}return h}var n=f(r,t.iterator,e.arg);if("throw"===n.type)return e.method="throw",e.arg=n.arg,e.delegate=null,h;var o=n.arg;return o?o.done?(e[t.resultName]=o.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=void 0),e.delegate=null,h):o:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,h)}function O(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function E(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function j(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(O,this),this.reset(!0)}function S(t){if(t){var e=t[a];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var r=-1,n=function e(){for(;++r<t.length;)if(o.call(t,r))return e.value=t[r],e.done=!1,e;return e.value=void 0,e.done=!0,e};return n.next=n}}return{next:k}}function k(){return{value:void 0,done:!0}}return d.prototype=y,s(w,"constructor",y),s(y,"constructor",d),d.displayName=s(y,u,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===d||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,y):(t.__proto__=y,s(t,u,"GeneratorFunction")),t.prototype=Object.create(w),t},t.awrap=function(t){return{__await:t}},b(x.prototype),s(x.prototype,c,(function(){return this})),t.AsyncIterator=x,t.async=function(e,r,n,o,i){void 0===i&&(i=Promise);var a=new x(l(e,r,n,o),i);return t.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},b(w),s(w,u,"Generator"),s(w,a,(function(){return this})),s(w,"toString",(function(){return"[object Generator]"})),t.keys=function(t){var e=[];for(var r in t)e.push(r);return e.reverse(),function r(){for(;e.length;){var n=e.pop();if(n in t)return r.value=n,r.done=!1,r}return r.done=!0,r}},t.values=S,j.prototype={constructor:j,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(E),!t)for(var e in this)"t"===e.charAt(0)&&o.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function r(r,n){return a.type="throw",a.arg=t,e.next=r,n&&(e.method="next",e.arg=void 0),!!n}for(var n=this.tryEntries.length-1;n>=0;--n){var i=this.tryEntries[n],a=i.completion;if("root"===i.tryLoc)return r("end");if(i.tryLoc<=this.prev){var c=o.call(i,"catchLoc"),u=o.call(i,"finallyLoc");if(c&&u){if(this.prev<i.catchLoc)return r(i.catchLoc,!0);if(this.prev<i.finallyLoc)return r(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return r(i.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return r(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&o.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var i=n;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,h):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),h},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),E(r),h}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;E(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,r){return this.delegate={iterator:S(t),resultName:e,nextLoc:r},"next"===this.method&&(this.arg=void 0),h}},t}function n(t,e,r,n,o,i,a){try{var c=t[i](a),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,o)}t.exports=function(){var t,e=(t=r().mark((function t(e,n){return r().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e.postMessage(n);case 1:case"end":return t.stop()}}),t)})),function(){var e=this,r=arguments;return new Promise((function(o,i){var a=t.apply(e,r);function c(t){n(a,o,i,c,u,"next",t)}function u(t){n(a,o,i,c,u,"throw",t)}c(void 0)}))});return function(t,r){return e.apply(this,arguments)}}()},676:t=>{t.exports=function(t){var e,r=t.workerPath,n=t.workerBlobURL;if(Blob&&URL&&n){var o=new Blob(['importScripts("'.concat(r,'");')],{type:"application/javascript"});e=new Worker(URL.createObjectURL(o))}else e=new Worker(r);return e}},100:t=>{t.exports=function(t){t.terminate()}},147:t=>{"use strict";t.exports=JSON.parse('{"name":"tesseract.js","version":"4.0.2","description":"Pure Javascript Multilingual OCR","main":"src/index.js","types":"src/index.d.ts","unpkg":"dist/tesseract.min.js","jsdelivr":"dist/tesseract.min.js","scripts":{"start":"node scripts/server.js","build":"rimraf dist && webpack --config scripts/webpack.config.prod.js && rollup -c scripts/rollup.esm.js","profile:tesseract":"webpack-bundle-analyzer dist/tesseract-stats.json","profile:worker":"webpack-bundle-analyzer dist/worker-stats.json","prepublishOnly":"npm run build","wait":"rimraf dist && wait-on http://localhost:3000/dist/tesseract.dev.js","test":"npm-run-all -p -r start test:all","test:all":"npm-run-all wait test:browser:* test:node:all","test:node":"nyc mocha --exit --bail --require ./scripts/test-helper.js","test:node:all":"npm run test:node -- ./tests/*.test.js","test:browser-tpl":"mocha-headless-chrome -a incognito -a no-sandbox -a disable-setuid-sandbox -a disable-logging -t 300000","test:browser:detect":"npm run test:browser-tpl -- -f ./tests/detect.test.html","test:browser:recognize":"npm run test:browser-tpl -- -f ./tests/recognize.test.html","test:browser:scheduler":"npm run test:browser-tpl -- -f ./tests/scheduler.test.html","test:browser:FS":"npm run test:browser-tpl -- -f ./tests/FS.test.html","lint":"eslint src","lint:fix":"eslint --fix src","postinstall":"opencollective-postinstall || true"},"browser":{"./src/worker/node/index.js":"./src/worker/browser/index.js"},"author":"","contributors":["jeromewu"],"license":"Apache-2.0","devDependencies":{"@babel/core":"^7.18.7","@babel/preset-env":"^7.18.7","@rollup/plugin-commonjs":"^22.0.2","acorn":"^6.4.0","babel-loader":"^8.2.0","buffer":"^6.0.3","cors":"^2.8.5","eslint":"^7.2.0","eslint-config-airbnb-base":"^14.2.0","eslint-plugin-import":"^2.22.1","expect.js":"^0.3.1","express":"^4.17.1","mocha":"^10.0.0","mocha-headless-chrome":"^4.0.0","npm-run-all":"^4.1.5","nyc":"^15.1.0","rimraf":"^2.7.1","rollup":"^2.79.0","wait-on":"^3.3.0","webpack":"^5.74.0","webpack-bundle-analyzer":"^4.6.0","webpack-cli":"^4.10.0","webpack-dev-middleware":"^5.3.3"},"dependencies":{"babel-eslint":"^10.1.0","bmp-js":"^0.1.0","file-type":"^12.4.1","idb-keyval":"^3.2.0","is-electron":"^2.2.0","is-url":"^1.2.4","node-fetch":"^2.6.0","opencollective-postinstall":"^2.0.2","regenerator-runtime":"^0.13.3","resolve-url":"^0.2.1","tesseract.js-core":"^4.0.2","wasm-feature-detect":"^1.2.11","zlibjs":"^0.3.1"},"repository":{"type":"git","url":"https://github.com/naptha/tesseract.js.git"},"bugs":{"url":"https://github.com/naptha/tesseract.js/issues"},"homepage":"https://github.com/naptha/tesseract.js","collective":{"type":"opencollective","url":"https://opencollective.com/tesseractjs"}}')}},e={};function r(n){var o=e[n];if(void 0!==o)return o.exports;var i=e[n]={id:n,loaded:!1,exports:{}};return t[n].call(i.exports,i,i.exports,r),i.loaded=!0,i.exports}return r.nmd=t=>(t.paths=[],t.children||(t.children=[]),t),r(352)})()));
    //# sourceMappingURL=tesseract.min.js.map

    // 识别 canvas 中的数字金额
    function recognizeCanvas() {
        const video = document.querySelector('video');
        if(video)video.playbackRate=16
        let start = Date.now();
        const canvas = document.querySelector('canvas.canvas.overflow-hidden');
        if (!canvas) {
            console.warn('Canvas not found');
            return;
        }
        const imageDataUrl = canvas.toDataURL('image/png');
        Tesseract.recognize(
            imageDataUrl,
            'chi_sim', // 使用中文简体
            {
                logger: m => console.log(m) // 可选：日志输出
            }
        ).then(({ data: { text } }) => {
            const match = text.match(/(\d+(\.\d{1,2})?)/);
            const amount = match ? parseFloat(match[0]) : null;
            console.info('当前金额:', amount);
            console.info(" monitor money spends ",Date.now()-start);
            if (amount) {
                let originMoney = window.localStorage.getItem('originMoney',0);
                if(!originMoney){
                    localStorage.setItem('originMoney', amount);
                }
                localStorage.setItem('totalMoney', amount);
                if (originMoney>0){
                    console.info('原始金额:', originMoney, '当前金额:', amount,'盈利：', amount - originMoney, '盈利率：', (amount - originMoney) / originMoney * 100 + '%')
                    document.getElementById('bet-comment').textContent = '余额:'+ amount+' 盈利:'+ (amount - originMoney);
                }
            }
        }).catch(err => {
            console.error('识别失败:', err);
        });
    }

    // 设置定时任务
    function monitorMoney() {
        if (window.recognitionIntervalId) {
            clearInterval(window.recognitionIntervalId);
        }else{
            localStorage.removeItem('totalMoney');
        }
        // console.info("start monitor money every 10 seconds.")
        window.recognitionIntervalId = setInterval(recognizeCanvas, 10000); // 每 16 秒执行一次
    }
    monitorMoney();
    console.info('injecting scripts successfully.');
    return true;
})();
        