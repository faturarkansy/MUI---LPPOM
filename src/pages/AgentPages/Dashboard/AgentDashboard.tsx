import {
  IconUserCheck,
  IconUsersGroup,
} from "@tabler/icons-react";
import Chart from "react-apexcharts";
import { useState, useEffect } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import axiosClient from "../../../axios-client";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

const AgentDashboard = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [summary, setSummary] = useState<any>(null);

  const [chartOptions, setChartOptions] = useState<any>({});
  const [activityChartSeries, setActivityChartSeries] = useState<any>([]);
  const [submissionChartSeries, setSubmissionChartSeries] = useState<any>([]);

  const getResponsiveFontSize = () => {
    return window.innerWidth < 640 ? "10px" : "14px";
  };

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1);
    setStartDate(firstDay);
    setEndDate(now);
  }, []);

  const fetchSummaryData = async () => {
    if (!startDate || !endDate) return;

    const start = startDate.toISOString().split("T")[0];
    const end = endDate.toISOString().split("T")[0];

    try {
      const res = await axiosClient.get(`/data/summary?periode[start]=${start}&periode[end]=${end}`);
      const data = res.data;

      setSummary(data);

      // Set chart series
      setActivityChartSeries([
        {
          name: "Activities",
          data: [
            data.activities.status.Prospect || 0,
            data.activities.status.Approaching || 0,
            data.activities.status.Presenting || 0,
            data.activities.status.Offering || 0,
            data.activities.status.Closing || 0,
          ],
        },
      ]);

      setSubmissionChartSeries([
        {
          name: "Submissions",
          data: [
            data.submission.status.New || 0,
            data.submission.status.Open || 0,
            data.submission.status.Process || 0,
            data.submission.status.Pending || 0,
            data.submission.status.Complete || 0,
            data.submission.status.Cancel || 0,
          ],
        },
      ]);

    } catch (err) {
      console.error("Failed to fetch summary data:", err);
    }
  };

  useEffect(() => {
    const fontSize = getResponsiveFontSize();

    setChartOptions({
      chart: {
        toolbar: { show: false },
      },
      xaxis: {
        labels: {
          style: {
            fontSize: fontSize,
            colors: "#4B5563",
          },
        },
      },
      yaxis: {
        show: false,
      },
      grid: {
        yaxis: { lines: { show: false } },
      },
      plotOptions: {
        bar: {
          columnWidth: "20%",
        },
      },
      dataLabels: {
        enabled: true,
      },
      colors: ["#4F46E5"],
      legend: {
        show: false,
      },
    });

    window.addEventListener("resize", () => {
      setChartOptions((prev: any) => ({
        ...prev,
        xaxis: {
          ...prev.xaxis,
          labels: {
            ...prev.xaxis.labels,
            fontSize: getResponsiveFontSize(),
          },
        },
      }));
    });

    return () => window.removeEventListener("resize", () => { });
  }, []);

  useEffect(() => {
    fetchSummaryData();
  }, [startDate, endDate]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Dashboard" />
      <div className="space-y-3 min-h-screen">
        {/* <div className="flex items-center mt-3 ">
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date)}
            dateFormat="dd-MM-yyyy"
            className="border-black border-2 sm:py-2 py-1.5 sm:px-3 px-2 font-bold text-xs sm:text-sm rounded-lg w-[95px]"
            placeholderText="Start Date"
            popperContainer={({ children }) => <div>{children}</div>}
          />
          <span className="text-gray-600 mx-2">-</span>
          <DatePicker
            selected={endDate}
            onChange={(date: Date | null) => setEndDate(date)}
            dateFormat="dd-MM-yyyy"
            className="border-black border-2 mr-2 sm:py-2 py-1.5 sm:px-3 px-2 font-bold text-xs sm:text-sm rounded-lg w-[95px]"
            placeholderText="End Date"
            popperContainer={({ children }) => <div>{children}</div>}
          />
          <button
            onClick={fetchSummaryData}
            className="bg-black text-white sm:py-2 py-1.5 sm:px-3 px-2 ml-1 text-xs sm:text-sm border-black border-2 rounded-lg w-fit hover:bg-gray-400 hover:text-black"
          >
            Filter
          </button>
        </div> */}

        {/* Cards */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          {/* Total Pelaku Usaha */}
          <div className="flex items-start p-4 bg-white rounded-xl border border-gray-400">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
              <IconUsersGroup size={24} />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold">{summary?.company.total ?? 0}</h2>
              <p className="text-gray-600 text-xs">Pelaku Usaha</p>
            </div>
          </div>

          {/* Total Tersertifikasi */}
          <div className="flex items-start p-4 bg-white rounded-xl border border-gray-400">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <IconUserCheck size={24} />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold">{summary?.company.has_certified ?? 0}</h2>
              <p className="text-gray-600 text-xs">Pelaku Usaha Bersertifikat</p>
            </div>
          </div>

          {/* Total Submission */}
          <div className="flex items-start p-4 bg-white rounded-xl border border-gray-400">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <IconUsersGroup size={24} />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold">{summary?.submission.total ?? 0}</h2>
              <p className="text-gray-600 text-xs">Submission</p>
            </div>
          </div>

          {/* Submission Complete */}
          <div className="flex items-start p-4 bg-white rounded-xl border border-gray-400">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <IconUserCheck size={24} />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold">{summary?.submission.status?.Complete ?? 0}</h2>
              <p className="text-gray-600 text-xs">Submission Success</p>
            </div>
          </div>
        </div>

        {/* Chart - Activities */}
        <div className="bg-white px-4 py-2 rounded-xl border border-gray-400">
          <h3 className="text-lg font-semibold text-gray-800">Status Activities</h3>
          <div className="overflow-x-scroll">
            <div className="min-w-[600px]">
              <Chart
                options={{
                  ...chartOptions,
                  xaxis: {
                    ...chartOptions.xaxis,
                    categories: ["Prospect", "Approaching", "Presenting", "Offering", "Closing"],
                  },
                }}
                series={activityChartSeries}
                type="bar"
                height={200}
                width="100%"
              />
            </div>
          </div>
        </div>

        {/* Chart - Submissions */}
        <div className="bg-white px-4 py-2 rounded-xl border border-gray-400">
          <h3 className="text-lg font-semibold text-gray-800">Status Submissions</h3>
          <div className="overflow-x-scroll">
            <div className="min-w-[600px]">
              <Chart
                options={{
                  ...chartOptions,
                  xaxis: {
                    ...chartOptions.xaxis,
                    categories: ["New", "Open", "Process", "Pending", "Complete", "Cancel"],
                  },
                }}
                series={submissionChartSeries}
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
