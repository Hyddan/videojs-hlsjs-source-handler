(function (window, videojs, Hls) {
    if (!videojs || !Hls || !Hls.isSupported()) return;

    var HlsJsTech = function (source, tech) {
        var _self = this,
            _duration,
            _errorCounts = {},
            _hasFailed = false,
            _video = tech.el(),
            _hlsJs = tech.hls = new Hls(tech.options_.hlsJs || {}),
            _recoverDecodeErrorTime,
            _recoverSwapAudioCodecTime,
            _tryRecoverMediaError = function (error) {
                var _now = Date.now();
                if (!_recoverDecodeErrorTime || 3000 < (_now - _recoverDecodeErrorTime)) {
                    _recoverDecodeErrorTime = _now;
                    _hlsJs.recoverMediaError();
                }
                else if (!_recoverSwapAudioCodecTime || 3000 < (_now - _recoverSwapAudioCodecTime)) {
                    _recoverSwapAudioCodecTime = _now;
                    _hlsJs.swapAudioCodec();
                    _hlsJs.recoverMediaError();
                }
                else {
                    // Could not recover - Bail out
                    if (_hasFailed) {
                        return;
                    }
                    
                    _hasFailed = true;
                    
                    tech.error = function () { return error; };
                    tech.trigger('error');
                }
            },
            _seekableStart = 0;

        _hlsJs.isHlsJs = true;

        _hlsJs.on(Hls.Events.LEVEL_LOADED, function (event, data) {
            _duration = data.details.live ? Infinity : data.details.totalduration;
            _seekableStart = (data.details.fragments && data.details.fragments[0] && data.details.fragments[0].start) || _seekableStart;
        });

        _hlsJs.on(Hls.Events.ERROR, function(event, data) {
            var _fail = function () {
                _hasFailed = true;
                
                tech.error = function () { return data; };
                tech.trigger('error');
            };

            if (!_hasFailed && data.fatal) {
                _errorCounts[data.type] = _errorCounts[data.type] || 0;
                ++_errorCounts[data.type];
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        if (2 < _errorCounts[data.type]) {
                            _fail();

                            return;
                        }

                        _hlsJs.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        _tryRecoverMediaError();
                        break;
                    default:
                        // Bail out
                        _fail();
                        break;
                }
            }
        });

        _hlsJs.attachMedia(_video);
        _hlsJs.loadSource(source.src);

        // Video.Js interface
        _self.dispose = function () {
            _hlsJs.destroy();
        };
        _self.duration = function () {
            return _duration || _video.duration || 0;
        };
        _self.seekable = function () {
            return videojs.createTimeRange(_seekableStart, (_video.seekable.length && _video.seekable.end(0)) || _video.duration);
        };

        return _self;
    };

    videojs.getComponent('Html5').registerSourceHandler({
        canHandleSource: function (source) {
            return /^(audio|video|application)\/(x-|vnd\.apple\.)?mpegurl/i.test(source.type)
                ? 'probably'
                : '';
        },
        handleSource: function (source, tech) {
            return new HlsJsTech(source, tech);
        }
    }, 0);
})(window, window.videojs, window.Hls);