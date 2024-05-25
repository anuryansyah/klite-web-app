import { FC, SetStateAction, Dispatch, useState } from 'react';
import useDebounce from 'Components/Hooks/useDebounce';
import Select from "react-select";

interface Props {
  filter: any;
  setFilter: Dispatch<SetStateAction<any>>;
  setLoadingData: Dispatch<SetStateAction<boolean>>;
}

const Filter: FC<Props> = ({ filter, setFilter, setLoadingData }) => {
  const debounceLoadingData = useDebounce(() => {
    setLoadingData(true);
  });

  const dayOpts = [
    { value: '', label: 'Semua Hari' },
    { value: '1', label: 'Senin' },
    { value: '2', label: 'Selasa' },
    { value: '3', label: 'Rabu' },
    { value: '4', label: 'Kamis' },
    { value: '5', label: 'Jumat' },
    { value: '6', label: 'Sabtu' },
    { value: '7', label: 'Minggu' },
  ];
  const [selectedDay, setSelectedDay] = useState<any>({ value: '', label: 'Semua Hari' });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFilter((prev: any) => ({ ...prev, [name]: value }));
    if (name === 'keywords') {
      debounceLoadingData();
    } else {
      setLoadingData(true);
    }
  };  

  const handleSelectDay = (day:any) => {
    setFilter((prev: any) => ({ ...prev, day: day.value }));
    setSelectedDay(day)
    setLoadingData(true);
  }

  return (
    <div className='d-flex gap-3'>
      <div className="w-50">
        <input
          className="form-control"
          name="keywords"
          placeholder="Cari..."
          value={filter.keywords}
          onChange={handleChange}
        />
      </div>
      <div className='w-50'>
        <Select
          placeholder='Pilih Hari'
          value={selectedDay}
          options={dayOpts}
          onChange={(selected:any) => handleSelectDay(selected)}
        />
      </div>
    </div>
  )
}

export default Filter;