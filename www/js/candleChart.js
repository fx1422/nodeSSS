function getKlineData() {
    const myChart = echarts.init(document.getElementById('candlestickCharts'));
    $.ajax({
        url: '/data/klineData',
        type: 'post',
        data: {type: 'k-line'},
        beforeSend: function () {
            myChart.showLoading();
        },
        success: function (data) {
            drawCandleChart(data, myChart);
        }
    })
}


function drawCandleChart(rawData, myChart) {
    const dates = rawData.map(function (item) {
        return item['date'] + " " + item['time'];
    });
    const data = rawData.map(function (item) {
        return [+item['open'], +item['close'], +item['low'], +item['high']];
    });
    const option = {
        backgroundColor: '#ffffff',
        legend: {
            inactiveColor: '#777',
            textStyle: {
                color: '#fff'
            }
        },
        tooltip: {
            trigger: 'axis',
            // triggerOn:'none',
            z: 990,
            backgroundColor: 'rgba(32,147,236,0.9)',
            textStyle: {
                color: '#eef5e4',
                fontSize: '12'
            },
            axisPointer: {
                animation: false,
                type: 'cross',
                crossStyle: {
                    color: "red"
                },
                lineStyle: {
                    color: 'red',
                    width: 1,
                    opacity: 1
                },
                label: {
                    backgroundColor: 'red',
                }
            },
        },
        xAxis: {
            type: 'category',
            data: dates,
            boundaryGap: true,
            axisLine: {lineStyle: {color: '#d7d7d7'}},
            splitLine: {
                show: false,
                interval: 4,
                lineStyle: {
                    type: 'dashed',
                    color: '#343434',

                }
            },
            axisTick: {
                show: true,
            },
            axisLabel: {
                showMinLabel: false,
                textStyle: {
                    color: '#121212',
                    fontFamily: "微软雅黑",
                    fontWeight: 600
                },
                interval: 'auto',
                formatter: function (value) {
                    const val = value.substr(5);
                    const vall = val.substring(5, val.length - 3)
                    return vall
                }
            }
        },
        yAxis: {
            scale: true,
            axisLine: {lineStyle: {color: ''}},
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#EBEBEB',
                }
            },
            axisLabel: {
                z: 60,
                inside: true,
                interval: 3,
                showMinLabel: false,
                textStyle: {
                    color: '#000000',
                    fontWeight: 600
                }
            },
            axisTick: {
                show: false
            }

        },
        grid: {
            top: 20,
            left: 0,
            right: 2,
            bottom: 30
        },
        animation: false,
        series: [
            {
                type: 'candlestick',
                data: data,
                barWidth: 13,
                dimensions: ['', '开盘', '收盘', '最低', '最高'],
                itemStyle: {
                    normal: {
                        color: '#D23032',
                        color0: '#1EA83C',
                        borderColor: '#D23032',
                        borderColor0: '#1EA83C'
                    }
                }
            }
        ]
    };
    setTimeout(showChart, 1000);
    setInterval(function () {
        let arr = [3616.47, parseInt(Math.random() * 5 + 3614), 3614.64, 3622.89];
        data.pop();
        data.push(arr);
        myChart.setOption({
            series: [{
                type: "candlestick",
                data: data,
                markLine: {
                    symbol: ['none', 'none'],
                    lineStyle: {
                        normal: {
                            color: 'red',
                            position: 'top',
                        },

                    },
                    label: {
                        normal: {
                            position: 'middle',
                            show: true,
                            color: '#121212',
                            fontWeight: 'bold'
                        }
                    },
                    data: [
                        [
                            {
                                name: data[data.length - 1][1],
                                coord: [0, data[data.length - 1][1]]
                            },
                            {
                                coord: [data.length - 1, data[data.length - 1][1]]
                            }
                        ]
                    ]
                }
            }]
        });
    }, 800);


    function showChart() {
        myChart.hideLoading();
        myChart.setOption(option);
    }

    window.onresize = myChart.resize;
}
