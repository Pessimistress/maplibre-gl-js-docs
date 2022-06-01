(window.webpackJsonp=window.webpackJsonp||[]).push([[41],{"6ORG":function(e,t,r){"use strict";r.r(t),t.default="<div id=\"map\"></div>\n\n<script>\n    var map = new maplibregl.Map({\n        container: 'map',\n        zoom: 0.3,\n        center: [0, 20],\n        style:\n            'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL'\n    });\n\n    map.addControl(new maplibregl.NavigationControl());\n\n    // filters for classifying earthquakes into five categories based on magnitude\n    var mag1 = ['<', ['get', 'mag'], 2];\n    var mag2 = ['all', ['>=', ['get', 'mag'], 2], ['<', ['get', 'mag'], 3]];\n    var mag3 = ['all', ['>=', ['get', 'mag'], 3], ['<', ['get', 'mag'], 4]];\n    var mag4 = ['all', ['>=', ['get', 'mag'], 4], ['<', ['get', 'mag'], 5]];\n    var mag5 = ['>=', ['get', 'mag'], 5];\n\n    // colors to use for the categories\n    var colors = ['#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c'];\n\n    map.on('load', function () {\n        // add a clustered GeoJSON source for a sample set of earthquakes\n        map.addSource('earthquakes', {\n            'type': 'geojson',\n            'data':\n                'https://maplibre.org/maplibre-gl-js-docs/assets/earthquakes.geojson',\n            'cluster': true,\n            'clusterRadius': 80,\n            'clusterProperties': {\n                // keep separate counts for each magnitude category in a cluster\n                'mag1': ['+', ['case', mag1, 1, 0]],\n                'mag2': ['+', ['case', mag2, 1, 0]],\n                'mag3': ['+', ['case', mag3, 1, 0]],\n                'mag4': ['+', ['case', mag4, 1, 0]],\n                'mag5': ['+', ['case', mag5, 1, 0]]\n            }\n        });\n        // circle and symbol layers for rendering individual earthquakes (unclustered points)\n        map.addLayer({\n            'id': 'earthquake_circle',\n            'type': 'circle',\n            'source': 'earthquakes',\n            'filter': ['!=', 'cluster', true],\n            'paint': {\n                'circle-color': [\n                    'case',\n                    mag1,\n                    colors[0],\n                    mag2,\n                    colors[1],\n                    mag3,\n                    colors[2],\n                    mag4,\n                    colors[3],\n                    colors[4]\n                ],\n                'circle-opacity': 0.6,\n                'circle-radius': 12\n            }\n        });\n        map.addLayer({\n            'id': 'earthquake_label',\n            'type': 'symbol',\n            'source': 'earthquakes',\n            'filter': ['!=', 'cluster', true],\n            'layout': {\n                'text-field': [\n                    'number-format',\n                    ['get', 'mag'],\n                    { 'min-fraction-digits': 1, 'max-fraction-digits': 1 }\n                ],\n                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],\n                'text-size': 10\n            },\n            'paint': {\n                'text-color': [\n                    'case',\n                    ['<', ['get', 'mag'], 3],\n                    'black',\n                    'white'\n                ]\n            }\n        });\n\n        // objects for caching and keeping track of HTML marker objects (for performance)\n        var markers = {};\n        var markersOnScreen = {};\n\n        function updateMarkers() {\n            var newMarkers = {};\n            var features = map.querySourceFeatures('earthquakes');\n\n            // for every cluster on the screen, create an HTML marker for it (if we didn't yet),\n            // and add it to the map if it's not there already\n            for (var i = 0; i < features.length; i++) {\n                var coords = features[i].geometry.coordinates;\n                var props = features[i].properties;\n                if (!props.cluster) continue;\n                var id = props.cluster_id;\n\n                var marker = markers[id];\n                if (!marker) {\n                    var el = createDonutChart(props);\n                    marker = markers[id] = new maplibregl.Marker({\n                        element: el\n                    }).setLngLat(coords);\n                }\n                newMarkers[id] = marker;\n\n                if (!markersOnScreen[id]) marker.addTo(map);\n            }\n            // for every marker we've added previously, remove those that are no longer visible\n            for (id in markersOnScreen) {\n                if (!newMarkers[id]) markersOnScreen[id].remove();\n            }\n            markersOnScreen = newMarkers;\n        }\n\n        // after the GeoJSON data is loaded, update markers on the screen and do so on every map move/moveend\n        map.on('data', function (e) {\n            if (e.sourceId !== 'earthquakes' || !e.isSourceLoaded) return;\n\n            map.on('move', updateMarkers);\n            map.on('moveend', updateMarkers);\n            updateMarkers();\n        });\n    });\n\n    // code for creating an SVG donut chart from feature properties\n    function createDonutChart(props) {\n        var offsets = [];\n        var counts = [\n            props.mag1,\n            props.mag2,\n            props.mag3,\n            props.mag4,\n            props.mag5\n        ];\n        var total = 0;\n        for (var i = 0; i < counts.length; i++) {\n            offsets.push(total);\n            total += counts[i];\n        }\n        var fontSize =\n            total >= 1000 ? 22 : total >= 100 ? 20 : total >= 10 ? 18 : 16;\n        var r = total >= 1000 ? 50 : total >= 100 ? 32 : total >= 10 ? 24 : 18;\n        var r0 = Math.round(r * 0.6);\n        var w = r * 2;\n\n        var html =\n            '<div><svg width=\"' +\n            w +\n            '\" height=\"' +\n            w +\n            '\" viewbox=\"0 0 ' +\n            w +\n            ' ' +\n            w +\n            '\" text-anchor=\"middle\" style=\"font: ' +\n            fontSize +\n            'px sans-serif; display: block\">';\n\n        for (i = 0; i < counts.length; i++) {\n            html += donutSegment(\n                offsets[i] / total,\n                (offsets[i] + counts[i]) / total,\n                r,\n                r0,\n                colors[i]\n            );\n        }\n        html +=\n            '<circle cx=\"' +\n            r +\n            '\" cy=\"' +\n            r +\n            '\" r=\"' +\n            r0 +\n            '\" fill=\"white\" /><text dominant-baseline=\"central\" transform=\"translate(' +\n            r +\n            ', ' +\n            r +\n            ')\">' +\n            total.toLocaleString() +\n            '</text></svg></div>';\n\n        var el = document.createElement('div');\n        el.innerHTML = html;\n        return el.firstChild;\n    }\n\n    function donutSegment(start, end, r, r0, color) {\n        if (end - start === 1) end -= 0.00001;\n        var a0 = 2 * Math.PI * (start - 0.25);\n        var a1 = 2 * Math.PI * (end - 0.25);\n        var x0 = Math.cos(a0),\n            y0 = Math.sin(a0);\n        var x1 = Math.cos(a1),\n            y1 = Math.sin(a1);\n        var largeArc = end - start > 0.5 ? 1 : 0;\n\n        return [\n            '<path d=\"M',\n            r + r0 * x0,\n            r + r0 * y0,\n            'L',\n            r + r * x0,\n            r + r * y0,\n            'A',\n            r,\n            r,\n            0,\n            largeArc,\n            1,\n            r + r * x1,\n            r + r * y1,\n            'L',\n            r + r0 * x1,\n            r + r0 * y1,\n            'A',\n            r0,\n            r0,\n            0,\n            largeArc,\n            0,\n            r + r0 * x0,\n            r + r0 * y0,\n            '\" fill=\"' + color + '\" />'\n        ].join(' ');\n    }\n<\/script>\n"},"9dGV":function(e,t,r){"use strict";function n(e){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=s(r("q1tI")),a=(r("yr+R"),r("cQZ0"),s(r("uLm5"))),i=s(r("6ORG")),c=s(r("1wO5"));function s(e){return e&&e.__esModule?e:{default:e}}function u(){return(u=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}).apply(this,arguments)}function l(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function p(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function f(e,t){return(f=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function d(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=y(e);if(t){var o=y(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return m(this,r)}}function m(e,t){if(t&&("object"===n(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}function y(e){return(y=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var h={title:"Display HTML clusters with custom properties",description:"Extend clustering with HTML markers and custom property expressions.",topics:["Layers"],thumbnail:"cluster-html",contentType:"example",layout:"example",hideFeedback:!0,language:["JavaScript"],products:["MapLibre GL JS"],headings:[]},b=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&f(e,t)}(m,e);var t,r,n,s=d(m);function m(){return l(this,m),s.apply(this,arguments)}return t=m,(r=[{key:"render",value:function(){var e=this.props;return o.default.createElement(c.default,u({},e,{frontMatter:h}),o.default.createElement("div",null,o.default.createElement("p",null,"This advanced example uses MapLibre GL JS clustering with HTML markers and custom property expressions. To use HTML or SVG for clusters in place of a MapLibre GL layer, you have to manually synchronize the clustered source with a pool of marker objects that updates continuously while the map view changes."),o.default.createElement(a.default,u({html:i.default},this.props))))}}])&&p(t.prototype,r),n&&p(t,n),Object.defineProperty(t,"prototype",{writable:!1}),m}(o.default.PureComponent);t.default=b},M4Oy:function(e,t,r){"use strict";var n;Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=((n=r("fG8n"))&&n.__esModule?n:{default:n}).default;t.default=o},"jX/3":function(e,t,r){var n=r("9dGV");n=n.default||n,e.exports={component:n,props:{frontMatter:{title:"Display HTML clusters with custom properties",description:"Extend clustering with HTML markers and custom property expressions.",topics:["Layers"],thumbnail:"cluster-html",contentType:"example",layout:"example",hideFeedback:!0,language:["JavaScript"],products:["MapLibre GL JS"],prependJs:["import Example from '../../components/example';","import html from './cluster-html.html';"]}}}},mOgX:function(e,t,r){"use strict";r.r(t);var n=r("f4rJ");r("yr+R");function o(e,t){return t&&t.local,"https://unpkg.com/maplibre-gl@".concat(n.a,"/dist/maplibre-gl.").concat(e)}t.default={js:function(e){return o("js",e)},css:function(e){return o("css",e)}}},uLm5:function(e,t,r){"use strict";r.r(t),r.d(t,"default",(function(){return S}));var n=r("q1tI"),o=r.n(n),a=r("mOgX"),i=r("v8ZZ"),c=r("irdr"),s=r.n(c),u=r("M4Oy"),l=r.n(u),p=r("umIL"),f=r("wdKx");function d(e){return(d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function m(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function y(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?m(Object(r),!0).forEach((function(t){O(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):m(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function h(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function b(e,t){return(b=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function g(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=w(e);if(t){var o=w(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return v(this,r)}}function v(e,t){if(t&&("object"===d(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}function w(e){return(w=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function O(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var j='<meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />',k="\tbody { margin: 0; padding: 0; }\n\t#map { position: absolute; top: 0; bottom: 0; width: 100%; }",S=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&b(e,t)}(u,e);var t,r,n,c=g(u);function u(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,u),(t=c.call(this,e)).state={unsupported:!1},t}return t=u,(r=[{key:"displayHTML",value:function(e){return'<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8" />\n<title>'.concat(this.props.frontMatter.title,"</title>\n").concat(j,'\n<script src="').concat(a.default.js(),'"><\/script>\n<link href="').concat(a.default.css(),'" rel="stylesheet" />\n<style>\n').concat(k,"\n</style>\n</head>\n<body>\n").concat(e,"\n</body>\n</html>")}},{key:"renderHTML",value:function(e){return"<!DOCTYPE html>\n<html>\n<head>\n<meta charset=utf-8 />\n<title>".concat(this.props.frontMatter.title,"</title>\n").concat(j,"\n\n\n<script src='").concat(a.default.js({local:!0}),"'><\/script>\n<link href='").concat(a.default.css({local:!0}),"' rel='stylesheet' />\n<style>\n    ").concat(k,"\n</style>\n</head>\n<body>\n").concat(e,"\n</body>\n</html>")}},{key:"renderSnippet",value:function(){var e=this.props,t=e.html,r=e.location,n=this.displayHTML(t),a=f.extractor(n);return o.a.createElement("div",{className:"bg-white"},o.a.createElement("div",{id:"code",className:"relative"},o.a.createElement(s.a,{code:this.displayHTML(t),highlighter:function(){return p.highlightHtml},edit:{frontMatter:y(y({},this.props.frontMatter),{},{pathname:r.pathname}),head:j,js:a.js,html:a.html,css:a.css,resources:a.resources}})))}},{key:"render",value:function(){var e=this,t=this.props,r=t.frontMatter,n=t.height;return o.a.createElement("div",{className:"prose"},this.state.unsupported&&o.a.createElement(l.a,{title:"Mapbox GL unsupported",theme:"warning"},"Mapbox GL requires"," ",o.a.createElement("a",{className:"link",href:"https://caniuse.com/#feat=webgl"},"WebGL support"),". Please check that you are using a supported browser and that"," ",o.a.createElement("a",{className:"link",href:"https://get.webgl.org/"},"WebGL is enabled"),"."),Object(i.supported)()&&o.a.createElement("iframe",{id:"demo",style:{height:n},className:"w-full mt18",allowFullScreen:!0,mozallowfullscreen:"true",webkitallowfullscreen:"true",ref:function(t){e.iframe=t},title:"".concat(r.title," example")}),this.props.displaySnippet&&this.renderSnippet())}},{key:"componentDidMount",value:function(){if(Object(i.supported)()||this.setState({unsupported:!0}),this.iframe){var e=this.iframe.contentWindow.document;e.open(),e.write(this.renderHTML(this.props.html)),e.close()}}}])&&h(t.prototype,r),n&&h(t,n),Object.defineProperty(t,"prototype",{writable:!1}),u}(o.a.Component);O(S,"defaultProps",{displaySnippet:!0,height:400})},v8ZZ:function(e,t,r){"use strict";function n(e){return!o(e)}function o(e){return"undefined"==typeof window||"undefined"==typeof document?"not a browser":Array.prototype&&Array.prototype.every&&Array.prototype.filter&&Array.prototype.forEach&&Array.prototype.indexOf&&Array.prototype.lastIndexOf&&Array.prototype.map&&Array.prototype.some&&Array.prototype.reduce&&Array.prototype.reduceRight&&Array.isArray?Function.prototype&&Function.prototype.bind?Object.keys&&Object.create&&Object.getPrototypeOf&&Object.getOwnPropertyNames&&Object.isSealed&&Object.isFrozen&&Object.isExtensible&&Object.getOwnPropertyDescriptor&&Object.defineProperty&&Object.defineProperties&&Object.seal&&Object.freeze&&Object.preventExtensions?"JSON"in window&&"parse"in JSON&&"stringify"in JSON?function(){if(!("Worker"in window&&"Blob"in window&&"URL"in window))return!1;var e,t,r=new Blob([""],{type:"text/javascript"}),n=URL.createObjectURL(r);try{t=new Worker(n),e=!0}catch(t){e=!1}t&&t.terminate();return URL.revokeObjectURL(n),e}()?"Uint8ClampedArray"in window?ArrayBuffer.isView?function(){var e=document.createElement("canvas");e.width=e.height=1;var t=e.getContext("2d");if(!t)return!1;var r=t.getImageData(0,0,1,1);return r&&r.width===e.width}()?function(e){void 0===a[e]&&(a[e]=function(e){var t,r=function(e){var t=document.createElement("canvas"),r=Object.create(n.webGLContextAttributes);return r.failIfMajorPerformanceCaveat=e,t.getContext("webgl",r)||t.getContext("experimental-webgl",r)}(e);if(!r)return!1;try{t=r.createShader(r.VERTEX_SHADER)}catch(e){return!1}if(!t||r.isContextLost())return!1;return r.shaderSource(t,"void main() {}"),r.compileShader(t),!0===r.getShaderParameter(t,r.COMPILE_STATUS)}(e));return a[e]}(e&&e.failIfMajorPerformanceCaveat)?document.documentMode?"insufficient ECMAScript 6 support":void 0:"insufficient WebGL support":"insufficient Canvas/getImageData support":"insufficient ArrayBuffer support":"insufficient Uint8ClampedArray support":"insufficient worker support":"insufficient JSON support":"insufficient Object support":"insufficient Function support":"insufficent Array support"}t.supported=n,t.notSupportedReason=o;var a={};n.webGLContextAttributes={antialias:!1,alpha:!0,stencil:!0,depth:!0}},wdKx:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.extractor=function(e){var t="",r={js:[],css:[]},n=/src=("|')([^']*?)("|')/g,o=/href=("|')([^']*?)("|')/g,a=/<script>((.|\n)*)<\/script>/,i=/<style\b[^>]*>([\s\S]*?)<\/style>/g,c=/<body[\s\S]*?>((.|\n)*)<\/body>/,s=e.match(i),u="".concat(e.replace(a,"")),l=e.match(a)[1];s&&(s.forEach((function(e){t+=e.replace(/<[^>]*>/g,"")})),u="".concat(u.replace(i,"")));if(e.match(n)){var p=e.match(n).map((function(e){return e.replace("src=","").replace(/["']/g,"")}));r.js=r.js.concat(p),u="".concat(u.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/g,""))}if(e.match(o)){var f=e.match(o).map((function(e){return e.replace("href=","").replace(/["']/g,"")}));r.css=r.css.concat(f),u="".concat(u.replace(/<link[\s\S]*?>/g,""))}u.match(c)&&(u=u.match(c)[1]);return{html:u,css:t,js:l,resources:r}}}}]);
//# sourceMappingURL=maplibre-gl-js-docs-example-cluster-html-7d1f538f68ad6dbb8bf3.chunk.js.map