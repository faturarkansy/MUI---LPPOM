import {
  IconUserCheck,
  IconUsersGroup,
} from "@tabler/icons-react";
import Chart from "react-apexcharts";
import { useState, useEffect } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import axiosClient from "../../../axios-client";

interface Submission {
  company_id: number | null;
}

const AgentDashboard = () => {
  const [chartOptions, setChartOptions] = useState({});
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const getResponsiveFontSize = () => {
    if (window.innerWidth < 640) {
      return '10px'; // Mobile
    } else {
      return '14px'; // Desktop
    }
  };

  useEffect(() => {
    const now = new Date();

    // Tahun dan bulan saat ini
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-based (0 = Jan, 11 = Dec)

    // Hitung jumlah hari dalam bulan ini
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // 0 berarti hari terakhir dari bulan sebelumnya

    // Kalau jumlah hari > 1, mulai dari hari ke-2, kalau tidak mulai dari hari pertama
    const startDay = daysInMonth > 1 ? 2 : 1;
    const firstDayOfMonth = new Date(year, month, startDay);
    const formattedFirstDay = firstDayOfMonth.toISOString().split("T")[0];

    const formattedToday = now.toISOString().split("T")[0];

    console.log("Jumlah hari di bulan ini:", daysInMonth);
    console.log("Tanggal awal (startDate):", formattedFirstDay);
    console.log("Tanggal akhir (today):", formattedToday);

    setStartDate(formattedFirstDay);
    setEndDate(formattedToday);
  }, []);



  useEffect(() => {
    const fetchTotalSubmissions = async () => {
      try {
        const response = await axiosClient.get("/submissions");
        const submissions: Submission[] = response.data?.data || [];

        // Set total submissions
        setTotalSubmissions(submissions.length);

        // Hitung company_id unik
        const uniqueCompanyIds = new Set(submissions.map(item => item.company_id));
        setTotalCompanies(uniqueCompanyIds.size);

      } catch (error) {
        console.error("Failed to fetch total submissions:", error);
        setTotalSubmissions(0);
        setTotalCompanies(0);
      }
    };


    fetchTotalSubmissions();
  }, []);


  useEffect(() => {
    const updateChartOptions = () => {
      const fontSize = getResponsiveFontSize();

      setChartOptions({
        chart: {
          id: "submission-status",
          toolbar: { show: false },
        },
        xaxis: {
          categories: ["Prospek", "Approaching", "Presenting", "Offering", "Closing"],
          labels: {
            style: {
              fontSize: fontSize,
              colors: '#4B5563',
            },
          },
        },
        yaxis: {
          show: false,
        },
        grid: {
          yaxis: {
            lines: { show: false },
          },
        },
        plotOptions: {
          bar: {
            columnWidth: '20%',
            distributed: false,
          },
        },
        dataLabels: {
          enabled: true,
        },
        colors: ["#4F46E5"],
        legend: {
          show: false, // <- Tambahkan ini
        },
      });
    };

    // Set initial chart options
    updateChartOptions();

    // Update on resize
    window.addEventListener('resize', updateChartOptions);
    return () => window.removeEventListener('resize', updateChartOptions);
  }, []);

  const chartSeries = [
    {
      name: "Submission",
      data: [12, 18, 10, 9, 14], // dummy data
    },
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle="Dashboard" />
      <div className="space-y-3 min-h-screen">
        <div className="flex items-center space-x-2 mt-3">
          <input
            type="date"
            className="border-black border-2 sm:py-2 py-1.5 sm:px-3 px-2 font-bold text-xs sm:text-sm rounded-lg w-fit min-w-[5rem]"
            value={startDate}
          />
          <span className="text-gray-600">-</span>
          <input
            type="date"
            className="border-black border-2 sm:py-2 py-1.5 sm:px-3 px-2 font-bold text-xs sm:text-sm rounded-lg w-fit min-w-[5rem]"
            value={endDate}
          />
          <button className="bg-black text-white sm:py-2 py-1.5 sm:px-3 px-2 ml-1 text-xs sm:text-sm border-black border-2 rounded-lg w-fit hover:bg-gray-400 hover:text-black">
            Filter
          </button>
        </div>
        {/* Top 4 Cards */}
        <div className="grid grid-cols-2 gap-3 mt-3">

          {/* Card 1 */}
          <div className="flex items-start p-4 bg-white rounded-xl border border-gray-400">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
              <IconUsersGroup size={24} />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold">{totalCompanies}</h2>
              <p className="text-gray-600 text-xs">Total Pelaku Usaha</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex items-start p-4 bg-white rounded-xl border border-gray-400">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <IconUserCheck size={24} />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold">53</h2>
              <p className="text-gray-600 text-xs">Total Pelaku Usaha dengan Submission Berhasil</p>
            </div>
          </div>
          {/* Card 3 */}
          <div className="flex items-start p-4 bg-white rounded-xl border border-gray-400">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <IconUsersGroup size={24} />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold">{totalSubmissions}</h2>
              <p className="text-gray-600 text-xs">Total Submission</p>
            </div>
          </div>

          {/* Card 4  */}
          <div className="flex items-start p-4 bg-white rounded-xl border border-gray-400">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <IconUserCheck size={24} />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold">65</h2>
              <p className="text-gray-600 text-xs">Total Submission Berhasil</p>
            </div>
          </div>
        </div>

        {/* Chart 1 */}
        <div className="bg-white px-4 py-2 rounded-xl border border-gray-400">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
            <h3 className="text-lg font-semibold text-gray-800">
              Status Activities
            </h3>
          </div>

          <div className="overflow-x-scroll">
            <div className="min-w-[600px]"> {/* Atur min-width sesuai kebutuhan */}
              <Chart
                options={chartOptions}
                series={chartSeries}
                type="bar"
                height={200}
                width="100%"
              />
            </div>
          </div>
        </div>


        {/* Chart 2 */}
        <div className="bg-white px-4 py-2 rounded-xl border border-gray-400">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
            <h3 className="text-lg font-semibold text-gray-800">
              Status Submissions
            </h3>
          </div>

          <div className="overflow-x-scroll">
            <div className="min-w-[600px]"> {/* Atur min-width sesuai kebutuhan */}
              <Chart
                options={chartOptions}
                series={chartSeries}
                type="bar"
                height={200}
                width="100%"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default AgentDashboard;
