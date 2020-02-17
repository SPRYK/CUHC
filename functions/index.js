const functions = require("firebase-functions");

const express = require("express");
const cors = require("cors");
const xl = require("excel4node");
const mail = require("nodemailer");

const app = express();
const admin = require("firebase-admin");
admin.initializeApp();

app.use(express.json());
app.use(cors());

let transporter = mail.createTransport({
  service: "gmail",
  auth: {
    user: "itcunex@gmail.com",
    pass: "cunex@1234"
  }
});

app.post("/createAccount", (req, res) => {
  const stringDate = getNow();
  const user = {
    stuID: req.body.stuID,
    createdDate: stringDate,
    exportDate: "-",
    record: {
      congentinalDisease: req.body.congentinalDisease,
      drugAllergy: req.body.drugAllergy,
      height: req.body.height,
      weight: req.body.weight
    }
  };
  const snapshot = admin
    .database()
    .ref("/users")
    .child("/" + req.body.stuID)
    .set(user);
  res.status(201).json(user);
});

app.get("/test", (req, res) => {
  admin
    .database()
    .ref("users")
    .once("value", function(data) {
      data.forEach(function(childData) {
        childData.ref.update({
          exportDate: "-"
        });
      });
      res.json({ status: "good" });
    });
});

app.get("/mail", (req,res)=>{
  const message={   
  from: "CUNEX <itcunex@gmail.com>",
  to: "natthapol3011@gmail.com",
  subject: "TEST",
  text: "Hello from CUNEX!!!",}
  return transporter.sendMail(message, (error, info) => {
    if (error) {
      console.log("Error occurred");
      console.log(error.message);
      return res.send(error.toString());
    }
    return res.send("sended")
});
});

app.get("/export", (req, res) => {

  admin
    .database()
    .ref("users")
    .orderByChild("createdDate")
    .equalTo(getNow())
    .once("value", function(polyData) {
      polyData.forEach(function(childData) {
        childData.ref.update({
          exportDate: getNow()
        });
      });
      var workbook = new xl.Workbook();
      var ws = workbook.addWorksheet("แผ่นหลัก");
      var style = workbook.createStyle({
        font: {
          color: "#000000",
          size: 14
        },
        alignment: {
          horizontal : "center"
        }
      });
      ws.cell(1, 1).string("StudentID");
      var cnt = 2;
      polyData.forEach(function(dataChild) {
        ws.cell(cnt, 1).string(dataChild.child("stuID").val());
        cnt++;
      });
      var cnt = 2;
      ws.cell(1, 2).string("createdDate");
      polyData.forEach(function(dataChild) {
        ws.cell(cnt, 2).string(dataChild.child("createdDate").val());
        cnt++;
      });
      var cnt = 2;
      ws.cell(1, 3).string("exportDate");
      polyData.forEach(function(dataChild) {
        ws.cell(cnt, 3).string(getNow());
        cnt++;
      });
      var cnt = 2;
      ws.cell(1, 4).string("congentinalDisease");
      polyData.forEach(function(dataChild) {
        ws.cell(cnt, 4).string(dataChild.child("record/congentinalDisease").val());
        cnt++;
      });
      var cnt = 2;
      ws.cell(1, 5).string("drugAllergy");
      polyData.forEach(function(dataChild) {
        ws.cell(cnt, 5).string(dataChild.child("record/drugAllergy").val());
        cnt++;
      });
      var cnt = 2;
      ws.cell(1, 6).string("height");
      polyData.forEach(function(dataChild) {
        ws.cell(cnt, 6).string(dataChild.child("record/height").val());
        cnt++;
      });
      var cnt = 2;
      ws.cell(1, 7).string("weight");
      polyData.forEach(function(dataChild) {
        ws.cell(cnt, 7).string(dataChild.child("record/weight").val());
        cnt++;
      });
      workbook.writeToBuffer().then(function(buffer){
      const message = {
        from: "CUNEX <itcunex@gmail.com>",
        to: req.query.destination,
        subject: "CUNEX EXPORT",
        text: "ข้อมูล cunex export ของนิสิตลงทะเบียนยนศูนย์สุขภาพวันที่ "+req.query.date ,
        attachments: [
          {
            filename: "cunex-form(" + getNow() + ").xlsx",
            content: buffer
            
          }
        ]
      };
      return transporter.sendMail(message, (error, info) => {
        if (error) {
          console.log("Error occurred");
          console.log(error.message);
          return error.toString();
        }
        console.log("Message sent successfully");
        res.send("sended");
      });
    });
    });
});

