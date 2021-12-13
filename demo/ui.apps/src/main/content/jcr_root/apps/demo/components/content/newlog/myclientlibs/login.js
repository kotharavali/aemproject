alert('mylogin page');
alert('myjs called');
// Get the modal
var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
$(document).ready(function(){
    alert('ready function');

  $("button").click(function(){

    alert('click function');

      var uname= $('#uname').val();

      alert('username---'+uname);
      $.ajax({
    
    url: '/bin/login?username=uname',
    type: 'POST',        
    success: function(data) {
       
    }
});
  });
});