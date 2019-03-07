
//Define margins and the window dimensions & the radius of the pie
var margin = {top: 20, right: 20, bottom:20, left:20},
    otherWidth = 500 - margin.right - margin.left,
    otherHeight = 500 - margin.top - margin.bottom,
    radius = otherWidth/2.5;

//Set column variables for the pie,
//Breaking it up into the totaltime spent on each part of the project
var xColumn = "totaltime";
var sliceSizeColumn = "totaltime";
var colorColumn = "desc";

//Set variables for the legend
var legendRectSize = 18;
var legendSpacing = 4;

//define the pieChart svg with class "svgPie"
var pieChart = d3.select("body").append("svg")
    .attr("width", otherWidth)
    .attr("height", otherHeight)
    .attr("viewBox", "0 0 500 500")
    .attr("perserveAspectRatio", "xMinYMin meet")
    .attr("class", "svgPie");
//Append group object to the pieChart svg
var gPie = pieChart.append("g")
        .attr("class", "pieG")
        .attr("transform", "translate(" + margin.left + "," + margin.right + ")");

var pieG = gPie.append("g");
//Set custom colors for the legend/pie slices
var color = ['#69c242', '#ffcc00', '#cf2030'];


//Set a custom ordinal scale using the color array and the set domain
var colors = d3.scale.ordinal()
    .range(color)
    .domain(["Angular", "D3", "App Development"]);

//Add the tooltip for the pie 
var pietooltip = d3.select("body")
        .append("div").attr("id", "tooltip")
        .style("z-index", "10")
        .style("visibility", "hidden");

//Generates the data used for the pie
var pie = d3.layout.pie();
//Generates the arcs for the pie
var arc = d3.svg.arc();
arc.outerRadius(radius);
arc.innerRadius(0);

//Render function used to display pie
function render(data) {
   //Sets the pie value to the totaltime
    pie.value(function(d) { return d[sliceSizeColumn]});
    
    //creates pie dataset
    var pieData = pie(data);
    
    //Center the pie group
    pieG.attr("transform", "translate(" + otherWidth / 2 + "," + otherHeight / 2 + ")");
    
    //Enter/Exit/Update slices
    var slices = pieG.selectAll("path").data(pieData);
    slices.enter().append("path");
    slices 
        //Set the arc and fill it using the color array and the set colorColumn
        .attr("d", arc)
        .attr("fill", function(d) { return colors(d.data[colorColumn]); })
        //Add mouseover events for the tooltip
        .on("mouseover", function(d){return pietooltip.style("visibility", "visible").text(d.data.totaltime);})
        .on("mousemove", function(){return pietooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
        .on("mouseenter", function(d, i) {
            d3.select(this)
                .transition()
                .duration(300)
                .attr("opacity", 0.6)
        })
          .on('mouseleave', function (d, i) {
            d3.select(this)
              .transition()
              .duration(300)
              .attr('opacity', 1)
          })
        .on("mouseout", function(){return pietooltip.style("visibility", "hidden");});
    slices.exit().remove();
    
    
    //Append legend to the piechart
    var legendG = pieChart.selectAll(".legend")
      .data(pieData)
      .enter().append("g")
      //Transform it to be on the right side of the chart
      .attr("transform", function(d,i){
        return "translate(" + (otherWidth - 80) + "," + (i * 23 + 10) + ")";
      })
      .attr("class", "legend");   

    //Make a color rect from the colors array
    legendG.append("rect")
      .attr("width", legendRectSize)
      .attr("height", legendRectSize)
      .attr("fill", function(d, i) {
        return colors(i);
      });

    //Add the text related to the data's desc
    legendG.append("text")
      .text(function(d){
        return d.data.desc;
      })
      .style("font-size", 12)
      .attr("y", 12)
      .attr("x", 20);
    
};           
//Standard function used to format data
function type(d){
    d.desc = d.desc,
    d.totaltime = +d.totaltime
    return d;
}
//make the data variable
var data = d3.csv("/mock/newdata.csv", type, render);