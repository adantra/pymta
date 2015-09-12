
var margin = {top: 20, right: 20, bottom: 30, left: 50},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

var x = techan.scale.financetime()
		.range([0, width]);

var y = d3.scale.linear()
		.range([height, 0]);

var ohlc = techan.plot.ohlc()
		.xScale(x)
		.yScale(y);

var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

var svg = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var data_url = "/get_data/" + req_symbol + "/" + req_mindate + "/" ;
d3.json(data_url, function(error, data) {
//~ d3.csv("/static/data/ohlc.csv", function(error, data) {
	
	var accessor = ohlc.accessor();

	data = data.slice(0, 200).map(function(d) {
		return {
			//~ date: parseDate(d.Date),
			date: new Date(d.date*1000),
			open: +d.open,
			high: +d.high,
			low: +d.low,
			close: +d.close,
			volume: +d.volume
		};
	}).sort(function(a, b) { return d3.ascending(accessor.d(a), accessor.d(b)); });

	x.domain(data.map(accessor.d));
	y.domain(techan.scale.plot.ohlc(data, accessor).domain());

	svg.append("g")
			.datum(data)
			.attr("class", "ohlc")
			.call(ohlc);

	svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

	svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Price ($)");
});