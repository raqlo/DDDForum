interface LoadingSpinnerProps {
    size: 'sm' | 'md' | 'lg';
}

function LoadingSpinner({size}: LoadingSpinnerProps) {
    return <span className={`fixed top-0 left-1/2 loading loading-spinner loading-${size}`}></span>
}

export {LoadingSpinner}