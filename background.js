let allbetSocket;
let isCreatingAllbetSocket = false; // 锁变量
let resolveQueue = []; // 用于存储等待的 resolve 函数
const maxReconnectAttempts = 5; // 最大重连次数
const initialReconnectInterval = 1000; // 初始重连间隔时间，单位为毫秒
let urlPattern;
let attachedTabs = new Set(); // 用于跟踪已经附加调试器的标签页

function getWebSocket() {
    return new Promise((resolve, reject) => {
        if (allbetSocket && allbetSocket.readyState === WebSocket.OPEN) {
            resolve(allbetSocket);
            return;
        }

        if (isCreatingAllbetSocket) {
            // 如果已经有进程在创建 WebSocket 连接，将当前进程加入等待队列
            resolveQueue.push(resolve);
            return;
        }

        isCreatingAllbetSocket = true;

        let reconnectAttempts = 0; // 当前重连次数

        const createAndInitializeWebSocket = () => {
            chrome.storage.local.get(['wsUrl'], ({ wsUrl }) => {
                console.info('configured WebSocket URL:', wsUrl);
                const url = wsUrl || 'ws://localhost:8765/long-hu'; // 替换为实际的 WebSocket 服务端 URL
                const socket = new WebSocket(url);

                socket.addEventListener('open', function(event) {
                    console.info('WebSocket connection established.');
                    allbetSocket = socket;
                    isCreatingAllbetSocket = false;
                    reconnectAttempts = 0; // 重置重连次数

                    // 解锁所有等待的进程
                    resolveQueue.forEach(res => res(socket));
                    resolveQueue = [];

                    resolve(socket);
                });

                socket.addEventListener('message', function(event) {
                    console.info('Received message:', event.data);
                    handleServerMessage(event.data);
                });

                socket.addEventListener('close', function(event) {
                    console.info('WebSocket connection closed:', event.code, event.reason);
                    allbetSocket = null;
                    attemptReconnect();
                });

                socket.addEventListener('error', function(event) {
                    console.error('WebSocket error:', event);
                    allbetSocket = null;
                    attemptReconnect();
                });

                function attemptReconnect() {
                    if (reconnectAttempts < maxReconnectAttempts) {
                        const reconnectDelay = initialReconnectInterval * Math.pow(3, reconnectAttempts);
                        console.log(`Attempting to reconnect in ${reconnectDelay} ms. Attempt ${reconnectAttempts + 1}/${maxReconnectAttempts}`);
                        setTimeout(createAndInitializeWebSocket, reconnectDelay);
                        reconnectAttempts++;
                    } else {
                        console.error('Max reconnect attempts reached. Giving up.');
                        isCreatingAllbetSocket = false;
                        reject(new Error('Max reconnect attempts reached'));
                    }
                }
            });
        };
        createAndInitializeWebSocket();
    });
}

// 初始化 WebSocket 连接
getWebSocket().then(socket => {
    console.info('WebSocket initialized successfully:', socket);
}).catch(error => {
    console.error('Failed to initialize WebSocket:', error);
});

chrome.storage.local.get(['gameUrlPattern'], ({ gameUrlPattern }) => {
    urlPattern = gameUrlPattern || '/video/,token=';
});

// 使用存储的 gameUrlPattern 进行匹配
function isGameUrl(url) {
    let mt = false;
    urlPattern.split(',').forEach(pattern => {
        if (pattern && (url.includes("http://") || url.includes("https://")) && url.includes(pattern)) {
            mt = true;
        }
    });
    return mt;
}

