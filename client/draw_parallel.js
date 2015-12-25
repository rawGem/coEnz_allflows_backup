Template.body.onRendered(
function() {
  var div = document.createElement("div");
  div.innerHTML = "Order " + FlowRouter.getParam("order_number") /*+
                  " Route " + FlowRouter.getParam("route_number")*/
  document.body.appendChild(div);
  var instance = this;

instance.autorun(
function(){
   
  if (FlowRouter.getParam("order_number")) {
  var order = FlowRouter.getParam("order_number")
  }

  if (order === "11") {
  var data = Periods.findOne();
  }

  if (instance.subscriptionsReady()) {

  var Routes, height, width, boxSide, linkScale, linkGutter,
      currentYpos, lowVolume;

  Routes = [];
  
  Object.keys(data).forEach(
  function(el) {
    if (el !== "_id") {
      var d = data[el].ord11
      Routes.push(ParseUtils.processRoutes(d))
    }
  })

  console.log(Routes)
  
  height        = 1240;
  width         = 930;
  boxSide       = 300;
  routeKeys     = Object.keys(Routes);
  currentYpos   = 0;
  linkScale     = d3.scale.linear().domain([0,70000]).range([1,50]);
  lowVolume     = 1;
  linkGutter    = 10;

  var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

  
  var groups = svg.selectAll("g").data(Routes).enter().append("g")
        .attr("transform", function(d,i) {
        return "translate("+(boxSide*(i%3)+10)+","
                           + boxSide*Math.floor(i/3)
                           + ")"
        })
        
  // draw links
  groups.each(
  function(data,index){ 
  d3.select(this).selectAll("rect")
        .data(function(d,i) {
        currentYpos = 0;
        return Object.keys(d)
        })
       .enter()
        .append("rect")
        .attr("fill", "#bbb")
        .attr("x", function(d,i) {
        //console.log(data[d]) 
        return 10})
        .attr("y", function(d,i) {
          if (currentYpos === 0) {
            data[d]["dy"] = 0
            currentYpos += linkScale(data[d].segments[0]["Product volume"])
            return 0
          }
          else {
            currentYpos += linkScale(data[d].segments[0]["Product volume"])+linkGutter
            data[d]["dy"] = currentYpos - linkScale(data[d].segments[0]["Product volume"])
            return currentYpos - linkScale(data[d].segments[0]["Product volume"])
          }
        })
        .attr("height", function(d,i) {
            return linkScale(data[d].segments[0]["Product volume"])
        })
        .attr("width", 300)
        .attr("fill", function(d,i) {
        var seg = data[d].segments[0]
        return seg["Product volume"] < lowVolume ? "red" : "#eeeeef"
        }).on("mouseenter", function(d){
           console.log(data[d])
           //svg.append("rect")
           //   .attr("x", 310)
           //   .attr("y", data[d].dy)
           //   .attr("width", 20)
           //   .attr("height", this.getAttribute("height"))
           //   .attr("fill", "orange")
           })
        
          
  
  })

  // label paths
  //groups.append("text")
  //      .attr("x", 125)
  //      .attr("dy", ".35em")
  //      .attr("text-anchor", "start")
  //      .attr("y",    function(d,i) {
  //      return Routes[i][d].dy + linkScale(Routes[i][d].segments[0]["Product volume"])/2
  //      })
  //      .text(function(d,i) {
  //      return Routes[i][d].path.join(" ")  
  //      })

  //svg.on("mousemove", function() {
  //  groups.attr("opacity", function(d,i) {console.log(Routes[i][d])}) 
  //})

  } // subs ready 

  }) // autorun
}) // onRendered

