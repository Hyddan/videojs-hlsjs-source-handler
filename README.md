# videojs-hlsjs-source-handler

> [Hls.js from Dailymotion](https://github.com/dailymotion/hls.js) Source Handler for [Video.js](https://github.com/videojs/video.js)

## Installation
NPM Package: https://www.npmjs.com/package/videojs-hlsjs-source-handler

```shell
npm install videojs-hlsjs-source-handler --save
```

## Dependencies
This source handler assumes you have the following dependencies already loaded:
* [Video.Js](https://github.com/videojs/video.js)
* [videojs-contrib-hls](https://github.com/videojs/videojs-contrib-hls)
* [videojs-contrib-media-sources](https://github.com/videojs/videojs-contrib-media-sources)
* [Hls.Js](https://github.com/dailymotion/hls.js)


## Api
The source handler will expose two properties on the video.js tech:
* hls - A reference to the current hls.js instance.
* isHlsJs - This property will be defined and have the boolean value `true` when the source handler/hls.js is being used.


## Usage
```js
videojs('video', {
    html5: {
        hlsJs: { // Hls.js options
            debug: true
        }
    }
});
```

## Options
For a full list of possible hls.js options, see [the hls.js documentation](https://github.com/dailymotion/hls.js/blob/master/API.md#fine-tuning).

## Full Example
```html
<!DOCTYPE html>
<html>
    <head>
        <title>videojs-hlsjs-source-handler</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style type="text/css">
            body {
                margin: 0;
                padding: 0;
            }
        </style>
        <link href="//some.domain.com/path/to/video-js.min.css" rel="stylesheet">
        
        <script src="//some.domain.com/path/to/video.min.js" type="text/javascript"></script>
        <script src="//some.domain.com/path/to/videojs-contrib-hls.min.js" type="text/javascript"></script>
        <script src="//some.domain.com/path/to/videojs-contrib-media-sources.min.js" type="text/javascript"></script>
        <script src="//some.domain.com/path/to/hls.min.js" type="text/javascript"></script>
        <script src="//some.domain.com/path/to/videojs-hlsjs-source-handler.min.js" type="text/javascript"></script>
    </head>
    <body>
        <video id="video" class="video-js vjs-default-skin" height="360" width="640" controls>
            <source src="//some.domain.com/path/to/manifest.m3u8" type="application/x-mpegURL"></source>
        </video>
        <script type="text/javascript">
            var player = videojs('video', {
                html5: {
                    hlsJs: {
                        debug: true
                    }
                }
            });
        </script>
    </body>
</html>
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality.

## Release History

 * 2016-10-19   v1.0.4   Updated README with npm installation and examples.
 * 2016-10-17   v1.0.3   Better network error handling.
 * 2016-10-14   v1.0.2   Correct seekable start point for DVR controls.
 * 2016-10-14   v1.0.1   Bugfix in recovery mechanism.
 * 2016-10-13   v1.0.0   Initial version.