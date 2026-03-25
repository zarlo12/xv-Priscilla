//import { invitados } from "./invitados.js";

const firebaseConfig = {
  apiKey: "AIzaSyDHnHj_z55B-VujnU3Uc1X1lMUt0a-Tjh8",
  authDomain: "xv-anios.firebaseapp.com",
  projectId: "xv-anios",
  storageBucket: "xv-anios.appspot.com",
  messagingSenderId: "1070165494180",
  appId: "1:1070165494180:web:5fbbd3a24226145b62d931",
  measurementId: "G-NE08T41NPZ",
};

// Inicializa Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
// Obtener invitados de Firestore
const querySnapshot = await db.collection("invitadosXVPriscilla2026").get();
const invitados = querySnapshot.docs.map((doc) => ({
  id: doc.id,
  ...doc.data(),
}));

console.log("invitados2", invitados);
// Función para obtener el parámetro 'nombre' de la URL
function obtenerCodigo() {
  const params = new URLSearchParams(window.location.search);
  return params.get("codigo");
}

// Función para agregar el nombre al body y generar inputs automáticamente
function actualizarHTMLConInvitado(invitado) {
  // Actualizar el nombre del invitado
  const nombreInvitadoElem = document.getElementById("nombreInvitado");
  nombreInvitadoElem.textContent = invitado.invitado;

  // Establecer el valor en el campo oculto
  const listaInvitadosElem = document.getElementById("listaInvitados");
  listaInvitadosElem.value = invitado.numeroInvitados;

  // Generar automáticamente los inputs para acompañantes
  if (invitado.numeroInvitados === 0) {
    // Si es 0, no mostrar inputs pero permitir confirmar asistencia individual
    generarInputsAcompanantes(0);
  } else {
    // Generar inputs para acompañantes (restar 1 porque el invitado principal ya cuenta)
    const numeroAcompanantes = invitado.numeroInvitados;
    generarInputsAcompanantes(numeroAcompanantes);
  }
}

// Obtener el nombre de la URL

const codigo = obtenerCodigo();

const invitado = invitados.find((inv) => inv.codigo === codigo);

if (invitado) {
  actualizarHTMLConInvitado(invitado);
} else {
  // Mensaje o acción si el invitado no se encuentra
  const nombreInvitadoElem = document.getElementById("nombreInvitado");
  nombreInvitadoElem.textContent = "Invitado no encontrado.";
}

// ==============================================
// GESTIÓN DE NOMBRES DE ACOMPAÑANTES
// ==============================================

/**
 * Genera campos de entrada dinámicos para los nombres de los acompañantes
 * @param {number} cantidad - Número de acompañantes
 */
function generarInputsAcompanantes(cantidad) {
  const contenedor = document.getElementById("contenedorNombresAcompanantes");

  // Limpiar contenedor
  contenedor.innerHTML = "";

  // Si no hay acompañantes o es 0, ocultar
  if (!cantidad || cantidad <= 0) {
    contenedor.style.display = "none";
    return;
  }

  // Mostrar contenedor
  contenedor.style.display = "block";

  // Agregar título solo si hay acompañantes
  if (cantidad > 0) {
    const titulo = document.createElement("div");
    titulo.className =
      "elementor-field-group elementor-column elementor-col-100";
    titulo.style.marginTop = "20px";
    titulo.innerHTML = `
      <label class="elementor-field-label" style="color: #000; font-weight: 600; margin-bottom: 15px; display: block; text-align: center; font-size: 16px;">
        📝 Ingresa ${cantidad > 1 ? "los nombres de tus" : "el nombre de tu"} ${cantidad} acompañante${cantidad > 1 ? "s" : ""}:
      </label>
    `;
    contenedor.appendChild(titulo);
  }

  // Generar inputs para cada acompañante
  for (let i = 1; i <= cantidad; i++) {
    const fieldGroup = document.createElement("div");
    fieldGroup.className =
      "elementor-field-group elementor-column elementor-col-100";
    fieldGroup.style.marginBottom = "15px";

    fieldGroup.innerHTML = `
      <input 
        type="text" 
        id="acompanante_${i}" 
        name="acompanante_${i}"
        class="elementor-field elementor-field-textual elementor-size-sm input-acompanante" 
        placeholder="Nombre completo del acompañante ${i}"
        required
        style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 14px; transition: all 0.3s;"
      />
    `;

    contenedor.appendChild(fieldGroup);
  }

  // Agregar estilos de focus dinámicamente
  const inputs = contenedor.querySelectorAll(".input-acompanante");
  inputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.style.borderColor = "#6366f1";
      this.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.1)";
    });

    input.addEventListener("blur", function () {
      this.style.borderColor = "#ddd";
      this.style.boxShadow = "none";
    });
  });
}

