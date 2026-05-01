import { TemplateError, TemplateFunction } from './types.js';

export class Parser {
    private pos = 0;
    private input = '';
    private data: any = {};
    private functions: Map<string, TemplateFunction>;

    constructor(functions: Map<string, TemplateFunction>) {
        this.functions = functions;
    }

    public evaluate(expression: string, data: any): any {
        if (!expression) {
            throw new TemplateError('Empty expression');
        }
        this.input = expression;
        this.pos = 0;
        this.data = data;
        
        const result = this.parseExpression();
        this.skipWhitespace();
        
        if (this.pos < this.input.length) {
            throw new TemplateError(`Unexpected character at position ${this.pos}: ${this.input[this.pos]}`);
        }
        
        return result;
    }

    private parseExpression(): any {
        return this.parseComparison();
    }

    private parseComparison(): any {
        let left = this.parseAdditionSubtraction();

        while (true) {
            this.skipWhitespace();
            const char = this.peek();
            const nextChar = this.peek(1);
            
            if (char === '>' && nextChar === '=') {
                this.consume(); this.consume();
                left = left >= this.parseAdditionSubtraction();
            } else if (char === '<' && nextChar === '=') {
                this.consume(); this.consume();
                left = left <= this.parseAdditionSubtraction();
            } else if (char === '=' && nextChar === '=') {
                this.consume(); this.consume();
                left = left == this.parseAdditionSubtraction();
            } else if (char === '!' && nextChar === '=') {
                this.consume(); this.consume();
                left = left != this.parseAdditionSubtraction();
            } else if (char === '>') {
                this.consume();
                left = left > this.parseAdditionSubtraction();
            } else if (char === '<') {
                this.consume();
                left = left < this.parseAdditionSubtraction();
            } else {
                break;
            }
        }
        return left;
    }

    private parseAdditionSubtraction(): any {
        let left = this.parseMultiplicationDivision();

        while (true) {
            this.skipWhitespace();
            const char = this.peek();
            if (char === '+') {
                this.consume();
                const right = this.parseMultiplicationDivision();
                left = Number(left) + Number(right);
            } else if (char === '-') {
                this.consume();
                const right = this.parseMultiplicationDivision();
                left = Number(left) - Number(right);
            } else {
                break;
            }
        }
        return left;
    }

    private parseMultiplicationDivision(): any {
        let left = this.parsePrimary();

        while (true) {
            this.skipWhitespace();
            const char = this.peek();
            if (char === '*') {
                this.consume();
                const right = this.parsePrimary();
                left = Number(left) * Number(right);
            } else if (char === '/') {
                this.consume();
                const right = this.parsePrimary();
                left = Number(left) / Number(right);
            } else {
                break;
            }
        }
        return left;
    }

    private parsePrimary(): any {
        this.skipWhitespace();
        const char = this.peek();

        if (char === '(') {
            this.consume();
            const result = this.parseExpression();
            this.skipWhitespace();
            if (this.peek() !== ')') {
                throw new TemplateError('Missing closing parenthesis');
            }
            this.consume();
            return result;
        }

        if (char === "'" || char === '"') {
            return this.parseString();
        }

        if (/[0-9]/.test(char)) {
            return this.parseNumber();
        }

        if (/[a-zA-Z_]/.test(char)) {
            return this.parseIdentifier();
        }

        throw new TemplateError(`Unexpected character: ${char}`);
    }

    private parseString(): string {
        const quote = this.consume();
        let result = '';
        while (this.pos < this.input.length && this.peek() !== quote) {
            result += this.consume();
        }
        if (this.peek() !== quote) {
            throw new TemplateError('Unterminated string');
        }
        this.consume();
        return result;
    }

    private parseNumber(): number {
        let result = '';
        while (this.pos < this.input.length && /[0-9.]/.test(this.peek())) {
            result += this.consume();
        }
        return parseFloat(result);
    }

    private parseIdentifier(): any {
        let name = '';
        while (this.pos < this.input.length && /[a-zA-Z0-9_.]/.test(this.peek())) {
            name += this.consume();
        }

        this.skipWhitespace();
        if (this.peek() === '(') {
            return this.parseFunctionCall(name);
        }

        return this.resolveVariable(name);
    }

    private parseFunctionCall(name: string): any {
        const fn = this.functions.get(name);
        if (!fn) {
            throw new TemplateError(`Function not found: ${name}`);
        }

        this.consume(); // (
        const args = [];
        this.skipWhitespace();
        
        if (this.peek() !== ')') {
            while (true) {
                args.push(this.parseExpression());
                this.skipWhitespace();
                if (this.peek() === ')') break;
                if (this.peek() !== ',') throw new TemplateError('Expected comma between function arguments');
                this.consume();
                this.skipWhitespace();
            }
        }
        
        this.consume(); // )
        return fn(...args);
    }

    private resolveVariable(path: string): any {
        const parts = path.split('.');
        let current = this.data;
        for (const part of parts) {
            if (current === undefined || current === null) return '';
            current = current[part];
        }
        return current === undefined ? '' : current;
    }

    private skipWhitespace(): void {
        while (this.pos < this.input.length && /\s/.test(this.input[this.pos])) {
            this.pos++;
        }
    }

    private peek(offset = 0): string {
        return this.input[this.pos + offset] || '';
    }

    private consume(): string {
        return this.input[this.pos++] || '';
    }
}
