//alert('studentjs called');

alert('Loading JS');

(function(){
    $(document).ready(function(){
        alert('heelo');
         var successFn=function(response){

                 alert('Success');

                 alert(response);
             };
             var errorFn=function(response){
                 alert('Error');
                 alert(response);
             };


$.ajax({
               type: 'GET',
	           url: '/bin/getjson',
    data:{
        param:'xxxx'
    },

    success:successFn,


    error:errorFn



	    });

    });
}) ();

