import React from 'react';
import { FaCalendar, FaBook } from "react-icons/fa";

type CardProps = {
  name: string;
  startDate?: Date;
  endDate?: Date;
  namaHari?: string[];
};

const Card: React.FC<CardProps> = ({ name, startDate, endDate, namaHari }) => {
  return (
    <div className="flex items-center w-64 md:w-80 h-28 justify-around py-4 px-5 bg-themeTeal/20 rounded-xl shadow-md mb-4 md:mb-4">
      <div className="flex flex-col items-start">
        <div className='flex flex-row justify-center items-center'>
          <FaBook className='text-gray-700 text-base'/>
          <p className="ml-2 font-bold text-lg">
            {name}
          </p>
        </div>
        {startDate && endDate && namaHari && (
          <div className='flex flex-row justify-center items-center'>
            <FaCalendar className='text-gray-700 text-base'/>
            <p className="text-sm ml-3">
              {`${namaHari[startDate.getDay()]} ${startDate.getHours() > 13 ? startDate.getHours() > 18 ? 'malam' : 'sore' : 'pagi'}, ${startDate.toLocaleString('id').replace(/\//g, '-').replace(',', '').split(' ')[0]} (${startDate.toLocaleTimeString('id')} s/d ${endDate.toLocaleTimeString('id')})`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;