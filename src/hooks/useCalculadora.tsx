import { useRef, useState } from 'react';

//Creamos una enumeracion para manejar como si fueran numeros, pero usa nombres(string)
enum Operadores {
    sumar, restar, multiplicar, dividir 
}

export const useCalculadora = () => {
    
    const [ numeroAnterior, setNumeroAnterior ] = useState('0');
    const [ numero, setNumero ] = useState('0');
    /* OJO: Se usa el 'useRef' cuando se quiere mantenar el valor en memoria y NO se quiere renderizar el componente, o sea volver a cargar
    la pantlla */
    const ultimaOperacion = useRef<Operadores>(); //Podrias utilizarlo para obtener el puntaje.


    const limpiar = () => {
        setNumero('0');
        setNumeroAnterior('0');
    }

    const armarNumero = ( numeroTexto: string ) => {

        // No aceptar doble punto
        if( numero.includes('.') && numeroTexto === '.' ) return;

        if ( numero.startsWith('0') || numero.startsWith('-0') ) {//Si el numero 'empieza' con '0'

            // Punto decimal
            if ( numeroTexto === '.' ) {
                setNumero( numero + numeroTexto );

                // Evaluar si es otro cero, y hay un punto
            } else if( numeroTexto === '0' && numero.includes('.')  ) {
                setNumero( numero + numeroTexto );

                // Evaluar si es diferente de cero y no tiene un punto
            } else if( numeroTexto !== '0' && !numero.includes('.') ) {
                setNumero( numeroTexto );

                // Evitar 0000.0
            } else if( numeroTexto === '0' && !numero.includes('.') ) {
                setNumero( numero );
            } else {
                setNumero( numero + numeroTexto ); 
            }

        } else {//Siempre debe haber un setNumero para cambiar el estado
            setNumero( numero + numeroTexto );
        }
    }

    const positioNegativo = () => {
        if ( numero.includes('-') ) {//En caso ya exista el '-'
            setNumero( numero.replace('-', '') );//Remover el '-' por un simbolo vacio.
        } else {
            setNumero( '-' + numero );//Si no existe simplemente concatena con el numero actual
        }
    }

    const btnDelete = () => {
        
        let negativo = '';
        let numeroTemp = numero;
        if ( numero.includes('-') ) {
            negativo = '-';
            numeroTemp = numero.substr(1);//Devuelve la cadena desde la posicion '1' hasta el final,no cuenta el '0'
        }

        if ( numeroTemp.length > 1 ) {
            setNumero( negativo + numeroTemp.slice(0,-1) );// 'slice' sirve para 'cortar', en este caso la ultima posicion
        } else {
            setNumero('0');//Por ejm 7, 5, -8
        }
    }

    const cambiarNumPorAnterior = () => {
        if( numero.endsWith('.') ) {
            setNumeroAnterior( numero.slice(0,-1) );//Con esto se quita el ultimo dato.
        } else {
            setNumeroAnterior( numero );
        }
        setNumero('0');
    }


    const btnDividir = () => {
        cambiarNumPorAnterior();
        ultimaOperacion.current = Operadores.dividir;
    }

    const btnMultiplicar = () => {
        cambiarNumPorAnterior();
        ultimaOperacion.current = Operadores.multiplicar;
    }

    const btnRestar = () => {
        cambiarNumPorAnterior();
        ultimaOperacion.current = Operadores.restar;
    }

    const btnSumar = () => {
        cambiarNumPorAnterior();
        ultimaOperacion.current = Operadores.sumar;
    }

    const calcular = () => {
        //casteando los string a number
        const num1 = Number( numero );
        const num2 = Number( numeroAnterior );
        //Evaluando en base a la ultima operación
        switch ( ultimaOperacion.current ) {
            case Operadores.sumar:
                setNumero( `${ num1 + num2 }` );
                break;

            case Operadores.restar:
                setNumero( `${ num2 - num1 }` );//Para usar variables en Cadenas de texto se usan plantillas literales ${variable} 
                break;// Convirtiendo a String usando usando ' ' y colocando la variable entre ${}

            case Operadores.multiplicar:
                setNumero( `${ num1 * num2 }` );
                break;

            case Operadores.dividir:
                setNumero( `${ num2 / num1 }` );
                break;

        }

        setNumeroAnterior( '0' );
    }

    //Retornando como un 'Objeto', TODO esto será lo que 'EXPONE' nuestro Hook
    return {
        numeroAnterior,
        numero,
        limpiar,
        positioNegativo,
        btnDelete,
        btnDividir,
        armarNumero,
        btnMultiplicar,
        btnRestar,
        btnSumar,
        calcular,
    }

}
