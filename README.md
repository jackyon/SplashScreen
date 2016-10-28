<h1>SplashScreen</h1>
> Create splash screen for mobiles
![alt tag](http://i.imgur.com/77Dultq.gif)
![alt tag](http://i.imgur.com/7x3e6Hb.gif)

<h2>Initialization</h2>
Include splash.min.js and splash.min.css in your target html file.
```
<head>
<link rel="stylesheet" href="dist/splash.min.css">
</head>
<body>
    <script type="text/javascript" src="splash.min.js"></script>
    var opts = {
        countdown: 3,
        splashLink: "www.google.com",
        splashImg: {
            full: "banner.jpg",
            bottom: "splash-btm.png"
        }
    };

    splash.init(opts);
</body>
```

<h2>Advanced usage</h2>
```
var opts = {
    alwaysShow: true,
    countdown: 3, 
    loading: {
        color: "#4ecdc4"
    },
    splashLink: "url",
    splashImg: {
        full: "image url",
        bottom: "image url"
    }
} 
```

<h2>Options</h2>
- `alwaysShow`: (default `true`) enable always show the splash screen or not. if set to false, it will only show on the first time.

- `countdown`: (default `"3"`) the countdown for waiting entering to the application.

- `loading.color`: (default `"#4ecdc4"`) the color of the spinner loader.

- `splashLink` (optional): add url for splash screen.

- `splashImg` :
there are three options:
1. only show the full screen image.
- full image size: 750*1334 (psd: <a href="http://s000.tinyupload.com/?file_id=58977320733006594611">download here</a>)
```
splashImg: {
    full: "image url"
}
```

2. only show the bottom logo image.
```
splashImg: {
    bottom: "image url"
}
```

3. show both full screen image and bottom logo image.
- full image size: 750*1088 (psd: <a href="http://s000.tinyupload.com/?file_id=00997650305977833453">download here</a>)
```
splashImg: {
    full: "image url",
    bottom: "image url"
}
```



