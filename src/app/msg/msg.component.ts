import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-msg',
  templateUrl: './msg.component.html',
  styleUrls: ['./msg.component.css']
})
export class MsgComponent implements OnInit {

  token;
  id;
  image;
  des;
  name;
  ver = false;
  found=false;
  email;
  constructor( public db : AngularFireDatabase, public route : ActivatedRoute) { 

  db.list("users",ref => ref.orderByChild("name").equalTo(this.route.snapshot.paramMap.get("id"))).valueChanges().subscribe(data => {
 
    if(data[0] != undefined){
      $(".cssload-thecube").hide();
      this.found = true;
      this.image = data[0]['image'];
      this.token = data[0]['token'];
      this.id = data[0]['id'];
      this.name = data[0]['name'];
      this.email = data[0]['email'];
      this.des = data[0]['des'];
      this.ver = data[0]['ver'];    
    }

    if(data[0] == undefined){
      $(".cssload-thecube").hide();
      $("#notfound").show();
    }

  });


}

  ngOnInit() {
    $(".header, .header .overlay, .upload-view").height($(window).height());
    var navh = $("nav").innerHeight();
    $('.header-content').height($(window).height() - navh);
    
  }


  send(text){

    if(text.length > 1){
      var d = new Date();
      $("#send").text("جاري الارسال");

      const monthNames = ["يناير", "فبراير", "مارس", "ابريل", "مايو", "يونيو",
        "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
      ];
  
      this.db.list("messages").push({
        date: monthNames[d.getMonth()]  + "/"  + d.getFullYear() + "/" + d.getDate(),
        text:text,
        name:this.name,
        email:this.email
      }).then( ()=> {
        $("textarea").val("");
        $("#send").text("تم الارسال");
        setTimeout(function(){
          $("#send").text("ارسال");   
        },3000);

      

      })
    }


    
  }

}
