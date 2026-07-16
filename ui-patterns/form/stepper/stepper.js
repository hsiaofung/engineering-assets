$(".plus").click(function () {
  var counter = $(this).siblings().filter("input").val();
  counter++;
  $(this).siblings().filter("input").val(counter);
  return false;
});

$(".minus").click(function () {
  var counter = $(this).siblings().filter("input").val();
  if (counter > 0) {
    counter--;
    $(this).siblings().filter("input").val(counter);
  }
  return false;
});
