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
    function slider(circumference_r, array){
        //Remove duplicates
        var newArray = [];
        array.forEach(function(d){
            var index = newArray.indexOf(d)
            if(index < 0 )
                newArray.push(d);
        });
        
        var delta = 2*Math.PI/(newArray.length);
        var angularRange = d3.range(0, 2*Math.PI, delta);
        
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
                .data(angularRange).enter().append("text")
                .attr("style", function(d){return anchor(d);})
                .attr("x", function(d) { return getX(d); })
                .attr("y", function(d) { return getY(d); })
                .text( function (d) { return newArray[angularRange.indexOf(d)]; })
                .attr("font-family", "sans-serif")
                .attr("font-size", "10px")
                .attr("fill", "black")
                .attr("transform", function(d){return rotate(d);});
        
        var line = container.append("g")
                .selectAll('lines')
                .data(angularRange).enter().append("line")
                .attr("x1", function(d) { return getX1(d); })
                .attr("y1", function(d) { return getY1(d); })
                .attr("x2", function(d) { return getX(d); })
                .attr("y2", function(d) { return getY(d); })
                .style("stroke-width", 1)
                .style("stroke", "black")
                .style("fill", "none");
        
        function anchor(alpha){
            var cos = Math.round(Math.cos(alpha) * 1000) / 1000;
            if(Math.sign(cos) >= 0)
                return "text-anchor: start";
            else if(Math.sign(cos) < 0)
                return "text-anchor: end";
        }
        
        function rotate(alpha){
            var cos = Math.round(Math.cos(alpha) * 1000) / 1000;
            var sgncos = Math.sign(cos);
            var angle = sgncos >= 0 ? alpha*180/Math.PI : sgncos*(180 - alpha*180/Math.PI);
            return "rotate(" + angle +","+getX(alpha)+","+getY(alpha)+")";
        }
        
        function getX1(alpha){
            var cos = Math.round(Math.cos(alpha) * 1000) / 1000;
            return circumference_r*cos
        }
        
        function getY1(alpha){
            var sin = Math.round(Math.sin(alpha) * 1000) / 1000;
            return circumference_r*sin
        }
        
        function getX(alpha){
            var cos = Math.round(Math.cos(alpha) * 1000) / 1000;
            return circumference_r*cos + Math.sign(cos)*8;
        }
        
        function getY(alpha){
            var sin = Math.round(Math.sin(alpha) * 1000) / 1000;
            return circumference_r*sin + Math.sign(sin)*8;
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
        var radius = [150, 120, 90];
        radius.forEach(function(r){slider(r, data.map(function(d){return d["Minuto"];}))});
     
    };
    
    d3.json("json/buses.json", function(error, data){
       if(error){
           throw error;
       }
       update(data) 
       
    });
    
    
})();