// 给接收到的消息执行相应动作
function handleServerMessage(message) {
    const infos = message.split(',');
    // 确保有足够的字段
    if (infos.length < 3) {
        console.error('Received message does not have enough fields:', message);
        return;
    }
    // 转换数据类型
    if(infos.length==3){
        const card1 = parseInt(infos[0], 10);
        const card2 = parseInt(infos[1], 10);
        const theTime = parseFloat(infos[2]) * 1000; // 假设 theTime 是秒数，转换为毫秒
        const startTime = new Date().getTime();
        chrome.storage.local.get(['amount'], ({ amount }) => {
            let betAmount = amount !== undefined ? amount : 10;
            const script = 'handleMessage(' + card1 + ',' + card2 + ',' + theTime + ',' + betAmount + ');';
            executeScriptInTabs(script);
            const timeSpend = new Date().getTime() - startTime;
            console.info(`spend ${timeSpend} ms on message redirect ${card1} - ${card2}, ${betAmount}`);
           
        });
        return true;
    }else if(infos.length==5){
        const table_id = parseInt(infos[0], 10);
        const card1 = parseInt(infos[1], 10);
        const card2 = parseInt(infos[2], 10);
        const tableName = infos[3];
        const theTime = parseFloat(infos[4]) * 1000;
        const startTime = new Date().getTime();
        chrome.storage.local.get(['amount'], ({ amount }) => {
            let betAmount = amount !== undefined ? amount : 10;
            const script = 'handleTableMessage(' + table_id + ',' + card1 + ',' + card2 +',"' + tableName+'",' + theTime + ',' + betAmount + ');';
            executeScriptInTabs(script);
            const timeSpend = new Date().getTime() - startTime;
            console.info(`spend ${timeSpend} ms on message redirect ${table_id}-${tableName} - ${card1} - ${card2}, ${betAmount}`)
    });
    }
    
}

// 在所有附加的标签页中执行 handleMessage 函数
async function executeScriptInTabs(script) {
   
    // 获取所有调试目标
    chrome.debugger.getTargets((targets) => {
        if (chrome.runtime.lastError) {
            console.error('Error getting targets:', chrome.runtime.lastError);
            return;
        }
        targets.forEach((target) => {
            // 检查 target 是否属于当前 tab 或其 iframe
            const isGame = isGameUrl(target.url);
            if (isGame && target.attached) {
                chrome.debugger.sendCommand({ targetId: target.id }, "Runtime.evaluate", {
                    expression: script
                }, (result) => {
                    if (chrome.runtime.lastError) {
                        console.error("执行失败：", chrome.runtime.lastError.message, target.url);
                        return;
                    }
                    console.log('handle message result:', result);
                });
            }
        });
    });
}

// 监听 storage 变化事件
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.wsUrl) {
        console.info('wsUrl changed to:', changes.wsUrl.newValue);
        closeWebSocket();
        getWebSocket().then(socket => {
            console.info('WebSocket reinitialized successfully:', socket);
        }).catch(error => {
            console.error('Failed to reinitialize WebSocket:', error);
        });
    }
    if (namespace === 'local' && changes.gameUrlPattern) {
        urlPattern = changes.gameUrlPattern.newValue;
        console.info('url pattern changed to:', changes.gameUrlPattern.newValue);
    }
});

// 关闭当前的 WebSocket 连接
function closeWebSocket() {
    if (allbetSocket) {
        allbetSocket.close();
        allbetSocket = null;
        console.info('Current WebSocket connection closed.');
    }
}

async function attachDebugger() {
    const script = await fetch(chrome.runtime.getURL('inject_scripts.js')).then(response => response.text());
    chrome.debugger.getTargets((targets) => {
        if (chrome.runtime.lastError) {
            console.error('Error getting targets:', chrome.runtime.lastError);
            return;
        }

        targets.forEach((target) => {
            const isGame = isGameUrl(target.url);
            if (isGame && !attachedTabs.has(target.id)) {
                // Step 2: 连接到目标
                chrome.debugger.attach({ targetId: target.id }, "1.3", () => {
                    if (chrome.runtime.lastError?.message.includes("already attached")) {
                        console.log('Already attached, skip');
                        return;
                    }
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError.message);
                    }
                    console.log(`成功连接到目标: ${target.url}`);
                    attachedTabs.add(target.id);
                    inject_scripts(target, script);
                });
            }
        });
    });
}

function inject_scripts(target, script) {
    // 启用 Debugger 代理
    chrome.debugger.sendCommand({ targetId: target.id }, 'Debugger.enable', {}, () => {
        if (chrome.runtime.lastError) {
            console.error('Failed to enable Debugger:', chrome.runtime.lastError);
            return;
        }
        chrome.debugger.sendCommand({ targetId: target.id }, "Runtime.evaluate", {
            expression: script
        }, (result) => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
                return;
            }
            console.log('注入方法成功:', result);
            setBreak(target);
        });

    });
}
function setBreak(target) {
    chrome.debugger.sendCommand({ targetId: target.id }, 'Debugger.setBreakpointByUrl', {
        lineNumber: 41,
        columnNumber: 41525,
        urlRegex: '.*/video/assets/_nexus-.*\\.js(\\?.*)?',
        condition: ""
    }, (breakpoint) => {
        if (chrome.runtime.lastError) {
            console.error("设置断点失败：", chrome.runtime.lastError.message);
            return;
        }

        const currentBreakpointId = breakpoint.breakpointId;
        console.log('断点设置成功:', currentBreakpointId, target.url);

        // 监听暂停事件并关联上下文
        const onPaused = (source, method, params) => {
            if (method === 'Debugger.paused') {
                const topCallFrame = params.callFrames[0];
                if (!topCallFrame) return;

                // 直接使用 callFrameId 执行代码
                handleBreak(target, currentBreakpointId, topCallFrame.callFrameId);
            }
        };

        chrome.debugger.onEvent.addListener(onPaused);
    });
}

