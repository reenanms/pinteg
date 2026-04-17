import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
}

const BaseIcon: React.FC<IconProps> = ({ size = 18, children, ...props }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        {children}
    </svg>
);

export const PlusIcon: React.FC<IconProps> = (props) => (
    <BaseIcon {...props}>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </BaseIcon>
);

export const SaveIcon: React.FC<IconProps> = (props) => (
    <BaseIcon {...props}>
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
    </BaseIcon>
);

export const XIcon: React.FC<IconProps> = (props) => (
    <BaseIcon {...props}>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </BaseIcon>
);

export const TrashIcon: React.FC<IconProps> = (props) => (
    <BaseIcon {...props}>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </BaseIcon>
);

export const PencilIcon: React.FC<IconProps> = (props) => (
    <BaseIcon {...props}>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </BaseIcon>
);

export const CheckIcon: React.FC<IconProps> = (props) => (
    <BaseIcon {...props}>
        <polyline points="20 6 9 17 4 12" />
    </BaseIcon>
);

export const EyeIcon: React.FC<IconProps> = (props) => (
    <BaseIcon {...props}>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </BaseIcon>
);

export const ChevronRightIcon: React.FC<IconProps> = (props) => (
    <BaseIcon {...props}>
        <polyline points="9 18 15 12 9 6" />
    </BaseIcon>
);

export const ChevronDownIcon: React.FC<IconProps> = (props) => (
    <BaseIcon {...props}>
        <polyline points="6 9 12 15 18 9" />
    </BaseIcon>
);

export const ChevronUpIcon: React.FC<IconProps> = (props) => (
    <BaseIcon {...props}>
        <polyline points="18 15 12 9 6 15" />
    </BaseIcon>
);
