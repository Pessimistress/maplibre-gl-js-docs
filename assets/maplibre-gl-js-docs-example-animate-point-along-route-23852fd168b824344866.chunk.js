(window.webpackJsonp=window.webpackJsonp||[]).push([[32],{"0dsY":function(e,t,n){"use strict";n.r(t),t.default="<style>\n    .overlay {\n        position: absolute;\n        top: 10px;\n        left: 10px;\n    }\n\n    .overlay button {\n        font: 600 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;\n        background-color: #3386c0;\n        color: #fff;\n        display: inline-block;\n        margin: 0;\n        padding: 10px 20px;\n        border: none;\n        cursor: pointer;\n        border-radius: 3px;\n    }\n\n    .overlay button:hover {\n        background-color: #4ea0da;\n    }\n</style>\n<script\n    src=\"https://api.tiles.mapbox.com/mapbox.js/plugins/turf/v2.0.0/turf.min.js\"\n    charset=\"utf-8\"\n><\/script>\n\n<div id=\"map\"></div>\n<div class=\"overlay\">\n    <button id=\"replay\">Replay</button>\n</div>\n\n<script>\n    var map = new maplibregl.Map({\n        container: 'map',\n        style:\n            'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL',\n        center: [-96, 37.8],\n        zoom: 3\n    });\n\n    // San Francisco\n    var origin = [-122.414, 37.776];\n\n    // Washington DC\n    var destination = [-77.032, 38.913];\n\n    // A simple line from origin to destination.\n    var route = {\n        'type': 'FeatureCollection',\n        'features': [\n            {\n                'type': 'Feature',\n                'geometry': {\n                    'type': 'LineString',\n                    'coordinates': [origin, destination]\n                }\n            }\n        ]\n    };\n\n    // A single point that animates along the route.\n    // Coordinates are initially set to origin.\n    var point = {\n        'type': 'FeatureCollection',\n        'features': [\n            {\n                'type': 'Feature',\n                'properties': {},\n                'geometry': {\n                    'type': 'Point',\n                    'coordinates': origin\n                }\n            }\n        ]\n    };\n\n    // Calculate the distance in kilometers between route start/end point.\n    var lineDistance = turf.lineDistance(route.features[0], 'kilometers');\n\n    var arc = [];\n\n    // Number of steps to use in the arc and animation, more steps means\n    // a smoother arc and animation, but too many steps will result in a\n    // low frame rate\n    var steps = 500;\n\n    // Draw an arc between the `origin` & `destination` of the two points\n    for (var i = 0; i < lineDistance; i += lineDistance / steps) {\n        var segment = turf.along(route.features[0], i, 'kilometers');\n        arc.push(segment.geometry.coordinates);\n    }\n\n    // Update the route with calculated arc coordinates\n    route.features[0].geometry.coordinates = arc;\n\n    // Used to increment the value of the point measurement against the route.\n    var counter = 0;\n\n    map.on('load', function () {\n        // Add a source and layer displaying a point which will be animated in a circle.\n        map.addSource('route', {\n            'type': 'geojson',\n            'data': route\n        });\n\n        map.addSource('point', {\n            'type': 'geojson',\n            'data': point\n        });\n\n        map.addLayer({\n            'id': 'route',\n            'source': 'route',\n            'type': 'line',\n            'paint': {\n                'line-width': 2,\n                'line-color': '#007cbf'\n            }\n        });\n\n        map.addLayer({\n            'id': 'point',\n            'source': 'point',\n            'type': 'symbol',\n            'layout': {\n                'icon-image': 'airport_15',\n                'icon-rotate': ['get', 'bearing'],\n                'icon-rotation-alignment': 'map',\n                'icon-overlap': 'always',\n                'icon-ignore-placement': true\n            }\n        });\n\n        function animate() {\n            // Update point geometry to a new position based on counter denoting\n            // the index to access the arc.\n            point.features[0].geometry.coordinates =\n                route.features[0].geometry.coordinates[counter];\n\n            // Calculate the bearing to ensure the icon is rotated to match the route arc\n            // The bearing is calculate between the current point and the next point, except\n            // at the end of the arc use the previous point and the current point\n            point.features[0].properties.bearing = turf.bearing(\n                turf.point(\n                    route.features[0].geometry.coordinates[\n                        counter >= steps ? counter - 1 : counter\n                    ]\n                ),\n                turf.point(\n                    route.features[0].geometry.coordinates[\n                        counter >= steps ? counter : counter + 1\n                    ]\n                )\n            );\n\n            // Update the source with this new data.\n            map.getSource('point').setData(point);\n\n            // Request the next frame of animation so long the end has not been reached.\n            if (counter < steps) {\n                requestAnimationFrame(animate);\n            }\n\n            counter = counter + 1;\n        }\n\n        document\n            .getElementById('replay')\n            .addEventListener('click', function () {\n                // Set the coordinates of the original point back to origin\n                point.features[0].geometry.coordinates = origin;\n\n                // Update the source layer\n                map.getSource('point').setData(point);\n\n                // Reset the counter\n                counter = 0;\n\n                // Restart the animation.\n                animate(counter);\n            });\n\n        // Start the animation.\n        animate(counter);\n    });\n<\/script>\n"},Bxe5:function(e,t,n){var r=n("kr/Y");r=r.default||r,e.exports={component:r,props:{frontMatter:{title:"Animate a point along a route",description:"Use Turf to smoothly animate a point along the distance of a line.",topics:["Camera"],thumbnail:"animate-point-along-route",contentType:"example",layout:"example",hideFeedback:!0,language:["JavaScript"],products:["MapLibre GL JS"],prependJs:["import Example from '../../components/example';","import html from './animate-point-along-route.html';"]}}}},M4Oy:function(e,t,n){"use strict";var r;Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=((r=n("fG8n"))&&r.__esModule?r:{default:r}).default;t.default=o},"kr/Y":function(e,t,n){"use strict";function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=u(n("q1tI")),a=(n("yr+R"),n("cQZ0"),u(n("uLm5"))),i=u(n("0dsY")),c=u(n("1wO5"));function u(e){return e&&e.__esModule?e:{default:e}}function s(){return(s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function p(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function f(e,t){return(f=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function d(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=y(e);if(t){var o=y(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return m(this,n)}}function m(e,t){if(t&&("object"===r(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}function y(e){return(y=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var h={title:"Animate a point along a route",description:"Use Turf to smoothly animate a point along the distance of a line.",topics:["Camera"],thumbnail:"animate-point-along-route",contentType:"example",layout:"example",hideFeedback:!0,language:["JavaScript"],products:["MapLibre GL JS"],headings:[]},b=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&f(e,t)}(m,e);var t,n,r,u=d(m);function m(){return p(this,m),u.apply(this,arguments)}return t=m,(n=[{key:"render",value:function(){var e=this.props;return o.default.createElement(c.default,s({},e,{frontMatter:h}),o.default.createElement("div",null,o.default.createElement("p",null,"Use ",o.default.createElement("a",{href:"http://turfjs.org/"},"Turf")," to smoothly animate a point along the distance of a line."),o.default.createElement(a.default,s({html:i.default},this.props))))}}])&&l(t.prototype,n),r&&l(t,r),Object.defineProperty(t,"prototype",{writable:!1}),m}(o.default.PureComponent);t.default=b},mOgX:function(e,t,n){"use strict";n.r(t);var r=n("f4rJ");n("yr+R");function o(e,t){return t&&t.local,"https://unpkg.com/maplibre-gl@".concat(r.a,"/dist/maplibre-gl.").concat(e)}t.default={js:function(e){return o("js",e)},css:function(e){return o("css",e)}}},uLm5:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return x}));var r=n("q1tI"),o=n.n(r),a=n("mOgX"),i=n("v8ZZ"),c=n("irdr"),u=n.n(c),s=n("M4Oy"),p=n.n(s),l=n("umIL"),f=n("wdKx");function d(e){return(d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function m(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function y(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?m(Object(n),!0).forEach((function(t){O(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):m(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function h(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function b(e,t){return(b=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function g(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=w(e);if(t){var o=w(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return v(this,n)}}function v(e,t){if(t&&("object"===d(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}function w(e){return(w=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function O(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var j='<meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />',S="\tbody { margin: 0; padding: 0; }\n\t#map { position: absolute; top: 0; bottom: 0; width: 100%; }",x=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&b(e,t)}(s,e);var t,n,r,c=g(s);function s(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,s),(t=c.call(this,e)).state={unsupported:!1},t}return t=s,(n=[{key:"displayHTML",value:function(e){return'<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8" />\n<title>'.concat(this.props.frontMatter.title,"</title>\n").concat(j,'\n<script src="').concat(a.default.js(),'"><\/script>\n<link href="').concat(a.default.css(),'" rel="stylesheet" />\n<style>\n').concat(S,"\n</style>\n</head>\n<body>\n").concat(e,"\n</body>\n</html>")}},{key:"renderHTML",value:function(e){return"<!DOCTYPE html>\n<html>\n<head>\n<meta charset=utf-8 />\n<title>".concat(this.props.frontMatter.title,"</title>\n").concat(j,"\n\n\n<script src='").concat(a.default.js({local:!0}),"'><\/script>\n<link href='").concat(a.default.css({local:!0}),"' rel='stylesheet' />\n<style>\n    ").concat(S,"\n</style>\n</head>\n<body>\n").concat(e,"\n</body>\n</html>")}},{key:"renderSnippet",value:function(){var e=this.props,t=e.html,n=e.location,r=this.displayHTML(t),a=f.extractor(r);return o.a.createElement("div",{className:"bg-white"},o.a.createElement("div",{id:"code",className:"relative"},o.a.createElement(u.a,{code:this.displayHTML(t),highlighter:function(){return l.highlightHtml},edit:{frontMatter:y(y({},this.props.frontMatter),{},{pathname:n.pathname}),head:j,js:a.js,html:a.html,css:a.css,resources:a.resources}})))}},{key:"render",value:function(){var e=this,t=this.props,n=t.frontMatter,r=t.height;return o.a.createElement("div",{className:"prose"},this.state.unsupported&&o.a.createElement(p.a,{title:"Mapbox GL unsupported",theme:"warning"},"Mapbox GL requires"," ",o.a.createElement("a",{className:"link",href:"https://caniuse.com/#feat=webgl"},"WebGL support"),". Please check that you are using a supported browser and that"," ",o.a.createElement("a",{className:"link",href:"https://get.webgl.org/"},"WebGL is enabled"),"."),Object(i.supported)()&&o.a.createElement("iframe",{id:"demo",style:{height:r},className:"w-full mt18",allowFullScreen:!0,mozallowfullscreen:"true",webkitallowfullscreen:"true",ref:function(t){e.iframe=t},title:"".concat(n.title," example")}),this.props.displaySnippet&&this.renderSnippet())}},{key:"componentDidMount",value:function(){if(Object(i.supported)()||this.setState({unsupported:!0}),this.iframe){var e=this.iframe.contentWindow.document;e.open(),e.write(this.renderHTML(this.props.html)),e.close()}}}])&&h(t.prototype,n),r&&h(t,r),Object.defineProperty(t,"prototype",{writable:!1}),s}(o.a.Component);O(x,"defaultProps",{displaySnippet:!0,height:400})},v8ZZ:function(e,t,n){"use strict";function r(e){return!o(e)}function o(e){return"undefined"==typeof window||"undefined"==typeof document?"not a browser":Array.prototype&&Array.prototype.every&&Array.prototype.filter&&Array.prototype.forEach&&Array.prototype.indexOf&&Array.prototype.lastIndexOf&&Array.prototype.map&&Array.prototype.some&&Array.prototype.reduce&&Array.prototype.reduceRight&&Array.isArray?Function.prototype&&Function.prototype.bind?Object.keys&&Object.create&&Object.getPrototypeOf&&Object.getOwnPropertyNames&&Object.isSealed&&Object.isFrozen&&Object.isExtensible&&Object.getOwnPropertyDescriptor&&Object.defineProperty&&Object.defineProperties&&Object.seal&&Object.freeze&&Object.preventExtensions?"JSON"in window&&"parse"in JSON&&"stringify"in JSON?function(){if(!("Worker"in window&&"Blob"in window&&"URL"in window))return!1;var e,t,n=new Blob([""],{type:"text/javascript"}),r=URL.createObjectURL(n);try{t=new Worker(r),e=!0}catch(t){e=!1}t&&t.terminate();return URL.revokeObjectURL(r),e}()?"Uint8ClampedArray"in window?ArrayBuffer.isView?function(){var e=document.createElement("canvas");e.width=e.height=1;var t=e.getContext("2d");if(!t)return!1;var n=t.getImageData(0,0,1,1);return n&&n.width===e.width}()?function(e){void 0===a[e]&&(a[e]=function(e){var t,n=function(e){var t=document.createElement("canvas"),n=Object.create(r.webGLContextAttributes);return n.failIfMajorPerformanceCaveat=e,t.getContext("webgl",n)||t.getContext("experimental-webgl",n)}(e);if(!n)return!1;try{t=n.createShader(n.VERTEX_SHADER)}catch(e){return!1}if(!t||n.isContextLost())return!1;return n.shaderSource(t,"void main() {}"),n.compileShader(t),!0===n.getShaderParameter(t,n.COMPILE_STATUS)}(e));return a[e]}(e&&e.failIfMajorPerformanceCaveat)?document.documentMode?"insufficient ECMAScript 6 support":void 0:"insufficient WebGL support":"insufficient Canvas/getImageData support":"insufficient ArrayBuffer support":"insufficient Uint8ClampedArray support":"insufficient worker support":"insufficient JSON support":"insufficient Object support":"insufficient Function support":"insufficent Array support"}t.supported=r,t.notSupportedReason=o;var a={};r.webGLContextAttributes={antialias:!1,alpha:!0,stencil:!0,depth:!0}},wdKx:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.extractor=function(e){var t="",n={js:[],css:[]},r=/src=("|')([^']*?)("|')/g,o=/href=("|')([^']*?)("|')/g,a=/<script>((.|\n)*)<\/script>/,i=/<style\b[^>]*>([\s\S]*?)<\/style>/g,c=/<body[\s\S]*?>((.|\n)*)<\/body>/,u=e.match(i),s="".concat(e.replace(a,"")),p=e.match(a)[1];u&&(u.forEach((function(e){t+=e.replace(/<[^>]*>/g,"")})),s="".concat(s.replace(i,"")));if(e.match(r)){var l=e.match(r).map((function(e){return e.replace("src=","").replace(/["']/g,"")}));n.js=n.js.concat(l),s="".concat(s.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/g,""))}if(e.match(o)){var f=e.match(o).map((function(e){return e.replace("href=","").replace(/["']/g,"")}));n.css=n.css.concat(f),s="".concat(s.replace(/<link[\s\S]*?>/g,""))}s.match(c)&&(s=s.match(c)[1]);return{html:s,css:t,js:p,resources:n}}}}]);
//# sourceMappingURL=maplibre-gl-js-docs-example-animate-point-along-route-23852fd168b824344866.chunk.js.map