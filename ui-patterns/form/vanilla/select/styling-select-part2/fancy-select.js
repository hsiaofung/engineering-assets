// --------- CUSTOM JS CODE ---------

// loops through the select and creates a div with an ul and li items that we can easiliy style with CSS. The select box code is still there it is just hidden from the browser or if no js then you don't get the fancy version, so this option degrades nicely
$('.fancySelect').each(function(){
    var $this = $(this), numberOfOptions = $(this).children('option').length;
  
    // creates new html elements
    $this.addClass('selectHidden'); 
    $this.wrap('<div class="select"></div>');
    $this.after('<div class="selectStyled"></div>');

    var $styledSelect = $this.next('div.selectStyled');
    $styledSelect.text($this.children('option').eq(0).text());
  
    // create the ul
    var $list = $('<ul />', {
        'class': 'selectOptions'
    }).insertAfter($styledSelect);
  
    for (var i = 0; i < numberOfOptions; i++) {
        $('<li />', {
            text: $this.children('option').eq(i).text(),
            rel: $this.children('option').eq(i).val()
        }).appendTo($list);
    }
  
    // this part adds/removes the active class from the ul (opens and closes the menu) 
    var $listItems = $list.children('li');
  
    $styledSelect.click(function(e) {
        e.stopPropagation();
        $('div.selectStyled.active').not(this).each(function(){
            $(this).removeClass('active').next('ul.selectOptions').hide();
        });
        $(this).toggleClass('active').next('ul.selectOptions').toggle();
    });
  
    $listItems.click(function(e) {
        e.stopPropagation();
        $styledSelect.text($(this).text()).removeClass('active');
        $this.val($(this).attr('rel'));
        $list.hide();
    });
  
    $(document).click(function() {
        $styledSelect.removeClass('active');
        $list.hide();
    });

});