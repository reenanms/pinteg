import { Parser } from './Parser.js';
import { BuiltInFunctions } from './BuiltInFunctions.js';
import { TemplateError, TemplateFunction } from './types.js';

export class TemplateEngine {
    private functions: Map<string, TemplateFunction>;
    private parser: Parser;

    constructor() {
        this.functions = new Map(BuiltInFunctions);
        this.parser = new Parser(this.functions);
    }

    public registerFunction(name: string, fn: TemplateFunction): void {
        if (!name || typeof fn !== 'function') {
            throw new TemplateError('Invalid function registration');
        }
        this.functions.set(name, fn);
    }

    public render(template: string, data: any): string {
        if (template === null || template === undefined) {
            throw new TemplateError('Template cannot be null or undefined');
        }
        
        let result = template;
        
        // Handle List Blocks first (nested ones would require a more complex recursive approach, 
        // but for now we follow the spec's begin:list / end:list)
        result = this.processListBlocks(result, data);
        
        // Handle Variable/Expression Placeholders
        result = this.processPlaceholders(result, data);
        
        return result;
    }

    private processListBlocks(template: string, data: any): string {
        const listRegex = /\$\{begin:([a-zA-Z0-9_.]+)\}([\s\S]*?)\$\{end:\1\}/g;
        
        return template.replace(listRegex, (_, path, content) => {
            const listData = this.resolvePath(path, data);
            
            if (!Array.isArray(listData)) {
                return '';
            }
            
            return listData.map(item => this.render(content, { ...data, ...item, _this: item })).join('');
        });
    }

    private processPlaceholders(template: string, data: any): string {
        const placeholderRegex = /\$\{([^{}]*)\}/g;
        
        return template.replace(placeholderRegex, (_, expression) => {
            try {
                // If the expression starts with begin: or end:, it was likely part of a malformed block,
                // but processListBlocks should have handled correct ones. 
                // We'll let the parser try or catch errors.
                const val = this.parser.evaluate(expression.trim(), data);
                return val === null || val === undefined ? '' : String(val);
            } catch (err) {
                if (err instanceof TemplateError) throw err;
                throw new TemplateError(`Error evaluating expression "${expression}": ${err instanceof Error ? err.message : String(err)}`);
            }
        });
    }

    private resolvePath(path: string, data: any): any {
        const parts = path.split('.');
        let current = data;
        for (const part of parts) {
            if (current === undefined || current === null) return undefined;
            current = current[part];
        }
        return current;
    }
}
