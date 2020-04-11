var appId = `edc25c96667041497c10beb2c9784ce3
`;

$("#search-btn").click(function() {
  var searchValue = $("#city-search-input").val();
$(".city-name").text(searchValue)
$("main-content").fadeOut();
  $.ajax({
    url: `https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=${appId}&units=metric`,
    method: "GET"
  }).then(function(response) {
    console.log(response);

    var temp = response.main.temp;
    var humidity = response.main.humidity;
    var windSpeed = response.wind.speed;
    var lat = response.coord.lat;
    var lon = response.coord.lon;

    $(".current-temperature").text(temp);
    $(".current-humidity").text(humidity);
    $(".current-wind-speed").text(windSpeed);

    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/uvi?appid=${appId}&lat=${lat}&lon=${lon}`,
      method: "GET"
    }).then(function(response2) {
      $(".current-uv-index").text(lat);
      $(".current-uv-index").text(lon);
      console.log(response2);
    });

    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/forecast?appid=${appId}&lat=${lat}&lon=${lon}&units=metric`,
      method: "GET"
    }).then(function(response3) {
      var { list: forcastArray } = response3;
      var endOfToday = moment()
        .utc()
        .endOf(`day`);
      var forcastContainer = $("#forcast-container");

      forcastContainer.empty();

      for (let index = 0; index < forcastArray.length; index++) {
        var {
          dt: timestamp,
          main: { temp, humidity }
        } = forcastArray[index];
        var date = moment(timestamp * 1000).utc();

        if (date.isSameOrBefore(endOfToday) || date.hour() != 0) {
          continue;
        }
        console.log(date.format());

        var forcastElem = $("#forcast-to-be-cloned").clone();
        forcastElem.removeAttr("id");

        forcastElem.find(".forcast-date").text(date.format("DD MM YYYY"));
        forcastElem.find(".forcast-temp").text(temp);
        forcastElem.find(".forcast-humidity").text(humidity);

        forcastContainer.append(forcastElem);
      }
    });
  });
});

$("#city-search-input").keydown(function(event) {
  if (event.which === 13) {
    $("#search-btn").trigger("click");
  }
});
