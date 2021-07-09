<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API - MARVEL</title>
  <link href="assets/bootstrap.min.css" rel="stylesheet">
  <link rel="manifest" href="manifest.webmanifest">
  <script src="assets/bootstrap.bundle.min.js"></script>
  <script type="text/javascript" src="assets/jquery.min.js"></script>
  <script src="assets/core.min.js"></script>
  <script src="assets/md5.js"></script>
  <script src="js/script.js"></script>
  <script src="./sw.js"></script>
  <script>
    window.addEventListener('load', ()=>{
        registerSW()
    })

    async function registerSW(){
        if('serviceWorker' in navigator){
            try{
                await navigator.serviceWorker.register('./sw.js')
            } catch(e){
                console.log(`SW registration failed`);
            }
        }
    }
  </script>
</head>
<body>
  <div class="container">
      <br>
    <img src="img/marvel.png" alt="" width="400" height="100"><br>
    <h1>ESCOLHA SEU PERSOGEM</h1>
    <div class="row">
      <div class="col-4">
        <label class="visually-hidden" for="inlineFormInputGroupUsername">Personagem</label>
        <div class="input-group">
          <div class="input-group-text">@</div>
          <input type="text" class="form-control" id="name" name="name" placeholder="Personagem">
        </div>
      </div>
      <div class="col-4">
        <button class="btn btn-primary" id='pesquisa'>Pesquisar</button>
      </div>
    </div>
    <hr>
    <div class="personagem"></div>
  </div>
</body>
</html>
