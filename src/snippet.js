/**
 * LOAD ANALYTICS.JS with configured `services` FROM `cdnUrl`.
 *
 * DETAILS
 * This file is the pure script that loads analytics.js from the cdnUrl.
 * It contains placeholders for the parameters `services` and `cdnUrl`,
 * which will be replaced when building/rendering this file (using `lodash.template()`).
 *
 * WHAT DOES THIS FILE DO?
 * It creates a queue for stubbed methods,
 *  which are available BEFORE analytics.js has been full loaded.
 * After analytics.js and its services has been fully loaded,
 *  it forwards events within the cue to the services,
 *  so that no events get lost.
 *
 * SOURCE
 * This file originally comes from https://gist.github.com/typpo/5e2e4403c60314e04e8b6b257555f6de.
 * => see the related blogpost at http://www.ianww.com/blog/2017/08/06/analytics-js-standalone-library/
 */
export function getSnippet () {
  return `
    window.analytics || (window.analytics = {});

    // Create a queue to push events and stub all methods
    window.analytics_queue || (window.analytics_queue = []);
    (function() {
      var methods = ['identify', 'track', 'trackLink', 'trackForm', 'trackClick', 'trackSubmit', 'page', 'pageview', 'ab', 'alias', 'ready', 'group', 'on', 'once', 'off'];
      var factory = function(method) {
        return function () {
          var args = Array.prototype.slice.call(arguments);
          args.unshift(method);
          analytics_queue.push(args);
          return window.analytics;
        };
      };
      for (var i = 0; i < methods.length; i++) {
        var method = methods[i];
        window.analytics[method] = factory(method);
      }
    })();

    // Load analytics.js after everything else
    analytics.load = function(callback) {
      var script = document.createElement('script');
      script.async = true;
      script.type = 'text/javascript';
      script.src = '<%= cdnUrl %>';  // NOTE: is replaced when building (via lodash.template())
      if (script.addEventListener) {
        script.addEventListener('load', function(e) {
          if (typeof callback === 'function') {
            callback(e);
          }
        }, false);
      } else {  // IE8
        script.onreadystatechange = function () {
          if (this.readyState == 'complete' || this.readyState == 'loaded') {
            callback(window.event);
          }
        };
      }
      var firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode.insertBefore(script, firstScript);
    };

    analytics.load(function() {
      analytics.initialize(<%= services %>);  // NOTE: is replaced when building (via lodash.template())
      // Loop through the interim analytics queue and reapply the calls to their
      // proper analytics.js method.
      while (window.analytics_queue.length > 0) {
        var item = window.analytics_queue.shift();
        var method = item.shift();
        if (analytics[method]) analytics[method].apply(analytics, item);
      }
    });
  `
}
