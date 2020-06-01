(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@vue/composition-api')) :
  typeof define === 'function' && define.amd ? define(['exports', '@vue/composition-api'], factory) :
  (global = global || self, factory(global.SimpleAlert = {}, global.compositionApi));
}(this, (function (exports, compositionApi) { 'use strict';

  var script = compositionApi.defineComponent({
    name: 'FileInput',
    props: {
      isImage: {
        type: Boolean,
        default: false
      },
      isPdf: {
        type: Boolean,
        default: false
      },
      isWord: {
        type: Boolean,
        default: false
      },
      isExcel: {
        type: Boolean,
        default: false
      },
      isVideo: {
        type: Boolean,
        default: false
      },
      isAudio: {
        type: Boolean,
        default: false
      },
      buttonBackgroundColor: {
        type: String,
        default: function default$1() {
          return '#003e70'
        }
      },
      buttonTextColor: {
        type: String,
        default: function default$2() {
          return '#FFF'
        }
      },
      placeholderInputText: {
        type: String,
        default: function () { return 'Select a file'; }
      },
      placeholderButtonText: {
        type: String,
        default: function () { return 'Select a file'; }
      }
    },
    setup: function setup (props, context) {
      var FileName = compositionApi.ref(props.placeholderInputText);

      var acceptType = compositionApi.computed(function () {
        if (props.isExcel) {
          return '.xlsx, .xls'
        } else if (props.isWord) {
          return '.doc, .docx'
        } else if (props.isImage) {
          return 'image/*'
        } else if (props.isVideo) {
          return 'video/*'
        } else if (props.isPdf) {
          return 'application/pdf'
        } else if (props.isAudio) {
          return 'audio/*'
        } else {
          return '*'
        }
      });

      var buttonStyle = compositionApi.computed(function () {
        return ("background-color: " + (props.buttonBackgroundColor) + "; color: " + (props.buttonTextColor) + ";")
      });

      var emitFileChange = function () {
        var files = context.refs.file.files;

        if (files.length === 0) {
          context.emit('input', null);
          FileName.value = props.placeholderInputText;
          return null
        }

        FileName.value = files[0].name;
        var FileBlob = new Blob([files[0]], {
          name: FileName.value,
          type: files[0].type
        });

        context.emit('input', {
          file: files[0],
          fileName: FileName.value,
          fileBlob: URL.createObjectURL(FileBlob),
          fileType: files[0].type
        });
      };

      return {
        acceptType: acceptType,
        FileName: FileName,
        emitFileChange: emitFileChange,
        buttonStyle: buttonStyle
      }
    }
  });

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
  /* server only */
  , shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
      createInjectorSSR = createInjector;
      createInjector = shadowMode;
      shadowMode = false;
    } // Vue.extend constructor export interop.


    var options = typeof script === 'function' ? script.options : script; // render functions

    if (template && template.render) {
      options.render = template.render;
      options.staticRenderFns = template.staticRenderFns;
      options._compiled = true; // functional template

      if (isFunctionalTemplate) {
        options.functional = true;
      }
    } // scopedId


    if (scopeId) {
      options._scopeId = scopeId;
    }

    var hook;

    if (moduleIdentifier) {
      // server build
      hook = function hook(context) {
        // 2.3 injection
        context = context || // cached call
        this.$vnode && this.$vnode.ssrContext || // stateful
        this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
        // 2.2 with runInNewContext: true

        if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
          context = __VUE_SSR_CONTEXT__;
        } // inject component styles


        if (style) {
          style.call(this, createInjectorSSR(context));
        } // register component module identifier for async chunk inference


        if (context && context._registeredComponents) {
          context._registeredComponents.add(moduleIdentifier);
        }
      }; // used by ssr in case component is cached and beforeCreate
      // never gets called


      options._ssrRegister = hook;
    } else if (style) {
      hook = shadowMode ? function () {
        style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
      } : function (context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook) {
      if (options.functional) {
        // register for functional component in vue file
        var originalRender = options.render;

        options.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = options.beforeCreate;
        options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }

    return script;
  }

  var normalizeComponent_1 = normalizeComponent;

  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  function createInjector(context) {
    return function (id, style) {
      return addStyle(id, style);
    };
  }
  var HEAD = document.head || document.getElementsByTagName('head')[0];
  var styles = {};

  function addStyle(id, css) {
    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: new Set(),
      styles: []
    });

    if (!style.ids.has(id)) {
      style.ids.add(id);
      var code = css.source;

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (!style.element) {
        style.element = document.createElement('style');
        style.element.type = 'text/css';
        if (css.media) { style.element.setAttribute('media', css.media); }
        HEAD.appendChild(style.element);
      }

      if ('styleSheet' in style.element) {
        style.styles.push(code);
        style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
      } else {
        var index = style.ids.size - 1;
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) { style.element.removeChild(nodes[index]); }
        if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }else { style.element.appendChild(textNode); }
      }
    }
  }

  var browser = createInjector;

  /* script */
  var __vue_script__ = script;

  /* template */
  var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('div',{staticClass:"FileInput--text-input-wrapper"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.FileName),expression:"FileName"}],staticClass:"form-control",attrs:{"type":"text","readonly":""},domProps:{"value":(_vm.FileName)},on:{"input":function($event){if($event.target.composing){ return; }_vm.FileName=$event.target.value;}}})]),_vm._v(" "),_c('div',{staticClass:"FileInput--file-input-wrapper"},[_c('label',{staticClass:"custom-file-upload",style:(_vm.buttonStyle)},[_c('input',{directives:[{name:"show",rawName:"v-show",value:(false),expression:"false"}],ref:"file",staticClass:"file",attrs:{"type":"file","accept":_vm.acceptType},on:{"change":_vm.emitFileChange}}),_vm._v("\n      "+_vm._s(_vm.placeholderButtonText)+"\n    ")])])])};
  var __vue_staticRenderFns__ = [];

    /* style */
    var __vue_inject_styles__ = function (inject) {
      if (!inject) { return }
      inject("data-v-0bdf5912_0", { source: ".FileInput--text-input-wrapper[data-v-0bdf5912]{float:left;width:60%}.FileInput--text-input-wrapper>.form-control[data-v-0bdf5912]{background-color:#fff;width:100%;display:block;height:28px;border-width:1px}.FileInput--file-input-wrapper[data-v-0bdf5912]{float:left;width:40%}.FileInput--file-input-wrapper>.custom-file-upload[data-v-0bdf5912]{border:1px solid #ccc;width:100%;line-height:inherit;text-align:center;display:inline-block;padding:6px 12px;cursor:pointer;transition:all ease .2s}.FileInput--file-input-wrapper>.custom-file-upload>.file[data-v-0bdf5912]{display:none!important}.file[data-v-0bdf5912]{display:none!important}.FileInput--file-input-wrapper>.custom-file-upload[data-v-0bdf5912]::hover{background-color:lighten(#003e70,5%);box-shadow:0 14px 26px -12px rgba(156,39,176,.42),0 4px 23px 0 rgba(0,0,0,.12),0 8px 10px -5px rgba(156,39,176,.2)}@media(min-width:768px){.FileInput--text-input-wrapper[data-v-0bdf5912]{width:70%}.FileInput--file-input-wrapper[data-v-0bdf5912]{width:30%}}@media(min-width:992px){.FileInput--text-input-wrapper[data-v-0bdf5912]{width:80%}.FileInput--file-input-wrapper[data-v-0bdf5912]{width:20%}}", map: undefined, media: undefined });

    };
    /* scoped */
    var __vue_scope_id__ = "data-v-0bdf5912";
    /* module identifier */
    var __vue_module_identifier__ = undefined;
    /* functional template */
    var __vue_is_functional_template__ = false;
    /* style inject SSR */
    

    
    var SimpleFileInput = normalizeComponent_1(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      browser,
      undefined
    );

  function install (Vue) {
    if (install.installed) { return }
    install.installed = true;
    Vue.component('SimpleFileInput', SimpleFileInput);
  }

  var plugin = {
    install: install
  };

  var GlobalVue = null;
  if (typeof window !== 'undefined') {
    GlobalVue = window.Vue;
  } else if (typeof global !== 'undefined') {
    GlobalVue = global.vue;
  }

  if (GlobalVue) {
    GlobalVue.use(plugin);
  }

  SimpleFileInput.install = install;

  exports.default = SimpleFileInput;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
