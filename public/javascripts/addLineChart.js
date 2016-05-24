'use strict'
//addLineChart is with lineChart.js, it is used to add new custom chart according to the user's preference
var id = 0;
var fields = {
  'open':['total','avgDisReq','medDisReq','avgBidAmt','medBidAmt'],
  'executed':['total','avgSave','avgAmtSave','medAmtSave','avgPrice','medPrice','avgAmt','medAmt']
};

$(".dropdown").children(".selStat").change(function(){
  var stat = $(this).val();
  var parent = $(this).parent();
  parent.children(".selField").empty();
  parent.children(".selField").append("<option value='' disabled selected>----Field----</option>");
  fields[stat].forEach(function(f){
    parent.children(".selField").append("<option value='" + f +"'>" + f + "</option>'");
  });
});

console.log(typeof data);
$("#newBTN").click(function(){
  $("<div id='graph" + id + "' class='dGraph'></div>").insertBefore("#createChart");
  var stat1 = $(".selStat:eq(0)").val();
  var stat2 = $(".selStat:eq(1)").val();
  var val1 = $(".selField:eq(0)").val();
  var val2 = $(".selField:eq(1)").val();
  var field = {'Status':[stat1,stat2],'Field':[val1,val2]};
  var graph = 'graph' + id;
  createGraph(graph,field['Status'],field['Field'],data);
  createDateLabel(graph + '-transform');
  createLegend(graph + '-transform',field['Status'],field['Field']);
  displayValueLabelsForPositionX(graph + '-transform',w,field['Status'],field['Field'],data);

  $('#'+graph).mousemove(function(event) {
    var hoverLineXOffset = m[3]+$('#'+graph).offset().left;
    var hoverLineYOffset = m[0]+$('#'+graph).offset().top;
    var hoverLine = [hoverLineXOffset,hoverLineYOffset];
		handleMouseOverGraph(graph,event,field['Status'],field['Field'],hoverLine,data);
  });
  $('#' + graph).append("<button class='delBTN'>Delete</button>")
  id += 1;

  $(".zoomBTN").click(function(){

    //console.log(selectDate.getCurrentAttributes().x1,selectDate.getCurrentAttributes().x2);
    var x = d3.time.scale().domain([startTime, endTime]).range([0, w]);
    var hoverLineXOffset = m[3];
    var startPos = selectDate.getCurrentAttributes().x1 - hoverLineXOffset;
    var endPos = selectDate.getCurrentAttributes().x2 - hoverLineXOffset;

    //TODO: bind each field correctly to the legend
    var d = data;
    // get the date on x-axis for the current location
    var start = x.invert(startPos);
    var end = x.invert(endPos);
    // Calculate the value from this date by determining the 'index'
    // within the data array that applies to this value
    var indexL = (start.getTime() - startTime) / timeStep;
    var indexR = (end.getTime() - endTime) / timeStep;
    if(indexL >= d.length) {
      indexL = d.length-1;
    }
    if(indexR >= d.length) {
      indexR = d.length-1;
    }
    // The date we're given is interpolated so we have to round off to get the nearest
    // index in the data array for the xValue we're given.
    // Once we have the index, we then retrieve the data from the d[] array
    indexL = Math.round(indexL);
    indexR = Math.round(indexR);

    $(this).parent().next('.dGraph').remove();
    var parentID = $(this).parent().attr('id');
    $("<div id='" + parentID + "-zoom" + "' class='dGraph'></div>").insertAfter("#" + parentID);
    //var status = $(this).parent().children("input[name~='status']").val();
    var status = $("#" + parentID + " :input[name='status']").val().split(',');
    var field = $("#" + parentID + " :input[name='field']").val().split(',');
    var graphZoom = parentID + '-zoom';
    console.log('before')
    createGraph(graphZoom,status,field,data.slice(indexL,indexR));
    createDateLabel(graphZoom + '-transform');
    createLegend(graphZoom + '-transform',status,field);
    displayValueLabelsForPositionX(graphZoom + '-transform',w,status,field,data.slice(indexL,indexR));

    $('#'+graphZoom).mousemove(function(event) {
      var hoverLineXOffset = m[3]+$('#'+graphZoom).offset().left;
      var hoverLineYOffset = m[0]+$('#'+graphZoom).offset().top;
      var hoverLine = [hoverLineXOffset,hoverLineYOffset];
      handleMouseOverGraph(graphZoom,event,status,field,hoverLine,data.slice(indexL,indexR));
    });
    $('#' + graphZoom).append("<button class='delBTN'>Delete</button>")
    $('#' + graphZoom).on('click','.delBTN',function(event){
      $(this).parent().remove();
    });
    selectDate.remove();
    $("#" + parentID).children(".zoomBTN").hide();
  });

  $('#' + graph).on('click','.delBTN',function(event){
    var parentID = $(this).parent().attr('id');
    console.log(parentID);
    $("#"+parentID).remove();
    if(!parentID.includes('zoom')){
      $("#"+parentID+'-zoom').remove();
    }
  });


  //clean up the dropdown after generate the new chart
  $(".selStat").val('');
  $(".selField").val('');
});
