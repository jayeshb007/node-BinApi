const binance = require('node-binance-api')().options({
	APIKEY: 'xnvO4VLDRHoFXUO5Tu73NzLo6v8dyR5jQBqaGefzkcELCqBHVqLdrrvdSqfopkB9',
	APISECRET: '4zWEneMNNuSfaTNOZ0QtPxPr7IjRbdvc8HAkvWVZa3MHt9CAWhMmrAdyyivDZHyd',
	useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
	test: true // If you want to use sandbox mode where orders are simulated
});

var mysql = require("mysql");
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendfile('index.html');
	//res.sendfile('/login/');
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "users"
});


io.on('connection', function (socket) {

    console.log('a client connected');
	
	// // Periods: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
	// binance.websockets.candlesticks(['BNBBTC'], "1m", (candlesticks) => {
		// let { e:eventType, E:eventTime, s:symbol, k:ticks } = candlesticks;
		// let { o:open, h:high, l:low, c:close, v:volume, n:trades, i:interval, x:isFinal, q:quoteVolume, V:buyVolume, Q:quoteBuyVolume } = ticks;
		// // console.log(symbol+" "+interval+" candlestick update");
		// // console.log("open: "+open);
		// // console.log("high: "+high);
		// // console.log("low: "+low);
		// // console.log("close: "+close);
		// // console.log("volume: "+volume);
		// // console.log("isFinal: "+isFinal);
		
		// con.query('INSERT INTO candlestick (open, close, high, low) VALUES ( ' + open + ', ' + close + ', ' + high + ', ' + low + ')',function(err,rows){
			// if(err) throw err;
			// console.log("1 record inserted");
		// }); 
		
	// });
	
	// binance.websockets.trades(['BNBBTC'], (trades) => {
		// let {e:eventType, E:eventTime, s:symbol, p:price, q:quantity, m:maker, a:tradeId} = trades;
		
		// console.log(symbol+" trade update. price: "+price+", quantity: "+quantity+", maker: "+maker+", eventType: "+eventType);
		
		
	// });
	
	
	
	binance.websockets.trades(['BNBBTC','POLYBTC'], (trades) => {
		let {e:eventType, E:eventTime, s:symbol, p:price, q:quantity, m:maker, a:tradeId} = trades;
		
		//console.log('INSERT INTO trade_history ( symbol, price, quantity, maker ) VALUES ( "' + symbol + '", ' + price + ', ' + quantity + ', ' + maker + ' )');
		
		con.query('INSERT INTO trade_history ( symbol, price, quantity, maker ) VALUES ( "' + symbol + '", ' + price + ', ' + quantity + ', ' + maker + ' )',function(err,rows){
			if(err) throw err;
			console.log("1 record inserted");
		}); 
	});
	
	

});



