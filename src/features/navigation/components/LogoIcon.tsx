interface Props { readonly loading?: 'eager' | 'lazy' }
export function LogoIcon({ loading = 'eager' }: Props) {
	return (
		<img
			src="/VoidCube_LOGO.svg"
			alt=""
			width={1000}
			height={1000}
			loading={loading}
			decoding="async"
			aria-hidden="true"
			className="h-full w-auto object-contain group-hover:animate-[logo-wiggle_400ms_ease-in-out]"
		/>
	);
}