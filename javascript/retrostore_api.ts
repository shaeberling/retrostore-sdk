/** Main RetroStore API class. */
class RetroStore {
   constructor(private url: string = "https://retrostore.org"){}

   xhr = new XMLHttpRequest();

   /** List RetroStore apps. */
   listApps(start: number, num: number, query: string) {
     if (start < 0) {
       throw new Error("Invalid 'start' value.");
     }
     if (num <= 0) {
       throw new Error("Invalid 'num' value.");
     }

     this.xhr.open('POST', `${this.url}/api/listApps`, true);
     this.xhr.onload = function (e) {
        var arraybuffer = this.xhr.response;
        console.log('Got response: ' + arraybuffer)
     }.bind({xhr: this.xhr})
     this.xhr.send(`{"start":${start},"num":${num},"query":"${query}","trs80":{"mediaTypes":[]}}`)
   }
}