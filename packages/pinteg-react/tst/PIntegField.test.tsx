import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { PIntegField } from '../src/components/PIntegField';
import { FieldRendererRegistry } from 'pinteg-core';
import { SchemaRegistry } from '../src/registry/SchemaRegistry';

// Ensure defaults are registered
import { registerDefaultRenderers } from '../src/registry/defaultRenderers';
registerDefaultRenderers();

const textDef = { type: 'text', caption: 'My Field' };
const onChange = () => { };

describe('PIntegField', () => {
    it('renders a known field type (text) without error', () => {
        const { container } = render(
            <PIntegField
                name="myField"
                definition={textDef}
                value="hello"
                readOnly={false}
                tableMode={false}
                onChange={onChange}
            />
        );
        expect(container.querySelector('input')).not.toBeNull();
    });

    it('hides label in tableMode', () => {
        const { container } = render(
            <PIntegField
                name="myField"
                definition={textDef}
                value="hello"
                readOnly={false}
                tableMode={true}
                onChange={onChange}
            />
        );
        // In tableMode the label is not rendered (caption handled by thead)
        expect(container.querySelector('label')).toBeNull();
    });

    it('renders pinteg-mobile-label span in tableMode', () => {
        const { container } = render(
            <PIntegField
                name="myField"
                definition={textDef}
                value="hello"
                readOnly={false}
                tableMode={true}
                onChange={onChange}
            />
        );
        const mobileLabel = container.querySelector('.pinteg-mobile-label');
        expect(mobileLabel).not.toBeNull();
        expect(mobileLabel?.textContent).toBe('My Field');
    });

    it('does NOT render pinteg-mobile-label in form mode', () => {
        const { container } = render(
            <PIntegField
                name="myField"
                definition={textDef}
                value="hello"
                readOnly={false}
                tableMode={false}
                onChange={onChange}
            />
        );
        expect(container.querySelector('.pinteg-mobile-label')).toBeNull();
    });

    it('returns null and warns for an unknown type in tableMode', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
        const { container } = render(
            <PIntegField
                name="myField"
                definition={{ type: 'unknown-xyz' }}
                value={null}
                readOnly={false}
                tableMode={true}
                onChange={onChange}
            />
        );
        expect(container.firstChild).toBeNull();
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('unknown-xyz'));
        warnSpy.mockRestore();
    });

    it('returns null and warns for an unknown type in form mode (no sub-schema)', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
        const { container } = render(
            <PIntegField
                name="myField"
                definition={{ type: 'totally-unknown-type' }}
                value={null}
                readOnly={false}
                tableMode={false}
                onChange={onChange}
            />
        );
        expect(container.firstChild).toBeNull();
        expect(warnSpy).toHaveBeenCalled();
        warnSpy.mockRestore();
    });

    it('renders a nested PIntegForm when the type matches a registered schema (form mode)', () => {
        const subSchemaName = `nested-${Date.now()}`;
        SchemaRegistry.register(subSchemaName, {
            street: { type: 'text', caption: 'Street' },
        });

        const { getByLabelText } = render(
            <PIntegField
                name="address"
                definition={{ type: subSchemaName, caption: 'Address' }}
                value={{ street: '123 Main St' }}
                readOnly={false}
                tableMode={false}
                onChange={onChange}
            />
        );
        // The nested form should render the 'Street' field
        expect(getByLabelText('Street')).toBeDefined();
    });

    it('renders the nested section caption when provided', () => {
        const schemaName = `captioned-${Date.now()}`;
        SchemaRegistry.register(schemaName, {
            field: { type: 'text', caption: 'Inner Field' },
        });

        const { getByText } = render(
            <PIntegField
                name="section"
                definition={{ type: schemaName, caption: 'My Section' }}
                value={{}}
                readOnly={false}
                tableMode={false}
                onChange={onChange}
            />
        );
        expect(getByText('My Section')).toBeDefined();
    });

    it('does NOT render nested form in tableMode even when schema matches', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
        const schemaName = `table-nested-${Date.now()}`;
        SchemaRegistry.register(schemaName, {
            field: { type: 'text', caption: 'Inner' },
        });

        const { container } = render(
            <PIntegField
                name="section"
                definition={{ type: schemaName, caption: 'Sec' }}
                value={{}}
                readOnly={false}
                tableMode={true}
                onChange={onChange}
            />
        );
        // tableMode disables nested schema rendering → falls through to null
        expect(container.firstChild).toBeNull();
        warnSpy.mockRestore();
    });

    it('passes listOptions override to the renderer', () => {
        const onChange2 = vi.fn();
        const { getByRole } = render(
            <PIntegField
                name="color"
                definition={{ type: 'list', caption: 'Color', options: ['red'] }}
                value=""
                readOnly={false}
                tableMode={false}
                listOptions={{ color: ['blue', 'green'] }}
                onChange={onChange2}
            />
        );
        const select = getByRole('combobox') as HTMLSelectElement;
        // 'blue' and 'green' come from listOptions override; 'red' should not appear
        const options = Array.from(select.options).map(o => o.value);
        expect(options).toContain('blue');
        expect(options).toContain('green');
        expect(options).not.toContain('red');
    });
});
