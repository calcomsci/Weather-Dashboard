



var clear_button = $("#clear-history");
var current_city = $("#current-city");
var current_temp = $("#temperature");
var current_humidity= $("#humidity");
var current_wind_speed=$("#wind-speed");
var current_uv_index= $("#uv-index");

var search_button = $("#search-button");
var search_city = $("#search-city");
var city="";

var s_city=[];

function find(c){
    for (var i=0; i<s_city.length; i++){
        if(c.toUpperCase()===s_city[i]){
            return -1;
        }
    }
    return 1;
}
//api key
var APIKey="a0aca8a89948154a4182dcecc780b513";

function displayWeather(event){
    event.preventDefault();
    if(search_city.val().trim()!==""){
        city=search_city.val().trim();
        currentWeather(city);
    }
}

function currentWeather(city){
    
    var queryURL= "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey;
    $.ajax({
        url:queryURL,
        method:"GET",
    }).then(function(response){

        
        console.log(response);
        
        var weathericon= response.weather[0].icon;
        var iconurl="https://openweathermap.org/img/wn/"+weathericon +"@2x.png";
       
        var date=new Date(response.dt*1000).toLocaleDateString();
        
        $(current_city).html(response.name +"("+date+")" + "<img src="+iconurl+">");
       

        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        $(current_temp).html((tempF).toFixed(2)+"&#8457");
       
        $(current_humidity).html(response.main.humidity+"%");
        
        var ws=response.wind.speed;
        var windsmph=(ws*2.237).toFixed(1);
        $(current_wind_speed).html(windsmph+"MPH");
        
        UVIndex(response.coord.lon,response.coord.lat);
        forecast(response.id);
        if(response.cod==200){
            s_city=JSON.parse(localStorage.getItem("cityname"));
            console.log(s_city);
            if (s_city==null){
                s_city=[];
                s_city.push(city.toUpperCase()
                );
                localStorage.setItem("cityname",JSON.stringify(s_city));
                addToList(city);
            }
            else {
                if(find(city)>0){
                    s_city.push(city.toUpperCase());
                    localStorage.setItem("cityname",JSON.stringify(s_city));
                    addToList(city);
                }
            }
        }

    });
}
    
function UVIndex(ln,lt){
    
    var uvqURL="https://api.openweathermap.org/data/2.5/uvi?appid="+ APIKey+"&lat="+lt+"&lon="+ln;
    $.ajax({
            url:uvqURL,
            method:"GET"
            }).then(function(response){
                $(current_uv_index).html(response.value);
            });
}
    

function forecast(cityid){
    var dayover= false;
    var queryforcastURL="https://api.openweathermap.org/data/2.5/forecast?id="+cityid+"&appid="+APIKey;
    $.ajax({
        url:queryforcastURL,
        method:"GET"
    }).then(function(response){
        
        for (i=0;i<5;i++){
            var date= new Date((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
            var iconcode= response.list[((i+1)*8)-1].weather[0].icon;
            var iconurl="https://openweathermap.org/img/wn/"+iconcode+".png";
            var tempK= response.list[((i+1)*8)-1].main.temp;
            var tempF=(((tempK-273.5)*1.80)+32).toFixed(2);
            var humidity= response.list[((i+1)*8)-1].main.humidity;
        
            $("#fDate"+i).html(date);
            $("#fImg"+i).html("<img src="+iconurl+">");
            $("#fTemp"+i).html(tempF+"&#8457");
            $("#fHumidity"+i).html(humidity+"%");
        }
        
    });
}


function addToList(c){
    var listEl= $("<li>"+c.toUpperCase()+"</li>");
    $(listEl).attr("class","list-group-item");
    $(listEl).attr("data-value",c.toUpperCase());
    $(".list-group").append(listEl);
}

function invokePastSearch(event){
    var liEl=event.target;
    if (event.target.matches("li")){
        city=liEl.textContent.trim();
        currentWeather(city);
    }

}


function loadlastCity(){
    $("ul").empty();
    var s_city = JSON.parse(localStorage.getItem("cityname"));
    if(s_city!==null){
        s_city=JSON.parse(localStorage.getItem("cityname"));
        for(i=0; i<s_city.length;i++){
            addToList(s_city[i]);
        }
        city=s_city[i-1];
        currentWeather(city);
    }

}

function clearHistory(event){
    event.preventDefault();
    s_city=[];
    localStorage.removeItem("cityname");
    document.location.reload();

}

$("#search-button").on("click",displayWeather);
$(document).on("click",invokePastSearch);
$(window).on("load",loadlastCity);
$("#clear-history").on("click",clearHistory);





















