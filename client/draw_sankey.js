/*draw sankey*/
//Template.body.onRendered(
//function() {
//  var div = document.createElement("div");
//  div.innerHTML = "Order " + FlowRouter.getParam("order_number") /*+
//                  " Route " + FlowRouter.getParam("route_number")*/
//  document.body.appendChild(div);
//
//this.autorun(
//function(){
//   
//  if (FlowRouter.getParam("order_number")) {
//    var query_from_param = {} 
//    query_from_param["order"+FlowRouter.getParam("order_number")] = { $exists : true };
//    var data_from_test = Test.findOne(query_from_param)
//  }
//
//  if (data_from_test) {
//  var data = data_from_test.order11;
//  
//  var objOfRoutes = ParseUtils.routesSortedBySegmentRank(data);
//      ParseUtils.setAllTags(objOfRoutes)
//
//  /* Use with ParseUtils.parseDataByOrder 
//   * var data = ParseUtils.addSourceTargetFieldsToRoutes(objOfRoutes[558])
//  /***********************************/
//
//  Object.keys(objOfRoutes).forEach(
//    function(el) {
//      if (el === "558" || 
//          el === "561" || 
//          el === "594" || 
//          //el === "597" || 
//          //el === "615" || 
//          el === "600" ) { 
//        objOfRoutes[el] = ParseUtils.addSourceTargetFieldsToRoutes(objOfRoutes[el])}
//    })
//
//  var routes = {};
//  routes["558"] = objOfRoutes["558"];
//  routes["561"] = objOfRoutes["561"];
//  routes["594"] = objOfRoutes["594"];
//  //routes["597"] = objOfRoutes["597"]; // parse error
//  routes["600"] = objOfRoutes["600"];
//  //routes["615"] = objOfRoutes["615"]; // parse error
//
//  var globalLinks = ParseUtils.sankeyLinksFromRoutes(routes)
//  var globalNodes = ParseUtils.sankeyNodesFromRoutes(routes)
//
//  var canvas = {};
//      canvas.margin = 30;
//      canvas.width = 2000 + 2*canvas.margin;
//      canvas.height = 440 + 2*canvas.margin;
//
//  var units = "Liters"
//
//  var formatNumber = d3.format(",.0f"),    // zero decimal places
//      format = function(d) { return formatNumber(d) + " " + units; },
//      color = d3.scale.category20();
//
//  var svg   = d3.select("body").append("svg").attr("width", canvas.width)
//                                             .attr("height", canvas.height)
//
// function runSankey() {
//  var sankey = d3.sankey()
//      .nodeWidth(16)
//      .nodePadding(100)
//      //.size([canvas.width-2*canvas.margin, canvas.height-2*canvas.margin])
//      .size([905,300])
//      .nodes(globalNodes)
//      .links(globalLinks)
//      .layout(32);
//
//  var link = svg.append("g").selectAll(".link")
//      .data(globalLinks)
//    .enter().append("path")
//      .attr("class", function(d) {
//          return  d.dy < 1 ? "link low" : "link"})
//      .attr("d", sankey.link())
//      .style("stroke-width", function(d) { 
//         return Math.max(1, d.dy); })
//      .sort(function(a, b) { return b.dy - a.dy; });
//  
//
//  // nodes
//  var node = svg.append("g").selectAll(".node")
//        .data(globalNodes)
//      .enter().append("g")
//        .attr("class", "node")
//        .attr("transform", function(d) { 
//        return "translate(" + d.x + "," + d.y + ")"; })
//      .call(d3.behavior.drag()
//        .origin(function(d) { return d; })
//        .on("dragstart", function() { 
//        this.parentNode.appendChild(this); })
//        .on("drag", dragmove));
//  
//  // rects for nodes
//    node.append("rect")
//        .attr("height", function(d) { 
//               return Math.max(2,d.dy); })
//        .attr("width", sankey.nodeWidth())
//        .style("fill", function(d,i) {
//        if (d.targetLinks.length === 1 &&
//            d.sourceLinks.length === 1 ){
//          var diff = d.sourceLinks[0].value - 
//                     d.targetLinks[0].value;
//        }
//        return diff > 0 ? "cyan" : "#fff"})
//        .style("stroke", function(d) { 
//        return "#888"
//        return d3.rgb(d.color).darker(2); })
//      .append("title")
//        .text(function(d) { 
//        return d.name + "\n" + format(d.value); });
//
//  // titles for the nodes
//    node.append("text")
//        .attr("x", -6)
//        .attr("y", function(d) { return d.dy / 2; })
//        .attr("dy", ".35em")
//        .attr("text-anchor", "end")
//        .attr("transform", null)
//        .text(function(d) { return d.name; })
//      .filter(function(d) { return d.x < canvas.width / 2; })
//        .attr("x", 6 + sankey.nodeWidth())
//        .attr("text-anchor", "start");
//
//    function dragmove(d) {
//      d3.select(this).attr("transform", 
//          "translate(" + d.x + "," + (
//                  d.y = Math.max(0, Math.min(300 - d.dy, d3.event.y))
//              ) + ")");
//      sankey.relayout();
//      link.attr("d", sankey.link());
//    }
//
//
//    } 
//
//
//    runSankey()
//
//    }
//
//  })
//})
//
