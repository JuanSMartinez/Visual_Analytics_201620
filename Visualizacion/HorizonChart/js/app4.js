(function(){

    //BEGIN: Read json***************************************************************************
    d3.json("json/buses.json", function(error, data){
       if(error){
           throw error;
       }
        
    //BEGIN: Global parameters*****************************************************************************
    
    //SVG
    var width =1200;
    var height = 725;
    var margin = {top: 20, left: 20, right: 20, bottom: 20};
    var effWidth = width - margin.left - margin.right;
    var effHeight = height - margin.top - margin.bottom;
    var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);
        
    //Round slider radius
    var rMonth = 100;
    var rDay = 60;    
        
    //Shift for round sliders due to text
    var radialDelta = 125;
        
    //Shift of horiozon charts
    var horizonDelta = 20;
        
    //Width of horizon charts
    var hWidth = (effWidth - (2*rMonth+radialDelta))/2 - horizonDelta;
        
    //Velocity chart container
    var velocityContainer = svg.append("g").attr("transform", "translate("+(2*rMonth+radialDelta + horizonDelta/2)+","+effHeight/2+")");
    var velocityContainers = [];
        
    //People container
    var peopleContainer = svg.append("g").attr("transform", "translate("+(2*rMonth+radialDelta+hWidth + horizonDelta)+","+effHeight/2+")");
    var peopleContainers = [];
        
    //Map container
    var rawPercentageWidth = (innerWidth - (2*rMonth+radialDelta + innerWidth - effWidth+20))/innerWidth;
    var widthPercentage = Math.floor(100*rawPercentageWidth);
    var rawPercentageHeight = ((height)/2-40)/innerHeight;
    var heightPercentage = Math.floor(100*rawPercentageHeight);
    
    
    var mapContainer = d3.select("body").append("div").attr("id","map");
    mapContainer
        .style("width",  widthPercentage+"%")
        .style("height",heightPercentage + "%")
        .style("left", (2*rMonth+radialDelta+ horizonDelta) + "px");
    var map = L.Mapzen.map('map');
    map.setView([-38.717530, -62.265174], 12);  
    var markers = new L.FeatureGroup();
    var marker = L.marker([-38.717530, -62.265174]);
    markers.addLayer(marker);
    map.addLayer(markers);

    //Chart 
    var bands = 1;
    var chartHeight = 10;
    var chart = d3.horizon()
                    .width(hWidth)
                    .height(chartHeight)
                    .bands(bands)
                    .mode("offset")
                    .curve(d3.curveMonotoneX)
                    //.curve(d3.curveStep)
                    .colors(["#fac173", "#ffa310", "#1877e5", "#1ad5f7"]);
        
    //Filtered data
    var filtered;
    
    //END: Global parameters*****************************************************************************
    
    //BEGIN: Generate control sliders*****************************************************************************
    
    //Hour range
    var hours = d3.range(1,25,1);
    
    //Month range
    var monthRange = ["Enero", "Febrero", "Marzo", "Abril", "Mayo",
                        "Junio", "Julio", "Agosto", "Septiembre", 
                     "Octubre", "Noviembre", "Diciembre"];
    
    //Day range
    var dayRange = d3.range(1,32,1);
    
    //Year range
    var yearRange = [2010,2011,2012,2013,2014,2015,2016];
    
    //Selected  year, month and day
    var year, month, day;
    
    //Horizontal slider
    function hSlider(array, height, width, x, y){
        
        var delta = width/(array.length-1);
        var linearRange = d3.range(0, width+1, delta);
        var container = svg.append("g").attr("class", "control").attr("transform", "translate(" + x + "," + y +")");
       
        var line = container.append('line')
        .attr('x1', -width/2)
        .attr('y1', height/2 )
        .attr('x2', width/2)
        .attr('y2', height/2)
        .style("stroke-width", 2)
        .style("stroke", "black")
        .style("fill", "none");
        var drag = d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended);
        
        var lines = container.append("g")
                .selectAll('lines')
                .data(linearRange).enter().append("line")
                .attr("x1", function(d) { return d-width/2; })
                .attr("y1", function(d) { return height/2-5; })
                .attr("x2", function(d) { return d-width/2; })
                .attr("y2", function(d) { return height/2+5; })
                .style("stroke-width", 1)
                .style("stroke", "black")
                .style("fill", "none");
        
        handle = [{
          x: 0,
          y: height/2
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
                .data(linearRange).enter().append("text")
                .attr("style","text-anchor: middle")
                .attr("x", function(d) { return d-width/2; })
                .attr("y", height/2-10)
                .text( function (d) { return array[linearRange.indexOf(d)]; })
                .attr("font-family", "sans-serif")
                .attr("font-size", "10px")
                .attr("fill", "black");
                //.attr("transform", function(d){return rotate(d);});
        
        
        function closestTag(x){
            
            var closestTag;
            var distance;
            var closestPos;
            linearRange.forEach(function(xc){
                
                if(distance == undefined || Math.abs(xc-x) < distance){
                    distance = Math.abs(xc-x);
                    closestTag = array[linearRange.indexOf(xc)];
                    closestPos = xc;
                }
            });
            return [closestTag, closestPos];
        }
        
        function dragstarted(d) {
          d3.event.sourceEvent.stopPropagation();
          d3.select(this)
            .classed("dragging", true);
        }

        function dragged(d) { 
            var pos;
            if (d3.event.x > width/2)
                pos = width/2;
            else if(d3.event.x < -width/2)
                pos = -width/2;
            else
                pos = d3.event.x;
            year = closestTag(pos + width/2)[0];
            var position = closestTag(pos + width/2)[1]
            d3.select(this)
            .attr("cx", d.x = position-width/2);
            
        }

        function dragended(d) {
          d3.select(this)
            .classed("dragging", false);
            //filterData(data);
            killData();
            update(); 
            
        }
    }
    
    //Round sliders
    function slider(circumference_r, array, type, width, height, x, y){
       
        var delta = 2*Math.PI/(array.length);
        var angularRange = d3.range(0, 2*Math.PI, delta);
        
        var drag = d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended);
    
        var container = svg.append("g").attr("class", "control").attr("transform", "translate(" + x + "," + y + ")");
        var circumference = container.append('circle')
        .attr('r', circumference_r)
        .attr('class', 'slider');
        
        var line = container.append("g")
                .selectAll('lines')
                .data(angularRange).enter().append("line")
                .attr("x1", function(d) { return getX1(d); })
                .attr("y1", function(d) { return getY1(d); })
                .attr("x2", function(d) { return getX2(d); })
                .attr("y2", function(d) { return getY2(d); })
                .style("stroke-width", 1)
                .style("stroke", "black")
                .style("fill", "none");

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
                .text( function (d) { return array[angularRange.indexOf(d)]; })
                .attr("font-family", "sans-serif")
                .attr("font-size", "10px")
                .attr("fill", "black")
                .attr("transform", function(d){return rotate(d);});
        
        
        
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
            var cos = Math.cos(alpha);
            return (circumference_r-5)*cos
        }
        
        function getY1(alpha){
            var sin = Math.sin(alpha);
            return (circumference_r-5)*sin
        }
        
        function getX2(alpha){
            var cos = Math.cos(alpha);
            return (circumference_r+5)*cos;
        }
        
        function getY2(alpha){
            var sin = Math.sin(alpha);
            return (circumference_r+5)*sin
        }
        
        function getX(alpha){
            var cos = Math.cos(alpha - (5/circumference_r)*Math.PI/180);
            return (circumference_r+5)*cos
        }
        
        function getY(alpha){
            var sin = Math.sin(alpha - (10/circumference_r)*Math.PI/180);
            return (circumference_r+10)*sin
        }
        
        function closestTag(alpha){
            var closestTag;
            var closestAngle;
            var distance;
            angularRange.forEach(function(angle){
                if(distance == undefined || Math.abs(alpha-angle) < distance){
                    distance = Math.abs(alpha-angle);
                    closestTag = array[angularRange.indexOf(angle)];
                    closestAngle = angle;
                }
            });
            
            return [closestTag, closestAngle];
        }

        function dragstarted(d) {
          d3.event.sourceEvent.stopPropagation();
          d3.select(this)
            .classed("dragging", true);
        }

        function dragged(d) {  
            d_from_origin = Math.sqrt(Math.pow(d3.event.x,2)+Math.pow(d3.event.y,2));
            alpha = Math.acos(d3.event.x/d_from_origin);
            var angle;
            var x = d3.event.x;
            var y = d3.event.y;
            if(y < 0){
                angle = 2*Math.PI - alpha;
            }
            else{
                angle = alpha;    
            }
            if(type=="month"){
                month = array.indexOf(closestTag(angle)[0]) + 1;
                
            }
            else if(type=="day"){
                day = closestTag(angle)[0];
                
            }
            var closestAngle = closestTag(angle)[1];
            d3.select(this)
            //.attr("cx", d.x = circumference_r*Math.cos(closestAngle))
            //.attr("cy", d.y = d3.event.y < 0 ? -circumference_r*Math.sin(closestAngle) : circumference_r*Math.sin(closestAngle));
            .attr("cx", d.x = circumference_r*Math.cos(closestAngle))
            .attr("cy", d.y = circumference_r*Math.sin(closestAngle));
            
        }

        function dragended(d) {
          d3.select(this)
            .classed("dragging", false);
            filterData(data);
            update();
        }
    }
    
    //Generate sliders
    slider(rMonth, monthRange, "month", 2*rMonth+radialDelta, effHeight/8, rMonth + radialDelta/2 , effHeight/2);
    slider(rDay, dayRange, "day", 2*rDay+radialDelta, effHeight/8 , rMonth + radialDelta/2 , effHeight/2);
    hSlider(yearRange, effHeight/8, effWidth/4, rMonth + radialDelta/2, effHeight/2+125);
    
    
    
    //END: Generate control sliders*****************************************************************************
    
    //BEGIN: Filter data*****************************************************************************
    /*
    function filterData(rawData){
        
        //Temporal functions
        function generateSeries(){
            var series = [];
            for (var i = 0, variance = 0, value; i < 500; i++) {
                variance += (Math.random() - 0.5) / 10;
                series.push(Math.abs(Math.cos(i/100) + variance)); // only positive values
            }  
            return series;
        }
        function generar(){
            var datos = [];
            for(var i = 0; i < 5; i++){
                datos[i] = generateSeries(); 
            }
            return datos;
        }

        //Filter by date    
        var filteredDate = rawData.map(function(d){
            if (d["Anio"] == 2010 && d["Mes"] == 6 && d["Dia"] == 25)
                return d;
        });


        //Unique line ids
        var ids = [];
        filteredDate.forEach(function(d){
            var index = ids.indexOf(d["Linea"]);
            if(index < 0)
                ids.push(d["Linea"])
        });

        //Array of average velocities per hour
        var array = [];
        ids.forEach(function(d, i){
            var avgHour = []
            hours.forEach(function(h){
                var averageHour = 0;
                var count = 0;
                filteredDate.forEach(function(f){
                    if(f["Hora"] == h && f["Linea"] == d){
                        averageHour += f["Velocidad"];
                        count += 1;
                    }  
                });
                avgHour[h] = isNaN(averageHour/count) ? 0 : averageHour/count; 
            });
            //array[i] = avgHour;
            array[i] = generateSeries();
        });   
        
        filtered = array;
        
    }
    */
    //END: Filter data*****************************************************************************************
        
    //BEGIN: Temporal Filter data function
        
    function filterData(rawData){
        n = 48;
        //charts = 3;
        charts = 31;
        data = [];
        for(var c = 0; c< charts; c++){
            array = [];
            for (var i = 0 ; i < n; i++){
                //y = Math.random()*10-5;
                if (i%2 == 0)
                    y = 1;
                else 
                    y = 0;
                y = Math.random()*10-5;
                array.push([i,y]);
                
            }
            data.push(array);
        }
        filtered = data;
        
    }
        
    function killData(){
        n = 48;
        //charts = 3;
        charts = 31;
        data = [];
        for(var c = 0; c< charts; c++){
            array = [];
            for (var i = 0 ; i < n; i++){
                //y = Math.random()*10-5;
                if (i%2 == 0)
                    y = -1;
                else 
                    y = 0;
            y = Math.random()*10-5;
            array.push([i,y]);
            }
            data.push(array);
        }
        filtered = data;
        
        
    }
    
    //BEGIN: Update of horizon charts***************************************************************************
        
    function update(){
        
        if(velocityContainers.length == 0){
            filtered.forEach(function(array, i){
                var g = velocityContainer.append("g").attr("id","containerG"); 
                velocityContainers.push(g);
            });
        }
        if(peopleContainers.length == 0){
            filtered.forEach(function(array, i){
                var g = peopleContainer.append("g").attr("id","containerG"); 
                peopleContainers.push(g);
            });
        }
        
        filtered.forEach(function(array, i){
            
            //Join
            var chartIV = velocityContainers[i].selectAll("g").data([array]);
            var chartIP = peopleContainers[i].selectAll("g").data([array]);
            
            //Update
            chartIV.attr("class","chart")
                .attr("transform", "translate(0,"+i*(chartHeight+2)+")")
                .call(chart.duration(1000));
            chartIP.attr("class","chart")
                .attr("transform", "translate(0,"+i*(chartHeight+2)+")")
                .call(chart.duration(1000));
        
            //Enter
            chartIV.enter().append("g")
                .attr("class","chart")
                .attr("transform", "translate(0,"+i*(chartHeight+2)+")")
                .call(chart.duration(1000));
            chartIP.enter().append("g")
                .attr("class","chart")
                .attr("transform", "translate(0,"+i*(chartHeight+2)+")")
                .call(chart.duration(1000));
            
                                                                            
        });
    }
    
    //END: Update of horizon charts*****************************************************************************
        
       filterData(data)  
       update()
    });
    
    //END: Read json*****************************************************************************

})();