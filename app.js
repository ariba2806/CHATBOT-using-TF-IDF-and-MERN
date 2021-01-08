const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const express=require('express');
const bodyParser=require('body-parser');
const app=express();
//const mongoose=require('mongoose');
const port=5000;
  const sessionId = uuid.v4();
app.use(bodyParser.urlencoded({
    extended:false
}))
//helps display code in ejs tarnsfered from this file
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
  
    // Pass to next layer of middleware
    next();
  });
//term frequency code formula-no of occurences of this word in a doc/total no. of words in that doc
function tf(doc,term){
   var result = 0;
        for (var j=0;j<doc.length;j++) {
            if (term==doc[j])
                result++;
        }
        return result / doc.length;
}
//inverse document frequency function formula-no of documents/no of documents containing that word
//determines the importance of a word within number of documents
 function idf(docs,term) {
        var n = 0;
        for (var j=0;j<docs.length;j++) {
            for (var k=0;k<docs[j].length;k++) {
                if (term==docs[j][k]) {
                    n++;
                    break;
                }
            }
        }
        return Math.log(docs.length / n);
    }
    //tf-idf=tf*idf
    function tfIdf(doc,docs, term) {
        return tf(doc, term) * idf(docs, term);

    }
  var count=0;
  var str="hello";
  var newobj={"question":"" ,"response":""};

//send-msg request called when a user enters a query
app.post('/send-msg',(req,res)=>{


  //get all the documents from the collection in an array and split each document into words to efficiently match words ahead
  var arr=[];
var arr1=[];
var finaldoc="hello";
var MongoClient = require('mongodb').MongoClient; 
 var url = "mongodb://localhost:27017/chatbot";  
 MongoClient.connect(url, function(err, db) {  
  if (err) throw err;  
  db.collection("QnA").find({}).toArray(function(err, result) {  
    if (err) {
        console.log(err);
    } else {
        for(var i=0;i<result.length;i++){
          var sentence=result[i].response.toLowerCase();
          var words=sentence.split(" ");
          arr.push(words);
          
        }
    }
   db.close();  
     console.log("docs "+ arr);

//getting question from user and using it to find most matching response
    var quest=req.body.MSG.toLowerCase();
     var questi=quest.split(" ");
     var war=[];
     //make a matrix of words contained in ques and the different documents and calculate each documents TF-IDF accuracy by adding the tf-idf 
     //of every word in ques contained in each doc
     for(var q=0;q<arr.length;q++){
    var c=0;
       for(var p=0;p<questi.length;p++){
         var termi=questi[p];
         var d=tfIdf(arr[q],arr,termi);
         //excluding very common words which dont have value
         if(termi=="is" || termi=="for" || termi=="then" || termi =="and" || termi=="or" || termi=="if" || termi=="in" || termi =="on" ||
          termi=="the" || termi=="to" || termi=="it" ){
            d=0;
          }
          else if(isNaN(d)){
           d=0;
         }
          else{
          d=tfIdf(arr[q],arr,termi);
          }
         
        
         c=c+d;
         //console.log("d value "+d);

       }
       war.push(c);
     }
     console.log("final array "+war);
     //find the document with the highest TF-IDF number and get its response 
     var largest= 0;
    var index=0;
   for (i=0; i<=war.length;i++){
      if (war[i]>largest) {
        largest=war[i];
        index=i;
      }
   }
   //if the largest in array is 0 means that no word of question matches to the split array of documents hence no match
    if(largest==0){
      var xoxo=Math.floor(Math.random()*46);
      console.log("rendommmeeeest "+xoxo);
     // var xyz=result[xoxo].response;
        res.send({Reply:result[xoxo].response});
   var today=new Date();
newobj={
  "question":req.body.MSG,
  "response":result[xoxo].response,
  "time":today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() +'  '+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(),
};

    }
    //if even one word of question and responses match return that document in which the matched word is present
    else{
   console.log("largest at index "+index);
   console.log("hence final document is "+result[index].response);
   res.send({Reply:result[index].response});
   var today=new Date();
newobj={
  "question":req.body.MSG,
  "response":result[index].response,
  "time":today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() +'  '+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(),
  };
    }

//insert the response and question document in IT_chatbot collection as chat history
var MongoClient = require('mongodb').MongoClient;  
var url = "mongodb://localhost:27017/chatbot";  
MongoClient.connect(url, function(err, db) {  
if (err) throw err;  
db.collection("IT_chatbot").insertOne(newobj, function(err, res) {  
if (err) throw err;  
console.log("1 record inserted");  
db.close();  
});  
});
});  
 
}); 
})

// display chat history from mongodb collection IT_chatbot
app.get("/", function (req, res) {
res.render("index",{ details: null })
});
app.get("/read",async(req,res)=>{
 var MongoClient = require('mongodb').MongoClient; 
 var url = "mongodb://localhost:27017/chatbot";  
 MongoClient.connect(url, function(err, db) {  
  if (err) throw err;  
  db.collection("IT_chatbot").find({}).toArray(function(err, result) {  
    if (err) {
        console.log(err);
    } else {
        res.render("index", { details: result })
        //console.log(result);
    }
    db.close();  
  });  
}); 
})


//listen to port
app.listen(port,()=>{
    console.log("running on port "+port);
})


