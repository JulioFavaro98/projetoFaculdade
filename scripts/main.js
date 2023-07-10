const KEY_BD = '@consultasMVP'

var listaConsultas = {
    ultimoIdGerado:0,
    consulta:[]
}

function gravarBD(){
    localStorage.setItem(KEY_BD, JSON.stringify(listaConsultas))
}

function lerBD(){
    const data = localStorage.getItem(KEY_BD)
    if(data){
        listaConsultas = JSON.parse(data)
    }
    desenhar()
}

function desenhar(){
    const tbody = document.getElementById('listaConsultasBody')
    if(tbody){
        tbody.innerHTML = listaConsultas.consulta
        .sort((a, b) => {
            const [diaA, mesA, anoA] = a.data.split('/');
            const [diaB, mesB, anoB] = b.data.split('/');
            const dataA = new Date(anoA, mesA - 1, diaA, a.hora.split(':')[0], a.hora.split(':')[1]);
            const dataB = new Date(anoB, mesB - 1, diaB, b.hora.split(':')[0], b.hora.split(':')[1]);
            return dataA - dataB;
        })
        .map(consulta => {
            return `<tr>
                <td>${consulta.medicoResponsavel}</td>
                <td>${consulta.paciente}</td>
                <td>${consulta.data}</td>
                <td>${consulta.hora}</td>
                <td>
                    <button class="azulEdit" onclick='visualizar("cadastro", true, ${consulta.id})'>Editar</button>
                    <button class="vermelhoDelete" onclick='perguntarSeDeleta(${consulta.id})'>Deletar</button>
                </td>
            </tr>`
        }).join('')
    }
    
}

function insertConsulta(medicoResponsavel, paciente, data, hora){
    const id = listaConsultas.ultimoIdGerado + 1;
    listaConsultas.ultimoIdGerado = id;
    listaConsultas.consulta.push({
        id, medicoResponsavel, paciente, data, hora
    })
    gravarBD()
    desenhar()
    visualizar('lista')
}

function editConsulta(id, medicoResponsavel, paciente, data, hora){
    var consulta = listaConsultas.consulta.find( consulta => consulta.id == id)
    consulta.medicoResponsavel = medicoResponsavel;
    consulta.paciente = paciente;
    consulta.data = data;
    consulta.hora = hora;
    gravarBD()
    desenhar()
    visualizar('lista')
}

function deleteConsulta(id){
    listaConsultas.consulta = listaConsultas.consulta.filter( consulta => {
        return consulta.id != id
    })
    gravarBD()
    desenhar()
}

function perguntarSeDeleta(id){
    if(confirm("Quer deletar o usuário de id: " + id + "?")){
        deleteConsulta(id)
    }
}

function limparEdicao(){
    document.getElementById('medicoResp').value = ' '
    document.getElementById('paciente').value = ' '
    document.getElementById('dataConsulta').value = ' '
    document.getElementById('horarioConsulta').value = ' '

}

function visualizar(pagina, novo=false, id=null){
    document.body.setAttribute('page', pagina)
    if(pagina === "cadastro"){
        if(novo == true) limparEdicao()
        if(id){
            const consulta = listaConsultas.consulta.find( consulta => consulta.id == id)
            if(consulta){
                document.getElementById('id').value = consulta.id
                document.getElementById('medicoResp').value = consulta.medicoResponsavel
                document.getElementById('paciente').value = consulta.paciente
                document.getElementById('dataConsulta').value = consulta.data
                document.getElementById('horarioConsulta').value = consulta.hora
            }
        }
        document.getElementById('medicoResp').focus()
    }
}

function submeter(e){
    e.preventDefault()
    const data = {
        id: document.getElementById('id').value,
        medicoResponsavel: document.getElementById('medicoResp').value,
        paciente: document.getElementById('paciente').value,
        data: document.getElementById('dataConsulta').value,
        hora: document.getElementById('horarioConsulta').value,
    }
    if(data.id){
        editConsulta(data.id, data.medicoResponsavel, data.paciente, data.data, data.hora)
    }else{
        insertConsulta(data.medicoResponsavel, data.paciente, data.data, data.hora)
    }
}

window.addEventListener('load', () => {
    lerBD()
    document.getElementById('cadastroConsulta').addEventListener('submit', submeter)
})