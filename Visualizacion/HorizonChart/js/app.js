(function(){
    
    //SVG
    var width =800;
    var height = 500;
    var margin = {top: 20, left: 20, right: 20, bottom: 20};
    var effWidth = width - margin.left - margin.right;
    var effHeight = height - margin.top - margin.bottom;
    var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height);
    
    //Time scales for control 
    var scaleMinutes = d3.scaleLinear().range([0, effWidth]);
    var scaleDays = d3.scaleLinear().range([0, width]);
    var scaleMonths = d3.scaleLinear().range([0, width]);
    var scaleYears = d3.scaleLinear().range([0, width]);
    
    //Round sliders
    function slider(circumference_r, scale, data){
        var drag = d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended);
    
        var container = svg.append("g").attr("transform", "translate(" + effWidth/2 + "," + effHeight/2 + ")");;
        var circumference = container.append('circle')
        .attr('r', circumference_r)
        .attr('class', 'slider');

        handle = [{
          x: 0,
          y: -circumference_r
        }];

        handle_circle = container.append("g")
          .attr("class", "dot")
            .selectAll('circle')
          .data(handle)
            .enter().append("circle")
          .attr("r", 5)
          .attr("cx", function(d) { return d.x;})
          .attr("cy", function(d) { return d.y;})
          .call(drag);
        
        
        var txt = container.append("g")
                .selectAll('labels')
                .data(data).enter().append("text")
                .attr("x", function(d) { return scale[d]; })
                .attr("y", function(d) { return scale[d]; })
                .text( function (d) { return "(" +scale[d]+")"; })
                .attr("font-family", "sans-serif")
                .attr("font-size", "10px")
                .attr("fill", "black");

        
        function getX(value, radius){
            d_from_origin = Math.sqrt(Math.pow(d3.event.x,2)+Math.pow(d3.event.y,2));
            alpha = Math.acos(d3.event.x/d_from_origin);
            return radius*Math.cos(alpha);
        }
        
        function getY(value, radius){
            d_from_origin = Math.sqrt(Math.pow(d3.event.x,2)+Math.pow(d3.event.y,2));
            alpha = Math.acos(d3.event.x/d_from_origin);
            return d3.event.y < 0 ? -radius*Math.sin(alpha) : radius*Math.sin(alpha);
        }

        function dragstarted(d) {
          d3.event.sourceEvent.stopPropagation();
          d3.select(this)
            .classed("dragging", true);
        }

        function dragged(d) {  
          d_from_origin = Math.sqrt(Math.pow(d3.event.x,2)+Math.pow(d3.event.y,2));

          alpha = Math.acos(d3.event.x/d_from_origin);

          d3.select(this)
            .attr("cx", d.x = circumference_r*Math.cos(alpha))
            .attr("cy", d.y = d3.event.y < 0 ? -circumference_r*Math.sin(alpha) : circumference_r*Math.sin(alpha));
        }

        function dragended(d) {
          d3.select(this)
            .classed("dragging", false);
        }
    }
    

    
    function update(data){
        
        scaleMinutes.domain(d3.extent(data, function(d){return d["Minuto"];}));
        svg.append("g")
            .attr("transform", "translate("+margin.left+"," + (effHeight - 100)+ ")")
            .call(d3.axisBottom(scaleMinutes));
        
        //Create sliders for months, days, hours, minutes and seconds
        var radius = [150, 120, 90, 60, 30];
        console.log(scaleMinutes);
        radius.forEach(function(r){slider(r, scaleMinutes, data.map(function(d){return d["Minuto"]}))});
     
    };
    
    d3.json("json/buses.json", function(error, data){
       if(error){
           throw error;
       }
       update(data) 
       
    });
    
    
})();