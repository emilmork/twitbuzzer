// Woooo. Don't look. This is a prototype-alpha code.
// Just too messy to be viewed by anyone. 

var socket = io.connect(window.location.hostname);
socket.on('new_tweet', function (data) {
  console.log(data);

  if ( data.type != "github") return;
  
  var id = data.data.id;

  var $item = $('[data-repo-id="'+id+'"]');


  if($item.length > 0) {
    var $plusOne = $("<span class='label success' />").html("+1");
    var $counter = $item.find(".count span");
    console.log("Counter obj:", $counter);
    var $counter_wrap = $item.find(".count");
    console.log("Counter wrapper obj:", $counter_wrap);

    $plusOne.appendTo($counter_wrap).hide();

    $plusOne.fadeIn("fast", function () {
      var $this = $(this);
      setTimeout(function () {
        $this.fadeOut("slow", function () {
          $this.remove();
        });
      }, 3000);
    });

    var counter = parseInt($counter.html()) + 1;
    console.log("Int value:", counter);
    $counter.html(counter);
    $item.attr("data-count", counter);

    console.log("Result:", $counter);


    // Move item up. 

    var $topItem = $("[data-count='"+(counter-1)+"']").first();

    console.log("Top item", $topItem);

    // Not already at top. 
    if ($topItem.length > 0 && $topItem.attr("data-repo-id") != id) {
      $item.fadeOut("slow", function () {
        var $oldItem = $(this).detach();
        console.log("Old item", $oldItem);

        $topItem.before($oldItem);
        $oldItem.fadeIn("slow");
      })
    }

    var obj = {
      notice: "Repo " + data.data.owner.login + "/" + data.data.name + " got another tweet! Is now at " + counter + " tweets."
    }

    var $alert = ich.alert(obj).appendTo(".sidebar").hide()

    $alert.fadeIn("fast", function () {
      var $this = $(this);
      setTimeout(function () {
        $this.fadeOut("slow", function () {
          $this.remove();
        });
      }, 5000);
    });

  } else {
    var obj = {
      notice: "Newly tweeted repo: " + data.data.owner.login + "/" + data.data.name + "!"
    }

    var $alert = ich.alert(obj).appendTo(".sidebar").hide()

    $alert.fadeIn("fast", function () {
      var $this = $(this);
      setTimeout(function () {
        $this.fadeOut("slow", function () {
          $this.remove();
        });
      }, 5000);
    });
  }


  // $("<p />").html("New " + data.type + " item").appendTo("body");
});


var page  = 1,
    history = 10000,
    limit = 10,
    scrollingMargin = 150,
    isLoading = false,
    keyword = "",
    timeoutSearch = "";

$(".alert-message").alert();

$("#searchInput").keyup(function () {

  clearTimeout(timeoutSearch);
  var keywordIn = $(this).val();
  console.log("Inside");
  if( keywordIn.length < 4 ) {
    keyword = "";
    page = 1;

    constructUrlAndFetchData();
    return;
  }

  console.log("keyword:", keywordIn);

  keyword = keywordIn;
  page = 1;

  timeoutSearch = setTimeout(function () {
    $("#content-box ul").html("");
    constructUrlAndFetchData();
  }, 600);
  
});



$("#timeSelect").live("change", function () {
  history = $(this).val();
  page = 1;

  $("#content-box ul").html("");
  constructUrlAndFetchData();
});

$(function () {
  var $loadMore = $("<p />").attr("id", "load-more-content");
  $("#content-box ul").after($loadMore);
  $loadMore.hide();

  constructUrlAndFetchData();

  $("[rel=twipsy]").twipsy({
    live: true
  });
});

infiniteScroll(scrollingMargin, function () {
  loadData("/github/" + history + "/" + limit + "/" + page);
});

