import * as React from "react"
import { cn } from "@/lib/utils"

const Select = React.forwardRef(({ className, children, ...props }, ref) => {
    return (
        <select
            className={cn(
                "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                className
            )}
            ref={ref}
            {...props}
        >
            {children}
        </select>
    )
})
Select.displayName = "Select"

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
    return (
        <select
            className={cn(
                "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                className
            )}
            ref={ref}
            {...props}
        >
            {children}
        </select>
    )
})
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder }) => (
    <option value="" disabled>{placeholder}</option>
)

const SelectContent = ({ children }) => children

const SelectItem = ({ value, children, className }) => (
    <option value={value} className={className}>
        {children}
    </option>
)

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
