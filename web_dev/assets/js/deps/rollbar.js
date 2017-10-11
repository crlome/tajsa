var _rollbarConfig = {
    accessToken: "86c1337e3268471d9c608adf661040a1",
    // captureUncaught: true,
    payload: {
        //environment: "production"
        environment: "qa"
        //environment: "qa-prod"
    }
};

! function(r) {
    function e(n) {
        if (t[n]) return t[n].exports;
        var o = t[n] = {
            exports: {},
            id: n,
            loaded: !1
        };
        return r[n].call(o.exports, o, o.exports, e), o.loaded = !0, o.exports
    }
    var t = {};
    return e.m = r, e.c = t, e.p = "", e(0)
}([function(r, e, t) {
    "use strict";

    function n() {
        var r = "undefined" == typeof JSON ? {} : JSON,
            e = t(8),
            n = {};
        e(n), r = n, o.setupJSON(r)
    }
    var o = t(1),
        i = t(2);
    n();
    var a = window._rollbarConfig,
        s = a && a.globalAlias || "Rollbar",
        u = window[s] && "undefined" != typeof window[s].shimId;
    !u && a ? o.wrapper.init(a) : (window.Rollbar = o.wrapper, window.RollbarNotifier = i.Notifier), r.exports = o.wrapper
}, function(r, e, t) {
    "use strict";

    function n(r) {
        a.setupJSON(r)
    }

    function o(r, e, t) {
        !t[4] && window._rollbarWrappedError && (t[4] = window._rollbarWrappedError, window._rollbarWrappedError = null), r.uncaughtError.apply(r, t), e && e.apply(window, t)
    }

    function i(r, e) {
        if (e.hasOwnProperty && e.hasOwnProperty("addEventListener")) {
            var t = e.addEventListener;
            e.addEventListener = function(e, n, o) {
                t.call(this, e, r.wrap(n), o)
            };
            var n = e.removeEventListener;
            e.removeEventListener = function(r, e, t) {
                n.call(this, r, e && e._wrapped || e, t)
            }
        }
    }
    var a = t(2),
        s = a.Notifier;
    window._rollbarWrappedError = null;
    var u = {};
    u.init = function(r, e) {
        var t = new s(e);
        if (t.configure(r), r.captureUncaught) {
            var n;
            n = e && "undefined" != typeof e._rollbarOldOnError ? e._rollbarOldOnError : window.onerror, window.onerror = function() {
                var r = Array.prototype.slice.call(arguments, 0);
                o(t, n, r)
            };
            var a, u, c = ["EventTarget", "Window", "Node", "ApplicationCache", "AudioTrackList", "ChannelMergerNode", "CryptoOperation", "EventSource", "FileReader", "HTMLUnknownElement", "IDBDatabase", "IDBRequest", "IDBTransaction", "KeyOperation", "MediaController", "MessagePort", "ModalWindow", "Notification", "SVGElementInstance", "Screen", "TextTrack", "TextTrackCue", "TextTrackList", "WebSocket", "WebSocketWorker", "Worker", "XMLHttpRequest", "XMLHttpRequestEventTarget", "XMLHttpRequestUpload"];
            for (a = 0; a < c.length; ++a) u = c[a], window[u] && window[u].prototype && i(t, window[u].prototype)
        }
        return window.Rollbar = t, s.processPayloads(), t
    }, r.exports = {
        wrapper: u,
        setupJSON: n
    }
}, function(r, e, t) {
    "use strict";

    function n(r) {
        h = r, g.setupJSON(r)
    }

    function o() {
        return y
    }

    function i(r) {
        y = y || this;
        var e = i.DEFAULT_ENDPOINT;
        this.options = {
            enabled: !0,
            endpoint: e,
            environment: "production",
            scrubFields: f.copy(i.DEFAULT_SCRUB_FIELDS),
            checkIgnore: null,
            logLevel: i.DEFAULT_LOG_LEVEL,
            reportLevel: i.DEFAULT_REPORT_LEVEL,
            uncaughtErrorLevel: i.DEFAULT_UNCAUGHT_ERROR_LEVEL,
            payload: {}
        }, this.lastError = null, this.plugins = {}, this.parentNotifier = r, this.logger = function() {
            var r = window.console;
            if (r && "function" == typeof r.log) {
                var e = ["Rollbar:"].concat(Array.prototype.slice.call(arguments, 0)).join(" ");
                r.log.apply(r, [e])
            }
        }, r && (r.hasOwnProperty("shimId") ? r.notifier = this : (this.logger = r.logger, this.configure(r.options)))
    }

    function a(r, e) {
        return function() {
            var t = e || this;
            try {
                return r.apply(t, arguments)
            } catch (n) {
                t && t.logger(n)
            }
        }
    }

    function s(r) {
        if (!r) return ["Unknown error. There was no error message to display.", ""];
        var e = r.match(m),
            t = "(unknown)";
        return e && (t = e[e.length - 1], r = r.replace((e[e.length - 2] || "") + t + ":", ""), r = r.replace(/(^[\s]+|[\s]+$)/g, "")), [t, r]
    }

    function u() {
        v || (v = setTimeout(c, 1e3))
    }

    function c() {
        var r;
        try {
            for (; r = window._rollbarPayloadQueue.shift();) l(r.endpointUrl, r.accessToken, r.payload, r.callback)
        } finally {
            v = void 0
        }
    }

    function l(r, e, t, n) {
        n = n || function() {};
        var o = (new Date).getTime();
        o - w >= 6e4 && (w = o, _ = 0);
        var i = window._globalRollbarOptions.maxItems,
            a = window._globalRollbarOptions.itemsPerMinute,
            s = function() {
                return !t.ignoreRateLimit && i >= 1 && b >= i
            },
            u = function() {
                return !t.ignoreRateLimit && a >= 1 && _ >= a
            };
        return s() ? void n(new Error(i + " max items reached")) : u() ? void n(new Error(a + " items per minute reached")) : (b++, _++, s() && y._log(y.options.uncaughtErrorLevel, "maxItems has been hit. Ignoring errors for the remainder of the current page load.", null, {
            maxItems: i
        }, null, !1, !0), t.ignoreRateLimit && delete t.ignoreRateLimit, void d.post(r, e, t, function(r, e) {
            return r ? n(r) : n(null, e)
        }))
    }
    var p = t(3),
        f = t(6),
        g = t(7),
        d = g.XHR,
        h = null;
    i.NOTIFIER_VERSION = "1.0.0", i.DEFAULT_ENDPOINT = "http://127.0.0.1:1337/sniper/shot", i.DEFAULT_SCRUB_FIELDS = ["pw", "pass", "passwd", "password", "secret", "confirm_password", "confirmPassword", "password_confirmation", "passwordConfirmation", "access_token", "accessToken", "secret_key", "secretKey", "secretToken"], i.DEFAULT_LOG_LEVEL = "debug", i.DEFAULT_REPORT_LEVEL = "debug", i.DEFAULT_UNCAUGHT_ERROR_LEVEL = "warning", i.DEFAULT_ITEMS_PER_MIN = 60, i.DEFAULT_MAX_ITEMS = 0, i.LEVELS = {
        debug: 0,
        info: 1,
        warning: 2,
        error: 3,
        critical: 4
    }, window._rollbarPayloadQueue = [], window._globalRollbarOptions = {
        startTime: (new Date).getTime(),
        maxItems: i.DEFAULT_MAX_ITEMS,
        itemsPerMinute: i.DEFAULT_ITEMS_PER_MIN
    };
    var y;
    i._generateLogFn = function(r) {
        return a(function() {
            var e = this._getLogArgs(arguments);
            return this._log(r || e.level || this.options.logLevel || i.DEFAULT_LOG_LEVEL, e.message, e.err, e.custom, e.callback)
        })
    }, i.prototype._getLogArgs = function(r) {
        for (var e, t, n, o, s, u, c, l = this.options.logLevel || i.DEFAULT_LOG_LEVEL, p = 0; p < r.length; ++p) c = r[p], u = typeof c, "string" === u ? t = c : "function" === u ? s = a(c, this) : c && "object" === u && ("Date" === c.constructor.name ? e = c : c instanceof Error || c.prototype === Error.prototype || c.hasOwnProperty("stack") || "undefined" != typeof DOMException && c instanceof DOMException ? n = c : o = c);
        return {
            level: l,
            message: t,
            err: n,
            custom: o,
            callback: s
        }
    }, i.prototype._route = function(r) {
        var e = this.options.endpoint,
            t = /\/$/.test(e),
            n = /^\//.test(r);
        return t && n ? r = r.substring(1) : t || n || (r = "/" + r), e + r
    }, i.prototype._processShimQueue = function(r) {
        for (var e, t, n, o, a, s, u, c = {}; t = r.shift();) e = t.shim, n = t.method, o = t.args, a = e.parentShim, u = c[e.shimId], u || (a ? (s = c[a.shimId], u = new i(s)) : u = this, c[e.shimId] = u), u[n] && "function" == typeof u[n] && u[n].apply(u, o)
    }, i.prototype._buildPayload = function(r, e, t, n, o) {
        var a = this.options.accessToken,
            s = this.options.environment,
            u = f.copy(this.options.payload),
            c = f.uuid4();
        if (void 0 === i.LEVELS[e]) throw new Error("Invalid level");
        if (!t && !n && !o) throw new Error("No message, stack info or custom data");
        var l = {
            environment: s,
            endpoint: this.options.endpoint,
            uuid: c,
            level: e,
            platform: "browser",
            framework: "browser-js",
            language: "javascript",
            body: this._buildBody(t, n, o),
            request: {
                url: window.location.href,
                query_string: window.location.search,
                user_ip: "$remote_ip"
            },
            client: {
                runtime_ms: r.getTime() - window._globalRollbarOptions.startTime,
                timestamp: Math.round(r.getTime() / 1e3),
                javascript: {
                    browser: window.navigator.userAgent,
                    language: window.navigator.language,
                    cookie_enabled: window.navigator.cookieEnabled,
                    screen: {
                        width: window.screen.width,
                        height: window.screen.height
                    },
                    plugins: this._getBrowserPlugins()
                }
            },
            server: {},
            notifier: {
                name: "rollbar-browser-js",
                version: i.NOTIFIER_VERSION
            }
        };
        u.body && delete u.body;
        var p = {
            access_token: a,
            data: f.merge(l, u)
        };
        return this._scrub(p.data), p
    }, i.prototype._buildBody = function(r, e, t) {
        var n;
        return n = e ? this._buildPayloadBodyTrace(r, e, t) : this._buildPayloadBodyMessage(r, t)
    }, i.prototype._buildPayloadBodyMessage = function(r, e) {
        r || (r = e ? h.stringify(e) : "");
        var t = {
            body: r
        };
        return e && (t.extra = f.copy(e)), {
            message: t
        }
    }, i.prototype._buildPayloadBodyTrace = function(r, e, t) {
        var n = s(e.message),
            o = e.name || n[0],
            i = n[1],
            a = {
                exception: {
                    "class": o,
                    message: i
                }
            };
        if (r && (a.exception.description = r || "uncaught exception"), e.stack) {
            var u, c, l, p, g, d, h, y;
            for (a.frames = [], h = 0; h < e.stack.length; ++h) u = e.stack[h], c = {
                filename: u.url ? f.sanitizeUrl(u.url) : "(unknown)",
                lineno: u.line || null,
                method: u.func && "?" !== u.func ? u.func : "[anonymous]",
                colno: u.column
            }, l = p = g = null, d = u.context ? u.context.length : 0, d && (y = Math.floor(d / 2), p = u.context.slice(0, y), l = u.context[y], g = u.context.slice(y)), l && (c.code = l), (p || g) && (c.context = {}, p && p.length && (c.context.pre = p), g && g.length && (c.context.post = g)), u.args && (c.args = u.args), a.frames.push(c);
            return a.frames.reverse(), t && (a.extra = f.copy(t)), {
                trace: a
            }
        }
        return this._buildPayloadBodyMessage(o + ": " + i, t)
    }, i.prototype._getBrowserPlugins = function() {
        if (!this._browserPlugins) {
            var r, e, t = window.navigator.plugins || [],
                n = t.length,
                o = [];
            for (e = 0; n > e; ++e) r = t[e], o.push({
                name: r.name,
                description: r.description
            });
            this._browserPlugins = o
        }
        return this._browserPlugins
    }, i.prototype._scrub = function(r) {
        function e(r, e, t, n, o, i, a, s) {
            return e + f.redact(i)
        }

        function t(r) {
            var t;
            if ("string" == typeof r)
                for (t = 0; t < s.length; ++t) r = r.replace(s[t], e);
            return r
        }

        function n(r, e) {
            var t;
            for (t = 0; t < a.length; ++t)
                if (a[t].test(r)) {
                    e = f.redact(e);
                    break
                }
            return e
        }

        function o(r, e) {
            var o = n(r, e);
            return o === e ? t(o) : o
        }
        var i = this.options.scrubFields,
            a = this._getScrubFieldRegexs(i),
            s = this._getScrubQueryParamRegexs(i);
        return f.traverse(r, o), r
    }, i.prototype._getScrubFieldRegexs = function(r) {
        for (var e, t = [], n = 0; n < r.length; ++n) e = "\\[?(%5[bB])?" + r[n] + "\\[?(%5[bB])?\\]?(%5[dD])?", t.push(new RegExp(e, "i"));
        return t
    }, i.prototype._getScrubQueryParamRegexs = function(r) {
        for (var e, t = [], n = 0; n < r.length; ++n) e = "\\[?(%5[bB])?" + r[n] + "\\[?(%5[bB])?\\]?(%5[dD])?", t.push(new RegExp("(" + e + "=)([^&\\n]+)", "igm"));
        return t
    }, i.prototype._urlIsWhitelisted = function(r) {
        var e, t, n, o, i, a, s, u, c, l;
        try {
            if (e = this.options.hostWhiteList, t = r.data.body.trace, !e || 0 === e.length) return !0;
            if (!t) return !0;
            for (s = e.length, i = t.frames.length, c = 0; i > c; c++) {
                if (n = t.frames[c], o = n.filename, "string" != typeof o) return !0;
                for (l = 0; s > l; l++)
                    if (a = e[l], u = new RegExp(a), u.test(o)) return !0
            }
        } catch (p) {
            return this.configure({
                hostWhiteList: null
            }), this.error("Error while reading your configuration's hostWhiteList option. Removing custom hostWhiteList.", p), !0
        }
        return !1
    }, i.prototype._messageIsIgnored = function(r) {
        var e, t, n, o, i, a, s;
        try {
            if (i = !1, n = this.options.ignoredMessages, s = r.data.body.trace, !n || 0 === n.length) return !1;
            if (!s) return !1;
            for (e = s.exception.message, o = n.length, t = 0; o > t && (a = new RegExp(n[t], "gi"), !(i = a.test(e))); t++);
        } catch (u) {
            this.configure({
                ignoredMessages: null
            }), this.error("Error while reading your configuration's ignoredMessages option. Removing custom ignoredMessages.")
        }
        return i
    }, i.prototype._enqueuePayload = function(r, e, t, n) {
        var o = {
                callback: n,
                accessToken: this.options.accessToken,
                endpointUrl: this._route("bullet/"),
                payload: r
            },
            i = function() {
                if (n) {
                    var r = "This item was not sent to Rollbar because it was ignored. This can happen if a custom checkIgnore() function was used or if the item's level was less than the notifier' reportLevel. See https://rollbar.com/docs/notifier/rollbar.js/configuration for more details.";
                    n(null, {
                        err: 0,
                        result: {
                            id: null,
                            uuid: null,
                            message: r
                        }
                    })
                }
            };
        if (this._internalCheckIgnore(e, t, r)) return void i();
        try {
            if (this.options.checkIgnore && "function" == typeof this.options.checkIgnore && this.options.checkIgnore(e, t, r)) return void i()
        } catch (a) {
            this.configure({
                checkIgnore: null
            }), this.error("Error while calling custom checkIgnore() function. Removing custom checkIgnore().", a)
        }
        if (this._urlIsWhitelisted(r) && !this._messageIsIgnored(r)) {
            if (this.options.verbose) {
                if (r.data && r.data.body && r.data.body.trace) {
                    var s = r.data.body.trace,
                        c = s.exception.message;
                    this.logger(c)
                }
                this.logger("Sending payload -", o)
            }
            "function" == typeof this.options.logFunction && this.options.logFunction(o);
            try {
                "function" == typeof this.options.transform && this.options.transform(r)
            } catch (a) {
                this.configure({
                    transform: null
                }), this.error("Error while calling custom transform() function. Removing custom transform().", a)
            }
            this.options.enabled && (window._rollbarPayloadQueue.push(o), u())
        }
    }, i.prototype._internalCheckIgnore = function(r, e, t) {
        var n = e[0],
            o = i.LEVELS[n] || 0,
            a = i.LEVELS[this.options.reportLevel] || 0;
        if (a > o) return !0;
        var s = this.options ? this.options.plugins : {};
        return s && s.jquery && s.jquery.ignoreAjaxErrors && t.body.message ? t.body.messagejquery_ajax_error : !1
    }, i.prototype._log = function(r, e, t, n, o, i, a) {
        var s = null;
        if (t) {
            if (s = t._savedStackTrace ? t._savedStackTrace : p.parse(t), t === this.lastError) return;
            this.lastError = t
        }
        var u = this._buildPayload(new Date, r, e, s, n);
        a && (u.ignoreRateLimit = !0), this._enqueuePayload(u, i ? !0 : !1, [r, e, t, n], o)
    }, i.prototype.log = i._generateLogFn(), i.prototype.debug = i._generateLogFn("debug"), i.prototype.info = i._generateLogFn("info"), i.prototype.warn = i._generateLogFn("warning"), i.prototype.warning = i._generateLogFn("warning"), i.prototype.error = i._generateLogFn("error"), i.prototype.critical = i._generateLogFn("critical"), i.prototype.uncaughtError = a(function(r, e, t, n, o, i) {
        if (i = i || null, o && o.stack) return void this._log(this.options.uncaughtErrorLevel, r, o, i, null, !0);
        if (e && e.stack) return void this._log(this.options.uncaughtErrorLevel, r, e, i, null, !0);
        var a = {
            url: e || "",
            line: t
        };
        a.func = p.guessFunctionName(a.url, a.line), a.context = p.gatherContext(a.url, a.line);
        var s = {
            mode: "onerror",
            message: r || "uncaught exception",
            url: document.location.href,
            stack: [a],
            useragent: navigator.userAgent
        };
        o && (s = o._savedStackTrace || p.parse(o));
        var u = this._buildPayload(new Date, this.options.uncaughtErrorLevel, r, s);
        this._enqueuePayload(u, !0, [this.options.uncaughtErrorLevel, r, e, t, n, o])
    }), i.prototype.global = a(function(r) {
        r = r || {}, f.merge(window._globalRollbarOptions, r), void 0 !== r.maxItems && (b = 0), void 0 !== r.itemsPerMinute && (_ = 0)
    }), i.prototype.configure = a(function(r) {
        f.merge(this.options, r), this.global(r)
    }), i.prototype.scope = a(function(r) {
        var e = new i(this);
        return f.merge(e.options.payload, r), e
    }), i.prototype.wrap = function(r, e) {
        try {
            var t;
            if (t = "function" == typeof e ? e : function() {
                    return e || {}
                }, "function" != typeof r) return r;
            if (r._isWrap) return r;
            if (!r._wrapped) {
                r._wrapped = function() {
                    try {
                        return r.apply(this, arguments)
                    } catch (e) {
                        throw e.stack || (e._savedStackTrace = p.parse(e)), e._rollbarContext = t() || {}, e._rollbarContext._wrappedSource = r.toString(), window._rollbarWrappedError = e, e
                    }
                }, r._wrapped._isWrap = !0;
                for (var n in r) r.hasOwnProperty(n) && (r._wrapped[n] = r[n])
            }
            return r._wrapped
        } catch (o) {
            return r
        }
    };
    var v, m = new RegExp("^(([a-zA-Z0-9-_$ ]*): *)?(Uncaught )?([a-zA-Z0-9-_$ ]*): ");
    i.processPayloads = function(r) {
        return r ? void c() : void u()
    };
    var w = (new Date).getTime(),
        b = 0,
        _ = 0;
    r.exports = {
        Notifier: i,
        setupJSON: n,
        topLevelNotifier: o
    }
}, function(r, e, t) {
    "use strict";

    function n(r, e) {
        return c
    }

    function o(r, e) {
        return null
    }

    function i(r) {
        var e = {};
        return e._stackFrame = r, e.url = r.fileName, e.line = r.lineNumber, e.func = r.functionName, e.column = r.columnNumber, e.args = r.args, e.context = o(e.url, e.line), e
    }

    function a(r) {
        function e() {
            var e = [];
            try {
                e = u.parse(r)
            } catch (t) {
                e = []
            }
            for (var n = [], o = 0; o < e.length; o++) n.push(new i(e[o]));
            return n
        }
        return {
            stack: e(),
            message: r.message,
            name: r.name
        }
    }

    function s(r) {
        return new a(r)
    }
    var u = t(4),
        c = "?";
    r.exports = {
        guessFunctionName: n,
        gatherContext: o,
        parse: s,
        Stack: a,
        Frame: i
    }
}, function(r, e, t) {
    var n, o, i;
    ! function(a, s) {
        "use strict";
        o = [t(5)], n = s, i = "function" == typeof n ? n.apply(e, o) : n, !(void 0 !== i && (r.exports = i))
    }(this, function(r) {
        "use strict";
        var e, t, n = /\S+\:\d+/,
            o = /\s+at /;
        return e = Array.prototype.map ? function(r, e) {
            return r.map(e)
        } : function(r, e) {
            var t, n = r.length,
                o = [];
            for (t = 0; n > t; ++t) o.push(e(r[t]));
            return o
        }, t = Array.prototype.filter ? function(r, e) {
            return r.filter(e)
        } : function(r, e) {
            var t, n = r.length,
                o = [];
            for (t = 0; n > t; ++t) e(r[t]) && o.push(r[t]);
            return o
        }, {
            parse: function(r) {
                if ("undefined" != typeof r.stacktrace || "undefined" != typeof r["opera#sourceloc"]) return this.parseOpera(r);
                if (r.stack && r.stack.match(o)) return this.parseV8OrIE(r);
                if (r.stack && r.stack.match(n)) return this.parseFFOrSafari(r);
                throw new Error("Cannot parse given Error object")
            },
            extractLocation: function(r) {
                if (-1 === r.indexOf(":")) return [r];
                var e = r.replace(/[\(\)\s]/g, "").split(":"),
                    t = e.pop(),
                    n = e[e.length - 1];
                if (!isNaN(parseFloat(n)) && isFinite(n)) {
                    var o = e.pop();
                    return [e.join(":"), o, t]
                }
                return [e.join(":"), t, void 0]
            },
            parseV8OrIE: function(t) {
                var n = this.extractLocation,
                    o = e(t.stack.split("\n").slice(1), function(e) {
                        var t = e.replace(/^\s+/, "").split(/\s+/).slice(1),
                            o = n(t.pop()),
                            i = t[0] && "Anonymous" !== t[0] ? t[0] : void 0;
                        return new r(i, void 0, o[0], o[1], o[2])
                    });
                return o
            },
            parseFFOrSafari: function(o) {
                var i = t(o.stack.split("\n"), function(r) {
                        return !!r.match(n)
                    }),
                    a = this.extractLocation,
                    s = e(i, function(e) {
                        var t = e.split("@"),
                            n = a(t.pop()),
                            o = t.shift() || void 0;
                        return new r(o, void 0, n[0], n[1], n[2])
                    });
                return s
            },
            parseOpera: function(r) {
                return !r.stacktrace || r.message.indexOf("\n") > -1 && r.message.split("\n").length > r.stacktrace.split("\n").length ? this.parseOpera9(r) : r.stack ? this.parseOpera11(r) : this.parseOpera10(r)
            },
            parseOpera9: function(e) {
                for (var t = /Line (\d+).*script (?:in )?(\S+)/i, n = e.message.split("\n"), o = [], i = 2, a = n.length; a > i; i += 2) {
                    var s = t.exec(n[i]);
                    s && o.push(new r(void 0, void 0, s[2], s[1]))
                }
                return o
            },
            parseOpera10: function(e) {
                for (var t = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i, n = e.stacktrace.split("\n"), o = [], i = 0, a = n.length; a > i; i += 2) {
                    var s = t.exec(n[i]);
                    s && o.push(new r(s[3] || void 0, void 0, s[2], s[1]))
                }
                return o
            },
            parseOpera11: function(o) {
                var i = t(o.stack.split("\n"), function(r) {
                        return !!r.match(n) && !r.match(/^Error created at/)
                    }),
                    a = this.extractLocation,
                    s = e(i, function(e) {
                        var t, n = e.split("@"),
                            o = a(n.pop()),
                            i = n.shift() || "",
                            s = i.replace(/<anonymous function(: (\w+))?>/, "$2").replace(/\([^\)]*\)/g, "") || void 0;
                        i.match(/\(([^\)]*)\)/) && (t = i.replace(/^[^\(]+\(([^\)]*)\)$/, "$1"));
                        var u = void 0 === t || "[arguments not available]" === t ? void 0 : t.split(",");
                        return new r(s, u, o[0], o[1], o[2])
                    });
                return s
            }
        }
    })
}, function(r, e, t) {
    var n, o, i;
    ! function(t, a) {
        "use strict";
        o = [], n = a, i = "function" == typeof n ? n.apply(e, o) : n, !(void 0 !== i && (r.exports = i))
    }(this, function() {
        "use strict";

        function r(r) {
            return !isNaN(parseFloat(r)) && isFinite(r)
        }

        function e(r, e, t, n, o) {
            void 0 !== r && this.setFunctionName(r), void 0 !== e && this.setArgs(e), void 0 !== t && this.setFileName(t), void 0 !== n && this.setLineNumber(n), void 0 !== o && this.setColumnNumber(o)
        }
        return e.prototype = {
            getFunctionName: function() {
                return this.functionName
            },
            setFunctionName: function(r) {
                this.functionName = String(r)
            },
            getArgs: function() {
                return this.args
            },
            setArgs: function(r) {
                if ("[object Array]" !== Object.prototype.toString.call(r)) throw new TypeError("Args must be an Array");
                this.args = r
            },
            getFileName: function() {
                return this.fileName
            },
            setFileName: function(r) {
                this.fileName = String(r)
            },
            getLineNumber: function() {
                return this.lineNumber
            },
            setLineNumber: function(e) {
                if (!r(e)) throw new TypeError("Line Number must be a Number");
                this.lineNumber = Number(e)
            },
            getColumnNumber: function() {
                return this.columnNumber
            },
            setColumnNumber: function(e) {
                if (!r(e)) throw new TypeError("Column Number must be a Number");
                this.columnNumber = Number(e)
            },
            toString: function() {
                var e = this.getFunctionName() || "{anonymous}",
                    t = "(" + (this.getArgs() || []).join(",") + ")",
                    n = this.getFileName() ? "@" + this.getFileName() : "",
                    o = r(this.getLineNumber()) ? ":" + this.getLineNumber() : "",
                    i = r(this.getColumnNumber()) ? ":" + this.getColumnNumber() : "";
                return e + t + n + o + i
            }
        }, e
    })
}, function(r, e) {
    "use strict";
    var t = {
        merge: function() {
            var r, e, n, o, i, a, s = arguments[0] || {},
                u = 1,
                c = arguments.length,
                l = !0;
            for ("object" != typeof s && "function" != typeof s && (s = {}); c > u; u++)
                if (null !== (r = arguments[u]))
                    for (e in r) r.hasOwnProperty(e) && (n = s[e], o = r[e], s !== o && (l && o && (o.constructor === Object || (i = o.constructor === Array)) ? (i ? (i = !1, a = []) : a = n && n.constructor === Object ? n : {}, s[e] = t.merge(a, o)) : void 0 !== o && (s[e] = o)));
            return s
        },
        copy: function(r) {
            var e;
            return "object" == typeof r && (r.constructor === Object ? e = {} : r.constructor === Array && (e = [])), t.merge(e, r), e
        },
        parseUriOptions: {
            strictMode: !1,
            key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
            q: {
                name: "queryKey",
                parser: /(?:^|&)([^&=]*)=?([^&]*)/g
            },
            parser: {
                strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
            }
        },
        parseUri: function(r) {
            if (!r || "string" != typeof r && !(r instanceof String)) throw new Error("Util.parseUri() received invalid input");
            for (var e = t.parseUriOptions, n = e.parser[e.strictMode ? "strict" : "loose"].exec(r), o = {}, i = 14; i--;) o[e.key[i]] = n[i] || "";
            return o[e.q.name] = {}, o[e.key[12]].replace(e.q.parser, function(r, t, n) {
                t && (o[e.q.name][t] = n)
            }), o
        },
        sanitizeUrl: function(r) {
            if (!r || "string" != typeof r && !(r instanceof String)) throw new Error("Util.sanitizeUrl() received invalid input");
            var e = t.parseUri(r);
            return "" === e.anchor && (e.source = e.source.replace("#", "")), r = e.source.replace("?" + e.query, "")
        },
        traverse: function(r, e) {
            var n, o, i, a = "object" == typeof r,
                s = [];
            if (a)
                if (r.constructor === Object)
                    for (n in r) r.hasOwnProperty(n) && s.push(n);
                else if (r.constructor === Array)
                for (i = 0; i < r.length; ++i) s.push(i);
            for (i = 0; i < s.length; ++i) n = s[i], o = r[n], a = "object" == typeof o, a ? null === o ? r[n] = e(n, o) : o.constructor === Object ? r[n] = t.traverse(o, e) : o.constructor === Array ? r[n] = t.traverse(o, e) : r[n] = e(n, o) : r[n] = e(n, o);
            return r
        },
        redact: function(r) {
            return r = String(r), new Array(r.length + 1).join("*")
        },
        uuid4: function() {
            var r = (new Date).getTime(),
                e = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(e) {
                    var t = (r + 16 * Math.random()) % 16 | 0;
                    return r = Math.floor(r / 16), ("x" === e ? t : 7 & t | 8).toString(16)
                });
            return e
        }
    };
    r.exports = t
}, function(r, e) {
    "use strict";

    function t(r) {
        n = r
    }
    var n = null,
        o = {
            XMLHttpFactories: [function() {
                return new XMLHttpRequest
            }, function() {
                return new ActiveXObject("Msxml2.XMLHTTP")
            }, function() {
                return new ActiveXObject("Msxml3.XMLHTTP")
            }, function() {
                return new ActiveXObject("Microsoft.XMLHTTP")
            }],
            createXMLHTTPObject: function() {
                var r, e = !1,
                    t = o.XMLHttpFactories,
                    n = t.length;
                for (r = 0; n > r; r++) try {
                    e = t[r]();
                    break
                } catch (i) {}
                return e
            },
            post: function(r, e, t, i) {
                if ("object" != typeof t) throw new Error("Expected an object to POST");
                t = n.stringify(t), i = i || function() {};
                var a = o.createXMLHTTPObject();
                if (a) try {
                    try {
                        var s = function(r) {
                            try {
                                s && 4 === a.readyState && (s = void 0, 200 === a.status ? i(null, n.parse(a.responseText)) : i("number" == typeof a.status && a.status >= 400 && a.status < 600 ? new Error(a.status.toString()) : new Error))
                            } catch (e) {
                                var t;
                                t = "object" == typeof e && e.stack ? e : new Error(e), i(t)
                            }
                        };

                        a.open("POST", r, !0), a.setRequestHeader && (a.setRequestHeader("Content-Type", "application/json"), a.setRequestHeader("X-ArmySniper-Access-Token", e)), a.onreadystatechange = s, a.send(t)
                    } catch (u) {
                        if ("undefined" != typeof XDomainRequest) {
                            var c = function(r) {
                                    i(new Error)
                                },
                                l = function(r) {
                                    i(new Error)
                                },
                                p = function(r) {
                                    i(null, n.parse(a.responseText))
                                };
                            a = new XDomainRequest, a.onprogress = function() {}, a.ontimeout = c, a.onerror = l, a.onload = p, a.open("POST", r, !0), a.send(t)
                        }
                    }
                } catch (f) {
                    i(f)
                }
            }
        };
    r.exports = {
        XHR: o,
        setupJSON: t
    }
}, function(module, exports) {
    var setupCustomJSON = function(JSON) {
        function f(r) {
            return 10 > r ? "0" + r : r
        }

        function quote(r) {
            return escapable.lastIndex = 0, escapable.test(r) ? '"' + r.replace(escapable, function(r) {
                var e = meta[r];
                return "string" == typeof e ? e : "\\u" + ("0000" + r.charCodeAt(0).toString(16)).slice(-4)
            }) + '"' : '"' + r + '"'
        }

        function str(r, e) {
            var t, n, o, i, a, s = gap,
                u = e[r];
            switch ("function" == typeof rep && (u = rep.call(e, r, u)), typeof u) {
                case "string":
                    return quote(u);
                case "number":
                    return isFinite(u) ? String(u) : "null";
                case "boolean":
                case "null":
                    return String(u);
                case "object":
                    if (!u) return "null";
                    if (gap += indent, a = [], "[object Array]" === Object.prototype.toString.apply(u)) {
                        for (i = u.length, t = 0; i > t; t += 1) a[t] = str(t, u) || "null";
                        return o = 0 === a.length ? "[]" : gap ? "[\n" + gap + a.join(",\n" + gap) + "\n" + s + "]" : "[" + a.join(",") + "]", gap = s, o
                    }
                    if (rep && "object" == typeof rep)
                        for (i = rep.length, t = 0; i > t; t += 1) "string" == typeof rep[t] && (n = rep[t], o = str(n, u), o && a.push(quote(n) + (gap ? ": " : ":") + o));
                    else
                        for (n in u) Object.prototype.hasOwnProperty.call(u, n) && (o = str(n, u), o && a.push(quote(n) + (gap ? ": " : ":") + o));
                    return o = 0 === a.length ? "{}" : gap ? "{\n" + gap + a.join(",\n" + gap) + "\n" + s + "}" : "{" + a.join(",") + "}", gap = s, o
            }
        }
        "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function() {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
        }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
            return this.valueOf()
        });
        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            gap, indent, meta = {
                "\b": "\\b",
                "   ": "\\t",
                "\n": "\\n",
                "\f": "\\f",
                "\r": "\\r",
                '"': '\\"',
                "\\": "\\\\"
            },
            rep;
        "function" != typeof JSON.stringify && (JSON.stringify = function(r, e, t) {
            var n;
            if (gap = "", indent = "", "number" == typeof t)
                for (n = 0; t > n; n += 1) indent += " ";
            else "string" == typeof t && (indent = t);
            if (rep = e, e && "function" != typeof e && ("object" != typeof e || "number" != typeof e.length)) throw new Error("JSON.stringify");
            return str("", {
                "": r
            })
        }), "function" != typeof JSON.parse && (JSON.parse = function(text, reviver) {
            function walk(r, e) {
                var t, n, o = r[e];
                if (o && "object" == typeof o)
                    for (t in o) Object.prototype.hasOwnProperty.call(o, t) && (n = walk(o, t), void 0 !== n ? o[t] = n : delete o[t]);
                return reviver.call(r, e, o)
            }
            var j;
            if (text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function(r) {
                    return "\\u" + ("0000" + r.charCodeAt(0).toString(16)).slice(-4)
                })), /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({
                "": j
            }, "") : j;
            throw new SyntaxError("JSON.parse")
        })
    };
    module.exports = setupCustomJSON
}]);