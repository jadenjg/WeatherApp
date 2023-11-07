const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");






const app = express();

app.use(express.static("public"));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
require('dotenv').config();




const apiKey = `${process.env.API_KEY}`;
var city = "london";



app.get("/", function(req,res){



   
 const url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`


    https.get(url,function(response,body){
        

        console.log(response.statusCode);

        


        response.on("data",function(data){
            if (response.statusCode == "404"){
            console.log("incorrect city name please try again");
            
            city="london";
            res.redirect("/");
        } else {
            
            const weather = JSON.parse(data);
        
            const temp = Math.round(weather.main.temp*10)/10 ;
            const location = weather.name;
            const weatherDes= weather.weather[0].main;
            const humidity = weather.main.humidity;
            const windSpeed= weather.wind.speed;
            let  imgURL ='';

            let cssClass='';
            if (weatherDes =='Clear'){
                cssClass="sunny";
              imgURL="/assets/imgs/sun.png";
            }else{
                cssClass="cloudy";
                imgURL="/assets/imgs/cloud.png";
            }
           

            console.log(cssClass);

            res.render('index',{
                    icon:imgURL,
                    temperature: temp,
                    x: weatherDes, 
                    name: location, 
                    humidity:humidity, 
                    windSpeed:windSpeed,
                    cssClass:cssClass});

            }   
        })
        
        
    })

    
    
    

});






app.post('/',function(req, res){

    city = req.body.cityname;
    res.redirect("/");
})



app.listen(3000, function(){

    console.log("server running on port 3000");

} )