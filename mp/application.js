/**
 * Created by Davy on 29-5-2017.
 */
const video = document.getElementById("video-block").firstElementChild;
console.log(video);
const container = document.getElementById("caption-wrapper");
const captions = [
    { "start": "0.00",
        "finish": "4.130",
        "text": "Now that we've looked at the architecture of the internet, let's see how you might "},
    { "start": "4.131",
        "finish": "7.535",
        "text": "connect your personal devices to the internet inside your house."},
    { "start": "7.536",
        "finish": "13.960",
        "text": "Well there are many ways to connect to the internet, and most often people connect wirelessly.\n\n"},
    { "start": "13.961",
        "finish": "17.940",
        "text": "Let's look at an example of how you can connect to the internet."},
    { "start": "17.941",
        "finish": "30.920",
        "text": "If you live in a city or a town, you probably have a coaxial cable for cable Internet, or a phone line if you have DSL, running to the outside of your house, that connects you to the Internet Service Provider, or ISP."},
    { "start": "32.100",
        "finish": "41.190",
        "text": "If you live far out in the country, you'll more likely have a dish outside your house, connecting you wirelessly to your closest ISP, or you might also use the telephone system.\n\n"},
    { "start": "42.350",
        "finish": "53.760",
        "text": "Whether a wire comes straight from the ISP hookup outside your house, or it travels over radio waves from your roof, the first stop a wire will make once inside your house, is at your modem."},
    { "start": "53.761",
        "finish": "57.780",
        "text": "A modem is what connects the internet to your network at home."},
    { "start": "57.781",
        "finish": "59.000",
        "text": "A few common residential modems are DSL or\n\n"}
];

function getQueryStringValue (key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

// borrowed from https://gist.github.com/niyazpk/f8ac616f181f6042d1e0
function updateUrlParameter (uri, key, value) {
    // remove the hash part before operating on the uri
    var
        i = uri.indexOf('#'),
        hash = i === -1 ? '' : uri.substr(i)
        ;

    uri = i === -1 ? uri : uri.substr(0, i);

    var
        re = new RegExp("([?&])" + key + "=.*?(&|$)", "i"),
        separator = uri.indexOf('?') !== -1 ? "&" : "?"
        ;

    if (!value) {
        // remove key-value pair if value is empty
        uri = uri.replace(new RegExp("([?&]?)" + key + "=[^&]*", "i"), '');

        if (uri.slice(-1) === '?') {
            uri = uri.slice(0, -1);
        }
        // replace first occurrence of & by ? if no ? is present

        if (uri.indexOf('?') === -1) {
            uri = uri.replace(/&/, '?');
        }

    } else if (uri.match(re)) {
        uri = uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
        uri = uri + separator + key + "=" + value;
    }
    return uri + hash;
}

var
    lang = getQueryStringValue('lang') || 'en',
    stretching = getQueryStringValue('stretching') || 'auto',
    languageSelector = document.querySelector('select[name=lang]'),
    stretchingSelector = document.querySelector('select[name=stretching]'),
    sourcesSelector = document.querySelectorAll('select[name=sources]'),
    sourcesTotal = sourcesSelector.length
    ;

languageSelector.value = lang;
languageSelector.addEventListener('change', function () {
    window.location.href = updateUrlParameter(window.location.href, 'lang', languageSelector.value);
});
stretchingSelector.value = stretching;
stretchingSelector.addEventListener('change', function () {
    window.location.href = updateUrlParameter(window.location.href, 'stretching', stretchingSelector.value);
});

for (var i = 0; i < sourcesTotal; i++) {
    sourcesSelector[i].addEventListener('change', function () {

        var
            media = this.closest('.players').querySelector('.mejs__container').id,
            player = mejs.players[media]
            ;

        player.setSrc(this.value.replace('&amp;', '&'));
        player.load();

        var renderer = document.getElementById(player.media.id + '-rendername');
        renderer.querySelector('.src').innerHTML = '<a href="' + this.value + '" target="_blank">' + this.value + '</a>';
        renderer.querySelector('.renderer').innerHTML = player.media.rendererName;
        renderer.querySelector('.error').innerHTML = '';

    });

    // These media types cannot play at all on iOS, so disabling them
    if (mejs.Features.isiOS) {
        sourcesSelector[i].querySelector('option[value^="rtmp"]').disabled = true;
        if (sourcesSelector[i].querySelector('option[value$="webm"]')) {
            sourcesSelector[i].querySelector('option[value$="webm"]').disabled = true;
        }
        if (sourcesSelector[i].querySelector('option[value$=".mpd"]')) {
            sourcesSelector[i].querySelector('option[value$=".mpd"]').disabled = true;
        }
        if (sourcesSelector[i].querySelector('option[value$=".ogg"]')) {
            sourcesSelector[i].querySelector('option[value$=".ogg"]').disabled = true;
        }
        if (sourcesSelector[i].querySelector('option[value$=".flv"]')) {
            sourcesSelector[i].querySelector('option[value*=".flv"]').disabled = true;
        }
    }
}

function subtitle () {
    for ( i=0 ; i < captions.length; i++ ) {
        const span = document.createElement("span");
        span.innerText = captions[i].text + ' ';
        span.setAttribute("id", captions[i].start);
        container.append(span);
    }
}

video.addEventListener("timeupdate", () => {
    const currentTime = parseFloat(video.currentTime);
for ( i=0; i < captions.length; i++ ) {
    const getCaption = document.getElementById(captions[i].start);
    console.log(getCaption);
    getCaption.classList.remove('glow');
    if ( currentTime > captions[i].start && currentTime < captions[i].finish ) {
        getCaption.classList.add('glow');
    }
}
});

subtitle();
document.addEventListener('DOMContentLoaded', function () {

    mejs.i18n.language(lang);

    var mediaElements = document.querySelectorAll('video, audio'), i, total = mediaElements.length;

    for (i = 0; i < total; i++) {
        new MediaElementPlayer(mediaElements[i], {
            stretching: stretching,
            pluginPath: '../build/',
            success: function (media) {
                var renderer = document.getElementById(media.id + '-rendername');

                media.addEventListener('loadedmetadata', function () {
                    var src = media.originalNode.getAttribute('src').replace('&amp;', '&');
                    if (src !== null && src !== undefined) {
                        renderer.querySelector('.src').innerHTML = '<a href="' + src + '" target="_blank">' + src + '</a>';
                        renderer.querySelector('.renderer').innerHTML = media.rendererName;
                        renderer.querySelector('.error').innerHTML = '';
                    }
                });

                media.addEventListener('error', function (e) {
                    renderer.querySelector('.error').innerHTML = '<strong>Error</strong>: ' + e.message;
                });
            }
        });
    }
});