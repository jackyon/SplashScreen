var splash = (function(){
    //options
    var url,
        callback,
        countdown,
        splashLink,
        alwaysShow,
        fullSplashUrl,
        spinnerColor,
        isOnlyBottomImg,
        btmLogoUrl;

    //global variables
    var screenHeight = screen.height,
        screenWidth = screen.width;

    //start running the application
    function init(opts) {
        url = opts.url;
        callback = opts.callback;
        countdownNum = opts.countdown || 3;
        splashLink = opts.splashLink;
        alwaysShow = true;
        spinnerColor = opts.loading ? opts.loading.color : null;
        //two options to show the defualt splash image
        fullSplashUrl = opts.splashImg.full;
        btmLogoUrl = opts.splashImg.bottom;
        isOnlyBottomImg = !fullSplashUrl && btmLogoUrl;


        if (opts.alwaysShow !== true && opts.alwaysShow !== undefined) {
            alwaysShow = false
        } else {
            alwaysShow = true
        }

        _createSpinner(spinnerColor);

        if (!alwaysShow) {
            if (!localStorage.getItem("splash")) {
                localStorage.setItem("splash", true);
            }
        } else {
            if (localStorage.getItem("splash")) {
                localStorage.setItem("splash", false);
            }
        }

        _renderHTML();
    }

    //hide the splash
    function hide() {
        var divWrap = document.getElementById("splash-wrap");
        divWrap.classList.add("hide");
    }

    //render base html code
    function _renderHTML() {
        var fragment = document.createDocumentFragment(),
            divWrap = document.createElement("div"),
            divSplash = document.createElement("div"),
            divSplashBtm = document.createElement("div"),
            skipButton = document.createElement("a"),
            skipButtonDiv = document.createElement("div");

        divWrap.id = "splash-wrap";
        divSplash.className = "splash";
        divSplashBtm.className = "splash-btm";
        _insertAdLink();
        _createCountDown();
        _insertBtmImg();
        _imgLoaded();
        _insertFullSplash();
        if (isOnlyBottomImg) {
            _afterImgLoaded();
        }
        fragment.appendChild(divWrap);
        document.body.appendChild(fragment);
        //if bottom image only
        if (isOnlyBottomImg) {
            setTimeout(function() {
                hide();
            },countdownNum * 1000);
        }
        _afterHide();

        //create countdown
        function _createCountDown() {
            if (isOnlyBottomImg) return;
            skipButtonDiv.appendChild(document.createTextNode(countdownNum + " 跳过"));
            skipButton.appendChild(skipButtonDiv);
            skipButton.className = "splash-skip-btn-outter"
            skipButtonDiv.className = "splash-skip-btn";
            skipButton.addEventListener("click", function(){
                hide();
            }, false);
        }

        //image loaded
        function _imgLoaded() {
            if (!fullSplashUrl) return;
            var img = new Image();
            img.onload = function() {
                _afterImgLoaded();
            }
            img.src = fullSplashUrl;
        }

        //after image loaded
        function _afterImgLoaded() {
            _hideSpinner();
            divWrap.appendChild(skipButton);
            if (fullSplashUrl) {
                _countDownFn(countdownNum);
            }
        }

        //insert bottom image
        function _insertBtmImg() {
            if (btmLogoUrl) {
                var splashBtmImg = document.createElement("img");
                var bottomHeight = _adaptiveBottomHeight();
                splashBtmImg.src = btmLogoUrl;
                _resetBottomHeight(divSplashBtm, bottomHeight);
                window.addEventListener("resize", _resize);

                divSplash.appendChild(divSplashBtm);
                divSplashBtm.appendChild(splashBtmImg);
            }
        }

        //resize functions
        function _resize () {
            var bottomHeight = _adaptiveBottomHeight(),
                splashBtm = document.getElementsByClassName("splash-btm")[0];

            screenWidth = screen.width;
            screenHeight = screen.height;
            _resetBottomHeight(splashBtm, bottomHeight);

            var splashBackground = document.getElementsByClassName("splash-background")[0];
            _resetSplashBackgroundHeight(splashBackground, _calcSplashBackgroundHeight());
        }

        //reset splash background height
        function _resetSplashBackgroundHeight(elem, height) {
            var splashBackgroundHeight = screenHeight - document.getElementsByClassName("splash-btm")[0].offsetHeight,
                splashBackground = document.getElementsByClassName("splash-background")[0];
            splashBackground.style.height = splashBackgroundHeight + "px";
        }

        //reset bottom Height
        function _resetBottomHeight(elem, height) {
            if (screenWidth < 415) {
                elem.style.height = height + "px";
                elem.style.lineHeight = height + "px";
            }
        }

        //adptive height for bottom
        function _adaptiveBottomHeight() {
            var screenWidth2 = screen.width * 2,
                bottomHeight = screenWidth2 / 3.05;
            return Math.ceil(bottomHeight/2);
        }

        //insert full splash
        function _insertFullSplash() {
            if (fullSplashUrl) {
                var divSplashBackground = document.createElement("div"),
                    splashBackgroundHeight = _calcSplashBackgroundHeight();

                //if both full and btm image existed, set the spalsh background height.
                if (btmLogoUrl) {
                    divSplashBackground.style.height = splashBackgroundHeight + 'px';
                } else {
                    divSplashBackground.style.height = "100%";
                }
                divSplashBackground.style.backgroundImage = "url('" + fullSplashUrl +"')";
                divSplashBackground.className = "splash-background";
                divSplash.appendChild(divSplashBackground);
            }
        }

        function _calcSplashBackgroundHeight() {
            if (screenWidth < 415) {
                var bottomHeight = _adaptiveBottomHeight();
            } else {
                var bottomHeight = "105";
            }
            return screenHeight - bottomHeight;
        }

        //insert ad link
        function _insertAdLink() {
            if (splashLink) {
                var a = document.createElement("a");
                a.className = "splash-ad-link";
                a.href = splashLink;
                a.appendChild(divSplash);
                divWrap.appendChild(a);
            } else {
                divWrap.appendChild(divSplash);
            }
        }
    }

    function _whichTransitionEvent(){
        var t;
        var el = document.createElement('fakeelement');
        var transitions = {
          'transition':'transitionend',
          'OTransition':'oTransitionEnd',
          'MozTransition':'transitionend',
          'WebkitTransition':'webkitTransitionEnd'
        }

        for(t in transitions){
            if( el.style[t] !== undefined ){
                return transitions[t];
            }
        }
    }

    //after splash hide
    function _afterHide() {
        var transitionEvent = _whichTransitionEvent();
        var divWrap = document.getElementById("splash-wrap");

        transitionEvent && divWrap.addEventListener(transitionEvent, function() {
            divWrap.style.display = 'none';
        });
    }

    //create spinner loader
    function _createSpinner(color) {
        var fragmentSpinner = document.createDocumentFragment();
            divSpinner = document.createElement("div"),
            divIconSpinner = document.createElement("div");

        divSpinner.className = "splash-spinner";
        divIconSpinner.className = "spinner-icon";
        divIconSpinner.style.borderTopColor = color;
        divIconSpinner.style.borderLeftColor = color;
        divSpinner.appendChild(divIconSpinner);
        fragmentSpinner.appendChild(divSpinner);
        document.body.appendChild(fragmentSpinner);
    }

    function _hideSpinner() {
        var spinnerTransitionEvent =  _whichTransitionEvent(),
            splashSpinner = document.getElementsByClassName("splash-spinner")[0];

        splashSpinner.classList.add("hide");
        spinnerTransitionEvent && splashSpinner.addEventListener(spinnerTransitionEvent, function() {
            document.body.removeChild(splashSpinner);
        });
    }

    //function for countdown
    function _countDownFn(num) {
        var count = num;
            counter = setInterval(_timer, 1000),
            skipButton = document.getElementsByClassName("splash-skip-btn")[0];

        //timer for counterdown
        function _timer() {
            count = count - 1;
            skipButton.innerHTML = count + " 跳过";

            if (count <= 0) {
                clearInterval(counter);
                hide();
                return;
            }
        }
    }

    return {
        init: init,
        hide: hide
    };
})();
