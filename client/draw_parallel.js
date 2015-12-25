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

  var Routes, viewingHeight, viewingWidth, linkScale, linkGutter,
      currentYpos, lowVolume;
    
    Object.keys(data).forEach(
    function(el) {
      if (el === "p1") {
        var d = data[el].ord11
        Routes = ParseUtils.processRoutes(d)
      }
    })
  
  routeKeys     = Object.keys(Routes);
  currentYpos   = 0;
  linkScale     = d3.scale.linear().domain([0,70000]).range([1,50]);
  viewingHeight = 500;
  viewingWidth  = 900;
  lowVolume     = 1;
  linkGutter    = 10;

  var svg = d3.select("body").append("svg")
        .attr("width", viewingWidth)
        .attr("height", viewingHeight);

  
  var rects = svg.selectAll("g").data(routeKeys).enter().append("g");

  // draw paths
  rects.append("rect") 
        .attr("x", function(d,i) {return 10})
        .attr("y", function(d,i) {
          if (currentYpos === 0) {
            Routes[d]["dy"] = 0
            currentYpos += linkScale(Routes[d].segments[0]["Product volume"])
            return 0
          }
          else {
            currentYpos += linkScale(Routes[d].segments[0]["Product volume"])+linkGutter
            Routes[d]["dy"] = currentYpos - linkScale(Routes[d].segments[0]["Product volume"])
            return currentYpos - linkScale(Routes[d].segments[0]["Product volume"])
          }
        })
        .attr("height", function(d,i) {
            return linkScale(Routes[d].segments[0]["Product volume"])
        })
        .attr("width", 300)
        .attr("fill", function(d,i) {
        var seg = Routes[d].segments[0]
        return seg["Product volume"] < lowVolume ? "red" : "#eeeeef"
        }).on("mouseenter", function(d){
           svg.append("rect")
              .attr("x", 310)
              .attr("y", Routes[d].dy)
              .attr("width", 20)
              .attr("height", this.getAttribute("height"))
              .attr("fill", "orange")
           })

  // label paths
  rects.append("text")
        .attr("x", 125)
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .attr("y",    function(d,i) {
        return Routes[d].dy + linkScale(Routes[d].segments[0]["Product volume"])/2
        })
        .text(function(d,i) {
        return Routes[d].path.join(" ")  
        })

  svg.on("mousemove", function() {
    rects.attr("opacity", function(d) {console.log(Routes[d])}) 
  })

  } // subs ready 

  }) // autorun
}) // onRendered

