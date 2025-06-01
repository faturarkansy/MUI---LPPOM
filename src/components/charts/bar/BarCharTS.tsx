import { Component } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface BarChartTSProps {
  // Add any props if needed in the future
}

interface BarChartTSState {
  options: ApexOptions;
  series: object[];
  // series: {
  //   data: number[];
  // }[];
}

class BarChartTS extends Component<BarChartTSProps, BarChartTSState> {
  constructor(props: BarChartTSProps) {
    super(props);
    this.state = {
      series: [
        {
          data: [200, 100, 235, 80, 55, 35],
        },
      ],
      options: {
        chart: {
          // type: "bar",
          id: "apexchart-bar",
        },
        plotOptions: {
          bar: {
            horizontal: true,
            borderRadius: 5,
            dataLabels: {
              position: "top",
              hideOverflowingLabels: true,
            },
            colors: {
              ranges: [
                {
                  from: 0,
                  to: 9007199254740991,
                  color: "#000000",
                },
              ],
            },
          },
        },
        dataLabels: {
          enabled: false,
          formatter: function (val: number) {
            return val;
          },
          offsetX: 0,
          style: {
            fontSize: "12px",
            colors: ["#000000"],
          },
        },
        xaxis: {
          categories: [
            "Foods",
            "Cosmetics",
            "Pharmaceuticals",
            "Packaging",
            "Personal Care",
            "Beverages",
          ],
        },
      },
    };
  }
  render() {
    return (
      <Chart
        options={this.state.options}
        // series={this.state.series}
        type="bar"
      />
    );
  }
}

export default BarChartTS;
