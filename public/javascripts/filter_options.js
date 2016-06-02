'use strict'
jQuery(document).ready(function($){

  var content = $("#filter").attr('id');
  $('#filterKey').change(function(){
    var key = $(this).val();
    var path = $('#filter').attr("action")+'/key?key='+ key;
    $.ajax({
      type:'GET',
      url:path,
      error: function(err){
        var msg = 'Status: ' + err.status + ': ' + err.responseText;
        alert(msg);
      },
      success: function (data) {
        $('#filterVal').empty().append('<option value="" selected disabled>Value</option>');
        for (var opt in data) {
          $('#filterVal').append('<option value=' + opt + '>' + opt + '</option>');
        }
      }
    })
  });
});
