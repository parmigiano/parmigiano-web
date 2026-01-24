import Load from "@/components/Loader/Load";
import { useState } from "react";

interface GUIButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    onClick?: () => Promise<void> | void;
}

const GUIButton: React.FC<GUIButtonProps> = ({ disabled, children, className, onClick, ...props }) => {
    const [loading, setLoading] = useState<boolean>(false);

    const handleClick = async () => {
        if (loading || !onClick) return;

        try {
            setLoading(true);
            await onClick();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-end items-center">
            <button {...props} id="button" className={`${className} ${loading && '!opacity-50 !cursor-default'}`} disabled={disabled || loading} onClick={handleClick}>
                {loading ? <Load /> : children}
            </button>
        </div>
    )
}

export default GUIButton