function handleBreak(target, currentBreakpointId,callFrameId) {
    try {
        console.info("执行到断点 ...",target.url);
        // 执行你的自定义代码
        script = 'console.info("断点执行:",this);if(WSNet){self.wsNet=this;console.info(self.wsNet);console.info("设置wsNet成功");a = true;}else{ console.info("设置wsNet失败");a = false;}';
        console.info("执行自定义代码...", script, target.url);
        chrome.debugger.sendCommand({ targetId: target.id }, "Debugger.evaluateOnCallFrame", {
            expression: script,
            callFrameId: callFrameId
        }, (result) => {
            if (chrome.runtime.lastError) {
                console.error("",chrome.runtime.lastError.message);
                return;
            }
            console.log('执行自定义代码成功:', result);
            if(result.result.value){
                 // 移除断点
                console.info("移除断点...", currentBreakpointId, target.url);
                chrome.debugger.sendCommand({
                        targetId: target.id
                    }, 'Debugger.removeBreakpoint', {
                        breakpointId: currentBreakpointId
                    }, (result1) => {
                        if (chrome.runtime.lastError) {
                            console.error(chrome.runtime.lastError.message);
                        }
                        console.info("恢复执行...", target.url);
                        chrome.debugger.sendCommand({
                            targetId: target.id
                        }, 'Debugger.resume', () => {
                            if (chrome.runtime.lastError) {
                                console.error(chrome.runtime.lastError.message);
                            }
                            console.info("恢复执行完成", target.url);
                        });
                    });
            }else{
                console.info("恢复执行...", target.url);
                chrome.debugger.sendCommand({
                    targetId: target.id
                }, 'Debugger.resume', () => {
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError.message);
                    }
                    console.info("恢复执行完成", target.url);
                });
            }
         });

    } catch (error) {
        console.error('Breakpoint handler error:', error);
    }
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
       await attachTab(tab);
    }
});

async function attachTab(tab){
    const script = await fetch(chrome.runtime.getURL('inject_scripts.js')).then(response => response.text());
    chrome.debugger.getTargets((targets) => {
        if (chrome.runtime.lastError) {
            console.error('Error getting targets:', chrome.runtime.lastError);
            return;
        }

        targets.forEach((target) => {
            const isGame = isGameUrl(target.url);
            if (isGame && target.url === tab.url) {
                // Step 2: 连接到目标
                chrome.debugger.attach({ targetId: target.id }, "1.3", () => {
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError.message);
                    }
                    console.log(`成功连接到目标: ${target.url}`);
                    attachedTabs.add(target.id);
                    inject_scripts(target, script);
                });
            }
        });
    });
}

// 监听新标签页创建事件
chrome.tabs.onCreated.addListener(async (tab) => {
    attachDebugger();
});

// 监听标签页被替换事件
chrome.tabs.onReplaced.addListener(async (addedTabId, removedTabId) => {
    attachDebugger();
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, async (tab) => {
        if (!tab) {
            console.error('Failed to retrieve tab information.');
            return;
        }

        if ((isGameUrl(tab.url)||isEmbedUrl(tab.url)) && !attachedTabs.has(tab.id)) {
            console.info('Enable debugging for tab', tab.url);
            chrome.debugger.attach({
                tabId: tab.id
            }, '1.3', () => {
                attachedTabs.add(tab.id);
                attachDebugger();
            });
        } else {
            console.info('Skipped attaching debugger to internal URL:', tab.url);
        }
    });
});

function isEmbedUrl(url) {
    return url && url.includes('embed');
}

console.info("web socket monitor background.js is loaded.");
