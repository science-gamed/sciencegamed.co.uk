//don't need this scatter graph for now
/*
function test( array ){
		var dataset = [];
		for(var i = 0; i < array.length; i++){
			var point = [];
			point[0] = i;
			point[1] = array[i].calories;

			dataset.push(point);
		}

			//Width and height
			var w = 500;
			var h = 300;
			var padding = 30;
			

			//Create scale functions
			var xScale = d3.scale.linear()
								 .domain([0, d3.max(dataset, function(d) { return d[0]; })])
								 .range([padding, w - padding * 2]);

			var yScale = d3.scale.linear()
								 .domain([0, d3.max(dataset, function(d) { return d[1]; })])
								 .range([h - padding, padding]);

			var rScale = d3.scale.linear()
								 .domain([0, d3.max(dataset, function(d) { return d[1]; })])
								 .range([2, 5]);

			//Define X axis
			var xAxis = d3.svg.axis()
							  .scale(xScale)
							  .orient("bottom")
							  .ticks(5);

			//Define Y axis
			var yAxis = d3.svg.axis()
							  .scale(yScale)
							  .orient("left")
							  .ticks(5)
							  .tickFormat(d3.format("s"));

			//Create SVG element
			var svg = d3.select(".caloriesOverTime")
						.append("svg")
						.attr("width", w)
						.attr("height", h);

			//Create circles
			svg.selectAll("circle")
			   .data(dataset)
			   .enter()
			   .append("circle")
			   .attr("cx", function(d) {
			   		return xScale(d[0]);
			   })
			   .attr("cy", function(d) {
			   		return yScale(d[1]);
			   })
			   .attr("r", function(d) {
			   		return rScale(d[1]);
			   });

			//Create labels
			/*svg.selectAll("text")
			   .data(dataset)
			   .enter()
			   .append("text")
			   .text(function(d) {
			   		return d[0] + "," + d[1];
			   })
			   .attr("x", function(d) {
			   		return xScale(d[0]);
			   })
			   .attr("y", function(d) {
			   		return yScale(d[1]);
			   })
			   .attr("font-family", "sans-serif")
			   .attr("font-size", "11px")
			   .attr("fill", "red");
			
			//Create X axis
			svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(0," + (h - padding) + ")")
				.call(xAxis);
			
			//Create Y axis
			svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(" + padding + ",0)")
				.call(yAxis);


			svg.append("text")
		        .attr("x", (w / 2))             
		        .attr("y", 15)
		        .attr("text-anchor", "middle")  
		        .style("font-size", "16px") 
		        .style("text-decoration", "underline")  
		        .style("z-index", "5")
		        .text("Calories over time");



		
		
};
*/

function barChart(){

	game.data = [];
	game.data[0] = {
		name: 'This game',
		value: game.finalPoints
	};

	game.data[1] = {
		name: 'Best Score',
		value: game.scoreHistory[game.scoreHistory.length - 1] 
	};

var width = 420,
    barHeight = 20;

var x = d3.scale.linear()
    .range([0, width])
	.domain([0, d3.max(game.data, function(d) { return d.value; })]);



var chart = d3.select(".thisScorevsLastScore").append("svg")
    .attr("width", width)
	.attr("height", barHeight * game.data.length);



  var bar = chart.selectAll("g")
      .data(game.data)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; })

  bar.append("rect")
      .attr("height", barHeight - 1)
      .attr("width", 0)
      .transition()
      .duration(2000)
      .attr("width", function(d) { return x(d.value); });

  bar.append("text")
      .attr("x", function(d) { return x(d.value) - 280; })
      .attr("y", barHeight / 2)
      .attr("dy", ".35em")
      .attr("fill", "white")
      .text(function(d) { return d.name + " :" + d.value; });

      /*
// A formatter for counts.
var formatCount = d3.format(",.0f");

var margin = {top: 10, right: 30, bottom: 30, left: 30},
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var y = d3.scale.ordinal()
    .domain(game.data.map(function(d) { return d.name; }))
    .rangeRoundBands([0, width], 1.0);


var x = d3.scale.linear()
    .domain([0, d3.max(game.data, function(d) { return d.value; })])
    .range([height, 0], 0.2);

var xAxis = d3.svg.axis()
    .ticks(2)
    .scale(x);


var chart = d3.select(".thisScorevsLastScore").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  chart.selectAll(".bar")
      .data(game.data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .attr("width", 20);
*/
function type(d) {
  d.value = +d.value; // coerce to number
  return d;
}
};

function pieChart( array ){
	game.temp = [];
	game.dataset = [];

//first, get food type data from events array, remove duplicates and compile into new dataset array
	for( var a = 0; a < array.length; a++){
		if(typeof array[a].context.type === 'undefined'){
			continue;
		}
		game.temp.push(array[a].context.type)
	}


	for( var i = 0, k = game.temp.length - 1;  k >= i; i++){
		game.dataset[i] =[];
		game.dataset[i][0] = game.temp[i];
		game.dataset[i][1] = 0;
		
		
		var j = game.temp.length;

		while (j--){
			if(game.temp[j] === game.dataset[i][0])	{
				game.dataset[i][1]++;		
				//game.temp.splice(j, 1);
				}

			}
	}
		game.dataset.getUnique = function (){
		   var u = {}; 
		   game.finalDataset = [];
		   for(var i = 0, l = this.length; i <= l; ++i){
		      if(u.hasOwnProperty(this[i])) {
		         continue;
		      }
		      game.finalDataset.push(this[i]);
		      u[this[i]] = 1;
		   }
		   game.finalDataset.pop();
		   return game.finalDataset;
		}

game.dataset.getUnique();

game.preferredFoodType = {
	name: 'nothing',
	value: 0
};

for(var k = 0; k < game.finalDataset.length - 1; k++){
	if(game.finalDataset[k][1] > game.preferredFoodType.value){
		game.preferredFoodType.name = game.finalDataset[k][0];
		}
	}


    var w = 300,                        //width
    h = 300,                            //height
    r = 150,                            //radius
    color = d3.scale.category20c();     //builtin range of colors
 
    
    var vis = d3.select(".foodTypes")
        .append("svg:svg")              //create the SVG element inside the <body>
        .data(game.finalDataset)                   //associate our data with the document
            .attr("width", w)           //set the width and height of our visualization (these will be attributes of the <svg> tag
            .attr("height", h)
        .append("svg:g")                //make a group to hold our pie chart
            .attr("transform", "translate(" + r + "," + r + ")")    //move the center of the pie chart from 0, 0 to radius, radius
 
    var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
        .outerRadius(r);
 
    var pie = d3.layout.pie()           //this will create arc data for us given a list of values
        .value(function(d, i) { return game.finalDataset[i][1]; });    //we must tell it out to access the value of each element in our data array
 
    var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
        .data(pie(game.finalDataset))                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
        .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
            .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
                .attr("class", "slice");    //allow us to style things in the slices (like text)
 
        arcs.append("svg:path")
                .attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
                .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function
 
        arcs.append("svg:text")                                     //add a label to each slice
                .attr("transform", function(d) {                    //set the label's origin to the center of the arc
               												 //we have to make sure to set these before calling arc.centroid
                d.innerRadius = 0;
                d.outerRadius = r;
                return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
            })
            .attr("text-anchor", "middle")   
            .style("z-index", "5")
            .style("overflow", "visible")    
      		.attr("fill", "white")                   
            .text(function(d, i) { return game.finalDataset[i][0]; });        //get the label from our original data array


        
}





