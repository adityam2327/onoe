import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export const Dialog = ({ open, onClose, onOpenChange, children }) => {
    const overlayRef = useRef(null);

    const handleClose = onOpenChange ? () => onOpenChange(false) : onClose;

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") handleClose();
        };
        if (open) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [open, handleClose]);

    if (!open) return null;

    return (
        <div 
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={(e) => e.target === overlayRef.current && handleClose()}
        >
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
                {children}
            </div>
        </div>
    );
};

export const DialogHeader = ({ children, className = "" }) => (
    <div className={`px-6 py-4 border-b border-gray-200 flex items-center justify-between ${className}`}>
        {children}
    </div>
);

export const DialogTitle = ({ children }) => (
    <h2 className="text-xl font-bold text-[#000080]">{children}</h2>
);

export const DialogContent = ({ children, className = "" }) => (
    <div className={`px-6 py-4 overflow-y-auto max-h-[calc(90vh-80px)] ${className}`}>
        {children}
    </div>
);

export const DialogDescription = ({ children }) => (
    <p className="text-sm text-gray-500 mt-1">{children}</p>
);

export const DialogFooter = ({ children, className = "" }) => (
    <div className={`px-6 py-4 border-t border-gray-200 flex justify-end gap-3 ${className}`}>
        {children}
    </div>
);
