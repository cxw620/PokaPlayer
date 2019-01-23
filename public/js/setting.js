// 初始化設定值
$(async () => {
    //卡片右上角的來源標籤
    $("#content").attr('data-sourcelabel', _setting(`showCardSource`))

    let version = (await request('/info/')).version

    // 更新版本號
    if (version != _setting(`version`))
        if ($("#content").attr("data-page") == "settings" || $("#content").attr("data-page") == "home")
            $("#header-wrapper .title .subtitle").text(`PokaPlayer ${version}`)
    _setting(`version`, version)

    // debug
    sessionStorage.debug = await request('/debug/')

    // 檢查更新
    console.time('檢查更新');
    let checkVersion = (await checkUpdate())
    console.timeEnd('檢查更新'); // 測時間
    if (checkVersion.version) mdui.snackbar(lang(`checkUpdate_poka`).render({
        version: checkVersion.version
    }), {
        buttonText: lang(`checkUpdate_button`),
        onButtonClick: () => showUpdateDialog(checkVersion),
        position: getSnackbarPosition()
    })
});
// 設定好朋友
function _setting(setting, value = undefined) {
    let pokaSetting = JSON.parse(localStorage.pokaSetting || `{}`)
    let defaultPokaSetting = {
        "audioQuality": localStorage["musicRes"] || "High", //音質
        "randomImgSource": localStorage["randomImg"] || "/og/og.png",
        "randomImgName": localStorage["randomImgName"] || "預設圖庫",
        "imageDataSaving": Boolean(localStorage["imgRes"]) || false,
        "showCardSource": Boolean(localStorage["pokaCardSource"]) || true,
        "version": localStorage["PokaPlayerVersion"] || "0.0.0",
        "filterEnabled": Boolean(localStorage["poka-filter"]) || true,
        "darkMode": Boolean(localStorage["mdui-theme-color"]) || false,
        "themeColor": localStorage["poka-theme-primary"] || "#009688",
        "themeTextColor": localStorage["poka-theme-primary-text"] || "#FFF",
        "lang": "en-US",
    }
    if (value != undefined) { //設定值
        pokaSetting[setting] = value
        localStorage.pokaSetting = JSON.stringify(pokaSetting)
        return pokaSetting[setting]
    } else { //取值
        if (pokaSetting[setting] != undefined) { //已有值
            return pokaSetting[setting]
        } else { //未有，先存下再回傳
            pokaSetting[setting] = defaultPokaSetting[setting] || ""
            localStorage.pokaSetting = JSON.stringify(pokaSetting)
            return pokaSetting[setting]
        }
    }
}
// 版本比對
function compareVersion(local, remote) {
    local = local.split('.')
    remote = remote.split('.')
    //版本號加權對比
    local = parseInt(local[0]) * 1000 * 1000 + parseInt(local[1]) * 1000 + parseInt(local[2])
    remote = parseInt(remote[0]) * 1000 * 1000 + parseInt(remote[1]) * 1000 + parseInt(remote[2])
    return remote > local
}
async function checkUpdate() {
    let getInfo = await request('/info/');
    let checkUpdate = await request(`https://api.github.com/repos/gnehs/PokaPlayer/releases`);
    let nowversion = getInfo.version
    let ghversion = checkUpdate[0].tag_name
    return {
        version: compareVersion(nowversion, ghversion) ? ghversion : false,
        changelog: checkUpdate[0].body
    }
}
async function checkPokaEleUpdate(version) {
    let checkUpdate = await request(`https://api.github.com/repos/gnehs/PokaPlayer-electron/releases`);
    let ghversion = checkUpdate[0].tag_name
    if (compareVersion(version, ghversion) || !window.electronData) { //electronData 供舊版更新用
        mdui.snackbar(lang(`checkUpdate_pokaEle`).render({
            version: ghversion
        }), {
            buttonText: lang(`checkUpdate_button`),
            onButtonClick: () => window.open('https://github.com/gnehs/PokaPlayer-electron/releases/latest'),
            position: getSnackbarPosition()
        })
    }
}
//- 設定頁面用的範本
var settingsItem = ({
    title,
    text,
    icon,
    navigate,
    attribute,
    cssClass = '',
    other = ''
}) => {
    //有 text 才輸出 Title 跟 Text
    return `<div class="mdui-list-item ${cssClass}" ${navigate?`onclick="router.navigate('${navigate}')"`:''} ${attribute}>
    ${icon?`<i class="mdui-list-item-icon mdui-icon eva ${icon}"></i>`:''}
    ${text ? `<div class="mdui-list-item-content">
        <div class="mdui-list-item-title">${title}</div>
        <div class="mdui-list-item-text">${text}</div>
    </div>` : `<div class="mdui-list-item-content">${title}</div>`}
    ${other}
    </div>`
}
//- 設定
async function showSettings() {
    $('#content').attr('data-page', 'settings')

    pokaHeader(lang("settings"), "PokaPlayer " + _setting(`version`))
    let settingItems = `<div class="mdui-list">
        ${settingsItem({
            "title":lang("settings_network"),
            "text":lang("settings_network_description"),
            "icon":"eva-wifi-outline",
            "navigate":"settings/network"
        })}
        ${settingsItem({
            "title":lang("settings_customize"),
            "text":lang("settings_customize_description"),
            "icon":"eva-brush-outline",
            "navigate":"settings/customize"
        })}
        ${settingsItem({
            "title":lang("settings_lang"),
            "text":lang("settings_lang_description"),
            "icon":"eva-globe-outline",
            "navigate":"settings/lang"
        })}
        ${settingsItem({
            "title":lang("settings_systemAndUpdate"),
            "text":lang("settings_systemAndUpdate_description"),
            "icon":"eva-browser-outline",
            "navigate":"settings/system"
        })}
        ${settingsItem({
            "title":lang("settings_aboutAndHelp"),
            "text":lang("settings_aboutAndHelp_description"),
            "icon":"eva-info-outline",
            "navigate":"settings/about"
        })}
    </div>`
    $("#content").html(settingItems);
}
async function showSettingsLang() {
    pokaHeader(lang("settings_lang"), lang("settings"))
    $("#content").html(template.getSpinner())
    mdui.mutation()
    let langData = (await getLangs())
    let settingItems = `<div class="mdui-list">`
    settingItems += settingsItem({
        "title": lang("back"),
        "icon": "eva-arrow-ios-back-outline",
        "navigate": "settings"
    })
    for (item of Object.keys(langData)) {
        settingItems +=
            `<div class="mdui-list-item" poka-lang="${item}">
            <i class="mdui-list-item-icon mdui-icon" style="color:#000">${langData[item].flag}</i>
            <div class="mdui-list-item-content"> ${langData[item].name}</div>
            <i class="checkmark mdui-list-item-icon mdui-icon eva ${item == _setting(`lang`) ? "eva-checkmark-outline":""}"></i>
        </div>`
    }
    settingItems += `</div>`
    $("#content").html(settingItems)
    $(`#content [poka-lang]`).click(async function () {
        let langCode = $(this).attr('poka-lang')
        $(`[poka-lang] i.checkmark`).removeClass('eva-checkmark-outline')
        $(this).children(`i.checkmark`).addClass('eva-checkmark-outline')
        await setLang(langCode)
    })
}
async function showSettingsSystem() {
    pokaHeader(lang("settings_systemAndUpdate"), lang("settings"))
    let settingItems = `<div class="mdui-list">
        ${settingsItem({
            "title":lang("back"),
            "icon":"eva-arrow-ios-back-outline",
            "navigate":"settings"
        })}
        <div class="mdui-subheader">${lang("settings_account")}</div>
        ${settingsItem({
            "title":lang("settings_logout"),
            "icon":"eva-person-outline",
            "attribute":`onclick="location.href='/logout'"`
        })}
        <div class="mdui-subheader">${lang("settings_system")}</div>
        ${settingsItem({
            "title":lang("settings_update"),
            "icon":"eva-cloud-upload-outline",
            "text":lang("settings_update_checking4updates"),
            "attribute":"data-upgrade"
        })}
        ${settingsItem({
            "title":lang("settings_restart"),
            "icon":"eva-loader-outline",
            "attribute":"data-restart"
        })}
    </div>`
    $("#content").html(settingItems);
    //檢查更新
    let debug = await request('/debug/')
    let checkNewVersion = await checkUpdate()
    let update = checkNewVersion.version ? lang("settings_update_update2").render({
        version: checkNewVersion.version
    }) : lang("settings_update_latestVersion")
    if (debug) {
        $("[data-upgrade]").attr('data-upgrade', true)
    } else if (checkNewVersion.version) {
        $("[data-upgrade]").attr('data-upgrade', true)
        pokaHeader('系統和更新', lang("settings_update_canUpdate2").render({
            version: checkNewVersion.version
        }))
    }
    $("[data-upgrade] .mdui-list-item-text").text(debug ? `DEV#${_setting(`version`)}(${debug})` : update)
    //重啟
    $("[data-restart]").click(() => {
        mdui.confirm(lang("settings_updateDialog_note"), lang("settings_restartDialog_title"), () => {
            mdui.snackbar(lang("settings_restarting"), {
                position: getSnackbarPosition()
            })
            axios.post('/restart')
            pingServer()
        }, false, {
            confirmText: lang("settings_restart"),
            cancelText: lang("cancel")
        })
    })
    //更新
    $("[data-upgrade=\"true\"]").click(() => showUpdateDialog(checkNewVersion))
}
async function showUpdateDialog(checkNewVersion, debug = sessionStorage.debug) {
    let content = `<div class="mdui-typo">
    ${new showdown.Converter().makeHtml(checkNewVersion.changelog)}
    <hr>` + lang("settings_updateDialog_note")
    if (debug)
        content += `</br>` + lang("settings_updateDialog_note_dev")
    content += `</div>`
    mdui.dialog({
        title: lang("settings_updateDialog_title").render({
            version: checkNewVersion.version || ""
        }),
        content: content,
        buttons: [{
                text: lang("cancel")
            },
            {
                text: lang("settings_update"),
                onClick: async inst => {
                    mdui.snackbar(lang("settings_update_updating"), {
                        position: getSnackbarPosition()
                    });
                    let update = await request('/upgrade/')
                    if (update == "upgrade") {
                        mdui.snackbar(lang("settings_update_srvRestart"), {
                            buttonText: lang("settings_update_reconnect"),
                            onButtonClick: () => window.location.reload(),
                            position: getSnackbarPosition()
                        })
                    } else if (update == "socket") {
                        socket.emit('update')
                        socket.on('Permission Denied Desu', () => mdui.snackbar('Permission Denied', {
                            timeout: 3000,
                            position: getSnackbarPosition()
                        }))
                        socket.on('init', () => mdui.snackbar(lang("settings_update_initializing"), {
                            timeout: 3000,
                            position: getSnackbarPosition()
                        }))
                        socket.on('git', data => mdui.snackbar({
                            fetch: lang("settings_update_git_fetch"),
                            reset: lang("settings_update_git_reset"),
                            api: lang("settings_update_git_api")
                        } [data], {
                            timeout: 3000,
                            position: getSnackbarPosition()
                        }))
                        socket.on('restart', () => {
                            socket.emit('restart')
                            mdui.snackbar(lang("settings_restarting"), {
                                position: getSnackbarPosition()
                            })
                            pingServer()
                        })
                        socket.on('err', data => mdui.snackbar('err: ' + data, {
                            timeout: 8000,
                            position: getSnackbarPosition()
                        }))
                    }
                }
            }
        ]
    });
}

