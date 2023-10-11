import { ReactNode } from "react"

interface IButtonProps {
    type: 'primary' | 'ghost'
    label: ReactNode,
    width?: string
    height?: string
    labelColor?: 'white' | 'grey'
    onClick?: () => void
}

export default function Button({
    type, label, height = '42px', width = '139px', labelColor = 'white', onClick
}: IButtonProps) {
    return (
        <button onClick={onClick} style={{ boxShadow: type === "primary" ? '0px 1px 3px 1px rgba(18, 23, 28, 0.08), 0px 1px 2px 0px rgba(18, 23, 28, 0.20)' : '' }} className={`text-${labelColor} w-[139px] h-[42px] ${type === "primary" ? 'bg-primary' : ''} rounded-[4px]`}>
            {label}
        </button>
    )
}