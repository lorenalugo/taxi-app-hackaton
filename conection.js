/* vars */
let myForm;
let refData;
let resultsContainer = document.getElementById('search-results');
const empresasBtn = document.getElementById('empresas-view');
const queryBtn = document.getElementById('query-btn');
const filterBtn = document.getElementById('empresas-button');
const mensaje = document.getElementById('mensaje');
/* functions */
const inicializar = () => {
	myForm = document.getElementById('form');
	myForm.addEventListener('submit', enviarData, false);
	refData = firebase.database().ref().child('data');
}

const enviarData = (e) => {
	e.preventDefault();
	refData.push({
		"Conductor": e.target.inputConductor.value,
		"Descripción": e.target.inputDesc.value,
		"Empresa": e.target.inputEmpresa.value,
		"Fecha": e.target.inputFecha.value,
		"Placa": e.target.inputPlaca.value
	});
	myForm.reset();
}
// for showing results DOM
const mostraDataBase = () => {
	refData.on('value', (snap) => {
		let dataToShow = "";
		let data = snap.val();
		for(let key in data) {
			dataToShow += `
			<div class="row">
				<div class="col-xs-6"><p>Datos: ${data[key]['Conductor']}</p><p>Placa: ${data[key]['Placa']}</p></div>
				<div class="col-xs-12"><p>Fecha: ${data[key]['Fecha']}</p><p>Descripción: ${data[key]['Descripcion']}</p></div>
			</div>`;
		}
		resultsContainer.innerHTML = dataToShow;
		filterBtn.disabled = false;
		filterBtn.innerText = "Empresas";
	});
}
// filter database by empresas
const filtrarDataBase = (condition) =>{
	refData.on('value', (snap) => {
		let data = snap.val();
		let resultArr = [];
		for(let key in data) {
		if(data[key]['Empresa'] === condition) {
			resultArr.push(data[key]);
		}
	}
	return resultArr;
	});
}
const displayBlock = (showId, hideId) => {
	document.getElementById(hideId).classList.add('none');
	document.getElementById(showId).classList.remove('none');
}
/* events */
filterBtn.addEventListener('click', (e) => {
	filterBtn.disabled = true;
	filterBtn.innerText = "Cargando...";
	inicializar();
	mostraDataBase();
	displayBlock('empresas-view', 'main-view');
});
empresasBtn.addEventListener('click', (e) => {
	displayBlock('search-results', 'empresas-view');
});

queryBtn.addEventListener('click', () => {
	document.getElementById('main-view').classList.add('none');
	displayBlock('form-view', 'query-btn');
	inicializar();
	document.getElementById('mensaje').classList.remove('none');
});
mensaje.addEventListener('click', () => {
	document.getElementById('form-view').classList.add('none');
	mostraDataBase();
})
// window.onload = inicializar;