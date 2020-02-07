var interval;

function setSpaceIDEvent() {
    document.getElementById("setSpaceID").onclick = function () {
        let spaceIDdocObj = document.getElementById("spaceID");
        if (spaceIDdocObj.value) {
            chrome.storage.sync.set({ "spaceid": spaceIDdocObj.value });
            renderInfo(spaceIDdocObj.value);
        }
    }
}

function setUrlClickEvent() {
    var aDivs = ["upSpaceUrl", "2er0Xbug"];
    for (i = 0; i < aDivs.length; i++) {
        let aDocObj = document.getElementById(aDivs[i]);
        aDocObj.onclick = function () {
            chrome.tabs.create({
                url: aDocObj.href,
                active: true,
                pinned: false
            });
        }
    }
}

function renderInfo(spaceid) {
    let upSpaceUrl = "https://space.bilibili.com/" + spaceid + "/#/";
    document.getElementById("upSpaceUrl").href = upSpaceUrl;
    renderUpName(upSpaceUrl);
    showFansNum(spaceid);
}

function renderUpName(url) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            document.getElementById("upName").innerText = xhr.responseText.match(/<title>(\s*\S*)的个人空间/)[1];
        }
    }
    xhr.send();
}


function renderFromStorage() {
    chrome.storage.sync.get("spaceid", function (spaceid) {
        if (spaceid.spaceid) {
            document.getElementById("spaceID").value = spaceid.spaceid;
            renderInfo(spaceid.spaceid);
            showFansNum(spaceid.spaceid);
        }
    });
}

function renderFansNum(spaceid) {
    let api = "https://api.bilibili.com/x/relation/stat?vmid=" + spaceid + "&jsonp=jsonp";
    let xhr = new XMLHttpRequest();
    xhr.open("GET", api, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            resp_json = JSON.parse(xhr.responseText);
            if (resp_json.code === 0) {
                document.getElementById("fansNum").value = resp_json.data.follower;
            }
        }
    }
    xhr.send();
}

function showFansNum(spaceid, sec = 1.5) {
    renderFansNum(spaceid);
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(function () {
        renderFansNum(spaceid);
    }, sec * 1000);
}

setSpaceIDEvent();
setUrlClickEvent();
renderFromStorage();