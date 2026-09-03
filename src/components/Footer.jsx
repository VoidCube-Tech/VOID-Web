import { Link } from "react-router-dom"
import { Logo } from "./Logo"
import { ArrowIcon } from "./Icons"
import "../style/footer.css"

export function Footer() {
    
  return (
    <footer className="site-footer">
      <div className="footer-heading">
        <div className="footer-heading__brand">
          <Logo />
          <span>Engenharia de software<br />no Pará</span>
        </div>

        <div className="footer-heading__message">
          <h2>
            Software criado <em>perto de quem usa.</em>
          </h2>

          <div className="footer-heading__links">
            <nav aria-label="Navegação do rodapé">
              <Link to="/#solucoes">Soluções</Link>
              <Link to="/sobre">Sobre</Link>
              <Link to="/blog">BLOG</Link>
            </nav>

            <Link className="footer-cta" to="/contato">
              Conversar com engenharia <ArrowIcon size={20} />
            </Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 VoidCube</span>
        <span>Feito no Pará</span>
      </div>
    </footer>
  )
}