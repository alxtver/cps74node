
function addSession() {
  let field_type_pki = document.getElementById("type_pki").value;
  sessionStorage.setItem("type_pki", field_type_pki);

  let field_vendor = document.getElementById("vendor").value;
  sessionStorage.setItem("id_part_name", field_vendor);

  let field_name = document.getElementById("id_name").value;
  let field_country = document.getElementById("id_country").value;

  
  sessionStorage.setItem("id_name", field_name);
  sessionStorage.setItem("id_country", field_country);
  
}

function loadSession() {
    let field_type_pki = document.getElementById("type_pki");

    let field_vendor = document.getElementById("vendor");
    let field_name = document.getElementById("id_name");
    
    let field_country = document.getElementById("id_country");
    
    if (sessionStorage.getItem("type_pki")) {
        field_type_pki.value = sessionStorage.getItem("type_pki")
    }
    if (sessionStorage.getItem("vendor")) {
        field_vendor.value = sessionStorage.getItem("vendor")
    }
    if (sessionStorage.getItem("id_name")) {
        field_name.value = sessionStorage.getItem("id_name")
    }
    if (sessionStorage.getItem("id_country")) {
        field_country.value = sessionStorage.getItem("id_country")
    }
    document.getElementById("serial_number").focus();
    }
// function insSession() {
//   let field_name_type = document.getElementById("id_name_type");
//   let field_part_name = document.getElementById("id_part_name");
//   let field_name = document.getElementById("id_name");
//   let field_country = document.getElementById("id_country");
//   if (sessionStorage.getItem("id_name_type")) {
//       field_name_type.value = sessionStorage.getItem("id_name_type")
//   }
//   if (sessionStorage.getItem("id_part_name")) {
//       field_part_name.value = sessionStorage.getItem("id_part_name")
//   }
//   if (sessionStorage.getItem("id_name")) {
//       field_name.value = sessionStorage.getItem("id_name")
//   }
//   if (sessionStorage.getItem("id_country")) {
//       field_country.value = sessionStorage.getItem("id_country")
//   }

// }


(function() {
    'use strict';
    window.addEventListener('load', function() {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName('needs-validation');
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add('was-validated');
        }, false);
      });
    }, false);
  })();
