var http = require("http");

timeToReload = false

http.createServer(function (req, res) {
    res.writeHead(200, {"Content-Type": "text/plain"});
    if (timeToReload) {
        res.end("1");
        console.log("Reloading...");
        timeToReload = false
    } else {
        res.end("0")
    }
}).listen(1337, "127.0.0.1");

// Listen for "r" key
var stdin = process.openStdin();
stdin.on("data", function(chunk) {
    if (chunk.toString() == "r\n") {
        timeToReload = true
    }
});
