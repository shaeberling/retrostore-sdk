/** Main RetroStore API class. */
var RetroStore = /** @class */ (function () {
    function RetroStore(url) {
        if (url === void 0) { url = "https://retrostore.org"; }
        this.url = url;
        this.xhr = new XMLHttpRequest();
    }
    /** List RetroStore apps. */
    RetroStore.prototype.listApps = function (start, num, query) {
        if (start < 0) {
            throw new Error("Invalid 'start' value.");
        }
        if (num <= 0) {
            throw new Error("Invalid 'num' value.");
        }
        this.xhr.open('POST', this.url + "/api/listApps", true);
        this.xhr.onload = function (e) {
            var arraybuffer = this.xhr.response;
            console.log('Got response: ' + arraybuffer);
        }.bind({ xhr: this.xhr });
        this.xhr.send("{\"start\":" + start + ",\"num\":" + num + ",\"query\":\"" + query + "\",\"trs80\":{\"mediaTypes\":[]}}");
    };
    return RetroStore;
}());
