import{e as hr}from"./chunk-P2VZOJAX.js";var Er=hr((Ue,He)=>{(function(S,k){typeof Ue=="object"&&typeof He<"u"?He.exports=k():typeof define=="function"&&define.amd?define(k):(S=typeof globalThis<"u"?globalThis:S||self,S.DOMPurify=k())})(Ue,function(){"use strict";function S(r){"@babel/helpers - typeof";return S=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(n){return typeof n}:function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},S(r)}function k(r,n){return k=Object.setPrototypeOf||function(u,c){return u.__proto__=c,u},k(r,n)}function At(){if(typeof Reflect>"u"||!Reflect.construct||Reflect.construct.sham)return!1;if(typeof Proxy=="function")return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch{return!1}}function Q(r,n,o){return At()?Q=Reflect.construct:Q=function(c,R,y){var C=[null];C.push.apply(C,R);var F=Function.bind.apply(c,C),V=new F;return y&&k(V,y.prototype),V},Q.apply(null,arguments)}function L(r){return yt(r)||gt(r)||St(r)||bt()}function yt(r){if(Array.isArray(r))return pe(r)}function gt(r){if(typeof Symbol<"u"&&r[Symbol.iterator]!=null||r["@@iterator"]!=null)return Array.from(r)}function St(r,n){if(r){if(typeof r=="string")return pe(r,n);var o=Object.prototype.toString.call(r).slice(8,-1);if(o==="Object"&&r.constructor&&(o=r.constructor.name),o==="Map"||o==="Set")return Array.from(r);if(o==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o))return pe(r,n)}}function pe(r,n){(n==null||n>r.length)&&(n=r.length);for(var o=0,u=new Array(n);o<n;o++)u[o]=r[o];return u}function bt(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var Ot=Object.hasOwnProperty,ze=Object.setPrototypeOf,Rt=Object.isFrozen,Lt=Object.getPrototypeOf,Mt=Object.getOwnPropertyDescriptor,h=Object.freeze,b=Object.seal,Dt=Object.create,Ge=typeof Reflect<"u"&&Reflect,ee=Ge.apply,me=Ge.construct;ee||(ee=function(n,o,u){return n.apply(o,u)}),h||(h=function(n){return n}),b||(b=function(n){return n}),me||(me=function(n,o){return Q(n,L(o))});var Nt=O(Array.prototype.forEach),We=O(Array.prototype.pop),Y=O(Array.prototype.push),te=O(String.prototype.toLowerCase),de=O(String.prototype.toString),Be=O(String.prototype.match),M=O(String.prototype.replace),Ct=O(String.prototype.indexOf),wt=O(String.prototype.trim),T=O(RegExp.prototype.test),_e=It(TypeError);function O(r){return function(n){for(var o=arguments.length,u=new Array(o>1?o-1:0),c=1;c<o;c++)u[c-1]=arguments[c];return ee(r,n,u)}}function It(r){return function(){for(var n=arguments.length,o=new Array(n),u=0;u<n;u++)o[u]=arguments[u];return me(r,o)}}function s(r,n,o){var u;o=(u=o)!==null&&u!==void 0?u:te,ze&&ze(r,null);for(var c=n.length;c--;){var R=n[c];if(typeof R=="string"){var y=o(R);y!==R&&(Rt(n)||(n[c]=y),R=y)}r[R]=!0}return r}function P(r){var n=Dt(null),o;for(o in r)ee(Ot,r,[o])===!0&&(n[o]=r[o]);return n}function re(r,n){for(;r!==null;){var o=Mt(r,n);if(o){if(o.get)return O(o.get);if(typeof o.value=="function")return O(o.value)}r=Lt(r)}function u(c){return console.warn("fallback value for",c),null}return u}var $e=h(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","section","select","shadow","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),Te=h(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","filter","font","g","glyph","glyphref","hkern","image","line","lineargradient","marker","mask","metadata","mpath","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),ve=h(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),xt=h(["animate","color-profile","cursor","discard","fedropshadow","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),he=h(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover"]),kt=h(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),je=h(["#text"]),Xe=h(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","face","for","headers","height","hidden","high","href","hreflang","id","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","pattern","placeholder","playsinline","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","xmlns","slot"]),Ee=h(["accent-height","accumulate","additive","alignment-baseline","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),Ye=h(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),ae=h(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),Pt=b(/\{\{[\w\W]*|[\w\W]*\}\}/gm),Ft=b(/<%[\w\W]*|[\w\W]*%>/gm),Ut=b(/\${[\w\W]*}/gm),Ht=b(/^data-[\-\w.\u00B7-\uFFFF]/),zt=b(/^aria-[\-\w]+$/),Gt=b(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),Wt=b(/^(?:\w+script|data):/i),Bt=b(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),$t=b(/^html$/i),jt=b(/^[a-z][.\w]*(-[.\w]+)+$/i),Xt=function(){return typeof window>"u"?null:window},Yt=function(n,o){if(S(n)!=="object"||typeof n.createPolicy!="function")return null;var u=null,c="data-tt-policy-suffix";o.currentScript&&o.currentScript.hasAttribute(c)&&(u=o.currentScript.getAttribute(c));var R="dompurify"+(u?"#"+u:"");try{return n.createPolicy(R,{createHTML:function(C){return C},createScriptURL:function(C){return C}})}catch{return console.warn("TrustedTypes policy "+R+" could not be created."),null}};function Ve(){var r=arguments.length>0&&arguments[0]!==void 0?arguments[0]:Xt(),n=function(e){return Ve(e)};if(n.version="2.5.2",n.removed=[],!r||!r.document||r.document.nodeType!==9)return n.isSupported=!1,n;var o=r.document,u=r.document,c=r.DocumentFragment,R=r.HTMLTemplateElement,y=r.Node,C=r.Element,F=r.NodeFilter,V=r.NamedNodeMap,qt=V===void 0?r.NamedNodeMap||r.MozNamedAttrMap:V,Kt=r.HTMLFormElement,Zt=r.DOMParser,ne=r.trustedTypes,ie=C.prototype,Jt=re(ie,"cloneNode"),Qt=re(ie,"nextSibling"),er=re(ie,"childNodes"),q=re(ie,"parentNode");if(typeof R=="function"){var Ae=u.createElement("template");Ae.content&&Ae.content.ownerDocument&&(u=Ae.content.ownerDocument)}var D=Yt(ne,o),ye=D?D.createHTML(""):"",oe=u,ge=oe.implementation,tr=oe.createNodeIterator,rr=oe.createDocumentFragment,ar=oe.getElementsByTagName,nr=o.importNode,qe={};try{qe=P(u).documentMode?u.documentMode:{}}catch{}var w={};n.isSupported=typeof q=="function"&&ge&&ge.createHTMLDocument!==void 0&&qe!==9;var Se=Pt,be=Ft,Oe=Ut,ir=Ht,or=zt,lr=Wt,Ke=Bt,sr=jt,Re=Gt,p=null,Ze=s({},[].concat(L($e),L(Te),L(ve),L(he),L(je))),m=null,Je=s({},[].concat(L(Xe),L(Ee),L(Ye),L(ae))),f=Object.seal(Object.create(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),K=null,Le=null,Qe=!0,Me=!0,et=!1,tt=!0,G=!1,rt=!0,U=!1,De=!1,Ne=!1,W=!1,le=!1,se=!1,at=!0,nt=!1,ur="user-content-",Ce=!0,Z=!1,B={},$=null,it=s({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]),ot=null,lt=s({},["audio","video","img","source","image","track"]),we=null,st=s({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),ue="http://www.w3.org/1998/Math/MathML",fe="http://www.w3.org/2000/svg",I="http://www.w3.org/1999/xhtml",j=I,Ie=!1,xe=null,fr=s({},[ue,fe,I],de),H,cr=["application/xhtml+xml","text/html"],pr="text/html",d,X=null,ut=255,mr=u.createElement("form"),ft=function(e){return e instanceof RegExp||e instanceof Function},ke=function(e){X&&X===e||((!e||S(e)!=="object")&&(e={}),e=P(e),H=cr.indexOf(e.PARSER_MEDIA_TYPE)===-1?H=pr:H=e.PARSER_MEDIA_TYPE,d=H==="application/xhtml+xml"?de:te,p="ALLOWED_TAGS"in e?s({},e.ALLOWED_TAGS,d):Ze,m="ALLOWED_ATTR"in e?s({},e.ALLOWED_ATTR,d):Je,xe="ALLOWED_NAMESPACES"in e?s({},e.ALLOWED_NAMESPACES,de):fr,we="ADD_URI_SAFE_ATTR"in e?s(P(st),e.ADD_URI_SAFE_ATTR,d):st,ot="ADD_DATA_URI_TAGS"in e?s(P(lt),e.ADD_DATA_URI_TAGS,d):lt,$="FORBID_CONTENTS"in e?s({},e.FORBID_CONTENTS,d):it,K="FORBID_TAGS"in e?s({},e.FORBID_TAGS,d):{},Le="FORBID_ATTR"in e?s({},e.FORBID_ATTR,d):{},B="USE_PROFILES"in e?e.USE_PROFILES:!1,Qe=e.ALLOW_ARIA_ATTR!==!1,Me=e.ALLOW_DATA_ATTR!==!1,et=e.ALLOW_UNKNOWN_PROTOCOLS||!1,tt=e.ALLOW_SELF_CLOSE_IN_ATTR!==!1,G=e.SAFE_FOR_TEMPLATES||!1,rt=e.SAFE_FOR_XML!==!1,U=e.WHOLE_DOCUMENT||!1,W=e.RETURN_DOM||!1,le=e.RETURN_DOM_FRAGMENT||!1,se=e.RETURN_TRUSTED_TYPE||!1,Ne=e.FORCE_BODY||!1,at=e.SANITIZE_DOM!==!1,nt=e.SANITIZE_NAMED_PROPS||!1,Ce=e.KEEP_CONTENT!==!1,Z=e.IN_PLACE||!1,Re=e.ALLOWED_URI_REGEXP||Re,j=e.NAMESPACE||I,f=e.CUSTOM_ELEMENT_HANDLING||{},e.CUSTOM_ELEMENT_HANDLING&&ft(e.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(f.tagNameCheck=e.CUSTOM_ELEMENT_HANDLING.tagNameCheck),e.CUSTOM_ELEMENT_HANDLING&&ft(e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(f.attributeNameCheck=e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),e.CUSTOM_ELEMENT_HANDLING&&typeof e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(f.allowCustomizedBuiltInElements=e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),G&&(Me=!1),le&&(W=!0),B&&(p=s({},L(je)),m=[],B.html===!0&&(s(p,$e),s(m,Xe)),B.svg===!0&&(s(p,Te),s(m,Ee),s(m,ae)),B.svgFilters===!0&&(s(p,ve),s(m,Ee),s(m,ae)),B.mathMl===!0&&(s(p,he),s(m,Ye),s(m,ae))),e.ADD_TAGS&&(p===Ze&&(p=P(p)),s(p,e.ADD_TAGS,d)),e.ADD_ATTR&&(m===Je&&(m=P(m)),s(m,e.ADD_ATTR,d)),e.ADD_URI_SAFE_ATTR&&s(we,e.ADD_URI_SAFE_ATTR,d),e.FORBID_CONTENTS&&($===it&&($=P($)),s($,e.FORBID_CONTENTS,d)),Ce&&(p["#text"]=!0),U&&s(p,["html","head","body"]),p.table&&(s(p,["tbody"]),delete K.tbody),h&&h(e),X=e)},ct=s({},["mi","mo","mn","ms","mtext"]),pt=s({},["foreignobject","annotation-xml"]),dr=s({},["title","style","font","a","script"]),ce=s({},Te);s(ce,ve),s(ce,xt);var Pe=s({},he);s(Pe,kt);var _r=function(e){var t=q(e);(!t||!t.tagName)&&(t={namespaceURI:j,tagName:"template"});var a=te(e.tagName),l=te(t.tagName);return xe[e.namespaceURI]?e.namespaceURI===fe?t.namespaceURI===I?a==="svg":t.namespaceURI===ue?a==="svg"&&(l==="annotation-xml"||ct[l]):!!ce[a]:e.namespaceURI===ue?t.namespaceURI===I?a==="math":t.namespaceURI===fe?a==="math"&&pt[l]:!!Pe[a]:e.namespaceURI===I?t.namespaceURI===fe&&!pt[l]||t.namespaceURI===ue&&!ct[l]?!1:!Pe[a]&&(dr[a]||!ce[a]):!!(H==="application/xhtml+xml"&&xe[e.namespaceURI]):!1},g=function(e){Y(n.removed,{element:e});try{e.parentNode.removeChild(e)}catch{try{e.outerHTML=ye}catch{e.remove()}}},Fe=function(e,t){try{Y(n.removed,{attribute:t.getAttributeNode(e),from:t})}catch{Y(n.removed,{attribute:null,from:t})}if(t.removeAttribute(e),e==="is"&&!m[e])if(W||le)try{g(t)}catch{}else try{t.setAttribute(e,"")}catch{}},mt=function(e){var t,a;if(Ne)e="<remove></remove>"+e;else{var l=Be(e,/^[\r\n\t ]+/);a=l&&l[0]}H==="application/xhtml+xml"&&j===I&&(e='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+e+"</body></html>");var E=D?D.createHTML(e):e;if(j===I)try{t=new Zt().parseFromString(E,H)}catch{}if(!t||!t.documentElement){t=ge.createDocument(j,"template",null);try{t.documentElement.innerHTML=Ie?ye:E}catch{}}var v=t.body||t.documentElement;return e&&a&&v.insertBefore(u.createTextNode(a),v.childNodes[0]||null),j===I?ar.call(t,U?"html":"body")[0]:U?t.documentElement:v},dt=function(e){return tr.call(e.ownerDocument||e,e,F.SHOW_ELEMENT|F.SHOW_COMMENT|F.SHOW_TEXT|F.SHOW_PROCESSING_INSTRUCTION|F.SHOW_CDATA_SECTION,null,!1)},Tr=function(e){return e instanceof Kt&&(typeof e.__depth<"u"&&typeof e.__depth!="number"||typeof e.__removalCount<"u"&&typeof e.__removalCount!="number"||typeof e.nodeName!="string"||typeof e.textContent!="string"||typeof e.removeChild!="function"||!(e.attributes instanceof qt)||typeof e.removeAttribute!="function"||typeof e.setAttribute!="function"||typeof e.namespaceURI!="string"||typeof e.insertBefore!="function"||typeof e.hasChildNodes!="function")},J=function(e){return S(y)==="object"?e instanceof y:e&&S(e)==="object"&&typeof e.nodeType=="number"&&typeof e.nodeName=="string"},x=function(e,t,a){w[e]&&Nt(w[e],function(l){l.call(n,t,a,X)})},_t=function(e){var t;if(x("beforeSanitizeElements",e,null),Tr(e)||T(/[\u0080-\uFFFF]/,e.nodeName))return g(e),!0;var a=d(e.nodeName);if(x("uponSanitizeElement",e,{tagName:a,allowedTags:p}),e.hasChildNodes()&&!J(e.firstElementChild)&&(!J(e.content)||!J(e.content.firstElementChild))&&T(/<[/\w]/g,e.innerHTML)&&T(/<[/\w]/g,e.textContent)||a==="select"&&T(/<template/i,e.innerHTML)||e.nodeType===7||rt&&e.nodeType===8&&T(/<[/\w]/g,e.data))return g(e),!0;if(!p[a]||K[a]){if(!K[a]&&vt(a)&&(f.tagNameCheck instanceof RegExp&&T(f.tagNameCheck,a)||f.tagNameCheck instanceof Function&&f.tagNameCheck(a)))return!1;if(Ce&&!$[a]){var l=q(e)||e.parentNode,E=er(e)||e.childNodes;if(E&&l)for(var v=E.length,_=v-1;_>=0;--_){var z=Jt(E[_],!0);z.__removalCount=(e.__removalCount||0)+1,l.insertBefore(z,Qt(e))}}return g(e),!0}return e instanceof C&&!_r(e)||(a==="noscript"||a==="noembed"||a==="noframes")&&T(/<\/no(script|embed|frames)/i,e.innerHTML)?(g(e),!0):(G&&e.nodeType===3&&(t=e.textContent,t=M(t,Se," "),t=M(t,be," "),t=M(t,Oe," "),e.textContent!==t&&(Y(n.removed,{element:e.cloneNode()}),e.textContent=t)),x("afterSanitizeElements",e,null),!1)},Tt=function(e,t,a){if(at&&(t==="id"||t==="name")&&(a in u||a in mr))return!1;if(!(Me&&!Le[t]&&T(ir,t))){if(!(Qe&&T(or,t))){if(!m[t]||Le[t]){if(!(vt(e)&&(f.tagNameCheck instanceof RegExp&&T(f.tagNameCheck,e)||f.tagNameCheck instanceof Function&&f.tagNameCheck(e))&&(f.attributeNameCheck instanceof RegExp&&T(f.attributeNameCheck,t)||f.attributeNameCheck instanceof Function&&f.attributeNameCheck(t))||t==="is"&&f.allowCustomizedBuiltInElements&&(f.tagNameCheck instanceof RegExp&&T(f.tagNameCheck,a)||f.tagNameCheck instanceof Function&&f.tagNameCheck(a))))return!1}else if(!we[t]){if(!T(Re,M(a,Ke,""))){if(!((t==="src"||t==="xlink:href"||t==="href")&&e!=="script"&&Ct(a,"data:")===0&&ot[e])){if(!(et&&!T(lr,M(a,Ke,"")))){if(a)return!1}}}}}}return!0},vt=function(e){return e!=="annotation-xml"&&Be(e,sr)},ht=function(e){var t,a,l,E;x("beforeSanitizeAttributes",e,null);var v=e.attributes;if(v){var _={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:m};for(E=v.length;E--;){t=v[E];var z=t,N=z.name,A=z.namespaceURI;if(a=N==="value"?t.value:wt(t.value),l=d(N),_.attrName=l,_.attrValue=a,_.keepAttr=!0,_.forceKeepAttr=void 0,x("uponSanitizeAttribute",e,_),a=_.attrValue,!_.forceKeepAttr&&(Fe(N,e),!!_.keepAttr)){if(!tt&&T(/\/>/i,a)){Fe(N,e);continue}G&&(a=M(a,Se," "),a=M(a,be," "),a=M(a,Oe," "));var Et=d(e.nodeName);if(Tt(Et,l,a)){if(nt&&(l==="id"||l==="name")&&(Fe(N,e),a=ur+a),D&&S(ne)==="object"&&typeof ne.getAttributeType=="function"&&!A)switch(ne.getAttributeType(Et,l)){case"TrustedHTML":{a=D.createHTML(a);break}case"TrustedScriptURL":{a=D.createScriptURL(a);break}}try{A?e.setAttributeNS(A,N,a):e.setAttribute(N,a),We(n.removed)}catch{}}}}x("afterSanitizeAttributes",e,null)}},vr=function i(e){var t,a=dt(e);for(x("beforeSanitizeShadowDOM",e,null);t=a.nextNode();)if(x("uponSanitizeShadowNode",t,null),!_t(t)){var l=q(t);t.nodeType===1&&(l&&l.__depth?t.__depth=(t.__removalCount||0)+l.__depth+1:t.__depth=1),t.__depth>=ut&&g(t),t.content instanceof c&&(t.content.__depth=t.__depth,i(t.content)),ht(t)}x("afterSanitizeShadowDOM",e,null)};return n.sanitize=function(i){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},t,a,l,E,v;if(Ie=!i,Ie&&(i="<!-->"),typeof i!="string"&&!J(i))if(typeof i.toString=="function"){if(i=i.toString(),typeof i!="string")throw _e("dirty is not a string, aborting")}else throw _e("toString is not a function");if(!n.isSupported){if(S(r.toStaticHTML)==="object"||typeof r.toStaticHTML=="function"){if(typeof i=="string")return r.toStaticHTML(i);if(J(i))return r.toStaticHTML(i.outerHTML)}return i}if(De||ke(e),n.removed=[],typeof i=="string"&&(Z=!1),Z){if(i.nodeName){var _=d(i.nodeName);if(!p[_]||K[_])throw _e("root node is forbidden and cannot be sanitized in-place")}}else if(i instanceof y)t=mt("<!---->"),a=t.ownerDocument.importNode(i,!0),a.nodeType===1&&a.nodeName==="BODY"||a.nodeName==="HTML"?t=a:t.appendChild(a);else{if(!W&&!G&&!U&&i.indexOf("<")===-1)return D&&se?D.createHTML(i):i;if(t=mt(i),!t)return W?null:se?ye:""}t&&Ne&&g(t.firstChild);for(var z=dt(Z?i:t);l=z.nextNode();)if(!(l.nodeType===3&&l===E)&&!_t(l)){var N=q(l);l.nodeType===1&&(N&&N.__depth?l.__depth=(l.__removalCount||0)+N.__depth+1:l.__depth=1),l.__depth>=ut&&g(l),l.content instanceof c&&(l.content.__depth=l.__depth,vr(l.content)),ht(l),E=l}if(E=null,Z)return i;if(W){if(le)for(v=rr.call(t.ownerDocument);t.firstChild;)v.appendChild(t.firstChild);else v=t;return(m.shadowroot||m.shadowrootmod)&&(v=nr.call(o,v,!0)),v}var A=U?t.outerHTML:t.innerHTML;return U&&p["!doctype"]&&t.ownerDocument&&t.ownerDocument.doctype&&t.ownerDocument.doctype.name&&T($t,t.ownerDocument.doctype.name)&&(A="<!DOCTYPE "+t.ownerDocument.doctype.name+`>
`+A),G&&(A=M(A,Se," "),A=M(A,be," "),A=M(A,Oe," ")),D&&se?D.createHTML(A):A},n.setConfig=function(i){ke(i),De=!0},n.clearConfig=function(){X=null,De=!1},n.isValidAttribute=function(i,e,t){X||ke({});var a=d(i),l=d(e);return Tt(a,l,t)},n.addHook=function(i,e){typeof e=="function"&&(w[i]=w[i]||[],Y(w[i],e))},n.removeHook=function(i){if(w[i])return We(w[i])},n.removeHooks=function(i){w[i]&&(w[i]=[])},n.removeAllHooks=function(){w={}},n}var Vt=Ve();return Vt})});export default Er();