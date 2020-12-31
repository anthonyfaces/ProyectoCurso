import { Paciente } from './paciente';

export class Signo {
    idSigno: number;
    temperatura: number;
    pulso: number;
    frecRespiratoria: number;
    fecha : string;
    paciente: Paciente
}