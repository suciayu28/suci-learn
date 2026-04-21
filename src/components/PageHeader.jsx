
const PageHeader = ({ title, breadcrumb, children }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        {/* Menggunakan prop title agar judul tidak kaku "Dashboard" saja */}
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        
        {/* Menggunakan prop breadcrumb */}
        <p className="text-gray-400 text-sm">
          {breadcrumb}
        </p>
      </div>

      {/* Children akan menampilkan tombol "Add Order" atau "Add Customer" 
          yang dikirim dari halaman masing-masing */}
      <div className="flex gap-2">
        {children}
      </div>
    </div>
  );
};

export default PageHeader;