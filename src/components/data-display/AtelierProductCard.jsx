import React from 'react';
import { FiPlus } from 'react-icons/fi';
import LumiereButton from '../basic/LumiereButton';
import LumiereBadge from '../basic/LumiereBadge';

const AtelierProductCard = ({ title, price, img, tag }) => (
  <div className="bg-white p-6 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-700 group">
    <div className="relative h-64 rounded-[2.5rem] overflow-hidden mb-6">
      <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
      <div className="absolute top-4 left-4">
        <LumiereBadge>{tag}</LumiereBadge>
      </div>
    </div>
    <div className="space-y-1 px-2 mb-6 text-center">
      <h4 className="text-xl font-['Playfair_Display'] italic font-bold">{title}</h4>
      <p className="text-[#4F5C18] font-bold text-xs tracking-tighter">{price}</p>
    </div>
    <LumiereButton variant="primary" className="w-full" icon={FiPlus}>Add to Bag</LumiereButton>
  </div>
);

export default AtelierProductCard;