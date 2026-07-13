// password help-tip
// hide the password helper text div
document.querySelector('#tt').classList.add('hide');
// make the tooltip able to close on click
const tooltip = document.querySelector('.tooltip');
tooltip.addEventListener('click', function(){
    document.querySelector('#tt').classList.toggle('show'); // togle the tooltip to show or hide
    document.querySelector('#tt').classList.toggle('hide');
})

//city help-tip
 // hide the helper text div
document.querySelector('#cty').classList.add('hide'); // hide the tooltip on page load
const cityTooltip = document.querySelector('.tooltip.city');
cityTooltip.addEventListener('click', function(){
    document.querySelector('#cty').classList.toggle('show'); // togle the tooltip to show or hide
    document.querySelector('#cty').classList.toggle('hide');
})