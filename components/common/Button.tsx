import { ReactNode } from "react"

interface IButtonProps {
    type: 'primary' | 'ghost' | 'border-primary'
    label: ReactNode,
    width?: string
    height?: string
    labelColor?: 'white' | 'grey' | 'primary'
    onClick?: () => void
}

export default function Button({
    type, label, height = '42px', width = '139px', labelColor = 'white', onClick
}: IButtonProps) {
    return (
        <button onClick={onClick} style={{ width, height, boxShadow: type === "primary" ? '0px 1px 3px 1px rgba(18, 23, 28, 0.08), 0px 1px 2px 0px rgba(18, 23, 28, 0.20)' : '' }} className={`text-${labelColor} ${type === "primary" ? 'bg-primary' : type === "border-primary" ? "border border-primary" : ""} rounded-[4px] $`}>
            {label}
        </button>
    )
}