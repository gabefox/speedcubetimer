class ScrambleGenerator {
    constructor() {
        this.moves = ["R", "L", "U", "D", "F", "B"];
        this.modifiers = ["", "'", "2"];
    }

    generateScramble(length = 20) {
        let scramble = [];
        let lastMove = null;
        let secondLastMove = null;

        for (let i = 0; i < length; i++) {
            let move;
            do {
                move = this.moves[Math.floor(Math.random() * this.moves.length)];
            } while (
                move === lastMove || 
                (move === secondLastMove && this.areOpposite(move, lastMove))
            );

            const modifier = this.modifiers[Math.floor(Math.random() * this.modifiers.length)];
            scramble.push(move + modifier);
            
            secondLastMove = lastMove;
            lastMove = move;
        }

        return scramble.join(" ");
    }

    areOpposite(move1, move2) {
        const opposites = {
            'R': 'L',
            'L': 'R',
            'U': 'D',
            'D': 'U',
            'F': 'B',
            'B': 'F'
        };
        return opposites[move1] === move2;
    }
}

const scrambler = new ScrambleGenerator();
