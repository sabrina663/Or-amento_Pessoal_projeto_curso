class Despesa{
    constructor(ano,mes,dia,tipo,descricao,valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }
    validardados(){
        for(let i in this){
            if(this[i] == undefined || this[i] == '' ||this[i] == null){
                return false
            }
        }
        return true
    }
}
class Bd{
    constructor (){
        let id= localStorage.getItem('id')
        if (id === null){
            localStorage.setItem('id', 0)
        }
    }
    getproximoId(){
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }
    grava(d){
        let id = this.getproximoId()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }
    recuperarTodosResgistro(){
        //console.log('Chegamos ate aqui')
        let despesas = Array()
        let id = localStorage.getItem('id')
        //recuperar as despesas cadastradas e m localStorage
        for(let i = 1 ;i <= id; i++){
            //como ele sera exibido como string, usar JSON parse pra transformar em objeto literal
            let despesa = JSON.parse(localStorage.getItem(i))
            console.log(i,despesa)
            if (despesa === null){
                continue
            }
            despesa.id = i
            despesas.push(despesa)
        }
        return despesas
    }
    pesquisar(despesa){
        let despesasfiltradas = Array()
        despesasfiltradas = this.recuperarTodosResgistro()
        console.log(despesasfiltradas)
        //filter dos dados
        //ano
        if (despesa.ano != ''){
            despesasfiltradas = despesasfiltradas.filter(d => d.ano == despesa.ano)
        }
        //mes
        if (despesa.mes != ''){
            despesasfiltradas = despesasfiltradas.filter(d => d.mes == despesa.mes)
        }
        //dia
        if (despesa.dia != ''){
            despesasfiltradas = despesasfiltradas.filter(d => d.dia == despesa.dia)
        }
        //tipo
        if (despesa.tipo != ''){
            console.log('tipo')
            despesasfiltradas = despesasfiltradas.filter(d => d.tipo == despesa.tipo)
        }
        //descrisao
        if (despesa.descricao != ''){
            despesasfiltradas = despesasfiltradas.filter(d => d.descricao == despesa.descricao)
        }
        //valor
        if (despesa.valor != ''){
            despesasfiltradas = despesasfiltradas.filter(d => d.valor == despesa.valor)
        }
        
        return despesasfiltradas
    }
    remover(id){
        localStorage.removeItem(id)
    }
}

let bd = new Bd()


function adicionardespeca(){
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )
    if(despesa.validardados ()){
        bd.grava(despesa)
        $('#modalregistrodespesa').modal('show')
        document.getElementById('msg-title').innerHTML = 'Gravação bem sucedida'
        document.getElementById('msg-title').className = "modal-title text-success"
        document.getElementById('msg-body').innerHTML= 'Despesa Gravada com sucesso'
        document.getElementById('button').innerHTML='Certo'
        document.getElementById('button').className = 'btn btn-success'
        console.log('Dados Validos')
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
    }else{
        $('#modalregistrodespesa').modal('show')
        document.getElementById('msg-title').innerHTML = 'Gravação mal sucedida'
        document.getElementById('msg-title').className = "modal-title text-danger"
        document.getElementById('msg-body').innerHTML= 'Campos obrigatorios não preenchidos'
        document.getElementById('button').innerHTML='Voltar'
        document.getElementById('button').className = 'btn btn-danger'
        
        console.log('Dados Invalidos')
    }
}

function carregalistadespesa(despesas = Array(), filtro = false){
    if(despesas.length == 0 && filtro == false){
        despesas = bd.recuperarTodosResgistro()
    }
    console.log(despesas)
    
    let listadespesas = document.getElementById('listadespesas')
    listadespesas.innerHTML = ''
    //percorre array despesas
    despesas.forEach(function(d){
        let linha = listadespesas.insertRow()
        linha.insertCell(0).innerHTML = `${d.dia} / ${d.mes} / ${d.ano}`
        switch (d.tipo) {
            case '1':
                d.tipo = 'Alimentação'
                break
            case '2':
                d.tipo = 'Educação'
                break
            case '3':
                d.tipo = 'Lazer'
                break
            case '4':
                d.tipo = 'Saúde'
                break
            case '5':
                d.tipo = 'Transporte'
                break
            default:
                break;
        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor
        //botao de exclusao
        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = 'id_despesa' + d.id
        btn.onclick = function(){
            let id = this.id.replace('id_despesa', "")
            /* alert(id) */
            bd.remover(id)
            window.location.reload()
        }
        linha.insertCell(4).append(btn)
        console.log(d)
    })
}
function pesquisardespesa(){
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano,mes,dia,tipo,descricao,valor)

    let despesas = bd.pesquisar(despesa)

    let listadespesas = document.getElementById('listadespesas')
    listadespesas.innerHTML = ''
    carregalistadespesa(despesas, true)
    
}