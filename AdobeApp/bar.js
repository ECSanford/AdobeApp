
//Set some initial variables for easier customization
var outerWidth = 600;
var outerHeight = 600;
var margin = { left: 60, top: 30, right: 60, bottom: 50 };
var barPadding = 0.4;

//Define our axes, and how we want to layer our stacked bar chart
var xColumnBar = "date";
var yColumnBar = "totalm";
var colorColumnBar = "desc";
var layerColumn = colorColumnBar;

//Add variables for axis labels
var xAxisLabelText = "Date";
var xAxisLabelOffset = 48;
var yAxisLabelText = "Time (m)";
var yAxisLabelOffset = 40;

var legendRectSizeBar = 18;
var legendSpacingBar = 4;

    //Calculate the actual dimensions of the chart given margin values
    var innerWidth  = outerWidth  - margin.left - margin.right;
    var innerHeight = outerHeight - margin.top  - margin.bottom;
    //Create/append our different element groups
    var svgBar = d3.select("body").append("svg")
        .attr("width",  outerWidth)
        .attr("height", outerHeight)
        //Use viewbox and perserveAspectRatio to make chart scalable
        .attr("viewBox", "0 0 600 600")
        .attr("perserveAspectRatio", "xMinYMin meet")
        .attr("class", "svgBar")
    //lineBar group is made before gBar so the grid does not lay on top of the axes/data
    var lineBar = svgBar.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "lineBar")
    //gBar group for the data
    var gBar = svgBar.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "barG");
    //Add groups for axis and axis labels
    var xAxisG = gBar.append("g")
        .attr("class", "x axis bar")
        .attr("transform", "translate(0," + innerHeight + ")");
     var xAxisLabel = xAxisG.append("text")
        .style("text-anchor", "middle")
        .attr("transform", "translate(" + (innerWidth / 2) + "," + xAxisLabelOffset + ")")
        .attr("class", "xlabel")
        .attr("id", "xlabel")
        .text(xAxisLabelText);
    var yAxisG = gBar.append("g")
        .attr("class", "y axis bar");
    var yAxisLabel = yAxisG.append("text")
        .style("text-anchor", "middle")
        .attr("transform", "translate(-" + yAxisLabelOffset + "," + (innerHeight / 2) + ") rotate(-90)")
        .attr("class", "ylabel")
        .attr("id", "ylabel")
        .text(yAxisLabelText);
   
        
    //Set scales for x and y axes
    var x = d3.scale.ordinal().rangeBands([0, innerWidth], barPadding);
    var y = d3.scale.linear().range([innerHeight, 0]);

    //Set colorScale with prepicked colors
    var colorbar = ['#1c26bc', '#f9a722', '#119900'];
    var colorScale = d3.scale.ordinal()
        .domain("Angular","D3", "App Development")
        .range(colorbar);
      // Use a modified SI formatter that uses "B" for Billion.
    
    //create axes using d3's built in d3.svg.axis
    var xAxes = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .outerTickSize(0);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(8);

    //function to make y axis gridlines
    function make_y_axis() {
      return d3.svg.axis()
          .scale(y)
          .orient("left")
          .ticks(8)
    }
    
    //create the tooltip used for hovering over data
    var tooltip = d3.select("body")
        .append("div").attr("id", "tooltip")
        .style("z-index", "10")
        .style("visibility", "hidden");


    //main render function called to render the data thats been created
      function render(data){
          
        //nest function and stack function used in conjunction to create layers for our stacked bar chart
        var nested = d3.nest()
          .key(function (d){ return d[layerColumn]; })
          .entries(data)
        
        var stack = d3.layout.stack()
          .y(function (d){ return d[yColumnBar]; })
          .values(function (d){ return d.values; });
        var layers = stack(nested);
        var layerStack = layers;
        console.log(layerStack);
          
        //Set the domain of the x and y axes
        //map layers array values and return the date
        x.domain(layers[0].values.map(function (d){
          return d[xColumnBar];
        }));
        //find the maximum stacked value for the y domain
        y.domain([
          0,
          d3.max(layers, function (layer){
            return d3.max(layer.values, function (d){
              //Stacked values are computed using y0 and y variables (created in stack(nested))
              return d.y0 + d.y;
            });
          })
        ]);
        
        //append our grid to lineBar so it is displayed below the axes/chart data
        lineBar.append("g")            
        .attr("class", "grid")
        .call(make_y_axis()
            .tickSize(-innerWidth, 0, 0)
            .tickFormat("")
        )
          

        xAxisG.call(xAxes);
        yAxisG.call(yAxis);
          
        //ENTER, EXIT, UPDATE data for layers and bars
        var layers = gBar.selectAll(".layer").data(layers);
        layers.enter().append("g").attr("class", "layer");
  
        layers.exit().remove();
        layers.style("fill", function (d){
          return colorScale(d.key);
        });
        var bars = layers.selectAll("rect").data(function (d){
          return d.values;
        });
        bars.enter().append("rect")
        bars.exit().remove();
        bars
          .attr("x", function (d){ return x(d[xColumnBar]); })
          .attr("y", function (d){ return y(d.y0 + d.y); })
          .attr("width", x.rangeBand())
          .attr("height", 0)
          .attr("height", function (d){ return innerHeight - y(d.y); })
          //Add mouseover events for the tooltip
          .on("mouseover", function(d){return tooltip.style("visibility", "visible").text(d.totalm);})
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
              .attr('x', function (d){ return x(d[xColumnBar]); })
          })
            
          .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
          .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
        
        //Add labels for the legend
        var labels = ["Angular", "D3", "App Development"]
        //Append legendBar to svgBar
        var legendBar = svgBar.selectAll(".legend") 
          //Use data generated from stack(nested) for our legend (3 data values instead of 15)
          .data(layerStack)
          .enter().append("g")
          //translate the legend an appropriate amount so there is no overlap
          .attr("transform", function(d,i){
            return "translate(" + (innerWidth) + "," + (i * 23) + ")";
          })
          .attr("class", "legend");   

        //match the rect with the colorScale
        legendBar.append("rect")
          .attr("width", legendRectSizeBar)
          .attr("height", legendRectSizeBar)
          .attr("fill", function(d, i) {
            return colorScale(i);
          });
          
        //use our labels array to insert text to the legend
        legendBar.append("text") // add the text
          .text(function(d, i){
            return labels[i];
          })
          .style("font-size", 12)
          .attr("y", 12)
          .attr("x", 20);

      }

      //function used to convert data from string to int
      function type(d){
        d.date = d.date;
        d.totalm = +d.totalm;
        return d;
      }
//call our csv file and run type and render on it
d3.csv("/mock/data.csv", type, render);