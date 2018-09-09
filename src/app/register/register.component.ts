import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { AngularFireAuth } from 'angularfire2/auth';
import {  AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router'
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {


  login = false;
  sign = true;

  constructor(public auth : AngularFireAuth,
    public db : AngularFireDatabase,
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
    $(".header, .header .overlay").height($(window).height());
    var navh = $("nav").innerHeight();

    $('#username').bind('copy paste, change', function (e) {
      e.preventDefault();
   });

   $("#username").attr("autocomplete","off")

   

   $("#username").keyup(function(){
    $(this).val($(this).val().toLowerCase());
   });
    
  }

  loginfun(){
    $("#signview").slideUp(200,function(){
      $("#loginview").slideDown();
      $("#loginview").css("display","inline-block");
      

    });
  }

  signfun(){
    $("#loginview").slideUp(200,function(){
      $("#signview").slideDown();

    });
  }


  loginac(email,pass){


    if(email.length > 4 && pass.length > 1){

      $("#logbtn").text("جاري الدخول ..")

this.auth.auth.signInWithEmailAndPassword(email,pass).then( ()=> {
  
  
  if(!this.auth.auth.currentUser.emailVerified){
    $("#logbtn").text("تسجيل الدخول");
    $("#errlog").fadeIn().delay("6000").fadeOut();
    $("#errlog p").text("قم بتفعيل حسابك");
    }

    if(this.auth.auth.currentUser.emailVerified){
  
      this.route.navigate(['/dashboard'])
    
    }

}).catch( err =>  {
  $("#logbtn").text("تسجيل الدخول");
  $("#errlog").fadeIn().delay("6000").fadeOut();

  if(err.message == "A network error (such as timeout, interrupted connection or unreachable host) has occurred."){
    $("#errlog p").text("لا يوجد اتصال بلشبكة");
  } 

  if(err.message == "The password is invalid or the user does not have a password."){
    $("#errlog p").text("كلمة مرور غير صحيحة");
  }

  if(err.message == "There is no user record corresponding to this identifier. The user may have been deleted."){
    $("#errlog p").text("لا يوجد حساب مرتبط");

  }

})
    }


  }



  register(name,email,pass){

  
    name.toLowerCase();
    name.replace(" ","");

    var ar = ["ا","ب","ب","ث","ج","ح","خ","د","ذ","ع","غ","ك","م","ن","ه","و","ي","ط","ض","ظ","ص","@","#","$","%","^","&","*","(",")","{","}","'",'"',"?","<","."];
    var en = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];


    
   if(name.length > 1 && email.length > 4 && pass.length > 1){

    if((name.charCodeAt() >= 65 && name.charCodeAt() <= 90) || (name.charCodeAt() >= 97 && name.charCodeAt() <= 122) || (name.charCodeAt() >= 48 && name.charCodeAt() <= 57)){

    $("#regbtn").text("جاري انشاء الحساب ..");

    var db = this.db.list("users",ref => ref.orderByChild("name").equalTo(name)).snapshotChanges();
    var sub = db.subscribe(userche => {

      if(userche[0] == undefined){

    this.auth.auth.createUserWithEmailAndPassword(email,pass).then(user => {

     this.auth.auth.currentUser.sendEmailVerification().then( ()=> {
      $("#suc").fadeIn().delay("6000").fadeOut();
      $("#suc p").text("تم ارسال رابط التفعيل");
      $("#regbtn").text("انشاء حساب");
      $("input").val("");

      this.db.list("users").push({
        name:name,
        email:email,
        image:"https://firebasestorage.googleapis.com/v0/b/raeak-iq.appspot.com/o/man.png?alt=media&token=cc38bf2e-5ea3-4210-bafe-25dcf3674013",
        ver:false,
        bot:false,
        id:0,
        des:"اخبرني رأيك الان بسرية تامة",
        token:"no"
      }).then( ()=> {

        var d = new Date();
        const monthNames = ["يناير", "فبراير", "مارس", "ابريل", "مايو", "يونيو",
        "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
      ];

        this.db.list("messages").push({
        date: monthNames[d.getMonth()]  + "/"  + d.getFullYear() + "/" + d.getDate(),
        text:"اهلا بك نشكرك على استخدام رأيك يمكنك الحصول على اراء متابعينك بسرية تامة من خلال مشاركة الرابط الخاص بك لمتابعينك نتمنى لك تجربة ممتعة",
        name:name,
        email:email
        })
      })

     });

    }).catch(err => {
      $("#regbtn").text("انشاء حساب");
      $("#loginp").hide().delay("6000").fadeIn()
      $("#err").fadeIn().delay("6000").fadeOut();

     if(err.message == "The email address is already in use by another account."){
      $("#err p").text("بريد الكتروني مستعمل");
     }

      if(err.message == "The email address is badly formatted."){
        $("#err p").text("بريد غير صالح");
      }

      if(err.message == "Password should be at least 6 characters"){
        $("#err p").text("كلمة مرور قصيرة");

      }

      if(err.message == "A network error (such as timeout, interrupted connection or unreachable host) has occurred."){
        $("#err p").text("لا يوجد اتصال بلشبكة");
      } 

    })

  }

  if(userche[0] != undefined){
    $("#regbtn").text("انشاء حساب");
    $("#loginp").hide().delay("6000").fadeIn()
    $("#err").fadeIn().delay("6000").fadeOut();
    $("#err p").text("اسم المستخدم محجوز");
  }

  sub.unsubscribe();

});

   }

  
  }

  }


}