app.get("/exportLeftover", (req, res) => {

  admin
    .database()
    .ref("users")
    .orderByChild("exportDate")
    .equalTo("-")
    .once("value", function(polyData) {
      polyData.forEach(function(childData) {
        childData.ref.update({
          exportDate: getNow()
        });
      });
      var workbook = new xl.Workbook();
      var ws = workbook.addWorksheet("แผ่นหลัก");
      var style = workbook.createStyle({
        font: {
          color: "#000000",
          size: 14
        },
        alignment: {
          horizontal : "center"
        }
      });
      ws.cell(1, 1).string("StudentID");
      var cnt = 2;
      polyData.forEach(function(dataChild) {
        ws.cell(cnt, 1).string(dataChild.child("stuID").val());
        cnt++;
      });
      var cnt = 2;
      ws.cell(1, 2).string("createdDate");
      polyData.forEach(function(dataChild) {
        ws.cell(cnt, 2).string(dataChild.child("createdDate").val());
        cnt++;
      });
      var cnt = 2;
      ws.cell(1, 3).string("exportDate");
      polyData.forEach(function(dataChild) {
        ws.cell(cnt, 3).string(getNow());
        cnt++;
      });
      var cnt = 2;
      ws.cell(1, 4).string("congentinalDisease");
      polyData.forEach(function(dataChild) {
        ws.cell(cnt, 4).string(dataChild.child("record/congentinalDisease").val());
        cnt++;
      });
      var cnt = 2;
      ws.cell(1, 5).string("drugAllergy");
      polyData.forEach(function(dataChild) {
        ws.cell(cnt, 5).string(dataChild.child("record/drugAllergy").val());
        cnt++;
      });
      var cnt = 2;
      ws.cell(1, 6).string("height");
      polyData.forEach(function(dataChild) {
        ws.cell(cnt, 6).string(dataChild.child("record/height").val());
        cnt++;
      });
      var cnt = 2;
      ws.cell(1, 7).string("weight");
      polyData.forEach(function(dataChild) {
        ws.cell(cnt, 7).string(dataChild.child("record/weight").val());
        cnt++;
      });
      workbook.writeToBuffer().then(function(buffer){
      const message = {
        from: "CUNEX <itcunex@gmail.com>",
        to: req.query.destination,
        subject: "CUNEX EXPORT",
        text: "ข้อมูล cunex export ของนิสิตลงทะเบียนยนศูนย์สุขภาพวันที่ "+req.query.date ,
        attachments: [
          {
            filename: "cunex-form(" + getNow() + ").xlsx",
            content: buffer
            
          }
        ]
      };
      return transporter.sendMail(message, (error, info) => {
        if (error) {
          console.log("Error occurred");
          console.log(error.message);
          return error.toString();
        }
        console.log("Message sent successfully");
        res.send("sended");
      });
    });
    });
});

