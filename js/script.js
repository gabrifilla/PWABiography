let table;
let inCon;
updateStatus();

$(document).ready(function (e) {
  // Verify internet connection
  window.addEventListener('online', updateStatus);
  window.addEventListener('offline', updateStatus);

  let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

  // Verifying if the indexDb is supported in the user browser
  if (!window.indexedDB) {
    Swal.fire({
      title: 'Falha!',
      text: 'Sinto muito, porém parece que o seu browser não suporta o IndexDB',
      icon: 'warning'
    });
    console.log('This browser doesn\'t support IndexedDB');
    return;
  }

  // Creating the indexDatabase
  let bioDb = indexedDB.open('biographyDb', 1);
  let db;
  bioDb.onupgradeneeded = function (e){
    db = e.target.result;

    console.log('Creating a new object');
    if(!db.objectStoreNames.contains('biographies')){
      let objSt = db.createObjectStore('biographies', {keyPath:'id', autoIncrement: true});
      objSt.createIndex('name', 'name', {unique: false});
      objSt.createIndex('email', 'email', {unique: true});
      objSt.createIndex('celphone', 'celphone', {unique: true});
      objSt.createIndex('biography', 'biography', {unique: false});
    }
  }

  // Saves the biography information to the DB.
  // If offline, saves to Indexed DB then sincronizes with online DB.
  // If online, saves directly to DB
  // Executes the below code by clicking on the button with id "saveBio"
  $("#saveBioOff").click(function () {
    // Get all data from form #bioForm
    let formData = $("#bioForm").serializeArray();
    let formDataArr = {};

    $.map(formData, function(n,i){
      formDataArr[n['name']] = n['value'];
    });

    // Send all form data to the method to save the information on the IndexedDB
    let db = bioDb.result;

    let tx = db.transaction('biographies','readwrite');
    let store = tx.objectStore('biographies');

    let storeSave = store.put(formDataArr);

    // Method to save the information gotten in "formDataArr" to the IndexDb
    storeSave.onsuccess = function (e){
      // Verify if there is internet connection
      if(inCon){
        Swal.fire({
          title: 'Sucesso!',
          text: 'Informações cadastradas com sucesso. Verifiquei que possui conexão com a internet,' +
            ' gostaria de salvar as informações na núvem?',
          icon: 'success',
          showCloseButton: true,
          showCancelButton: true,
          confirmButtonText: 'Sim, por favor!',
          cancelButtonText: `Não, obrigado!`
        }).then((result) => {
          if (result.isConfirmed) {
            $("#saveBioOn").trigger( "click" );
          }
        });
      }else{
        Swal.fire({
          title: 'Sucesso!',
          text: 'Informações cadastradas com sucesso, porém verifiquei que não possui conexão com a internet,' +
            ' por favor reestabeleça a conexão para salvar as informações na núvem.',
          icon: 'success',
          showCloseButton: true,
          confirmButtonText: 'Okay, obrigado!'
        });
      }
    }
  });

  // Method that verifies the click on specified button
  // Saves the data from indexDB to online database MySQL
  $("#saveBioOn").click(function () {
    if(inCon){
      let db = bioDb.result;

      // Open the transaction as readonly and select the objectStore that we want to get the data from
      let tx = db.transaction('biographies', 'readonly');
      let store = tx.objectStore('biographies');

      // Does the select to get all data stored in the specified objectStore
      let data = store.getAll();

      // On success from getting the indexdb data, saves that data to MySQL;
      data.onsuccess = function (e) {
        let result = JSON.stringify(data.result);
        // Url that contains the data to pass it to the  ajax
        $.ajax({
          url: 'dbHandler/saveMysql.php',
          type: "POST",
          dataType: "json",
          data: {result: result},
          success: function (data) {
            if(data){
              Swal.fire({
                title: 'Sucesso!',
                text: 'Opa! Todas as informações foram inseridas corretamente.',
                icon: 'succcess',
                showCloseButton: true,
                confirmButtonText: 'Ok!'
              });
            }else{
              Swal.fire({
                title: 'Erro!',
                text: 'Sinto muito, algo ocorreu e não foi possível salvar as informações.',
                icon: 'error',
                showCloseButton: true,
                confirmButtonText: 'Ok!'
              });
            }
          }
        });
      }

      data.onerror = function (e) {
        Swal.fire({
          title: 'Erro!',
          text: 'Sinto muito, algo ocorreu e não foi possível recuperar as informações locais.',
          icon: 'error',
          showCloseButton: true,
          confirmButtonText: 'Ok!'
        });
        console.error(e);
      }
    }else{
      Swal.fire({
        title: 'Erro!',
        text: 'Sinto muito, você não possui conexão com a internet para executar esta ação.',
        icon: 'error',
        showCloseButton: true,
        confirmButtonText: 'Ok!'
      });
    }
  });

  // Timeout so that the datatable can load with the information
  setTimeout(function(){
    loadDT(bioDb);
  }, 500);

  // Method to get the data from clicking a row on the Table
  $('#bioTable tbody').on( 'click', 'tr', function () {
    let rowData = table.row(this).data();

    // Set the values from the selected row to the inputs
    $('#id').val(rowData.id);
    $('#name').val(rowData.name);
    $('#email').val(rowData.email);
    $('#celphone').val(rowData.celphone);
    $('#biography').val(rowData.biography);

    // Verify if it is selected just for styling
    if ($(this).hasClass('selected')) {
      $(this).removeClass('selected');
    }
    else {
      table.$('tr.selected').removeClass('selected');
      $(this).addClass('selected');
    }
  } );
});

