var sectionHeight = function() {
  var total    = $(window).height(),
      $section = $('section').css('height','auto');
}
$(window).resize(sectionHeight);

// Show table of contents for the current content
$(function() {
  $("section h1, section h2, section h3").each(function(index){
    if ($(this).text() == "Search Result:") return;
    $("nav ul").append("<li class='tag-" + this.nodeName.toLowerCase() + "'><a href='#toc-" + index + "'>" + $(this).text() + "</a></li>");
    $(this).attr("id", "toc-" + index);
    $("nav ul li:first-child a").parent().addClass("active");
  });

  $("nav ul li").on("click", "a", function(event) {
    var position = $($(this).attr("href")).offset().top - 190;
    $("html, body").animate({scrollTop: position}, 400);
    $("nav ul li a").parent().removeClass("active");
    $(this).parent().addClass("active");
    event.preventDefault();
  });

  sectionHeight();
  $('img').on('load', sectionHeight);
});
