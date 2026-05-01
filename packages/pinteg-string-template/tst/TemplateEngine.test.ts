import { describe, it, expect } from 'vitest';
import { TemplateEngine, TemplateError } from '../src/index.js';

describe('TemplateEngine', () => {
    const engine = new TemplateEngine();

    describe('Variable Interpolation', () => {
        it('should interpolate simple variables', () => {
            const template = 'Hello ${name}';
            const data = { name: 'World' };
            expect(engine.render(template, data)).toBe('Hello World');
        });

        it('should handle null and undefined variables', () => {
            expect(engine.render('Val: ${val}', { val: null })).toBe('Val: ');
            expect(engine.render('Val: ${val}', { val: undefined })).toBe('Val: ');
        });

        it('should interpolate nested variables', () => {
            const template = 'City: ${user.address.city}';
            const data = { user: { address: { city: 'New York' } } };
            expect(engine.render(template, data)).toBe('City: New York');
        });

        it('should handle partial paths in interpolation', () => {
            expect(engine.render('${user.missing.property}', { user: {} })).toBe('');
            expect(engine.render('${user.missing.property}', { user: { missing: null } })).toBe('');
        });

        it('should return empty string for missing variables', () => {
            const template = 'Val: ${missing}';
            expect(engine.render(template, {})).toBe('Val: ');
        });
    });

    describe('Arithmetic Operations', () => {
        it('should perform addition and subtraction', () => {
            expect(engine.render('${1 + 2 - 1}', {})).toBe('2');
        });

        it('should perform complex arithmetic with variables', () => {
            const data = { a: 10, b: 2, c: 5 };
            expect(engine.render('${(a + b) * c / 2}', data)).toBe('30');
        });
    });

    describe('Comparison Operations', () => {
        it('should support all comparison operators', () => {
            expect(engine.render('${1 > 0}', {})).toBe('true');
            expect(engine.render('${0 < 1}', {})).toBe('true');
            expect(engine.render('${1 >= 1}', {})).toBe('true');
            expect(engine.render('${1 <= 1}', {})).toBe('true');
            expect(engine.render('${1 == 1}', {})).toBe('true');
            expect(engine.render('${1 != 2}', {})).toBe('true');
        });
    });

    describe('Built-in Functions', () => {
        it('should support SUM', () => {
            expect(engine.render('${SUM(1, 2, 3)}', {})).toBe('6');
            expect(engine.render('${SUM(1, "invalid")}', {})).toBe('1');
        });

        it('should support SUBSTRING', () => {
            expect(engine.render('${SUBSTRING("Hello", 0, 2)}', {})).toBe('He');
            expect(engine.render('${SUBSTRING("Hello", 1)}', {})).toBe('ello');
            expect(engine.render('${SUBSTRING(123, 1)}', {})).toBe('');
        });

        it('should support UPPER and LOWER', () => {
            expect(engine.render('${UPPER("hi")} ${LOWER("BYE")}', {})).toBe('HI bye');
            expect(engine.render('${UPPER(123)} ${LOWER(123)}', {})).toBe(' ');
        });

        it('should support IF', () => {
            expect(engine.render('${IF(1 > 0, "yes", "no")}', {})).toBe('yes');
            expect(engine.render('${IF(0 > 1, "yes", "no")}', {})).toBe('no');
        });

        it('should support nested functions', () => {
            expect(engine.render('${UPPER(SUBSTRING("hello", 0, 1))}', {})).toBe('H');
        });
    });

    describe('List Iteration', () => {
        it('should iterate over a list', () => {
            const template = '${begin:items}${name}, ${end:items}';
            const data = { items: [{ name: 'A' }, { name: 'B' }] };
            expect(engine.render(template, data)).toBe('A, B, ');
        });

        it('should handle empty or missing lists', () => {
            expect(engine.render('${begin:items}${name}${end:items}', {})).toBe('');
            expect(engine.render('${begin:items}${name}${end:items}', { items: 'not an array' })).toBe('');
        });

        it('should support _this for primitive lists', () => {
            const template = '${begin:tags}${_this} ${end:tags}';
            const data = { tags: ['js', 'ts'] };
            expect(engine.render(template, data)).toBe('js ts ');
        });

        it('should handle nested paths in begin', () => {
            const data = { obj: { list: [{ v: 1 }] } };
            expect(engine.render('${begin:obj.list}${v}${end:obj.list}', data)).toBe('1');
        });
    });

    describe('Custom Functions', () => {
        it('should allow registering custom functions', () => {
            engine.registerFunction('HELLO', (name) => `Hello ${name}!`);
            expect(engine.render('${HELLO("Agent")}', {})).toBe('Hello Agent!');
        });

        it('should throw on invalid registration', () => {
            expect(() => engine.registerFunction('', () => {})).toThrow(TemplateError);
            expect(() => engine.registerFunction('TEST', null as any)).toThrow(TemplateError);
        });
    });

    describe('Error Handling', () => {
        it('should throw on template null/undefined', () => {
            expect(() => engine.render(null as any, {})).toThrow(TemplateError);
        });

        it('should throw on missing closing parenthesis', () => {
            expect(() => engine.render('${SUM(1, 2}', {})).toThrow(TemplateError);
            expect(() => engine.render('${(1 + 2}', {})).toThrow(TemplateError);
        });

        it('should throw on unknown function', () => {
            expect(() => engine.render('${UNKNOWN()}', {})).toThrow(TemplateError);
        });

        it('should throw on unterminated string', () => {
            expect(() => engine.render('${"unterminated}', {})).toThrow(TemplateError);
        });

        it('should throw on unexpected character', () => {
            expect(() => engine.render('${1 @ 2}', {})).toThrow(TemplateError);
            expect(() => engine.render('${SUM(1, @)}', {})).toThrow(TemplateError);
        });
        
        it('should throw on empty expression', () => {
            expect(() => engine.render('${}', {})).toThrow(TemplateError);
        });

        it('should handle non-TemplateError in evaluation', () => {
            engine.registerFunction('CRASH', () => { throw new Error('Boom'); });
            expect(() => engine.render('${CRASH()}', {})).toThrow(TemplateError);
        });

        it('should throw if expected comma is missing in function call', () => {
            expect(() => engine.render('${SUM(1 2)}', {})).toThrow('Expected comma');
        });
    });
});
