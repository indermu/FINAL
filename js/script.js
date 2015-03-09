var margin = {top: 20, right: 20, bottom: 30, left: 300},
    width = 1250- margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.ordinal()
    .range([height, 0])
    .rangeRoundBands([height, 0], 1);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(function(d) {
      return "$"+(d/1000)+"K";
    })

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("js/data.tsv", function(error, data) {

  console.log(data);

  data.forEach(function(d) {
    d.city = d.AREA_NAME;
    d.salary = +d.A_MEAN.replace(",", "");
  });

  console.log(data);

  x.domain(d3.extent(data, function(d) { return d.salary; })).nice();

  y.domain(data.map(function(d) { return d.city; }));

  //y.domain(d3.extent(data, function(d) { return d.city; })).nice();

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Average Salary");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", function(d) { return d.JOBS_1000;})
      .attr("cx", function(d) { return x(d.salary);})
      .attr("cy", function(d) { return y(d.city); })
      .style("fill", function(d) { return color(d.OCC_TITLE); });

  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

});