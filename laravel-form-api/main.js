document.addEventListener("DOMContentLoaded", () => {
  const nombreInput = document.getElementById("nombre");
  const apellidosInput = document.getElementById("apellidos");
  const sexoInput = document.getElementById("sexo");
  const fechaNacimientoInput = document.getElementById("fecha_nacimiento");
  const nuevoBtn = document.getElementById("nuevo");
  const guardarBtn = document.getElementById("guardar");
  const tableBody = document.querySelector("#personas-table tbody");

  let personas = [];
  let personaEditando = null;

  // Cargar personas desde la API
  fetch("http://localhost:8000/api/person")
    .then((response) => response.json())
    .then((data) => {
      personas = data;
      renderTable();
    })
    .catch((error) => {
      console.error("Error al obtener los datos de la API:", error);
    });

  // Evento para el botón "Nuevo"
  nuevoBtn.addEventListener("click", () => {
    resetForm(); // Limpiar el formulario
    personaEditando = null; 
  });

  // Evento para el botón "Guardar"
  guardarBtn.addEventListener("click", (event) => {
    event.preventDefault(); 
    if (personaEditando) {
      actualizarPersona(personaEditando); // Si estamos editando, llamamos a la función de actualizar
    } else {
      guardarPersona(); // De lo contrario, guardamos un nuevo registro
    }
  });

  // Función para renderizar la tabla
  function renderTable() {
    tableBody.innerHTML = ""; // Limpiar la tabla antes de renderizar
    personas.forEach((persona) => {
      const fila = document.createElement("tr");

      fila.innerHTML = `
      <td>${persona.nombre || "Sin nombre"}</td>
      <td>${persona.apellidos || "Sin apellidos"}</td>
      <td>${persona.sexo || "Sin sexo"}</td>
      <td>${persona.fecha_nacimiento || "Sin fecha"}</td>
      <td>${calcularEdad(persona.fecha_nacimiento) || "Edad no disponible"}</td>
      <td>${convertirSexo(persona.sexo) || "No especificado"}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editarPersona(${
          persona.id
        })">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="eliminarPersona(${
          persona.id
        })">Eliminar</button>
      </td>
    `;
      tableBody.appendChild(fila);
    });
  }

  // Función para editar una persona
  window.editarPersona = function (id) {
    const persona = personas.find((p) => p.id === id);
    if (persona) {
      nombreInput.value = persona.nombre;
      apellidosInput.value = persona.apellidos;
      sexoInput.value = persona.sexo;
      fechaNacimientoInput.value = persona.fecha_nacimiento;

      personaEditando = id; // Guardar el ID de la persona que estamos editando
    }
  };

  // Función para guardar una nueva persona
  function guardarPersona() {
    const nuevaPersona = {
      nombre: nombreInput.value,
      apellidos: apellidosInput.value,
      sexo: sexoInput.value,
      fecha_nacimiento: fechaNacimientoInput.value,
    };

    fetch("http://localhost:8000/api/person", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevaPersona),
    })
      .then((response) => response.json())
      .then((data) => {
        personas.push(data); // Agregar la nueva persona al array
        renderTable(); // Actualizar la tabla
        resetForm(); // Limpiar el formulario
      })
      .catch((error) => {
        console.error("Error al guardar la persona:", error);
      });
  }

  // Función para actualizar una persona
  function actualizarPersona(id) {
    const personaActualizada = {
      nombre: nombreInput.value,
      apellidos: apellidosInput.value,
      sexo: sexoInput.value,
      fecha_nacimiento: fechaNacimientoInput.value,
    };

    // Actualiza localmente antes de la petición al servidor
    const index = personas.findIndex((p) => p.id === id);
    if (index !== -1) {
      personas[index] = personaActualizada;
    }

    fetch(`http://localhost:8000/api/person/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(personaActualizada),
    })
      .then((response) => response.json())
      .then((data) => {
        renderTable();
        resetForm();
        personaEditando = null;
      })
      .catch((error) => {
        console.error("Error al actualizar la persona:", error);
      });
  }

  // Función para eliminar una persona
  window.eliminarPersona = function (id) {
    fetch(`http://localhost:8000/api/person/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        personas = personas.filter((p) => p.id !== id); // Eliminar la persona del array
        renderTable(); // Actualizar la tabla
      })
      .catch((error) => {
        console.error("Error al eliminar la persona:", error);
      });
  };

  // Función para limpiar el formulario
  function resetForm() {
    nombreInput.value = "";
    apellidosInput.value = "";
    sexoInput.value = "";
    fechaNacimientoInput.value = "";
  }

  function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  function convertirSexo(sexo) {
    switch (sexo?.toLowerCase()) {
      case "masculino":
      case "varón":
        return "Varón";
      case "femenino":
      case "mujer":
        return "Mujer";
      default:
        return "No especificado";
    }
  }
});
