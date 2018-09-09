import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  
  email;
  list : Observable<any>;
  name;
  image;
  arr;
  key;
  url;
  show = false;

  constructor(public storeg : AngularFireStorage,public route : Router, public db : AngularFireDatabase,
   public auth : AngularFireAuth ) { 

    auth.authState.subscribe( res=> {

      if(res == undefined){
        route.navigate(['/']);
      }

      if(res != undefined){
        this.email = res.email;
        this.list = db.list("messages",ref => ref.orderByChild("email").equalTo(res.email)).snapshotChanges();

       
      db.list("users",ref => ref.orderByChild("email").equalTo(this.email)).snapshotChanges().subscribe(data => {
        this.name = data[0].payload.val()['name'];
        this.image = data[0].payload.val()['image'];
        this.key = data[0].key;
        this.url = window.location.host + "/" + data[0].payload.val()['name'];
      $(".load").remove();   
      $("#father").fadeIn();
      });


        
      }

    });

   
     
   }

  ngOnInit() {
    
    $(".add-bot,.load").height($(window).height());

    // Get the modal
var modal = document.getElementById('myModal');
var modal2 = document.getElementById('myModal2');
// Get the button that opens the modal
var btn = document.getElementById("myBtn");
var btn2 = document.getElementById("showstory");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
var hidestory = document.getElementById("hidestory");
// When the user clicks on the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";
}

btn2.onclick = function() {
  modal2.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
$(span).click(function(){
  modal.style.display = "none";

})

$(hidestory).click(function(){
  modal2.style.display = "none";

})


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
    
  }

  showbot(){
    $(".add-bot").css("display","flex");
  }

  hidebot(){
    $(".add-bot").css("display","none");

  }

  geturl(){
    $(".token-bot").css("display","flex");

  }

  hideurl(){
    $(".token-bot").css("display","none");
  }

  showStore(){
    $(".store").css("display","flex");
  }

  hidestore(){
    $(".store").css("display","none");

  }

  adddes(des){
    
    this.db.list("users").update(this.key,{
      des:des
    }).then( ()=> {
      $("#des").val("");
    $("#adddes").text("تم الاضافة");
    setTimeout(function(){
     $("#adddes").text("اضافة");
     $(".store").css("display","none");

    },2000 );
    });
  }

  addtoken(token,id){
    
    if(token.length > 10 && id.length > 4){

      $("#addbot").text("جاري التحقيق");

   var text = "اهلا بك ✨ لقد تم تفعيل البوت الخاص بك لاستلام الرسائل بشكل فوري من موقع رأيك تحياتنا - فريق العمل"
   $.get(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${id}&text=${text}`,(data)=>{
     $("#addbot").text("تم اضافة البوت");
     
     this.db.list("users").update(this.key,{
      token:token,
      id:id,
      bot:true
     })
    
    setTimeout(function(){
      $(".add-bot").css("display","none");
    },2000)

   }).fail(function(){
     $("#addbot").text("ادخل معلومات صحيحة");
   })

    }

  }

  logout(){
    this.auth.auth.signOut();
  
  }

  
 takePhoto(file){
  var ref = this.storeg.ref("images/" + file.target.files[0].name);

  var put = ref.put(file.target.files[0]);

  var sub = this.db.list("users",ref => ref.orderByChild("email").equalTo(this.auth.auth.currentUser.email)).snapshotChanges().subscribe(data => {

  
  put.then(ok => {
    ref.getDownloadURL().subscribe(url => {
      

      this.db.list("users").update(data[0].payload.key,{
        image:url
      });
    });
  });
});
 }

 copytext(){

  $(".header .mupload .filinput input").show();
  $(".copyview").fadeIn().delay("3000").fadeOut();
  var copyText = <HTMLInputElement>document.getElementById("acurl");

  /* Select the text field */
  copyText.select();

  /* Copy the text inside the text field */
  document.execCommand("copy");

  /* Alert the copied text */

}

delete(key){
  this.db.list("messages").remove(key)
}

}
