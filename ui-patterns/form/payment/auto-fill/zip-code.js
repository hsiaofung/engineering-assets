// ZIP CODE - (this uses jQuery so make sure to place it with the document.ready function)
$(document).ready(function () {
  function is_int(value) {
    if (parseFloat(value) == parseInt(value) && !isNaN(value)) {
      return true;
    } else {
      return false;
    }
  }

  $("#zip").keyup(function () {
    var el = $(this);

    // Did they type five integers?
    if (el.val().length == 5 && is_int(el.val())) {
      // Call Ziptastic for information
      $.ajax({
        url: "https://zip.getziptastic.com/v2/US/" + el.val(),
        cache: false,
        dataType: "json",
        type: "GET",
        success: function (result, success) {
          // Fill in the city / state data
          $("#city").val(result.city);
          $("#state").val(result.state);

          $("#zip").blur();
          $("#address-line-1").show().focus();
        },

        error: function (result, success) {
          $(".zip-error").fadeIn(300);
        },
      });
    } else if (el.val().length < 5) {
      $(".zip-error").fadeOut(200);
    }
  });
});
