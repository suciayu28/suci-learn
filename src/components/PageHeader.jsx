const PageHeader = ({ title, breadcrumb, children }) => {
  return (
    <div className="flex justify-between items-end mb-8 border-b border-pink-50 pb-6">
      <div>
        {/* Breadcrumb di atas judul dengan gaya minimalis */}
        <p className="text-rose-300 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">
          {breadcrumb}
        </p>

        {/* Judul dengan font yang lebih elegan */}
        <h1 className="text-3xl font-serif font-bold text-gray-800 tracking-tight">
          {title}
        </h1>
      </div>

      {/* Area tombol (children) dengan gap yang lebih rapi */}
      <div className="flex gap-3 items-center">
        {children}
      </div>
    </div>
  );
};

export default PageHeader;