function constructUrlAndFetchData () {
  var url = "/github/" + history + "/" + limit + "/" + page;

  if ( keyword.length >= 4 ) {
    url = "/github/" + keyword + "/" + history + "/" + limit + "/" + page;
  } 

  loadData(url);
}

function loadData (url) {
  isLoading = true;
  $("#load-more-content").fadeIn();
  $.getJSON(url, function (data) {
    $(data).each(function () {

      this.value.data.id = this._id;
      this.value.data.count = this.value.count;

      if(/\?/.test(this.value.data.owner.avatar_url)) {
        this.value.data.owner.avatar_url += "&s=30";
      } else {
        this.value.data.owner.avatar_url += "?s=30";
      }

      this.value.data.owner.url = "http://github.com/" + this.value.data.owner.login;

      var item = ich.item(this.value.data);
      $("#content-box ul").append(item);
    });
    isLoading = false;
    $("#load-more-content").fadeOut();
  });
}

function infiniteScroll (scrollingMargin, callback) {
  $(window).scroll(function() {
    if($(window).scrollTop() + scrollingMargin > $(document).height() - $(window).height() && !isLoading) {
      page += 1;
      callback();
    }
  });
}


$('#modal-from-dom').modal({
  keyboard: true,
  backdrop: true
});

$('.btn', '#modal-from-dom').live('click', function () {
  $('#modal-from-dom').modal('hide');
  return false;
});

$("[data-github-api]").live("click", function () {
  var url = $(this).attr("data-github-api");
  var $modal = $("#modal-from-dom");

  $modal.html("<p id='modal-loading'>Loading...</p>");

  $.ajax({
    type: "GET",
    dataType: "jsonp",
    url: url,
    contentType: "application/json"
  }).done(function( data ) {
    console.log("Data:", data);

    if(/\?/.test(data.data.owner.avatar_url)) {
      data.data.owner.avatar_url += "&s=30";
    } else {
      data.data.owner.avatar_url += "?s=30";
    }

    $modal.html(ich.modalbody(data.data));
    // $modal.modal('show');
  })

})


// Big up to Jeffrey Way for this noise generator (http://net.tutsplus.com/tutorials/javascript-ajax/how-to-generate-noise-with-canvas/)

function generateNoise(opacity) {
  if (!!!document.createElement('canvas').getContext) {  
    return false;  
  }
  
  var canvas = document.createElement("canvas"),  
  ctx = canvas.getContext('2d'),  
  x, y,  
  number,  
  opacity = opacity || .2;  
  
  canvas.width = 250;
  canvas.height = 250;
  
  for(x = 0; x < canvas.width; x++) {  
    for(y = 0; y < canvas.height; y++) {  
       number = Math.floor(Math.random() * 40); 
       ctx.fillStyle = "rgba(" + number + "," + number + "," + number + "," + opacity + ")";  
       ctx.fillRect(x, y, 1, 1);
    }  
  }  
  
  if(jQuery.browser.mozilla) {
    document.body.style.backgroundImage = "-moz-radial-gradient(center center, rgba(0, 0, 0, 0), rgba(0, 0, 0, .4)), url(" + canvas.toDataURL("image/png") + ")";
    document.getElementById("header").style.backgroundImage = "-moz-radial-gradient(center center, rgba(0, 0, 0, 0), rgba(0, 0, 0, .4)), url(" + canvas.toDataURL("image/png") + ")";

  } else {
    document.body.style.backgroundImage = "-webkit-gradient(radial, center 250, 0, center 250, 1000, from(rgba(0, 0, 0, 0)), to(rgba(0, 0, 0, .4))), url(" + canvas.toDataURL("image/png") + ")";
    document.getElementById("header").style.backgroundImage = "-webkit-gradient(radial, center 250, 0, center 250, 1000, from(rgba(0, 0, 0, 0)), to(rgba(0, 0, 0, .4))), url(" + canvas.toDataURL("image/png") + ")";
  }
}

$(document).ready(function() {
  generateNoise(.2);
});
