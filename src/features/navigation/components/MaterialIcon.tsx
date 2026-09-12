interface Props {
	readonly className?: string;
	readonly name: string;
}

export function MaterialIcon({ className = "size-5", name }: Props) {
	return <span aria-hidden="true" className={`material-symbols-outlined inline-block ${className}`}>{name}</span>;
}
