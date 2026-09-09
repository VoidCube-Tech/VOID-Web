import { Link } from "react-router-dom";


export function Logo() {
  const logo = new URL('/VoidCube_LOGO.svg', import.meta.url).href
 return <Link className="logo" to="/" aria-label="VoidCube — início">
    <img
      src={logo}
      className="logo-symbol"
      alt=""
      aria-hidden="true"
    />
    <span>VOID<b>CUBE</b></span>
  </Link>
}