import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import AbstractView from "./abstract.js";
import {formatDuration, getHourDuration} from "../utils/date.js";
import {TRANSFER_TYPES, pointTypeToIcon, ACTIVITY_TYPES} from "../constants.js";

const BAR_HEIGHT = 55;
const COUNT_VALUE = 1;
const TRANSFER_TYPE_SET = new Set(TRANSFER_TYPES);

const ChartDataset = {
  BACKGROUND_COLOR: `#ffffff`,
  HOVER_BACKGROUND_COLOR: `#ffffff`,
  ANCHOR: `start`,
  BAR_THICKNESS: 44,
  MIN_BAR_LENGTH: 50,
};

const ChartDataLabel = {
  FONT_SIZE: 13,
  COLOR: `#000000`,
  ANCHOR: `end`,
  ALIGN: `start`,
};

const ChartTitle = {
  DISPLAY: true,
  FONT_COLOR: `#000000`,
  FONT_SIZE: 23,
  POSITION: `left`,
};

const ChartTick = {
  FONT_COLOR: `#000000`,
  PADDING: 5,
  FONT_SIZE: 13,
};

const moneyChartOptions = {
  chartKey: `price`,
  title: `MONEY`,
  dataFormatter: (value) => `€ ${value}`,
};

const transportChartOptions = {
  chartKey: `count`,
  title: `TRANSPORT`,
  dataFormatter: (value) => `${value}x`,
};

const timeSpentChartOptions = {
  chartKey: `duration`,
  title: `TIME SPENT`,
  dataFormatter: (value) => `${formatDuration(0, value)}`,
};

const createChartData = (points) => {
  return points.reduce((chartData, point) => {
    const pointType = chartData[point.type];

    if (pointType) {
      pointType.price += point.price;
      pointType.duration += getHourDuration(point.startDate, point.endDate);
      pointType.count++;
    } else {
      chartData[point.type] = {
        label: pointTypeToIcon[point.type],
        price: point.price,
        duration: getHourDuration(point.startDate, point.endDate),
        count: COUNT_VALUE,
        groupType: TRANSFER_TYPE_SET.has(point.type)
          ? TRANSFER_TYPES
          : ACTIVITY_TYPES,
      };
    }

    return chartData;
  }, {});
};

const renderChart = (chartCtx, chartData, chartConfig) => {
  const labels = [];
  const data = [];

  const {chartKey, dataFormatter, title} = chartConfig;

  chartData.forEach((item) => {
    labels.push(item.label);
    data.push(item[chartKey]);
  });

  return new Chart(chartCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ChartDataset.BACKGROUND_COLOR,
        hoverBackgroundColor: ChartDataset.HOVER_BACKGROUND_COLOR,
        anchor: ChartDataset.ANCHOR,
        barThickness: ChartDataset.BAR_THICKNESS,
        minBarLength: ChartDataset.MIN_BAR_LENGTH
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: ChartDataLabel.FONT_SIZE
          },
          color: ChartDataLabel.COLOR,
          anchor: ChartDataLabel.ANCHOR,
          align: ChartDataLabel.ALIGN,
          formatter: dataFormatter,
        }
      },
      title: {
        display: ChartTitle.DISPLAY,
        text: title,
        fontColor: ChartTitle.FONT_COLOR,
        fontSize: ChartTitle.FONT_SIZE,
        position: ChartTitle.POSITION
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: ChartTick.FONT_COLOR,
            padding: ChartTick.PADDING,
            fontSize: ChartTick.FONT_SIZE,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const createStatisticsTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">
        Trip statistics
      </h2>
      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900">
        </canvas>
      </div>
      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900">
        </canvas>
      </div>
      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900">
        </canvas>
      </div>
    </section>`
  );
};

export default class Statistics extends AbstractView {
  constructor(points) {
    super();
    this._points = createChartData(points);

    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpendChart = null;

    this._setCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  _getMoneyChartData() {
    return Object.values(this._points).sort((itemA, itemB) => itemB.price - itemA.price);
  }

  _getTransportChartData() {
    return Object.values(this._points).
      filter((item) => item.groupType === TRANSFER_TYPES)
      .sort((itemA, itemB) => itemB.count - itemA.count);
  }

  _getSpentTimeChartData() {
    return Object.values(this._points).sort((itemA, itemB) => itemB.duration - itemA.duration);
  }

  _setCharts() {
    const element = this.getElement();
    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = element.querySelector(`.statistics__chart--time`);

    moneyCtx.height = BAR_HEIGHT * 6;
    transportCtx.height = BAR_HEIGHT * 4;
    timeSpendCtx.height = BAR_HEIGHT * 4;

    this._moneyChart = renderChart(
        moneyCtx,
        this._getMoneyChartData(),
        moneyChartOptions
    );

    this._transportChart = renderChart(
        transportCtx,
        this._getTransportChartData(),
        transportChartOptions
    );

    this._timeSpendChart = renderChart(
        timeSpendCtx,
        this._getSpentTimeChartData(),
        timeSpentChartOptions
    );
  }
}