/**
 * Obtiene los nombres de los acompañantes de los inputs
 * @returns {Array<string>} Array con los nombres de los acompañantes
 */
function obtenerNombresAcompanantes() {
  const inputs = document.querySelectorAll(".input-acompanante");
  const nombres = [];

  inputs.forEach((input) => {
    const nombre = input.value.trim();
    if (nombre) {
      nombres.push(nombre);
    }
  });

  return nombres;
}

/**
 * Valida que todos los inputs de acompañantes estén llenos
 * @returns {boolean} true si todos están llenos, false si falta alguno
 */
function validarNombresAcompanantes() {
  const inputs = document.querySelectorAll(".input-acompanante");

  if (inputs.length === 0) {
    return true; // No hay inputs, validación exitosa
  }

  for (let input of inputs) {
    if (!input.value.trim()) {
      input.focus();
      input.style.borderColor = "#ef4444";
      setTimeout(() => {
        input.style.borderColor = "#ddd";
      }, 2000);
      return false;
    }
  }

  return true;
}

// Ya no se necesita el listener del select porque los inputs se generan automáticamente al cargar la página

// ==============================================
// FIN GESTIÓN DE NOMBRES DE ACOMPAÑANTES
// ==============================================

// Función para enviar el mensaje de WhatsApp
function enviarWhatsApp(nombre, numeroInvitados, nombresAcompanantes = []) {
  console.log("🚀 ~ enviarWhatsApp ~ numeroInvitados:", numeroInvitados);
  console.log("🚀 ~ enviarWhatsApp ~ nombre:", nombre);
  console.log(
    "🚀 ~ enviarWhatsApp ~ nombresAcompanantes:",
    nombresAcompanantes,
  );
  const numeroTelefono = "+5219831146444";
  let mensaje = "";

  // No asistirá
  if (
    numeroInvitados == "0" ||
    numeroInvitados == 0 ||
    numeroInvitados == "No podra asistir"
  ) {
    mensaje = `¡Hola! 👋

Soy *${nombre}*

Lamentablemente no podré asistir a los XV años de Priscilla 😔

Les deseo una celebración increíble 🩵✨`;
  }
  // Asistirá con 1 persona (solo el invitado)
  else if (numeroInvitados == "1" || numeroInvitados == 1) {
    mensaje = `¡Hola! 👋

Soy *${nombre}* y confirmo mi asistencia a los XV años de Priscilla 🩵

✅ *Asistiré*

¡Nos vemos el 23 de Mayo! 🎉`;
  }
  // Asistirá con múltiples personas
  else {
    mensaje = `¡Hola! 👋

Soy *${nombre}* y confirmo mi asistencia a los XV años de Priscilla 🩵

✅ *Número de asistentes:* ${numeroInvitados} personas`;

    // Agregar nombres de acompañantes si existen
    if (nombresAcompanantes && nombresAcompanantes.length > 0) {
      mensaje += `\n\n👥 *Acompañantes:*`;
      nombresAcompanantes.forEach((nombreAcomp, index) => {
        mensaje += `\n   ${index + 1}. ${nombreAcomp}`;
      });
    }

    mensaje += `\n\n¡Nos vemos el 23 de Mayo! 🎉`;
  }

  const url = `https://api.whatsapp.com/send?phone=${numeroTelefono}&text=${encodeURIComponent(
    mensaje,
  )}`;
  window.open(url, "_blank");
}

