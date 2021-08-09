<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"> 
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Biography Form</title>
  <link href="assets/bootstrap.min.css" rel="stylesheet">
  <link href="assets/sweetalert2.min.css" rel="stylesheet">
  <link href="assets/datatables.min.css" rel="stylesheet">
  <link rel="manifest" href="manifest.webmanifest">
  <link rel="shortcut icon" href="#">
  <script src="assets/bootstrap.bundle.min.js"></script>
  <script src="assets/sweetalert2.all.min.js"></script>
  <script type="text/javascript" src="assets/jquery.min.js"></script>
  <script src="assets/datatables.min.js"></script>
  <script src="assets/core.min.js"></script>
  <script src="assets/md5.js"></script>
  <script src="js/script.js" type="module"></script>
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
<body style="background-color: #2d2d2d; color: white;">
  <div class="container col-12">
      <br>
    <div class="col-2">
      <div class="rounded-circle border border-success col-12" id="conStatus"></div>
    </div>
    <button class="btn btn-default" href="#">
      <img src="img/biography-header.png" alt="" width="400" height="100">
    </button><br>
    <h1>Conte-nos mais sobre você</h1>
    <div class="row">
      <div class="col-12">
        <label class="visually-hidden">Biografia: </label>
        <form id="bioForm" name="bioForm">
<!--          <input type="text" class="form-control" hidden id="id" name="id" placeholder="Id">-->
          <div class="form-group">
            <label for="name">Nome: </label>
            <input type="text" class="form-control" id="name" name="name" placeholder="Nome">
          </div>
          <div class="form-group">
            <label for="email">Email: </label>
            <input type="email" class="form-control" id="email" name="email" placeholder="Email">
          </div>
          <div class="form-group">
            <label for="celphone">Celular: </label>
            <input type="number" class="form-control" id="celphone" name="celphone" placeholder="Celular">
          </div>
          <div class="form-group">
            <label for="biography">Biografia: </label>
            <textarea type="textarea" class="form-control" id="biography" name="biography" rows="3" placeholder="Bio"></textarea>
          </div>
        </form>
      </div>
    </div>
    <br>
    <div class="row">
      <div class="col-4">
        <button class="btn btn-primary" id='saveBioOff'>Salvar biografia</button>
      </div>
      <div class="col-4">
        <button class="btn btn-primary" id='saveBioOn'>Sincronizar com banco</button>
      </div>
    </div>
    <hr>
    <div class="loading" hidden></div>
    <div class="col-12">
      <table id="bioTable" class="display" style="width: 100%">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Celular</th>
            <th>Biografia</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  </div>
</body>
</html>
