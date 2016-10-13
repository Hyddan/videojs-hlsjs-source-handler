(function (window, videojs, Hls) {
    if (!videojs || !Hls || !Hls.isSupported()) return;

	var HlsJsTech = function (source, tech) {
		var _self = this,
				_options = tech.options_,
				_duration,
				_video = tech.el(),
				_hlsJs = tech.hls = new Hls(_options.hlsJs || {}),
				_recoverDecodeErrorTime,
				_recoverSwapAudioCodecTime,
				_tryRecoverMediaError = function (error) {
					var _now = Date.now();
                    if (!_recoverDecodeErrorTime || 3000 < (now - _recoverDecodeErrorTime)) {
                        _recoverDecodeErrorTime = now;
                        _hlsJs.recoverMediaError();
                    }
					else if (!_recoverSwapAudioCodecTime || 3000 < (now - _recoverSwapAudioCodecTime)) {
                        _recoverSwapAudioCodecTime = now;
                        _hlsJs.swapAudioCodec();
                        _hlsJs.recoverMediaError();
                    }
					else {
                        // Could not recover - Bail out
						tech.error = function () { return error; };
						tech.trigger('error');
                    }
				};
		
		_hlsJs.isHlsJs = true;
		
		_hlsJs.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
            _duration = data.details.live ? Infinity : data.details.totalduration;
        });
		
		_hlsJs.on(Hls.Events.LEVEL_LOADED, function (event, data) {
            _duration = data.details.live ? Infinity : data.details.totalduration;
        });
		
		_hlsJs.on(Hls.Events.ERROR, function(event, data) {
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        _hlsJs.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        _tryRecoverMediaError();
                        break;
                    default:
                        // Bail out
						tech.error = function () { return data; };
						tech.trigger('error');
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