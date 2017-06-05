function firstClick(id){

    var form=document.getElementById('selectLayout-'+id.split('-')[1]);
    form.firstElementChild.style.setProperty('display','inline-table');

   //remove o icon antigo
   var icon=document.getElementById(id);
   icon.parentNode.removeChild(icon);

   form.setAttribute('type','submit');
   form.setAttribute('value','Submit');

   var glyphiconsend = document.createElement('i');
   glyphiconsend.className = "glyphicon glyphicon-check";
   glyphiconsend.setAttribute('style','display:none;');
   form.lastElementChild.appendChild(glyphiconsend);

   $(glyphiconsend).toggle('slide',function(){ glyphiconsend.parentNode.disabled=false;});
}
/**
Handlebars.registerHelper('isMe', function(v1, v2, options) {
    console.log(v1);
    console.log(v2);
    return (v1 == v2)? options.fn(this) : options.inverse(this);
});
 **/