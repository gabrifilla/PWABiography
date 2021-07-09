$(document).ready(function () {
    $("#pesquisa").click(function () {
      var publicKey = "8f4cc787a1653cab670c4231170dca1e";
      var privateKey = "3bd9677e9831ed694c0200f2fc75fd68b797508a";
      var ts = Date.now();
      var hash = CryptoJS.MD5(ts + privateKey + publicKey);
      var name = $("#name").val();
      var url = "http://gateway.marvel.com/v1/public/characters?name=" + name + "&ts=" + ts + "&apikey=" + publicKey + "&hash=" + hash;
      //{url: url, type: "GET", datatype: "json"}
      $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function (data) {
          console.log(data);
          if(data['data']['total'] == 0){
            $('.personagem').empty();
            var html = '<h3>Personagem 404!</h3>';
            $('.personagem').append(html);
          }else{
            $('.personagem').empty();
            var html = '<img style="width:200px;" src="' + data['data']['results'][0]['thumbnail']['path'] + '.' + data['data']['results'][0]['thumbnail']['extension'] + '"><br><p>' + data['data']['results'][0]['name'] + '</p>';
            $('.personagem').append(html);
          }
        }
      });
    });
  });
