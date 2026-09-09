import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Logo } from "./Logo"
import { ArrowIcon } from "./Icons"
import "../style/footer.css"

export function Footer({ footerRef }) {
  const { t } = useTranslation("footer")

  const navigation = t("navigation", { returnObjects: true })

  return (
    <footer ref={footerRef} className="site-footer">
      <div className="footer-heading">
        <div className="footer-heading__brand" data-reveal>
          <Logo />
          <span>{t("brand.line1")}<br />{t("brand.line2")}</span>
        </div>

        <div className="footer-heading__message">
          <h2>
            {t("message.line1")} <em>{t("message.line2")}</em>
          </h2>

          <div className="footer-heading__links">
            <nav data-reveal aria-label={t("navigationLabel")}>
              {navigation.map(item => (
                <Link key={item.path} to={item.path}>
                  {t(item.label)}
                </Link>
              ))}
            </nav>

            <Link className="footer-cta" data-reveal to="/contato">
              {t("cta")}
              <ArrowIcon size={20} />
            </Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom" data-reveal>
        <span>{t("copyright")}</span>
        <span>{t("location")}</span>
      </div>
    </footer>
  )
}
