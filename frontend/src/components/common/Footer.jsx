import { Landmark, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import navigation from "../../constants/navigation";

function Footer({ setCurrentTab, siteSettings }) {
  const social = siteSettings?.social || {};
  const office = siteSettings?.office || {};
  const handleSubscribe = (e) => {
    e.preventDefault();
    alert("Thank you for subscribing to updates!");
    e.target.reset();
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 text-white">
                <Landmark className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg">{siteSettings?.siteName}</span>
            </div>
            <p className="text-sm text-slate-400">
              Connecting the citizens of {siteSettings?.constituency} directly with their representative for progressive development and collective growth.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition" aria-label="Facebook">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition" aria-label="Instagram">
                <svg className="h-5 w-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href={social.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition" aria-label="YouTube">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.41 19c1.71.46 8.59.46 8.59.46s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" className="fill-slate-900" />
                </svg>
              </a>
              <a href={social.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition" aria-label="WhatsApp">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navigation.slice(0, 5).map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setCurrentTab(item.path)}
                    className="text-sm hover:text-emerald-400 hover:underline transition cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support / Contact Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm">
                <MapPin className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{office.address}</span>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Phone className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>{office.phone}</span>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Mail className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>{office.email}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Newsletter</h3>
            <p className="text-sm text-slate-400 mb-4">
              Subscribe to receive development progress reports and announcement alerts directly in your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex">
              <input
                type="email"
                required
                placeholder="Enter email address"
                className="w-full rounded-l-lg bg-slate-800 border-0 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-r-lg bg-emerald-600 px-4 hover:bg-emerald-700 transition duration-200 text-white flex items-center justify-center cursor-pointer"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {siteSettings?.mlaName}. All rights reserved.</p>

          <div className="flex items-center gap-4">
            {/* User Panel Button — visible only when in Admin area */}
            <button
              onClick={() => setCurrentTab("/")}
              className="hover:text-emerald-400 font-bold underline transition cursor-pointer"
            >
              ← User Panel
            </button>

            {/* Admin Portal Button */}
            <button
              onClick={() => setCurrentTab("/admin")}
              className="hover:text-emerald-400 font-bold underline transition cursor-pointer"
            >
              Admin Portal
            </button>
          </div>

          <p>Designed &amp; Maintained by constituency IT cell.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