// Method to get the information from IndexDb
function updateStatus(){
  let status = $('#conStatus');
  if(navigator.onLine){
    // Change status icon to green
    if(status.hasClass('border-danger')){
      status.toggleClass('border-danger border-success')
    }
    inCon = true;
  }else{
    // Change status icon to red
    if(status.hasClass('border-success')) {
      status.toggleClass('border-success border-danger')
    }
    inCon = false;
  }
}

// Method to get the information from MySQL
function loadDT(bioDb){
  if(inCon) {
    $.ajax({
      url: 'dbHandler/getMysql.php',
      type: "GET",
      dataType: "json",
      success: function (data) {
        if (table) {
          table.destroy();
          table = $('#bioTable').DataTable({
            data: data,
            columns:[
              {data: 'id'},
              {data: 'name'},
              {data: 'email'},
              {data: 'celphone'},
              {data: 'biography'}
            ]
          });
        } else {
          table = $('#bioTable').DataTable({
            data: data,
            columns:[
              {data: 'id'},
              {data: 'name'},
              {data: 'email'},
              {data: 'celphone'},
              {data: 'biography'}
            ]
          });
        }
      }
    });
  }else{
    let db = bioDb.result;

    // Open the transaction as readonly and select the objectStore that we want to get the data from
    let tx = db.transaction('biographies', 'readonly');
    let store = tx.objectStore('biographies');

    // Does the select to get all data stored in the specified objectStore
    let data = store.getAll();

    // On success from getting the indexdb data, saves that data to MySQL;
    data.onsuccess = function (e) {
      if (data.result.length > 0){
        if (table) {
          table.destroy();
          table = $('#bioTable').DataTable({
            data: data.result,
            columns:[
              {data: 'id'},
              {data: 'name'},
              {data: 'email'},
              {data: 'celphone'},
              {data: 'biography'}
            ]

          });
        } else {
          table = $('#bioTable').DataTable({
            data: data.result,
            columns:[
              {data: 'id'},
              {data: 'name'},
              {data: 'email'},
              {data: 'celphone'},
              {data: 'biography'}
            ]
          });
        }
      }
    }
  }
}
