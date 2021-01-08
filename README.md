# CHATBOT-using-TF-IDF-and-MERN
This is a chatbot which is created using javascript and is based on the TF-IDF algortihm for searching the best response like the search engines.
It uses local mongodb database to store the documents/answers.

insert documents into mongodb database-"chatbot" and collection-"QnA" in the form of
{
  response:"anything you want to insert"
}


## to get started

1)run "npm install"
2)then run "node app" to start the server
3)open "index.html"
4)ask anything from you chatbot

now whatever you want to ask type in the search box and if any word from your question matches the documents words then you will get the nearest accurate answer 
but if nothing matches then it will generate a random response.
