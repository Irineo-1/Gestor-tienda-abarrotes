// 'use client'

// import { useEffect, useState } from 'react';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemText from '@mui/material/ListItemText';
// import { getUsuarios } from '@/request/usuarios';
// import { Usuario } from '@/interfaces/Usuario';
// import Button from '@mui/material/Button';
// import { PersonAdd } from '@mui/icons-material';
// import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
// import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';

// export default function GestorUsuarios() {

//     const [usuarios, setUsuarios] = useState<Usuario[]>([])

//     useEffect(() => {
//         getUsuarios().then(data => {
//             setUsuarios(data)
//         })
//     }, [])

//     return (
//         <>
//             <div className="flex flex-wrap flex-row h-full w-full">
//                 <div className="w-full h-[50%] md:w-[50%] md:h-full md:pl-3">
//                     <div className='mb-2'>
//                         <Button variant="contained" startIcon={<PersonAdd />}> Agregar usuario</Button>
//                     </div>
//                     {usuarios.map(usuario => (
//                         <ListItem component="div" disablePadding>
//                             <ListItemButton>
//                                 <ListItemText primary={`${usuario.usuario} - ${usuario.typo}`} />
//                             </ListItemButton>
//                         </ListItem>
//                     ))}
//                 </div>

//                 <div className="flex items-center justify-center w-full h-[50%] md:w-[50%] md:h-full md:pr-3">
//                     <div className='w-[250px] flex items-center justify-center'>
//                         <div></div>
//                         <div className='w-full'>
//                             <Button variant="contained" color="success" size="small">Actualizar</Button>
//                             <Button variant="contained" color='error' size="small">Eliminar</Button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }

'use client'

import { useEffect, useState } from "react";

// export default function TicTacToe() {
//   const [board, setBoard] = useState(Array(9).fill(null));
//   const [xIsNext, setXIsNext] = useState(true);

//   const winner = calculateWinner(board);
//   const isDraw = !winner && board.every((square) => square !== null);
//   const status = winner
//     ? `Winner: ${winner}`
//     : isDraw
//     ? "It's a draw!"
//     : `Next player: ${xIsNext ? "X" : "O"}`;

//   function handleClick(index) {
//     if (board[index] || winner) return;

//     const newBoard = board.slice();
//     newBoard[index] = xIsNext ? "X" : "O";
//     setBoard(newBoard);
//     setXIsNext(!xIsNext);
//   }

//   function restartGame() {
//     setBoard(Array(9).fill(null));
//     setXIsNext(true);
//   }

//   function renderSquare(index) {
//     return (
//       <button
//         onClick={() => handleClick(index)}
//         className="w-16 h-16 text-2xl border border-gray-400"
//       >
//         {board[index]}
//       </button>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center gap-4 p-4">
//       <h1 className="text-xl font-bold">{status}</h1>
//       <div className="grid grid-cols-3 gap-1">
//         {board.map((_, i) => renderSquare(i))}
//       </div>
//       <button
//         onClick={restartGame}
//         className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
//       >
//         Restart
//       </button>
//     </div>
//   );
// }

// function calculateWinner(squares) {
//   const lines = [
//     [0, 1, 2],
//     [3, 4, 5],
//     [6, 7, 8],
//     [0, 3, 6],
//     [1, 4, 7],
//     [2, 5, 8],
//     [0, 4, 8],
//     [2, 4, 6],
//   ];

//   for (let [a, b, c] of lines) {
//     if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
//       return squares[a];
//     }
//   }
//   return null;
// }

const crearMatriz = (filas: number, columnas: number) => {
    return Array.from({ length: filas }, () =>
      Array.from({ length: columnas }, () => null)
    );
}

export default function PruebaConcepto() {

    const [tablero, setTablero] = useState(() => crearMatriz(4,4))
    const [Jugador, setJugador] = useState<"X" | "O">("X")

    useEffect(() => {

        // verificarHorizontal()
        // verificaVertical()
        verificaDiagonal()

    }, tablero)

    const verificarHorizontal = () => {
        let anterior: string | null = ""
        principal: for(let i = 0; i < tablero.length; i++) {
            
            if(tablero[i][0] === null) continue
            let contador = 0

            anterior = tablero[i][0]
            for(let j = 0; j < tablero[i].length; j++) {
                console.log(tablero[i][j]) // log
                if(tablero[i][j] === null) continue principal

                if(anterior === tablero[i][j]) contador ++
                if(contador === tablero.length) return console.log("ganador: ", tablero[i][0])
            }
        }
    }

    const verificaVertical = () => {
        const size = tablero.length

        for (let j = 0; j < size; j++) {
            const valorInicial = tablero[0][j]
            if (!valorInicial) continue
    
            let ganador = true
            for (let i = 1; i < size; i++) {
                if (tablero[i][j] !== valorInicial) {
                    ganador = false
                    break
                }
            }
    
            if (ganador) {
                console.log("ganador: ", valorInicial)
                return
            }
        }
    }

    const verificaDiagonal = () => {

        let columnaIzquierda = 0
        let columnaDerecha = tablero.length -1

        // izquierda: for(let i = 0; i < tablero.length; i++) {

        //     console.log(`fila: ${i} :: columna: ${columnaIzquierda} :: `, tablero[i][columnaIzquierda]) // log
        //     if(tablero[i][columnaIzquierda] == null) return
        //     columnaIzquierda ++
        //     continue izquierda
        // }

        derecha: for(let i = 0; i < tablero.length; i++) {

            console.log(`fila: ${i} :: columna: ${columnaDerecha} :: `, tablero[i][columnaDerecha]) // log
            console.log(tablero) // log
            if(tablero[i][columnaDerecha] == null) return
            columnaDerecha --
            continue derecha
        }
    }

    const actualizarCelda = (fila, columna, valor) => {
        setTablero((prev) => {
          const nueva = prev.map((filaArr) => [...filaArr])
          nueva[fila][columna] = valor
          return nueva;
        })
        setJugador((Jugador === "X") ? "O" : "X")
    }

    return (
        <div className="grid grid-cols-4 gap-2">
          {tablero.map((fila, i) =>
            fila.map((celda, j) => (
              <button
                key={`${i}-${j}`}
                onClick={() => actualizarCelda(i, j, Jugador)}
                className="p-4 border text-center"
              >
                {celda ?? "-"}
              </button>
            ))
          )}
        </div>
      );

}