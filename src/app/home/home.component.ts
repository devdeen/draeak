import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { WOW } from 'wowjs/dist/wow.min';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  filename = "اسم الملف";
  copy = false;
  upload = true;

  constructor(public storeg : AngularFireStorage, public db : AngularFireDatabase,
    public auth : AngularFireAuth,
    public route : Router) { 

    auth.authState.subscribe( res=> {

      if(res != undefined){
        
        if(res.emailVerified){
        route.navigate(['/dashboard']);
        $(".fathers").fadeIn();
        }
      }

    });

  }

  ngOnInit() {
    $(".header, .header .overlay, .upload-view").height($(window).height());
    var navh = $("nav").innerHeight();
    $('.header-content').height($(window).height() - navh);

    
  }

  ngAfterViewInit(){

    var wow = new WOW({
      live: false
  });
    wow.init();

  
 
  }


  selectfile(file){

    var d = new Date();

    const monthNames = ["يناير", "فبراير", "مارس", "ابريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ];
    
    var char = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","A","B","C","D","E","F","J"];
    var rand1 = Math.floor(Math.random() * char.length);
    var rand2 = Math.floor(Math.random() * char.length);
    var rand3 = Math.floor(Math.random() * char.length);
    var rand4 = Math.floor(Math.random() * char.length);
    var rand5 = Math.floor(Math.random() * char.length);
    var rand = char[rand1] + char[rand2] + char[rand3] + char[rand4] + char[rand5];



    $(".upload-view").css("display","flex");
    
    var ref = this.storeg.ref("folders/" + file.target.files[0].name);

    var put = ref.put(file.target.files[0]);
  
    put.percentageChanges().subscribe(present => {
     $(".progress-bar").animate({
       width:present + "%"
     },100);
     $(".progress-bar").text(Math.floor(present) + "%");
    })

    put.then(ok => {
      ref.getDownloadURL().subscribe(url => {
        this.copy = true;
        this.upload = false;
        $(".header .mupload .filinput input").hide();
       $(".upload-view").fadeOut();
       $("#fileurl").val(window.location.href + rand);
       $("#fileurl").removeAttr("readonly");

       
 
       this.db.list("public").push({
         url:url,
         name:file.target.files[0].name,
         date: d.getFullYear() + "/" + d.getDate() + "/" + monthNames[d.getMonth()],
         word:rand
       });


      });
    
    });
    
  }


  copytext(text){

    this.upload = true;
    this.copy = false;
    $(".header .mupload .filinput input").show();
    $(".copyview").fadeIn().delay("3000").fadeOut();
    var copyText = <HTMLInputElement>document.getElementById("fileurl");

    /* Select the text field */
    copyText.select();
  
    /* Copy the text inside the text field */
    document.execCommand("copy");
  
    $(copyText).val("");
    /* Alert the copied text */

  }

  fed(name,email,msg){
    var text =  `{name: ${name}, email: ${email}, msg: ${msg}}`;
    $("#fed").text("جاري الارسال");

    $.get("https://api.telegram.org/bot627557311:AAEwVUtDIouxrftgIawXkmYctUfTqasv2AQ/sendMessage?chat_id=578601940&text=" + text,function(){
      $("#fed").text("تم الارسال");
      $("inpute").value("");
      setTimeout(function(){
        $("#fed").text("ارسال الرسالة");
      },2000)
    });
  }

}
