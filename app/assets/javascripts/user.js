//= require jquery
//= require jquery_ujs
//= require jquery.ui.all
//= require twitter/bootstrap
//= require ckeditor/init
//= require websocket_rails/main
//= require_self

function custom_json_parse(data){
  for(var i in data){
    if(data[i] === null) data[i]  = "";
  }
  return data;
}

var dispatcher = new WebSocketRails('localhost:3000/websocket');
var submission_channel = dispatcher.subscribe('submissions');
// var score_channel = dispatcher.subscribe("user_scores");
submission_channel.bind('user_disconnected', function(data) {
  console.log(data.name + " has been disconnected");
});

submission_channel.bind("update", function(data){
  console.log("update score board");
  console.log(data);
  html = "";
  for(var score in data){
    score = data[score]
    var xtr = '<tr><td>' + score.email + '</td><td><div class="progress progress-striped progress-success"><div class="bar" style="width:' + score.percent + '%;"></div></div></td><td>' + score.point + '</td></tr>'
    html += xtr;
  }
  $("table#user-scores tbody").html(html);
})

submission_channel.bind("show", function(data){
  console.log("update contest score board");
  console.log(data);
  html = "";
  for(var score in data){
    score = data[score]
    var xtr = $("<tr>");
    xtr.attr("id", score.id);
    xtr.append('<td>' + score.email + '</td>');
    for(var xc in score.scores){
      var xtd = $("<td>");
      xtd.attr("style", "text-align:center;");
      var xct = $("<center>");
      var xdiv = $("<div>");
      xdiv.attr("style", "width:120px;");
      var xhtml = ""
      if (score.scores[xc] > 0){
        xhtml = '<button class="btn btn-block btn-success">'+score.scores[xc]+'</button>';
      }else if(score.scores[xc] == 0){
        xhtml = '<button class="btn btn-block btn-inverse">'+score.scores[xc]+'</button>';
      }else{
        xhtml = '';
      }
      xtr.append(xtd.html(xct.html(xdiv.html(xhtml))));
    }
    xtr.append('<td><button class="btn btn-block btn-danger">'+score.total_score+'</button></td>');
    html += xtr[0].outerHTML;
  }
  $("table#contest-scores tbody").html(html);
})
