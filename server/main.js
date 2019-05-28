const http = require('http');
const socket = require('socket.io');

let PORT = 8080;
let getPort = 0;
let io = null;


let server = http.createServer( (req, res) => {
	// Server Handling goes here
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Hell-Oh\n');
});


console.log('Starting server...');

try {
	process.argv.forEach( (val, index, arr) => {
		if(val == '-p'){
			getPort = parseInt(process.argv[index+1], 10);
			if(!getPort){
				getPort = 0;
				throw('-p Expects an Integer as a port, received ' + process.argv[index+1]);
			}
			PORT = getPort;
		}
	});

	server.listen(PORT); // Listen on port 80 - HTTP
	io = socket.listen(server);
} catch (e) {
	console.log('\nWARNING: ' + e + '\nUsing default PORT ' + PORT + '\n');
}

console.log('Listening on port ' + PORT + '...');

if(io != null) {
	// On Connect Event
	io.sockets.on('connection', (sock) => {
		console.log('New connection from ' + sock.id + '!\n');
		sock.on('disconnect', () => {
			console.log('Client ' + sock.id + ' disconnected!\n');
		});
	});

	
}
