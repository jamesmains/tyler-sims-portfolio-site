import React from 'react';
import { TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

interface MemoizedSearchInputProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
}

const MemoizedSearchInput = React.memo(
    React.forwardRef<HTMLInputElement, MemoizedSearchInputProps>(
        ({ id, label, value, onChange }, ref) => {
            
        return (
            <TextInput
                ref={ref}
                key={id} 
                id={id}
                placeholder={`Search ${label}...`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                leftSection={<IconSearch size={14} />} 
            />
        );
    })
);

export default MemoizedSearchInput;