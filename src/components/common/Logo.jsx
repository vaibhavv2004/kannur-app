import siteConfig from "../../config/siteConfig";

function Logo() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-900">
        {siteConfig.siteName}
      </h1>
    </div>
  );
}

export default Logo;