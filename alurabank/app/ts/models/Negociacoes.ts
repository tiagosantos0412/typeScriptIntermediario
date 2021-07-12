import { Negociacao } from './Negociacao';
import { MeuObjeto } from './MeuObjeto';


export class Negociacoes implements MeuObjeto<Negociacoes>{

    //private _negociacoes: Negociacao[] = []; --Também funciona

    private _negociacoes: Array<Negociacao> = [];

    adiciona(negociacao: Negociacao): void{
        this._negociacoes.push(negociacao);
    }

    paraArray(): Negociacao[]{
        return ([] as Negociacao[]).concat(this._negociacoes);// Tratei o array como um array do tipo Negociacao
    }

    paraTexto(): void{
        console.log('Impressão');
        console.log(JSON.stringify(this._negociacoes)); 
    }

    ehIgual(negociacoes: Negociacoes): boolean{

        return JSON.stringify(this._negociacoes) == JSON.stringify(negociacoes.paraArray());
    }
}