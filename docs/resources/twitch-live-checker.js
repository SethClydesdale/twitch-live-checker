// helper function for checking if a user is live on Twitch or not
(function (window, document) {
  'use strict';
  window.TwitchLiveChecker = {
    
    // gets a user from Twitch to check if they're live or not
    // name: the name of the channel you want to check the status of (e.g. 'sethc95' from www.twitch.tv/sethc95)
    // callback(status): the action to be performed when the status is received
    //                   status in the callback param and returns either 'offline' or 'online'
    // example: TwitchLiveChecker.getUser('sethc95', function (status) { alert(status) });
    getUser : function (name, callback) {
      if (typeof Twitch === 'undefined') {
        return TwitchLiveChecker.getAPI(name ? name : null, callback ? callback : null);
      }
      
      // remove duplicate frames
      var old = document.getElementById("TwitchLiveChecker_stream-" + name);
      if (old) {
        old.parentNode.removeChild(old);
      }
      
      var options = {
        width: 300,
        height: 300,
        channel: name,
        muted: true,
        autoplay: false,
        parent: [window.location.host]
      },
      stream = document.createElement('DIV');
      
      stream.id = 'TwitchLiveChecker_stream-' + name;
      stream.style.display = 'none';
      document.body.appendChild(stream);
      
      var player = new Twitch.Player("TwitchLiveChecker_stream-" + name, options);

      // offline
      player.addEventListener(Twitch.Player.OFFLINE, function () {
        stream.querySelector('iframe').src = 'about:blank';
        document.body.removeChild(stream);
        
        callback && callback('offline');
      });

      // online
      player.addEventListener(Twitch.Player.ONLINE, function () {
        stream.querySelector('iframe').src = 'about:blank';
        document.body.removeChild(stream);
        
        callback && callback('online');
      });
    },
    
    // gets the Twitch embed API if not already loaded
    getAPI : function (name, callback) {
      var script = document.createElement('SCRIPT');
      script.src = 'https://player.twitch.tv/js/embed/v1.js';
      script.async = true;
      
      if (name || callback) {
        script.onload = function () {
          TwitchLiveChecker.getUser(name ? name : null, callback ? callback : null);
        }
      }

      document.head.appendChild(script);
    }
    
  };
}(window, document));