app.get("/exportByDate", (req, res) => {

  admin
    .database()
    .ref("users")
    .orderByChild("createdDate")
    .equalTo(req.query.date)
    .once("value", function(polyData) {
      polyData.forEach(function(childData) {
        childData.ref.update({
          exportDate: getNow()
        });
      });
      var workbook = new xl.Workbook();
      var ws = workbook.addWorksheet("แผ่นหลัก");
      var style = workbook.createStyle({
        font: {
          color: "#000000",
          size: 14
        },
        alignment: {
          horizontal : "center"
        }
      });
      ws.cell(1, 1).string("StudentID");
      var cnt = 2;
      polyData.forEach(function(dataChild) {
        ws.cell(cnt, 1).string(dataChild.child("stuID").val());
        cnt++;
      });
      var cnt = 2;
      ws.cell(1, 2).string("createdDate");
      polyData.forEach(function(dataChild) {
        ws.cell(cnt, 2).string(dataChild.child("createdDate").val());
        cnt++;
      });
      var cnt = 2;
      ws.cell(1, 3).string("exportDate");
      polyData.forEach(function(dataChild) {
        ws.cell(cnt, 3).string(getNow());
        cnt++;
      });
      var cnt = 2;
      ws.cell(1, 4).string("congentinalDisease");
      polyData.forEach(function(dataChild) {
        ws.cell(cnt, 4).string(dataChild.child("record/congentinalDisease").val());
        cnt++;
      });
      var cnt = 2;
      ws.cell(1, 5).string("drugAllergy");
      polyData.forEach(function(dataChild) {
        ws.cell(cnt, 5).string(dataChild.child("record/drugAllergy").val());
        cnt++;
      });
      var cnt = 2;
      ws.cell(1, 6).string("height");
      polyData.forEach(function(dataChild) {
        ws.cell(cnt, 6).string(dataChild.child("record/height").val());
        cnt++;
      });
      var cnt = 2;
      ws.cell(1, 7).string("weight");
      polyData.forEach(function(dataChild) {
        ws.cell(cnt, 7).string(dataChild.child("record/weight").val());
        cnt++;
      });
      workbook.writeToBuffer().then(function(buffer){
      const message = {
        from: "CUNEX <itcunex@gmail.com>",
        to: req.query.destination,
        subject: "CUNEX EXPORT",
        text: "ข้อมูล cunex export ของนิสิตลงทะเบียนบนเว็ปศูนย์สุขภาพวันที่ "+req.query.date ,
        attachments: [
          {
            filename: "cunex-form(" + getNow() + ").xlsx",
            content: buffer
            
          }
        ]
      };
      return transporter.sendMail(message, (error, info) => {
        if (error) {
          console.log("Error occurred");
          console.log(error.message);
          return error.toString();
        }
        console.log("Message sent successfully");
        res.send("sended");
      });
    });
    });
});

app.post("/check", (req, res) => {
  admin
    .database()
    .ref("users")
    .orderByChild("stuID")
    .equalTo(req.body.stuID)
    .once("value", function(data) {
      if (data.exists()) {
        res.json({ status: "00", comment: "user already resgistered" });
      } else {
        res.json({ status: "01", comment: "user is fine for registragion" });
      }
    });
});

app.get("/getTime", (req,res) => {
  var message= {
    from : "CUNEX <itcunex@gmail.com>",
    to : req.query.dest,
    subject : "TimeTest",
    text : getAcctualTime(),//timezone GMT+0700
  };
  return transporter.sendMail(message, (error, info) => {
    if (error) {
      console.log("Error occurred");
      console.log(error.message);
      return error.toString();
    }
    console.log("Message sent successfully");
    res.send("sended");
  });

});

function getAcctualTime() {
  var nowUTC00 = new Date();
  var now = new Date(nowUTC00.getTime()+(420*60*1000));//convert timezone manually
  return now.toString();
};

function getNow() {
  var nowUTC00 = new Date();
  var now = new Date(nowUTC00.getTime()+(420*60*1000));//convert timezone manually
  var dd = now.getDate();
  var mm = now.getMonth();
  var yyyy = now.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + (mm+1);
  }
  return yyyy + "-" + mm + "-" + dd;
};

function Now() {
    var nowUTC00 = new Date();
    var now = new (nowUTC00.getTime()+(480*60*1000));    var dd = now.getDate();
    var mm = now.getMonth();
    var yyyy = now.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + (mm+1);
    }
    return dd + "-" + mm + "-" + (yyyy+543);
};

exports.api = functions.region("asia-east2").https.onRequest(app);