function enviarWhatsAppForm(nombre_form, anecdota_form, deseos_form) {
  // console.log("🚀 ~ enviarWhatsApp ~ numeroInvitados:", numeroInvitados);
  // console.log("🚀 ~ enviarWhatsApp ~ nombre:", nombre);
  const numeroTelefono = "+5219831146444"; // Reemplaza con el número de teléfono al que deseas enviar el mensaje
  let mensaje = `Hola soy ${nombre_form},\nConfirmó mi invitación. `;

  mensaje = mensaje + "\n\n*Anecdota juntos:* " + anecdota_form;
  mensaje = mensaje + "\n\n*Palabras o buenos deseos:* " + deseos_form;

  const url = `https://api.whatsapp.com/send?phone=${numeroTelefono}&text=${encodeURIComponent(
    mensaje,
  )}`;
  window.open(url, "_blank");
}

// Agregar evento al botón de confirmar

document
  .getElementById("btn_send_counterzz")
  .addEventListener("click", async function (e) {
    e.preventDefault(); // Prevenir envío del formulario

    const nombreInvitado =
      document.getElementById("nombreInvitado").textContent;
    const numeroInvitados = document.getElementById("listaInvitados").value;
    console.log("🚀 ~ numeroInvitados:", numeroInvitados);

    // Validaciones básicas
    if (nombreInvitado == "Invitado no encontrado.") {
      return alert("Invitado no registrado.");
    }

    if (!numeroInvitados) {
      return alert("Error: No se pudo obtener el número de asistentes.");
    }

    // Validar nombres de acompañantes si los hay
    if (!validarNombresAcompanantes()) {
      return alert("Por favor, ingresa los nombres de todos tus acompañantes.");
    }

    // Obtener nombres de acompañantes
    const nombresAcompanantes = obtenerNombresAcompanantes();
    console.log("🚀 ~ nombresAcompanantes:", nombresAcompanantes);

    // Guardar confirmación en Firestore
    try {
      // Buscar el documento del invitado
      const querySnapshot = await db
        .collection("invitadosXVPriscilla2026")
        .where("codigo", "==", codigo)
        .get();

      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;

        // Actualizar el documento con la confirmación y nombres
        await db
          .collection("invitadosXVPriscilla2026")
          .doc(docId)
          .update({
            confirmado: true,
            numeroConfirmados: parseInt(numeroInvitados),
            nombresAcompanantes: nombresAcompanantes,
            fechaConfirmacion: new Date(),
          });

        console.log("✅ Confirmación guardada en Firestore");
      }
    } catch (error) {
      console.error("❌ Error al guardar en Firestore:", error);
      // Continuar con WhatsApp aunque falle Firestore
    }

    // Enviar mensaje de WhatsApp
    enviarWhatsApp(nombreInvitado, numeroInvitados, nombresAcompanantes);
  });

// document
//   .getElementById("confirmarFomrulario")
//   .addEventListener("click", function () {
//     const nombre_form = document.getElementById("nombre_form").value;
//     const anecdota_form = document.getElementById("anecdota_form").value;
//     const deseos_form = document.getElementById("deseos_form").value;

//     if (!nombre_form) {
//       return alert("Ingresa tu nombre");
//     }

//     enviarWhatsAppForm(nombre_form, anecdota_form, deseos_form);
//   });

// document.addEventListener("visibilitychange", function () {
//   const audio = document.getElementById("audio-33769-1");
//   console.log("🚀 ~ audio:", audio);
//   if (document.visibilityState === "hidden") {
//     audio.pause();
//   } else if (document.visibilityState === "visible") {
//     audio.play();
//   }
// });
