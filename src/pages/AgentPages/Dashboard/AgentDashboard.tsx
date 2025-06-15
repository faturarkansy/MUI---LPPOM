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
            colors: "#1874A5",
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
      colors: ["#1874A5"],
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
        <div className="grid mt-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-3">

          <div className="flex flex-col justify-between rounded-lg p-2 h-18 shadow-sm bg-white text-gray-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center mx-3">
                <div className="mr-3">
                  <div className="flex items-center justify-center w-12 h-12 sm:w-11 sm:h-11 rounded-xl bg-white text-[#670075] shadow">
                    <IconUsersGroup size={24} />
                  </div>
                </div>

                <div className='mx-2'>
                  <div className="text-2xl font-bold">
                    {summary?.company.total ?? 0}
                  </div>
                  <div className="text-sm sm:text-xs">
                    PU
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-lg p-2 h-18 shadow-sm bg-white text-gray-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center mx-3">
                <div className="mr-3">
                  <div className="flex items-center justify-center w-12 h-12 sm:w-11 sm:h-11 rounded-xl bg-white text-[#670075] shadow">
                    <IconUserCheck size={24} />
                  </div>
                </div>

                <div className='mx-2'>
                  <div className="text-2xl font-bold">
                    {summary?.company.has_certified ?? 0}
                  </div>
                  <div className="text-sm sm:text-xs">
                    Bersertifikat
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-lg p-2 h-18 shadow-sm bg-white text-gray-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center mx-3">
                <div className="mr-3">
                  <div className="flex items-center justify-center w-12 h-12 sm:w-11 sm:h-11 rounded-xl bg-white text-[#670075] shadow">
                    <IconUsersGroup size={24} />
                  </div>
                </div>

                <div className='mx-2'>
                  <div className="text-2xl font-bold">
                    {summary?.submission.total ?? 0}
                  </div>
                  <div className="text-sm sm:text-xs">
                    Submission
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-lg p-2 h-18 shadow-sm bg-white text-gray-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center mx-3">
                <div className="mr-3">
                  <div className="flex items-center justify-center w-12 h-12 sm:w-11 sm:h-11 rounded-xl bg-white text-[#670075] shadow">
                    <IconUserCheck size={24} />
                  </div>
                </div>

                <div className='mx-2'>
                  <div className="text-2xl font-bold">
                    {summary?.submission.status?.Complete ?? 0}
                  </div>
                  <div className="text-sm sm:text-xs">
                    Success
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart - Submissions */}
        <div className="bg-white px-4 py-2 rounded-lg border">
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

        {/* Chart - Activities */}
        <div className="bg-white px-4 py-2 rounded-lg border">
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


      </div>
    </div>
  );
};

export default AgentDashboard;
