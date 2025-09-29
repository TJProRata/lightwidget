/**
 * LightWidget Async Loader
 * This is the tiny script that customers embed on their websites
 * It asynchronously loads the full widget bundle
 */
(function(w,d,s,o,f){
  // Create namespace
  w['LightWidget'] = o;

  // Create stub function to queue calls
  w[o] = w[o] || function(){
    (w[o].q = w[o].q || []).push(arguments);
  };

  // Mark load time
  w[o].l = 1 * new Date();

  // Create script element
  var js = d.createElement(s);
  js.async = 1;
  js.src = f;

  // Insert script before first script tag
  var fjs = d.getElementsByTagName(s)[0];
  fjs.parentNode.insertBefore(js, fjs);

})(window, document, 'script', 'lightWidget', 'https://lightwidget.vercel.app/widget.js');

// Auto-init if config is present
if (window.LightWidgetConfig) {
  lightWidget('init', window.LightWidgetConfig);
}