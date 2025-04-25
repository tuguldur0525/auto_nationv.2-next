export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-col">
                        <h3>Манай апп-ыг татах (Тун удахгүй)</h3>
                        <p>Google play болон App store-с татах боломжтой.</p>
                        <div className="app-logo">
                        <img src="/images/apple-logo-transparent.svg" alt="App Store" />
                        <img src="/images/play-store-logo3.png" alt="Google Play" /> 
                        </div>
                    </div>
                    <div className="footer-col">
                        <img className="footer-logo" src="/images/Logo_AN.png" alt="autonation logo"/>
                        <p>Монголын хамгийн том авто худалдааны сайт.</p>
                     </div>
                     <div className="footer-col">
                        <h3>Бидний цахим хуудсыг дагах</h3>
                        <ul>
              <li><a href="#">Facebook</a></li>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">YouTube</a></li>
            </ul>
                     </div>
                     <div className="footer-col">
                     <h3>Холбоо барих</h3>
            <ul>
              <li><a href="#">Утас: +976-99008800</a></li>
              <li><a href="#">И-Майл хаяг: autonation@sales.mn</a></li>
              <li>
                <a href="#">
                  Хаяг байршил: Улаанбаатар хот, СБД 8-р хороо, Оюутны гудамж, МУИС-8
                </a>
              </li>
            </ul>
                     </div>
                </div>
            </div>
            <div className="copyright">
        <p>&copy; 2025 AutoNation. Бүх эрх хуулиар хамгаалагдсан.</p>
      </div>
        </footer>
    );
}