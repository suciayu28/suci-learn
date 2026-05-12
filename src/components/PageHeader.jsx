const PageHeader = ({ title, breadcrumb, children }) => {
  return (
    <div className="flex justify-between items-end mb-8 border-b border-[#F3F3F3] pb-6">
      <div>
        {/* Breadcrumb menggunakan Primary Green dengan opacity rendah untuk kesan lux */}
        <nav className="flex items-center gap-2 mb-2">
          {Array.isArray(breadcrumb) ? (
            breadcrumb.map((item, index) => (
              <span key={index} className="flex items-center gap-2">
                <span className="text-[#4F5C18]/50 text-[9px] uppercase tracking-[0.2em] font-black">
                  {item}
                </span>
                {index < breadcrumb.length - 1 && (
                  <span className="w-1 h-1 rounded-full bg-[#4F5C18]/20" />
                )}
              </span>
            ))
          ) : (
            <span className="text-[#4F5C18]/50 text-[9px] uppercase tracking-[0.2em] font-black">
              {breadcrumb}
            </span>
          )}
        </nav>

        {/* Judul menggunakan Font Serif (Playfair Display) sesuai CP */}
        <h1 className="text-3xl font-playfair font-bold text-[#262626] tracking-tight">
          {title}
        </h1>
      </div>

      {/* Area tombol (children) */}
      <div className="flex gap-3 items-center">
        {children}
      </div>
    </div>
  );
};

export default PageHeader;