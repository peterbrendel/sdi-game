/*      TODO
 *  1: Packet ordering (timestamp ??)
 *  2: Send name of winner
 *  3: Fix issues
 */


const readline = require('readline');
const express = require('express');
const socket = require('socket.io');
const reader = require('readline-async');
const random = require('random');
const app = express();

let PORT = 8080;
let io = null;

let teams = new Map();
let admin = null;
let adminName = null;
let server = app.listen(process.env.PORT || PORT, 'localhost', listen); // Heroku PORT env variable PORT or 8080; Testar 80 na sdi-1

function listen() {
	var host = server.address().address;
	var port = server.address().port;
	console.log('host: ' + host + " !");
	console.log('Server listening at http://' + host + ':' + port);
}

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile('index.html');
});

io = socket(server);

if(io != null) {
	// On Connect Event
	io.sockets.on('connection', (socket) => {
		console.log('New connection from ' + socket.id + '!\n');

		socket.emit('getName', null);

		socket.on('getName', (data) => {
			if(adminName != null && admin == null && data.name == adminName){
				admin = socket.id;
				console.log('Admin account detected');
				let sendData = data.name;
				socket.emit('setAdmin', {name: sendData});
			}
			teams.set(socket.id, data.name);
			socket.emit('start', null);
		});
		socket.on('disconnect', () => {
			console.log('Client ' + socket.id + ' disconnected!\n');
			if(!teams.delete(socket.id))
				console.log('Error deleting ' + socket.id + 'user ' + teams.get(socket.id));
		});
		socket.on('count', () => {
			if(socket.id === admin){
				let data = random.int(2,8);
				io.sockets.emit('count', {_:data});
			}else{
				let data = 'You do not have permission to run this!';
				socket.emit('error', data);
			}
		});


	});

	// Instantiate console commands
	console.log('"." to get a list of commands\n');
	reader.addCommands(
		{
			name:'count',
			description: 'Send a random countdown.',
			func: function() {
				let data = random.int(2, 8);
				console.log('Sending a countdown of ' + data + ' seconds');
				io.sockets.emit('count', {_:data});
			}
		},
		{
			name:'setAdmin',
			argNames: ['<string>'],
			description: 'Set admin to run commands from browser',
			func: function(adminNameIn) {
				console.log('Got ' + adminNameIn);
				adminName = adminNameIn;
				teams.forEach((v, k) => {
					console.log('trying ' + k + ' ' + v);
					if(adminName === v){
						admin = k;
						console.log('Setting game admin privilege to user ' + adminNameIn + ' socketId ' + k);
						return;
					}
				});
			}
		}
	);

	reader.onLine( (line) => {

	})

}
