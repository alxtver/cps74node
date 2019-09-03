
function addSession() {
  let field_type_pki = document.getElementById("type_pki").value;
  sessionStorage.setItem("type_pki", field_type_pki);

  let field_vendor = document.getElementById("vendor").value;
  sessionStorage.setItem("vendor", field_vendor);

  let field_model = document.getElementById("model").value;
  sessionStorage.setItem("model", field_model);

  let field_country = document.getElementById("country").value;
  sessionStorage.setItem("country", field_country);
  
  // let field_serial_number = document.getElementById("serial_number").value;
  // sessionStorage.setItem("serial_number", field_serial_number);

  let field_part = document.getElementById("part").value;
  sessionStorage.setItem("part", field_part);

  let check = document.getElementById("in_case");
 
  if (check.checked) {
     sessionStorage.setItem("check", "checked");
    } else {
      sessionStorage.setItem("check", "unchecked");
    }
  }
  

function loadSession() {
    let field_type_pki = document.getElementById("type_pki");
    if (sessionStorage.getItem("type_pki")) {
      field_type_pki.value = sessionStorage.getItem("type_pki");
    }
    
    let field_vendor = document.getElementById("vendor");
    if (sessionStorage.getItem("vendor")) {
      field_vendor.value = sessionStorage.getItem("vendor");
    }
    
    let field_model = document.getElementById("model");
    if (sessionStorage.getItem("model")) {
      field_model.value = sessionStorage.getItem("model");
  }

    let field_country = document.getElementById("country");      
    if (sessionStorage.getItem("country")) {
        field_country.value = sessionStorage.getItem("country")
    }
    
    // let field_serial_number = document.getElementById("serial_number");      
    // if (sessionStorage.getItem("serial_number")) {
    //     field_serial_number.value = sessionStorage.getItem("serial_number")
    // }
    
    let field_part = document.getElementById("part");      
    if (sessionStorage.getItem("part")) {
        field_part.value = sessionStorage.getItem("part")
    }
    
    if (sessionStorage.getItem("check") == "checked") {
      document.getElementById("in_case").checked = true;
    }
    

    document.getElementById("serial_number").focus();
    }


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