function pingServer() {
    let pinging = setInterval(async () => {
        let ping = (await axios.get('/ping')).data
        if (ping == 'PONG') {
            clearInterval(pinging);
            mdui.dialog({
                title: lang(`pingServer_title`),
                content: lang(`pingServer_content`),
                history: false,
                buttons: [{
                        text: lang("cancel")
                    },
                    {
                        text: lang(`pingServer_reconnect`),
                        onClick: function (inst) {
                            window.location.reload()
                        }
                    }
                ]
            });
        }
    }, 2000);
}
async function showSettingsNetwork() {
    $('#content').attr('data-page', 'settings')
    pokaHeader(lang("settings_network"), lang("settings"))
    let settingItems = `<div class="mdui-list">
        ${settingsItem({
            "title":lang("back"),
            "icon":"eva-arrow-ios-back-outline",
            "navigate":"settings"
        })}
        <div class="mdui-subheader">${lang("settings_network")}</div>
        ${settingsItem({
            "title":lang("settings_network_soundQuality"),
            "icon":"eva-music-outline",
            "text":_setting(`audioQuality`),
            "attribute":"data-music-res"
        })}
        ${settingsItem({
            "title":lang("settings_network_imageDataSaver"),
            "icon":"eva-image-outline",
            "attribute":"data-imgRes",
            "other":`<label class="mdui-switch">
                        <input type="checkbox" ${_setting(`imageDataSaving`)?"checked":""}/>
                        <i class="mdui-switch-icon"></i>
                    </label>`
        })}
        </div>`
    $("#content").html(settingItems);
    // 音質設定
    // TODO: 音質設定可立即生效
    $("[data-music-res]").click(function () {
        mdui.dialog({
            title: lang("settings_network_soundQuality"),
            content: `</br>
            <div class="poka four doubling cards">
                <div class="card" 
                    title="${lang("settings_network_soundQuality_Low")}"
                    onclick="_setting(\`audioQuality\`,'Low')"
                    mdui-dialog-close>
                    <div class="image mdui-ripple"><i class="mdui-icon">Low</i></div>
                    <div class="title mdui-text-color-theme-text">${lang("settings_network_soundQuality_Low")}</div>
                    <div class="subtitle mdui-text-color-theme-text">${lang("settings_network_soundQuality_Low_description")}</div>
            </div>
                <div class="card" 
                    title="${lang("settings_network_soundQuality_Med")}"
                    onclick="_setting(\`audioQuality\`,'Medium')"
                    mdui-dialog-close>
                    <div class="image mdui-ripple"><i class="mdui-icon">Med</i></div>
                    <div class="title mdui-text-color-theme-text">${lang("settings_network_soundQuality_Med")}</div>
                    <div class="subtitle mdui-text-color-theme-text">${lang("settings_network_soundQuality_Med_description")}</div>
            </div>
                <div class="card" 
                    title="${lang("settings_network_soundQuality_High")}"
                    onclick="_setting(\`audioQuality\`,'High')"
                    mdui-dialog-close>
                    <div class="image mdui-ripple"><i class="mdui-icon">High</i></div>
                    <div class="title mdui-text-color-theme-text">${lang("settings_network_soundQuality_High")}</div>
                    <div class="subtitle mdui-text-color-theme-text">${lang("settings_network_soundQuality_High_description")}</div>
            </div>
                <div class="card" 
                    title="${lang("settings_network_soundQuality_Ori")}"
                    onclick="_setting(\`audioQuality\`,'Original')"
                    mdui-dialog-close>
                    <div class="image mdui-ripple"><i class="mdui-icon">Ori</i></div>
                    <div class="title mdui-text-color-theme-text">${lang("settings_network_soundQuality_Ori")}</div>
                    <div class="subtitle mdui-text-color-theme-text">${lang("settings_network_soundQuality_Ori_description")}</div>
            </div>
            </div>`,
            buttons: [{
                text: lang("cancel")
            }],
            onClose: () => $("[data-music-res] .mdui-list-item-text").text(_setting(`audioQuality`))
        });
    });
    // 圖片流量節省
    $("[data-imgRes]").click(function () {
        $("[data-imgRes] input").prop('checked', !$("[data-imgRes] input").prop('checked'))
        _setting(`imageDataSaving`, $("[data-imgRes] input").prop('checked'))
    })
}
async function showSettingsCustomize() {
    // TODO: 自訂 CSS
    $('#content').attr('data-page', 'settings')
    pokaHeader(lang("settings_customize"), lang("settings"))
    let colorSelector = (themecolor, textcolor, text = "A") =>
        `<div class="colorSelector" 
            style="background-color: ${themecolor};color: ${textcolor}" 
            data-bg="${themecolor}" 
            data-text="${textcolor}">
            ${text}
        </div>`

    let settingItems = `<div class="mdui-list">
        ${settingsItem({
            "title":lang("back"),
            "icon":"eva-arrow-ios-back-outline",
            "navigate":"settings"
        })}
        <div class="mdui-subheader">${lang("settings_customize_randomImage")}</div>
        ${settingsItem({
            "title":lang("settings_customize_randomImageSource"),
            "text":_setting(`randomImgName`),
            "icon":"eva-image-outline",
            "attribute":"data-pic-source"
        })}
        ${settingsItem({
            "title":lang("settings_customize_customRandomImageSource"),
            "text":_setting(`randomImgSource`),
            "icon":"eva-link-outline",
            "attribute":"data-pic-custom-link"
        })}
        <div class="mdui-subheader">${lang("settings_customize_detail")}</div>
        ${settingsItem({
            "title":lang("settings_customize_sourceTag"),
            "icon":"eva-bookmark-outline",
            "attribute":"data-pokaCardSource",
            "other":`<label class="mdui-switch">
                        <input type="checkbox" ${_setting(`showCardSource`)?"checked":""}/>
                        <i class="mdui-switch-icon"></i>
                    </label>`
        })}
        ${settingsItem({
            "title":lang("settings_customize_filter"),
            "icon":"eva-funnel-outline",
            "attribute":"data-poka-filter",
            "other":`<label class="mdui-switch">
                        <input type="checkbox" ${_setting(`filterEnabled`)?"checked":""}/>
                        <i class="mdui-switch-icon"></i>
                    </label>`
        })}
        <div class="mdui-subheader">${lang("settings_customize_theme")}</div>
        ${settingsItem({
            "title":lang("settings_customize_themeColor"),
            "text":_setting(`darkMode`)?'Dark':'Light',
            "icon":_setting(`darkMode`)?'eva-moon-outline':'eva-sun-outline',
            "attribute":`data-theme="mdui-theme-color"`
        })}
        </div>
        <div id="theme-color">
            ${colorSelector("#03A9F4","#FFFFFF")}
            ${colorSelector("#00BCD4","#FFFFFF")}
            ${colorSelector("#009688","#FFFFFF")}
            ${colorSelector("#4CAF50","#FFFFFF")}
            ${colorSelector("#8BC34A","#FFFFFF")}
            ${colorSelector("#CDDC39","#FFFFFF")}
            ${colorSelector("#FFEE58","#000000")}
            ${colorSelector("#FFCA28","#FFFFFF")}
            ${colorSelector("#FFA726","#FFFFFF")}
            ${colorSelector("#FF5722","#FFFFFF")}
            ${colorSelector("#795548","#FFFFFF")}
            ${colorSelector("#9E9E9E","#FFFFFF")}
            ${colorSelector("#607D8B","#FFFFFF")}
            ${colorSelector("#000000","#FFFFFF")}
        </div>
        <div class="mdui-row-xs-1 mdui-row-sm-2" data-change-color-lab>
            <div class="mdui-col">
                <div class="mdui-card">
                    <div class="mdui-card-media">
                        <div class='theme-primary-color-picker'></div>
                    </div>
                    <div class="mdui-card-primary">
                        <div class="mdui-card-primary-title">${lang("settings_customize_primaryColor")}</div>
                        <div class="mdui-card-primary-subtitle">${lang("settings_customize_primaryColor_description")}</div>
                    </div>
                </div>
            </div>
            <div class="mdui-col">
                <div class="mdui-card">
                    <div class="mdui-card-media">
                        <div class='theme-primary-text-color-picker'></div>
                    </div>
                    <div class="mdui-card-primary">
                        <div class="mdui-card-primary-title">${lang("settings_customize_primaryTextColor")}</div>
                        <div class="mdui-card-primary-subtitle">${lang("settings_customize_primaryTextColor_description")}</div>
                    </div>
                </div>
            </div>
        </div>`
    $("#content").html(settingItems);
    let primaryColor = new Pickr({
        el: '.theme-primary-color-picker',
        default: _setting(`themeColor`).toUpperCase() || "#009688",
        showAlways: true,
        components: {
            preview: true,
            hue: true,
            interaction: {
                input: true
            }
        },
        onChange(hsva, instance) {
            $("#colortheme").text(`:root {
                --poka-theme-primary-color: ${hsva.toHEX().toString()};
                --poka-theme-primary-text-color: ${_setting(`themeTextColor`)};
            }`)
            _setting(`themeColor`, hsva.toHEX().toString())
            // 設定狀態欄顏色
            $("meta[name=theme-color]").attr("content", hsva.toHEX().toString());
            //移除預設好的主題啟用狀態
            $("#theme-color>.colorSelector").removeClass("active")
        }
    });
    let primaryTextColor = new Pickr({
        el: '.theme-primary-text-color-picker',
        default: _setting(`themeTextColor`).toUpperCase() || "#FFF",
        showAlways: true,
        components: {
            preview: true,
            hue: true,
            interaction: {
                input: true
            }
        },
        onChange(hsva, instance) {
            hsva.toRGBA().toString()
            $("#colortheme").text(`:root {
                --poka-theme-primary-color: ${_setting(`themeColor`)};
                --poka-theme-primary-text-color: ${hsva.toHEX().toString()};
            }`)
            _setting(`themeTextColor`, hsva.toHEX().toString())
            //移除預設好的主題啟用狀態
            $("#theme-color>.colorSelector").removeClass("active")
        }
    });
    /* 預設選好的主題色 */
    $("#theme-color>.colorSelector").each(function () {
        let active = $(this).attr("data-bg") == _setting(`themeColor`) && $(this).attr("data-text") == _setting(`themeTextColor`)
        if (active) $(this).addClass("active")
    })
    $("#theme-color>.colorSelector").click(function () {
        let colorSelectorPrimary = $(this).attr("data-bg")
        let colorSelectorPrimaryText = $(this).attr("data-text")
        _setting(`themeColor`, colorSelectorPrimary)
        _setting(`themeTextColor`, colorSelectorPrimaryText)

        primaryColor.setColor(colorSelectorPrimary)
        primaryTextColor.setColor(colorSelectorPrimaryText)

        $("#theme-color>.colorSelector").removeClass("active")
        $(this).addClass("active")

        $("#colortheme").text(`:root {
            --poka-theme-primary-color: ${_setting(`themeColor`)};
            --poka-theme-primary-text-color: ${_setting(`themeTextColor`)};
        }`)
    })
    // 卡片右上角的來源標籤
    $("[data-pokaCardSource]").click(function () {
        $("[data-pokaCardSource] input").prop('checked', !$("[data-pokaCardSource] input").prop('checked'))
        _setting(`showCardSource`, $("[data-pokaCardSource] input").prop('checked'))
        $("#content").attr('data-sourcelabel', _setting(`showCardSource`))
    });
    // 篩選器
    $("[data-poka-filter]").click(function () {
        $("[data-poka-filter] input").prop('checked', !$("[data-poka-filter] input").prop('checked'))
        _setting(`filterEnabled`, $("[data-poka-filter] input").prop('checked'))
    });
    // 主題
    $('[data-theme="mdui-theme-color"]').click(function () {
        let dm = !_setting(`darkMode`)
        _setting(`darkMode`, dm)
        $('[data-theme="mdui-theme-color"] .mdui-list-item-text').text(_setting(`darkMode`) ? 'Dark' : 'Light')
        if (_setting(`darkMode`)) { //啟用夜間模式
            $('[data-theme="mdui-theme-color"] i').removeClass('eva-sun-outline')
            $('[data-theme="mdui-theme-color"] i').addClass('eva-moon-outline')
        } else {
            $('[data-theme="mdui-theme-color"] i').removeClass('eva-moon-outline')
            $('[data-theme="mdui-theme-color"] i').addClass('eva-sun-outline')
        }
        if (_setting(`darkMode`))
            $('body').addClass("mdui-theme-layout-dark theme-dark")
        else
            $('body').removeClass("mdui-theme-layout-dark theme-dark")
        //設定顏色
        let metaThemeColor = document.querySelector("meta[name=theme-color]");
        metaThemeColor.setAttribute("content", $('header>div:first-child').css("background-color"));
    });
    // 隨機圖片
    $('[data-pic-source]').click(function () {
        let imgsOption = imgs => {
                let option = `<div class="poka three cards">`
                for (i = 0; i < imgs.length; i++) {
                    let img = imgs[i]
                    option += `
                <a class="card" 
                   title="${img.name}&#10;${img.description}"
                   data-img-src="${img.src}" mdui-dialog-close>
                    <div class="image mdui-ripple" style="background-image:url('${img.src}')"></div>
                    <div class="title mdui-text-color-theme-text mdui-text-truncate">${img.name}</div>
                    <div class="subtitle mdui-text-color-theme-text mdui-text-truncate">${img.description}</div>
                </a>`
                }
                option += "</div>"
                return option
            },
            imgs = [{
                name: lang('settings_customize_randomImage_default'),
                description: lang('settings_customize_randomImage_default_description'),
                src: '/og/og.png'
            }, {
                name: 'LoremFlickr',
                description: 'loremflickr.com',
                src: 'https://loremflickr.com/1920/1080'
            }, {
                name: 'Picsum Photos',
                description: 'picsum.photos',
                src: 'https://picsum.photos/1920/1080/?random'
            }, {
                name: lang('settings_customize_randomImage_bing'),
                description: 'yingjoy.cn',
                src: 'https://api.yingjoy.cn/pic/?t=bing&w=1920'
            }, {
                name: lang('settings_customize_randomImage_bing'),
                description: 'area.sinaapp.com',
                src: 'https://area.sinaapp.com/bingImg/'
            }, {
                name: lang('settings_customize_randomImage_bing'),
                description: 'meowv.com',
                src: 'https://api.meowv.com/bing'
            }, {
                name: 'The Dog API (GIF)',
                description: 'thedogapi.com',
                src: 'https://api.thedogapi.com/v1/images/search?format=src&mime_types=image/gif'
            }, {
                name: 'The Dog API (PNG)',
                description: 'thedogapi.com',
                src: 'https://api.thedogapi.com/v1/images/search?format=src&mime_types=image/png'
            }, {
                name: 'The Cat API (GIF)',
                description: 'thecatapi.com',
                src: 'https://thecatapi.com/api/images/get?format=src&type=gif'
            }, {
                name: 'The Cat API (PNG)',
                description: 'thecatapi.com',
                src: 'https://thecatapi.com/api/images/get?format=src&type=png'
            }, {
                name: 'Unsplash Source',
                description: 'source.unsplash.com',
                src: 'https://source.unsplash.com/random'
            }]
        mdui.dialog({
            title: lang("settings_customize_randomImageSource"),
            content: `<div class="mdui-list">${imgsOption(imgs)}</div>`,
            buttons: [{
                text: lang("cancel")
            }]
        });
        $('[data-img-src]').click(function () {
            let src = $(this).attr('data-img-src')
            let name = $(this).children('.title').text()
            _setting(`randomImgSource`, src)
            _setting(`randomImgName`, name)
            pokaHeader(lang("settings_customize"), lang("settings"), src, false, false)
            $('[data-pic-source] .mdui-list-item-text').text(name)
            $('[data-pic-custom-link] .mdui-list-item-text').text(src)
        })
    });
    $('[data-pic-custom-link]').click(function () {
        mdui.dialog({
            title: lang("settings_customize_customRandomImageSource"),
            content: `
            <div class="mdui-textfield">
                <label class="mdui-textfield-label">${lang("settings_customize_imageUrl")}</label>
                <input class="mdui-textfield-input" type="text" value="https://images2.imgbox.com/99/e2/knJdNcns_o.jpg" data-imgurl/>
            </div>`,
            buttons: [{
                text: lang("cancel")
            }, {
                text: lang("ok"),
                bold: true,
                onClick: () => {
                    let img = $('[data-imgurl]').val()
                    if (img != null) {
                        _setting(`randomImgSource`, img)
                        $('[data-pic-custom-link] .mdui-list-item-text').text(img)
                        $('[data-pic-source] .mdui-list-item-text').text(lang("settings_customize_custom"))
                        _setting(`randomImgName`, lang("settings_customize_custom"))
                        pokaHeader(lang("settings_customize"), lang("settings"), img, false, false)
                    }
                }
            }]
        });
    })
}
async function showSettingsAbout() {
    $('#content').attr('data-page', 'settings')
    pokaHeader(lang("settings_aboutAndHelp"), lang("settings"))
    let settingItems = `<div class="mdui-list">
        ${settingsItem({
            "title":lang("back"),
            "icon":"eva-arrow-ios-back-outline",
            "navigate":"settings"
        })}
        <div class="mdui-subheader">${lang("settings_about")}</div>
        ${settingsItem({
            "title":lang("settings_about_version"),
            "text":_setting(`version`),
            "icon":"eva-info-outline",
            "attribute":`data-version`,
            "other":`<i class="mdui-list-item-icon mdui-icon" data-count style="opacity: 0;">0</i>`
        })}`
    settingItems += window.electronData ?
        settingsItem({
            "title": lang("settings_about_electronVersion"),
            "text": `Pokaplayer-Electron: ${electronData.appVersion} / Chrome: ${electronData.chromeVersion} / Electron: ${electronData.electronVersion}`,
            "icon": "eva-info-outline",
            "attribute": `data-poka-ele`,
            "other": `<i class="mdui-list-item-icon mdui-icon" data-count style="opacity: 0;">0</i>`
        }) : ``
    settingItems +=
        `${settingsItem({
                "title": lang("settings_about_developer"),
                "text": lang("loading"),
                "icon": "eva-people-outline",
                "attribute": `data-dev`
        })}
        <div class="mdui-subheader">${lang("settings_about_externalLink")}</div>
        ${settingsItem({
            "title": "GitHub",
            "icon": "eva-github-outline",
            "attribute": `onclick="window.open('https://github.com/gnehs/PokaPlayer')"`
        })}
        ${settingsItem({
            "title": lang("settings_about_errorEeport"),
            "icon": "eva-alert-triangle-outline",
            "attribute": `onclick="window.open('https://github.com/gnehs/PokaPlayer/issues/new/choose')"`
        })}`
    settingItems += `</div>`
    $("#content").html(settingItems)

    // 點七次的彩蛋蛋
    $("[data-version]").click(function () {
        let click = $(this).attr("data-click") ? Number($(this).attr("data-click")) + 1 : 1
        $(this).attr("data-click", click)
        if (click > 3) {
            $("[data-version] [data-count]").removeAttr('style')
            $("[data-version] [data-count]").text(7 - click)
        }
        if (click == 7) {
            $(this).attr("data-click", 0)
            $("[data-version] [data-count]").text(":D")
            loadJS('https://anohito.tw/thisUnitIsAFlippinPlatelet/flippin_platelet.js')
        }
    })
    $("[data-poka-ele]").click(function () {
        let click = $(this).attr("data-click") ? Number($(this).attr("data-click")) + 1 : 1
        $(this).attr("data-click", click)
        if (click > 3) {
            $("[data-poka-ele] [data-count]").removeAttr('style')
            $("[data-poka-ele] [data-count]").text(7 - click)
        }
        if (click == 7) {
            $(this).attr("data-click", 0)
            $("[data-poka-ele] [data-count]").text(":D")
            loadJS('https://gnehs.github.io/Sealed/negi/negi.js')
        }
    })

    function loadJS(js) {
        s = document.createElement('script');
        s.src = js
        document.getElementsByTagName('body')[0].appendChild(s);
    }
    // PokaPlayer 詳細資料
    let getInfo = await request('/info/');
    $("[data-dev] .mdui-list-item-text").text(getInfo.author)
    $("[data-version] .mdui-list-item-text").text(getInfo.version)
    _setting(`version`, getInfo.version)
}