import { MensagemView, NegociacoesView } from '../views/index'
import { Negociacao, Negociacoes } from '../models/index'
import { data } from 'jquery';
import { domInject, throttle } from '../helpers/decorators/index';
import { NegociacaoParcial } from '../models/NegociacaoParcial';
import { NegociacaoService } from '../services/index';
import { imprime } from '../helpers/Index';


export class NegociacaoController {
    @domInject('#data')

    private _inputData: JQuery;
    @domInject('#quantidade')

    private _inputQuantidade: JQuery;
    @domInject('#valor')

    private _inputValor: JQuery;
    private _negociacoes = new Negociacoes();
    private _negociacoesView = new NegociacoesView('#negociacoesView', true);
    private _mensagemView = new MensagemView('#mensagemView', true);
    private _service = new NegociacaoService();

    constructor() {
        
        this._negociacoesView.update(this._negociacoes);
    }

    @throttle(500)
    adiciona() {

        let data =new Date(this._inputData.val().replace(/-/g, ','));

        if(!this._ehDiaUtil(data)){
            this._mensagemView.update('As negociais devem ser realizadas somente em dias uteis!');
            return
        }

        const negociacao = new Negociacao(
            data, 
            parseInt(this._inputQuantidade.val()),
            parseFloat(this._inputValor.val())
        );
        this._negociacoes.adiciona(negociacao);

        imprime(negociacao, this._negociacoes);

        this._negociacoesView.update(this._negociacoes);
        this._mensagemView.update('Negociação adicionada com sucesso!');
    }

    private _ehDiaUtil(data: Date){
        return data.getDay() != diaDaSemana.Sabado && data.getDay() != diaDaSemana.Domingo;
    }

    @throttle(500)
    async importaDados() {

        try {

           // usou await antes da chamada de this.service.obterNegociacoes()

            const negociacoesParaImportar = await this._service
                .obterNegociacoes(res => {

                    if(res.ok) {
                        return res;
                    } else {
                        throw new Error(res.statusText);
                    }
                });

            const negociacoesJaImportadas = this._negociacoes.paraArray();

            negociacoesParaImportar
                .filter(negociacao => 
                    !negociacoesJaImportadas.some(jaImportada => 
                        negociacao.ehIgual(jaImportada)))
                .forEach(negociacao => 
                this._negociacoes.adiciona(negociacao));

            this._negociacoesView.update(this._negociacoes);

        } catch(err) {
            this._mensagemView.update(err.message);
        }
    }

/*

    @throttle(500)
    importaDados(){
        this._service
            .obterNegociacoes(res => {
                if(res.ok) return res;
                throw new Error(res.statusText);
            })
            .then(negociacoesParaImportar => {

                const negociacoesJaImportadas = this._negociacoes.paraArray();

                negociacoesParaImportar
                    .filter(negociacao => 
                        !negociacoesJaImportadas.some(jaImportada => 
                            negociacao.ehIgual(jaImportada)))
                    .forEach(negociacao => 
                    this._negociacoes.adiciona(negociacao));

                this._negociacoesView.update(this._negociacoes);    
            })
            .catch(err => {
                this._mensagemView.update(err.message);
            })
    }

*/

    /*
    importaDados(){
        function isOk(res: Response){

            if(res.ok){
                return res;
            }else {
                throw new Error(res.statusText);
            }
        }
        this._service.obterNegociacoes(isOk)
        .then(negociacoes => {

            negociacoes.forEach(negociacao => 
                this._negociacoes.adiciona(negociacao));
            this._negociacoesView.update(this._negociacoes);    
         });
    }
    */
}

enum diaDaSemana{
    Domingo,
    Segunda,
    Terça, 
    Quarta,
    Quinta,
    Sexta,
    Sabado
}